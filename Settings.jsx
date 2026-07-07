import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sliders, Palette, Info, Check, RotateCcw } from 'lucide-react';

const Settings = () => {
  const { currentThemeId, selectTheme, themes, customColors, updateCustomColors } = useTheme();

  const handleCustomColorChange = (key, value) => {
    updateCustomColors({ [key]: value });
  };

  const handleResetCustom = () => {
    updateCustomColors({
      primary: '#8b5cf6',
      secondary: '#ec4899',
      bgStart: '#0f0c1b',
      bgEnd: '#05020a',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Theme Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Customize the aesthetic, colors, and gradients of your IdeaForge AI dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Presets Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-md font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Theme Presets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${
                    currentThemeId === theme.id
                      ? 'bg-white/5 border-primary shadow-lg shadow-primary/10'
                      : 'bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-white">{theme.name}</span>
                    {currentThemeId === theme.id && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Gradient strip preview */}
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/10" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/10" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary Color"
                    />
                    <div 
                      className="w-12 h-6 rounded-lg border border-white/10" 
                      style={{ 
                        background: `linear-gradient(to right, ${theme.colors.bgStart}, ${theme.colors.bgEnd})` 
                      }}
                      title="Background Gradient"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Theme Color Picker Panel */}
          <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                Custom Color Picker
              </h2>
              {currentThemeId === 'custom' && (
                <button
                  onClick={handleResetCustom}
                  className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary Color Picker */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Primary Accent
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">{customColors.primary}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                  <input
                    type="text"
                    value={customColors.primary}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Secondary Color Picker */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Secondary Accent
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">{customColors.secondary}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                  <input
                    type="text"
                    value={customColors.secondary}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Background Start Picker */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Background Gradient Start
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">{customColors.bgStart}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customColors.bgStart}
                    onChange={(e) => handleCustomColorChange('bgStart', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                  <input
                    type="text"
                    value={customColors.bgStart}
                    onChange={(e) => handleCustomColorChange('bgStart', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Background End Picker */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Background Gradient End
                  </label>
                  <span className="text-[11px] font-mono text-gray-500">{customColors.bgEnd}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customColors.bgEnd}
                    onChange={(e) => handleCustomColorChange('bgEnd', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                  <input
                    type="text"
                    value={customColors.bgEnd}
                    onChange={(e) => handleCustomColorChange('bgEnd', e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Theme Preview</h2>
          <div className="sticky top-24 rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl p-6 space-y-6">
            {/* Live demo header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white tracking-wide">Live Demo Card</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Simulated Score */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-primary flex items-center justify-center font-extrabold text-sm text-primary shadow-lg shadow-primary/10">
                85
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">SaaS Platform Idea</h3>
                <p className="text-[10px] text-gray-400">Score generated by AI jury</p>
              </div>
            </div>

            {/* Simulated UI components */}
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest">Strength</span>
                <p className="text-[11px] text-gray-300">High recurring margins and low customer churn.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[9px] font-extrabold text-secondary uppercase tracking-widest">Suggestion</span>
                <p className="text-[11px] text-gray-300">Expand local beta tests before launching.</p>
              </div>
            </div>

            {/* Simulated Primary Button */}
            <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all">
              Glow CTA Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
