import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useIdeas } from '../context/IdeaContext';
import { useAuth } from '../context/AuthContext';

const FeedbackModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitFeedback } = useIdeas();
  const [email, setEmail] = useState(user?.email || '');
  const [type, setType] = useState('bug');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 800));
    submitFeedback(email, type, message);
    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-white/10 shadow-2xl p-6 overflow-hidden z-10 animate-scaleUp">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">Feedback Received!</h3>
            <p className="text-xs text-gray-400 max-w-[280px]">
              Thank you for helping us improve IdeaForge AI. Our team will review your report shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Share Your Feedback</h2>
              <p className="text-xs text-gray-400 mt-1">
                Encountered a bug or have a suggestion to make the platform better?
              </p>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  type === 'bug'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report a Bug
              </button>

              <button
                type="button"
                onClick={() => setType('suggestion')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  type === 'suggestion'
                    ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Suggest Feature
              </button>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Details
              </label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === 'bug'
                    ? 'Describe what happened. Include steps to reproduce if possible...'
                    : 'What feature or improvement would you like to see? Describe the benefit...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

export default FeedbackModal;
