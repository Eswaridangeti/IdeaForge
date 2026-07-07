import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, Link } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import { useAuth } from '../context/AuthContext';
import MiniChart from '../components/MiniChart';
import SocialShare from '../components/SocialShare';
import InvestorCard from '../components/InvestorCard';
import { Search, ArrowUpDown, Heart, MessageSquare, Calendar, X, Send, Eye, ShieldAlert, Award, Star, Trash2, AlertTriangle, Globe, Lock } from 'lucide-react';

const Community = () => {
  const { ideas, likeIdea, addComment, deleteIdea, saveIdea } = useIdeas();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Search, filter and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Handle URL deep linking for sharing
  useEffect(() => {
    const ideaId = searchParams.get('idea');
    if (ideaId) {
      const ideaExists = ideas.some(i => i.id === ideaId);
      if (ideaExists) {
        setSelectedIdeaId(ideaId);
      }
    }
  }, [searchParams, ideas]);

  const handleOpenIdea = (id) => {
    setSelectedIdeaId(id);
    setSearchParams({ idea: id });
  };

  const handleCloseIdea = () => {
    setSelectedIdeaId(null);
    setSearchParams({});
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteIdea(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Liking handler
  const handleLike = (e, id) => {
    e.stopPropagation();
    if (!user) {
      alert("Please sign in to like ideas!");
      return;
    }
    likeIdea(id, user.email);
  };

  // Add Comment handler
  const handleAddComment = (e, ideaId) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to comment!");
      return;
    }
    if (!commentText.trim()) return;

    addComment(ideaId, commentText, user);
    setCommentText('');
  };

  // Only show public ideas
  const publicIdeas = ideas.filter(i => i.isPublic);

  // Filter ideas
  const filteredIdeas = publicIdeas.filter(idea => {
    const query = searchQuery.toLowerCase();
    const title = idea.title || '';
    const desc = idea.description || '';
    const category = idea.market_category || '';
    return (
      title.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query)
    );
  });

  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'highest_score') {
      return b.viability_score - a.viability_score;
    }
    if (sortBy === 'lowest_score') {
      return a.viability_score - b.viability_score;
    }
    return 0;
  });

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Sandbox</h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore startup ideas shared by founders, see VC jury score comparisons, and contribute feedback.
        </p>
      </div>

      {/* Search & Sort Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel border border-white/15 rounded-2xl p-4">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer select-none"
          >
            <option value="newest" className="bg-black text-white">Date Created: Newest</option>
            <option value="oldest" className="bg-black text-white">Date Created: Oldest</option>
            <option value="highest_score" className="bg-black text-white">Viability Score: Highest</option>
            <option value="lowest_score" className="bg-black text-white">Viability Score: Lowest</option>
          </select>
        </div>
      </div>

      {/* Grid listing */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-16 glass-panel border border-white/5 rounded-3xl">
          <span className="text-2xl">🔍</span>
          <h3 className="text-sm font-bold text-white mt-2">No matching ideas found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try checking spelling or resetting search queries to see more startup projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedIdeas.map((idea) => {
            const isLiked = user ? idea.likes?.includes(user.email) : false;
            return (
              <div
                key={idea.id}
                onClick={() => handleOpenIdea(idea.id)}
                className="glass-panel-interactive rounded-3xl p-6 flex flex-col justify-between gap-6 cursor-pointer relative"
              >
                {/* Score Chart Indicator */}
                <div className="absolute top-6 right-6">
                  <MiniChart score={idea.viability_score} size={50} strokeWidth={4.5} />
                </div>

                <div className="space-y-3 pr-14">
                  {/* Category badge */}
                  <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-extrabold text-primary uppercase tracking-wider">
                    {idea.market_category}
                  </span>

                  {/* Title & Desc */}
                  <h3 className="text-md sm:text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  {/* User Profile */}
                  <div className="flex items-center gap-2">
                    <img
                      src={idea.userPhoto}
                      alt={idea.userName}
                      className="w-7 h-7 rounded-lg border border-white/10"
                    />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-gray-300 leading-3">{idea.userName}</p>
                      <span className="text-[8px] text-gray-500 font-semibold">{formatDate(idea.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions counts */}
                  <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleLike(e, idea.id)}
                      className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                        isLiked ? 'text-rose-400' : 'text-gray-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{idea.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleOpenIdea(idea.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-primary transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{idea.comments?.length || 0}</span>
                    </button>
                    {user && idea.userId === user.uid && (
                      <button
                        onClick={(e) => handleDeleteClick(e, idea.id)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/20 transition-all duration-200"
                        title="Delete Idea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Idea Detail Modal */}
      {selectedIdea && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={handleCloseIdea}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl glass-panel border border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto z-10 animate-scaleUp">
            {/* Close */}
            <button
              onClick={handleCloseIdea}
              className="absolute top-4 right-4 p-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-8">
              {/* Creator details & category */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-extrabold text-primary uppercase tracking-wider">
                      {selectedIdea.market_category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Shared on {formatDate(selectedIdea.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedIdea.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedIdea.userPhoto}
                      alt={selectedIdea.userName}
                      className="w-5 h-5 rounded-md border border-white/10"
                    />
                    <span className="text-xs text-gray-400 font-medium">Shared by <strong className="text-white">{selectedIdea.userName}</strong></span>
                  </div>
                </div>

                {/* Score badge & Share/Save */}
                <div className="flex flex-col items-end gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-2xl font-black text-white">{selectedIdea.viability_score}/100</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Viability Score</span>
                    </div>
                    <MiniChart score={selectedIdea.viability_score} size={64} strokeWidth={5.5} showText={false} />
                  </div>
                  <div className="flex items-center gap-2">
                    {user && selectedIdea.userId === user.uid && (
                      <button
                        onClick={() => saveIdea({ ...selectedIdea, isPublic: !selectedIdea.isPublic })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-200 ${
                          selectedIdea.isPublic
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400'
                        }`}
                        title={selectedIdea.isPublic ? "Make Private" : "Upload to Community"}
                      >
                        {selectedIdea.isPublic ? (
                          <>
                            <Globe className="w-3.5 h-3.5" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Private
                          </>
                        )}
                      </button>
                    )}
                    <SocialShare title={selectedIdea.title} score={selectedIdea.viability_score} ideaId={selectedIdea.id} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pitch Details</h4>
                <p className="text-sm text-gray-300 leading-relaxed bg-white/2 border border-white/5 p-4 rounded-2xl">
                  {selectedIdea.description}
                </p>
              </div>

              {/* Location & Model Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Scope Setting</span>
                  <span className="text-xs font-bold text-white">{selectedIdea.location}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Business Type</span>
                  <span className="text-xs font-bold text-white">{selectedIdea.businessModel}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Risk Assessment</span>
                  <span className={`text-xs font-bold ${
                    selectedIdea.risk_level === 'High' ? 'text-rose-400' : selectedIdea.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{selectedIdea.risk_level} Risk</span>
                </div>
              </div>

              {/* Core metrics feedback */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current" />
                    Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIdea.strengths?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Risks
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIdea.risks?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Suggestions
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIdea.suggestions?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Location Impact and Boom Potential (Extra features) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Location Impact Analysis</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedIdea.location_impact}</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Current Market Demand</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedIdea.current_demand}</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Market Growth & Boom Verdict</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedIdea.boom_potential}</p>
                </div>
              </div>

              {/* Shark Tank Feedback Panel */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-bold text-white">Shark Tank Panel Verdict</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedIdea.final_verdict === 'Invest' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                      : selectedIdea.final_verdict === 'Needs Improvement'
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}>
                    Final Panel: {selectedIdea.final_verdict}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedIdea.sharks?.map((shark, idx) => (
                    <InvestorCard key={idx} {...shark} />
                  ))}
                </div>
              </div>

              {/* Mentoring & Improvements */}
              {selectedIdea.improved_idea && (
                <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5 space-y-4 pt-4">
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Mentor Redesign Pitch
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Improved Idea Pitch</span>
                      <p className="text-sm font-semibold text-white leading-relaxed bg-black/35 p-4 rounded-2xl">{selectedIdea.improved_idea}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Key Pivot Changes</span>
                        <ul className="space-y-1">
                          {selectedIdea.key_changes?.map((change, idx) => (
                            <li key={idx} className="text-xs text-gray-300 leading-normal list-decimal list-inside">{change}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Expected Improvement</span>
                        <p className="text-xs text-gray-400 leading-relaxed">{selectedIdea.expected_improvement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Future outcomes */}
              {selectedIdea.future_prediction && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-md font-bold text-white">Futurist 1-Year Projections</h3>
                  
                  {/* Probability Bar */}
                  <div className="space-y-1 bg-white/2 border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between text-xs font-semibold text-gray-400">
                      <span>Simulated 12-Month Market Success Probability</span>
                      <span className="text-primary font-bold">{selectedIdea.future_prediction.success_probability}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${selectedIdea.future_prediction.success_probability}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Best Case Scenario</span>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedIdea.future_prediction.best_case}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Worst Case Scenario</span>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedIdea.future_prediction.worst_case}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Most Likely Outcome</span>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedIdea.future_prediction.most_likely}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Discussion Section */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-primary" />
                  Jury Debate & Discussion ({selectedIdea.comments?.length || 0})
                </h3>

                {/* Comment Feed */}
                <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
                  {selectedIdea.comments?.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-4 text-center">No comments posted yet. Be the first to start the discussion!</p>
                  ) : (
                    selectedIdea.comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3 items-start bg-white/2 border border-white/5 rounded-2xl p-4">
                        <img
                          src={comment.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.userEmail}`}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-lg border border-white/10 object-cover"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">{comment.userName}</span>
                            <span className="text-[9px] text-gray-500 font-semibold">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                {user ? (
                  <form onSubmit={(e) => handleAddComment(e, selectedIdea.id)} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your perspective on this idea..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold placeholder-gray-500 text-white focus:outline-none focus:border-primary/50"
                    />
                    <button
                      type="submit"
                      className="px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all duration-200 active:scale-95 flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="text-center p-4 rounded-2xl bg-white/2 border border-white/5 text-xs text-gray-400">
                    Please <Link to="/auth" className="text-primary hover:underline font-bold">Sign In</Link> to post comments and join the debate.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setDeleteTargetId(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <div className="relative w-full max-w-sm rounded-2xl glass-panel border border-white/10 shadow-2xl p-6 text-center z-10 animate-scaleUp">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-md font-bold text-white mb-1">Delete Startup Evaluation?</h3>
            <p className="text-xs text-gray-400 mb-6">
              This action cannot be undone. You will delete the viability scorecard, investor panel analysis, and future forecasts.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-bold text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Community;
