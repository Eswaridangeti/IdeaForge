import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useIdeas } from '../context/IdeaContext';
import { useAuth } from '../context/AuthContext';
import MiniChart from '../components/MiniChart';
import SocialShare from '../components/SocialShare';
import FeedbackModal from '../components/FeedbackModal';
import InvestorCard from '../components/InvestorCard';
import { 
  Search, ArrowUpDown, Trash2, Globe, Lock, Eye, Calendar, X, AlertTriangle, 
  MessageSquare, HelpCircle, Star, ShieldAlert, Award, ChevronRight 
} from 'lucide-react';

const MyIdeas = () => {
  const { ideas, saveIdea, deleteIdea } = useIdeas();
  const { user } = useAuth();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Custom dialog modals
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Filter ideas owned by user
  const myIdeas = ideas.filter(idea => idea.userId === user?.uid || idea.userEmail === user?.email);

  const filteredIdeas = myIdeas.filter(idea => {
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

  const handleTogglePublic = (e, idea) => {
    e.stopPropagation();
    saveIdea({
      ...idea,
      isPublic: !idea.isPublic
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Idea Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your startup evaluations, toggle public sharing status, and review shark feedback.
          </p>
        </div>
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/20 hover:bg-rose-500/5 text-xs font-semibold text-gray-300 hover:text-rose-300 transition-all duration-200"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Report Bug / Feedback
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel border border-white/15 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your dashboard..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Sorting dropdown */}
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

      {/* My Ideas list */}
      {sortedIdeas.length === 0 ? (
        <div className="text-center py-16 glass-panel border border-white/5 rounded-3xl">
          <span className="text-2xl">💡</span>
          <h3 className="text-sm font-bold text-white mt-2">No ideas saved yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Input a concept on the Home screen to run AI evaluations and save your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setSelectedIdeaId(idea.id)}
              className="glass-panel-interactive rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer relative"
            >
              {/* Left text fields */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <MiniChart score={idea.viability_score} size={54} strokeWidth={4.5} />
                <div className="space-y-1 text-left">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-extrabold text-primary uppercase tracking-wider">
                      {idea.market_category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(idea.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-md font-bold text-white leading-tight">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {idea.summary}
                  </p>
                </div>
              </div>

              {/* Right menu tools */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0" onClick={e => e.stopPropagation()}>
                {/* Sharing Visibility Switch */}
                <button
                  onClick={(e) => handleTogglePublic(e, idea)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all duration-200 ${
                    idea.isPublic 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                  title={idea.isPublic ? "Shared publicly in community feed" : "Private only to your profile"}
                >
                  {idea.isPublic ? (
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

                {/* Delete */}
                <button
                  onClick={(e) => handleDeleteClick(e, idea.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/20 transition-all duration-200"
                  title="Delete Idea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-4 h-4 text-gray-500 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
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
              This action cannot be undone. You will lose the viability scorecard, investor panel analysis, and future forecasts.
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

      {/* Idea Detail Modal */}
      {selectedIdea && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedIdeaId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl glass-panel border border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto z-10 animate-scaleUp">
            <button
              onClick={() => setSelectedIdeaId(null)}
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
                      <Calendar className="w-3.5 h-3.5" />
                      Analyzed on {formatDate(selectedIdea.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {selectedIdea.title}
                  </h2>
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

              {/* Location Impact and Boom Potential */}
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
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Feedback Modal component */}
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};

export default MyIdeas;
