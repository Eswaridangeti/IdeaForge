import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIdeas } from '../context/IdeaContext';
import { Link } from 'react-router-dom';
import MiniChart from '../components/MiniChart';
import { User, Calendar, Activity, Database, Heart, MessageSquare, ArrowRight, Clock } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { ideas } = useIdeas();
  const [activeTab, setActiveTab] = useState('my-ideas');

  // Filter lists based on active user
  const myCreatedIdeas = ideas.filter(idea => idea.userId === user?.uid || idea.userEmail === user?.email);
  const myLikedIdeas = ideas.filter(idea => idea.likes?.includes(user?.email));
  
  // Find all comments posted by the active user
  const myComments = [];
  ideas.forEach(idea => {
    idea.comments?.forEach(comment => {
      if (comment.userEmail === user?.email) {
        myComments.push({
          ...comment,
          ideaId: idea.id,
          ideaTitle: idea.title
        });
      }
    });
  });

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Never';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDate(isoString);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Profile Header glass card */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user?.photoURL}
            alt={user?.displayName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/10 shadow-lg object-cover"
          />
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.displayName}</h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">{user?.email}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Joined: {formatDate(user?.joinedDate)}
              </span>
              <span className="flex items-center gap-1.5 text-primary">
                <Activity className="w-3.5 h-3.5" />
                Active: {formatRelativeTime(user?.lastActive)}
              </span>
            </div>
          </div>
        </div>

        {/* Small Stats Grid in Header */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white/2 border border-white/5 rounded-2xl p-4">
          <div className="text-center px-2">
            <span className="block text-lg sm:text-xl font-extrabold text-white">{myCreatedIdeas.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ideas</span>
          </div>
          <div className="text-center px-2 border-x border-white/5">
            <span className="block text-lg sm:text-xl font-extrabold text-white">{myLikedIdeas.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Likes</span>
          </div>
          <div className="text-center px-2">
            <span className="block text-lg sm:text-xl font-extrabold text-white">{myComments.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Comments</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="space-y-6">
        <div className="border-b border-white/10 flex gap-2">
          <button
            onClick={() => setActiveTab('my-ideas')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 ${
              activeTab === 'my-ideas'
                ? 'border-primary text-white font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              My Ideas ({myCreatedIdeas.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('liked-ideas')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 ${
              activeTab === 'liked-ideas'
                ? 'border-primary text-white font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              Liked Ideas ({myLikedIdeas.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-comments')}
            className={`pb-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-150 ${
              activeTab === 'my-comments'
                ? 'border-primary text-white font-extrabold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              My Comments ({myComments.length})
            </span>
          </button>
        </div>

        {/* Tab content renderer */}
        <div className="grid grid-cols-1 gap-4">
          {activeTab === 'my-ideas' && (
            myCreatedIdeas.length === 0 ? (
              <div className="text-center py-12 glass-panel border border-white/5 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase">No Startup Ideas Yet</p>
                <Link to="/" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
                  Go analyze your first idea &rarr;
                </Link>
              </div>
            ) : (
              myCreatedIdeas.map(idea => (
                <div key={idea.id} className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <MiniChart score={idea.viability_score} size={48} strokeWidth={4} />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white leading-tight">{idea.title}</h3>
                      <div className="flex gap-2 items-center text-[10px] text-gray-500 font-semibold">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {idea.market_category}
                        </span>
                        <span>&bull;</span>
                        <span>{formatRelativeTime(idea.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/my-ideas" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )
          )}

          {activeTab === 'liked-ideas' && (
            myLikedIdeas.length === 0 ? (
              <div className="text-center py-12 glass-panel border border-white/5 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase">No Liked Ideas</p>
                <Link to="/community" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
                  Browse public ideas in community &rarr;
                </Link>
              </div>
            ) : (
              myLikedIdeas.map(idea => (
                <div key={idea.id} className="glass-panel-interactive rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <MiniChart score={idea.viability_score} size={48} strokeWidth={4} />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white leading-tight">{idea.title}</h3>
                      <div className="flex gap-2 items-center text-[10px] text-gray-500 font-semibold">
                        <span className="text-primary font-bold">by {idea.userName}</span>
                        <span>&bull;</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {idea.market_category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link to="/community" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )
          )}

          {activeTab === 'my-comments' && (
            myComments.length === 0 ? (
              <div className="text-center py-12 glass-panel border border-white/5 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase">No Comments Posted</p>
                <Link to="/community" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
                  Browse feed and start discussions &rarr;
                </Link>
              </div>
            ) : (
              myComments.map(comment => (
                <div key={comment.id} className="glass-panel-interactive rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Commented on &ldquo;{comment.ideaTitle}&rdquo;</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium bg-white/2 border border-white/5 rounded-xl p-3.5">
                    &ldquo;{comment.text}&rdquo;
                  </p>
                  <div className="flex justify-end">
                    <Link to="/community" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                      View Discussion
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
