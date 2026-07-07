import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const RegenButton = ({ onClick, label, loading, lastUpdated }) => {
  const [timeText, setTimeText] = useState('Never');

  useEffect(() => {
    if (!lastUpdated) {
      setTimeText('Never');
      return;
    }

    const updateTime = () => {
      const diffMs = Date.now() - new Date(lastUpdated).getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);

      if (diffSecs < 10) {
        setTimeText('just now');
      } else if (diffSecs < 60) {
        setTimeText(`${diffSecs}s ago`);
      } else if (diffMins < 60) {
        setTimeText(`${diffMins}m ago`);
      } else {
        setTimeText(new Date(lastUpdated).toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, [lastUpdated, loading]);

  return (
    <div className="flex flex-col items-end sm:items-start gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 text-xs font-semibold text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-primary group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
        <span>{label}</span>
      </button>
      <span className="text-[10px] text-gray-500 font-medium pl-1">
        Last updated: {loading ? 'recalculating...' : timeText}
      </span>
    </div>
  );
};

export default RegenButton;
