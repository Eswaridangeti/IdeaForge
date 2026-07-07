import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Sync user profile in LocalStorage (simulating Firestore database user syncing)
  const syncUser = (userData) => {
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    const existingIndex = dbUsers.findIndex(u => u.email === userData.email);
    
    const profile = {
      uid: userData.uid || Math.random().toString(36).substring(7),
      email: userData.email,
      displayName: userData.displayName || userData.email.split('@')[0],
      photoURL: userData.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.email}`,
      joinedDate: userData.joinedDate || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      theme: localStorage.getItem('theme-id') || 'purple-dream',
    };

    if (existingIndex > -1) {
      dbUsers[existingIndex] = { ...dbUsers[existingIndex], ...profile, lastActive: new Date().toISOString() };
    } else {
      dbUsers.push(profile);
    }

    localStorage.setItem('db_users', JSON.stringify(dbUsers));
    localStorage.setItem('auth_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  };

  // Sign up simulation
  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
      if (dbUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = syncUser({
        email,
        displayName: name,
        joinedDate: new Date().toISOString()
      });
      
      // Save password hash simulator
      const credentials = JSON.parse(localStorage.getItem('db_credentials') || '{}');
      credentials[email] = password;
      localStorage.setItem('db_credentials', JSON.stringify(credentials));

      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // Sign in simulation
  const login = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const credentials = JSON.parse(localStorage.getItem('db_credentials') || '{}');
      if (!credentials[email] || credentials[email] !== password) {
        throw new Error('Invalid email or password');
      }

      const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
      const userProfile = dbUsers.find(u => u.email === email);

      if (!userProfile) {
        throw new Error('Profile not found, but credentials match');
      }

      return syncUser(userProfile);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Simulation
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randomSeed = Math.random().toString(36).substring(7);
      const email = `hackathon_demo_${randomSeed}@gmail.com`;
      
      return syncUser({
        email,
        displayName: `Shark Evaluator ${randomSeed.substring(0, 3).toUpperCase()}`,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  // Update Activity Timestamp on User Interaction (mouse clicks or keyboard input)
  const updateActivity = () => {
    if (!user) return;
    const now = new Date().toISOString();
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, lastActive: now };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });

    // Update in the mock database too
    const dbUsers = JSON.parse(localStorage.getItem('db_users') || '[]');
    const index = dbUsers.findIndex(u => u.email === user.email);
    if (index > -1) {
      dbUsers[index].lastActive = now;
      localStorage.setItem('db_users', JSON.stringify(dbUsers));
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      // Throttling updates to avoid too many writes
      const lastUpdate = localStorage.getItem('last_active_update_time');
      const now = Date.now();
      if (!lastUpdate || now - parseInt(lastUpdate, 10) > 10000) {
        localStorage.setItem('last_active_update_time', now.toString());
        updateActivity();
      }
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      syncUser,
      updateActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
