import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CursorTrail from './components/CursorTrail';
import Home from './pages/Home';
import Community from './pages/Community';
import MyIdeas from './pages/MyIdeas';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col z-10">
        {/* Particle Canvas Overlay */}
        <CursorTrail />

        {/* Global Navigation Header */}
        <Navbar />

        {/* Main Content Router */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route 
              path="/my-ideas" 
              element={
                <ProtectedRoute>
                  <MyIdeas />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Minimalist Footer */}
        <footer className="w-full text-center py-6 border-t border-white/5 text-[11px] text-gray-500 font-semibold mt-auto bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <span>&copy; 2026 IdeaForge AI. Built for hackathon demo.</span>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
