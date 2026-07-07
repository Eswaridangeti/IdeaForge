import React, { useState, useRef, useEffect } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';

const SocialShare = ({ title, score, ideaId, isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const setIsOpen = propSetIsOpen !== undefined ? propSetIsOpen : setLocalIsOpen;

  // Generate simulated share link
  const shareUrl = `${window.location.origin}/community?idea=${ideaId}`;
  const shareText = `Check out my startup idea "${title}" on IdeaForge AI! Viability Score: ${score}/100 🧠🚀`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTwitterLink = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  };

  const getFacebookLink = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  };

  const getLinkedinLink = () => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        title="Share this Idea"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0c0919] border border-white/10 shadow-2xl z-50 py-1.5 animate-fadeIn">
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
          >
            <span className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
          </button>

          <div className="h-px bg-white/10 my-1" />

          <a
            href={getTwitterLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            Twitter / X
          </a>

          <a
            href={getFacebookLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-500" />
            Facebook
          </a>

          <a
            href={getLinkedinLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-600" />
            LinkedIn
          </a>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
