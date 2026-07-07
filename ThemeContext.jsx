import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  {
    id: 'purple-dream',
    name: 'Purple Dream 🔮',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      primaryGlow: 'rgba(139, 92, 246, 0.4)',
      secondary: '#ec4899',
      bgStart: '#0f0c1b',
      bgEnd: '#05020a',
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow 🌅',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryGlow: 'rgba(249, 115, 22, 0.4)',
      secondary: '#f43f5e',
      bgStart: '#1c0d02',
      bgEnd: '#070200',
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue 🌊',
    colors: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      primaryGlow: 'rgba(6, 182, 212, 0.4)',
      secondary: '#3b82f6',
      bgStart: '#020f1b',
      bgEnd: '#00050a',
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green 🌲',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryGlow: 'rgba(16, 185, 129, 0.4)',
      secondary: '#84cc16',
      bgStart: '#021a0f',
      bgEnd: '#000804',
    }
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden 🌹',
    colors: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      primaryGlow: 'rgba(236, 72, 153, 0.4)',
      secondary: '#f43f5e',
      bgStart: '#1a020f',
      bgEnd: '#080004',
    }
  },
  {
    id: 'neon-night',
    name: 'Neon Night ⚡',
    colors: {
      primary: '#00ff66',
      primaryHover: '#00cc52',
      primaryGlow: 'rgba(0, 255, 102, 0.4)',
      secondary: '#00ffff',
      bgStart: '#080808',
      bgEnd: '#000000',
    }
  }
];

export const ThemeProvider = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('theme-id') || 'purple-dream';
  });

  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('custom-theme-colors');
    return saved ? JSON.parse(saved) : {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      bgStart: '#0f0c1b',
      bgEnd: '#05020a',
    };
  });

  const applyTheme = (colors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover || colors.primary);
    root.style.setProperty('--color-primary-glow', colors.primaryGlow || `${colors.primary}66`);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-bg-start', colors.bgStart);
    root.style.setProperty('--color-bg-end', colors.bgEnd);
  };

  useEffect(() => {
    if (currentThemeId === 'custom') {
      applyTheme({
        primary: customColors.primary,
        secondary: customColors.secondary,
        bgStart: customColors.bgStart,
        bgEnd: customColors.bgEnd,
      });
    } else {
      const theme = themes.find(t => t.id === currentThemeId) || themes[0];
      applyTheme(theme.colors);
    }
  }, [currentThemeId, customColors]);

  const selectTheme = (themeId) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('theme-id', themeId);
  };

  const updateCustomColors = (newColors) => {
    const updated = { ...customColors, ...newColors };
    setCustomColors(updated);
    localStorage.setItem('custom-theme-colors', JSON.stringify(updated));
    setCurrentThemeId('custom');
    localStorage.setItem('theme-id', 'custom');
  };

  return (
    <ThemeContext.Provider value={{
      currentThemeId,
      currentTheme: currentThemeId === 'custom' 
        ? { id: 'custom', name: 'Custom Theme🎨', colors: customColors } 
        : (themes.find(t => t.id === currentThemeId) || themes[0]),
      selectTheme,
      themes,
      customColors,
      updateCustomColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
