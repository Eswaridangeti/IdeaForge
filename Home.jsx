import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIdeas } from '../context/IdeaContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MiniChart from '../components/MiniChart';
import InvestorCard from '../components/InvestorCard';
import RegenButton from '../components/RegenButton';
import SocialShare from '../components/SocialShare';
import { 
  analyzeIdea, askSharks, improveIdea, predictFuture, validateStartupPitch 
} from '../services/openai';
import { 
  Sparkles, ShieldAlert, Award, Star, MapPin, Globe, Laptop, HelpCircle, 
  CheckCircle, ArrowRight, Save, Check, RefreshCw, LogIn, AlertTriangle, Lock
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { ideas, saveIdea } = useIdeas();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const resultId = searchParams.get('result');

  // Form states
  const [ideaText, setIdeaText] = useState('');
  const [location, setLocation] = useState('City');
  const [businessModel, setBusinessModel] = useState('SaaS');
  const [validationError, setValidationError] = useState(null);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingSharks, setLoadingSharks] = useState(false);
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [loadingFuture, setLoadingFuture] = useState(false);

  // Result states
  const [analysisResult, setAnalysisResult] = useState(null);
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeIdeaId, setActiveIdeaId] = useState(null);

  // Timestamps for regen tracking
  const [timestamps, setTimestamps] = useState({
    core: null,
    sharks: null,
    mentor: null,
    future: null
  });

  // Restores pending idea inputs from sessionStorage if the user just signed in
  useEffect(() => {
    const pendingText = sessionStorage.getItem('pending_idea_text');
    const pendingLoc = sessionStorage.getItem('pending_location');
    const pendingModel = sessionStorage.getItem('pending_business_model');
    
    if (pendingText) {
      setIdeaText(pendingText);
      sessionStorage.removeItem('pending_idea_text');
    }
    if (pendingLoc) {
      setLocation(pendingLoc);
      sessionStorage.removeItem('pending_location');
    }
    if (pendingModel) {
      setBusinessModel(pendingModel);
      sessionStorage.removeItem('pending_business_model');
    }
  }, []);

  // Synchronize search param with local evaluation state
  useEffect(() => {
    if (resultId) {
      const found = ideas.find(i => i.id === resultId);
      if (found) {
        setAnalysisResult(found);
        setSavedStatus(found.isPublic ? 'public' : 'private');
      }
    } else {
      setAnalysisResult(null);
      setSavedStatus(false);
    }
  }, [resultId, ideas]);

  const runCoreAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!ideaText.trim()) return;

    const errorMsg = validateStartupPitch(ideaText);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }
    setValidationError(null);

    if (!user) {
      // Store current form inputs in sessionStorage so they are restored after sign-in/up
      sessionStorage.setItem('pending_idea_text', ideaText);
      sessionStorage.setItem('pending_location', location);
      sessionStorage.setItem('pending_business_model', businessModel);
      navigate('/auth');
      return;
    }

    setIsAnalyzing(true);
    setLoadingStep(0);
    setAnalysisResult(null);
    setSavedStatus(false);

    // Simulate progressive loading steps for Hackathon wow-factor
    const steps = [
      "Deconstructing pitch vocabulary...",
      "Matching location limitations...",
      "Evaluating current market demand...",
      "Comparing competitive moats...",
      "Formulating viability metrics..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const core = await analyzeIdea(ideaText, location, businessModel);
      
      // Auto-generate all other segments sequentially to populate dashboard
      setLoadingSharks(true);
      const sharksResult = await askSharks(ideaText, core);
      setLoadingSharks(false);

      setLoadingMentor(true);
      const mentorResult = await improveIdea(ideaText, core);
      setLoadingMentor(false);

      setLoadingFuture(true);
      const futureResult = await predictFuture(ideaText, core);
      setLoadingFuture(false);

      const ideaId = Math.random().toString(36).substring(7);
      setActiveIdeaId(ideaId);

      const combinedResult = {
        id: ideaId,
        title: ideaText.split(' ').slice(0, 5).join(' ') + '...',
        description: ideaText,
        location,
        businessModel,
        ...core,
        ...sharksResult,
        ...mentorResult,
        future_prediction: futureResult,
      };

      setAnalysisResult(combinedResult);
      setSavedStatus(false);
      setSearchParams({ result: ideaId });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Section-specific Regeneration handlers
  const handleRegenCore = async () => {
    if (!analysisResult) return;
    setIsAnalyzing(true);
    try {
      const core = await analyzeIdea(ideaText, location, businessModel);
      const updated = {
        ...analysisResult,
        ...core
      };
      setAnalysisResult(updated);
      setTimestamps(prev => ({ ...prev, core: new Date().toISOString() }));
      
      if (savedStatus) {
        saveIdea({
          ...updated,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          isPublic: savedStatus === 'public'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenSharks = async () => {
    if (!analysisResult) return;
    setLoadingSharks(true);
    try {
      const sharksResult = await askSharks(ideaText, analysisResult);
      const updated = {
        ...analysisResult,
        ...sharksResult
      };
      setAnalysisResult(updated);
      setTimestamps(prev => ({ ...prev, sharks: new Date().toISOString() }));
      
      if (savedStatus) {
        saveIdea({
          ...updated,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          isPublic: savedStatus === 'public'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSharks(false);
    }
  };

  const handleRegenMentor = async () => {
    if (!analysisResult) return;
    setLoadingMentor(true);
    try {
      const mentorResult = await improveIdea(ideaText, analysisResult);
      const updated = {
        ...analysisResult,
        ...mentorResult
      };
      setAnalysisResult(updated);
      setTimestamps(prev => ({ ...prev, mentor: new Date().toISOString() }));
      
      if (savedStatus) {
        saveIdea({
          ...updated,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          isPublic: savedStatus === 'public'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMentor(false);
    }
  };

  const handleRegenFuture = async () => {
    if (!analysisResult) return;
    setLoadingFuture(true);
    try {
      const futureResult = await predictFuture(ideaText, analysisResult);
      const updated = {
        ...analysisResult,
        future_prediction: futureResult
      };
      setAnalysisResult(updated);
      setTimestamps(prev => ({ ...prev, future: new Date().toISOString() }));
      
      if (savedStatus) {
        saveIdea({
          ...updated,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          isPublic: savedStatus === 'public'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFuture(false);
    }
  };

  const handleSavePrivate = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (analysisResult) {
      saveIdea({
        ...analysisResult,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        isPublic: false
      });
      setSavedStatus('private');
    }
  };

  const handleUploadCommunity = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (analysisResult) {
      saveIdea({
        ...analysisResult,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        isPublic: true
      });
      setSavedStatus('public');
    }
  };

  return (
    <div className="space-y-12">
      {/* SCREEN 1: HERO + INPUT */}
      {!analysisResult && !isAnalyzing && (
        <div className="max-w-3xl mx-auto text-center space-y-8 py-10 sm:py-16 animate-fadeIn">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary animate-pulse-slow">
            <Sparkles className="w-4 h-4" />
            <span>AI Startup Evaluation Engine</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Test Your Idea <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Before You Build It</span>
            </h1>
            <p className="text-sm sm:text-md text-gray-400 max-w-lg mx-auto font-medium">
              Get objective VC grade viability reports, simulated investor panels, and location feasibility checks in seconds.
            </p>
          </div>

          <form onSubmit={runCoreAnalysis} className="space-y-5 text-left bg-white/2 border border-white/5 rounded-3xl p-6 relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                Describe Your Startup Idea
              </label>
              <textarea
                required
                rows="4"
                value={ideaText}
                onChange={(e) => {
                  setIdeaText(e.target.value);
                  setValidationError(null);
                }}
                placeholder="e.g. A peer-to-peer car washing service where students clean vehicles parked on campus during lectures, ordered via mobile app..."
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm placeholder-gray-500 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Selection filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Location setting
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer select-none"
                  >
                    <option value="City" className="bg-black text-white">City (Urban / High Density)</option>
                    <option value="Village" className="bg-black text-white">Village (Rural / Low Density)</option>
                    <option value="Online" className="bg-black text-white">Online / Global Scale</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                  Business Model
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer select-none"
                  >
                    <option value="Online" className="bg-black text-white">Digital App / SaaS / E-commerce</option>
                    <option value="Physical" className="bg-black text-white">Physical Store / Local Operations</option>
                    <option value="Hybrid" className="bg-black text-white">Hybrid (Digital + Physical Operations)</option>
                    <option value="DeepTech" className="bg-black text-white">Deep Tech / AI / Biotech</option>
                    <option value="FinTech" className="bg-black text-white">FinTech / Payments / Web3</option>
                    <option value="Enterprise" className="bg-black text-white">B2B Enterprise / SaaS</option>
                    <option value="Hardware" className="bg-black text-white">Hardware / Consumer Electronics</option>
                    <option value="Social" className="bg-black text-white">Social Platform / Creator Economy</option>
                    <option value="AgriTech" className="bg-black text-white">AgriTech / Farm Operations</option>
                  </select>
                </div>
              </div>
            </div>

            {validationError && (
              <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Invalid Startup Pitch</span>
                  <p className="text-gray-400 leading-normal">{validationError}</p>
                </div>
              </div>
            )}

            {/* Glowing Action Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-xs font-extrabold uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 active:scale-[0.98] btn-glow"
            >
              Analyze Startup Idea
            </button>
          </form>
        </div>
      )}

      {/* SCREEN 2: LOADING STATE */}
      {isAnalyzing && (
        <div className="max-w-md mx-auto text-center py-20 space-y-6 animate-fadeIn">
          {/* Dual spinning ring */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-secondary animate-spin-reverse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-bold text-white">Jury deliberation in progress...</h3>
            <p className="text-xs text-gray-500 leading-normal max-w-xs mx-auto">
              We are parsing your idea keywords and evaluating logistics.
            </p>
          </div>

          {/* Sequential items checklist */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-4 text-left space-y-2.5">
            {[
              "Deconstructing pitch vocabulary...",
              "Matching location limitations...",
              "Evaluating current market demand...",
              "Comparing competitive moats...",
              "Formulating viability metrics..."
            ].map((stepText, idx) => {
              const active = loadingStep >= idx;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    active ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-gray-600'
                  }`}>
                    {active ? <Check className="w-2.5 h-2.5" /> : null}
                  </div>
                  <span className={active ? 'text-gray-300 font-semibold' : 'text-gray-600'}>
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 3: RESULT DASHBOARD */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Dashboard Header toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Evaluation Workspace</span>
              <h2 className="text-2xl font-black text-white leading-tight">Evaluation Report</h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchParams({});
                  setIdeaText('');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
              >
                Analyze New Idea
              </button>

              {user ? (
                <div className="flex gap-2">
                  {!savedStatus ? (
                    <>
                      <button
                        onClick={handleSavePrivate}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        Save Private
                      </button>
                      <button
                        onClick={handleUploadCommunity}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-white transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-white" />
                        Upload to Community
                      </button>
                    </>
                  ) : savedStatus === 'private' ? (
                    <>
                      <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 select-none">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Saved: Private
                      </span>
                      <button
                        onClick={handleUploadCommunity}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold text-white transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5 text-white" />
                        Upload to Community
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 select-none">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        Community Shared
                      </span>
                      <button
                        onClick={handleSavePrivate}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        Make Private
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white"
                >
                  <LogIn className="w-3.5 h-3.5 text-primary" />
                  Sign In to Save
                </button>
              )}
              <SocialShare 
                title={analysisResult.title} 
                score={analysisResult.viability_score} 
                ideaId={analysisResult.id} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Score Card & summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* SECTION 1: SCORE CARD */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
                {/* Score background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />

                <div className="inline-flex justify-center">
                  <MiniChart score={analysisResult.viability_score} size={110} strokeWidth={8} showText={true} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Viability Score</span>
                  <h3 className="text-lg font-black text-white">
                    {analysisResult.viability_score >= 75 ? 'Strong Concept' : analysisResult.viability_score >= 50 ? 'Moderate Concept' : 'High Risk Concept'}
                  </h3>
                </div>

                {/* SECTION 6: MARKET INFO BADGES */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-extrabold text-gray-400 uppercase">
                    {analysisResult.market_category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${
                    analysisResult.risk_level === 'High' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : analysisResult.risk_level === 'Medium' 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {analysisResult.risk_level} Risk
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-extrabold text-gray-400 uppercase">
                    Confidence: {analysisResult.confidence}
                  </span>
                </div>
              </div>

              {/* SECTION 2: SUMMARY */}
              <div className="glass-panel border border-white/10 rounded-3xl p-5 space-y-2">
                <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Elevator Pitch Summary</span>
                <p className="text-xs text-gray-300 leading-relaxed italic">&ldquo;{analysisResult.summary}&rdquo;</p>
              </div>

              {/* SECTION 3: LOCATION IMPACT */}
              <div className="glass-panel border border-white/10 rounded-3xl p-5 space-y-2">
                <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Scope & Location Constraints</span>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">{analysisResult.location_impact}</p>
              </div>
            </div>

            {/* Right details workspace */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* LOW SCORE WARNING & FEEDBACK TRIGGER */}
              {analysisResult.viability_score < 60 && (
                <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 text-left flex gap-3 items-start animate-pulse-slow">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Critical Review: Weakness Alert</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This business idea scored **{analysisResult.viability_score}/100**. This suggests high operational barriers or market constraints (e.g. low density for physical operations). We strongly advise reviewing the **Mentor Redesign Pitch** below to pivot your concept.
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 3,4,5: STRENGTHS, RISKS, SUGGESTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                  <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {analysisResult.strengths?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
                  <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Risks
                  </h4>
                  <ul className="space-y-1.5">
                    {analysisResult.risks?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-3">
                  <h4 className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    Suggestions
                  </h4>
                  <ul className="space-y-1.5">
                    {analysisResult.suggestions?.map((pt, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-normal list-disc list-inside">{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* MARKET DETAIL PROJECTIONS */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Market Projections & Core Metrics</h3>
                  <RegenButton onClick={handleRegenCore} label="Re-analyze Core" loading={isAnalyzing} lastUpdated={timestamps.core} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Current Market Demand</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{analysisResult.current_demand}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Boom Potential & Growth Verdict</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{analysisResult.boom_potential}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 7: SHARK TANK PANEL */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Shark Tank Investor Feedback</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      analysisResult.final_verdict === 'Invest'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : analysisResult.final_verdict === 'Needs Improvement'
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      Panel Verdict: {analysisResult.final_verdict}
                    </span>
                  </div>
                  <RegenButton onClick={handleRegenSharks} label="Re-ask the Sharks 🦈" loading={loadingSharks} lastUpdated={timestamps.sharks} />
                </div>

                {loadingSharks ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 font-bold">Consulting Shark panel...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.sharks?.map((shark, idx) => (
                      <InvestorCard key={idx} {...shark} />
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 8: IMPROVED IDEA (MENTOR PIVOT) */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-6 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Startup Mentor Redesign Pitch
                  </h3>
                  <RegenButton onClick={handleRegenMentor} label="Reimagine Idea 💡" loading={loadingMentor} lastUpdated={timestamps.mentor} />
                </div>

                {loadingMentor ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 font-bold">Redesigning pitch...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Improved Idea Pitch</span>
                      <p className="text-xs font-semibold text-white leading-relaxed bg-black/40 p-4 rounded-xl">
                        {analysisResult.improved_idea}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Key Pivot Changes</span>
                        <ul className="space-y-1">
                          {analysisResult.key_changes?.map((change, idx) => (
                            <li key={idx} className="text-xs text-gray-300 leading-normal list-decimal list-inside">{change}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Expected Improvement</span>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {analysisResult.expected_improvement}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 9: FUTURE SUCCESS PREDICTIONS */}
              <div className="glass-panel border border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Futurist Predictions & Success Probability</h3>
                  <RegenButton onClick={handleRegenFuture} label="Re-predict Future 🔮" loading={loadingFuture} lastUpdated={timestamps.future} />
                </div>

                {loadingFuture ? (
                  <div className="flex items-center justify-center py-10 gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 font-bold">Simulating market forecasts...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Progress bar success */}
                    <div className="space-y-1.5 bg-black/30 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between text-xs font-semibold text-gray-400">
                        <span>12-Month Market Success Probability</span>
                        <span className="text-primary font-bold">{analysisResult.future_prediction?.success_probability}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000"
                          style={{ width: `${analysisResult.future_prediction?.success_probability}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Best Case Scenario</span>
                        <p className="text-xs text-gray-300 leading-relaxed">{analysisResult.future_prediction?.best_case}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Worst Case Scenario</span>
                        <p className="text-xs text-gray-300 leading-relaxed">{analysisResult.future_prediction?.worst_case}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">Most Likely Outcome</span>
                        <p className="text-xs text-gray-300 leading-relaxed">{analysisResult.future_prediction?.most_likely}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
