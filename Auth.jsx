import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, User, LogIn, ChevronRight, Chrome } from 'lucide-react';

const Auth = () => {
  const { login, signup, loginWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google Sign-In failed.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
        {/* Decorative corner glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />

        <div className="text-center relative z-10">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Brain className="h-6.5 w-6.5 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-1.5 text-xs text-gray-400">
            {isLogin
              ? 'Sign in to analyze and save your startup ideas'
              : 'Join the community and test your business plans'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl relative z-10">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4 relative z-10" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Full Name"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-black text-gray-500 font-semibold uppercase">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all duration-200 active:scale-95 disabled:opacity-50 relative z-10"
        >
          <Chrome className="w-4 h-4 text-primary" />
          <span>Demo Google Account</span>
        </button>

        <p className="text-center text-xs text-gray-500 mt-4 relative z-10">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-semibold"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
