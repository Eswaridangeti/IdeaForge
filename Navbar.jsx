import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LayoutDashboard, Settings, User, LogOut, Menu, X, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/auth');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Community', path: '/community' },
    ...(user ? [{ name: 'My Ideas', path: '/my-ideas' }] : []),
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-md sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              IdeaForge <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-white border border-primary/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-lg object-cover border border-white/10"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-semibold text-white leading-3">{user.displayName}</p>
                    <span className="text-[10px] text-gray-500 font-medium">Logged In</span>
                  </div>
                </button>

                {/* Dropdown Options */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 shadow-2xl py-1.5 animate-fadeIn">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/15 hover:shadow-primary/25 active:scale-95 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center gap-3">
            {user && (
              <Link to="/profile" className="flex items-center">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-lg border border-white/10"
                />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 bg-black/95 px-4 pt-2 pb-4 space-y-1 animate-slideDown">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="block text-center px-4 py-2.5 rounded-xl bg-primary text-sm font-bold text-white shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
