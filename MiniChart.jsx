import React from 'react';

const MiniChart = ({ score, size = 60, strokeWidth = 5, showText = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color theme based on score
  let strokeColor = 'stroke-emerald-400';
  let glowColor = 'shadow-emerald-500/20';
  let textColor = 'text-emerald-400';
  let bgColor = 'bg-emerald-500/10';

  if (score < 50) {
    strokeColor = 'stroke-rose-500';
    glowColor = 'shadow-rose-500/20';
    textColor = 'text-rose-400';
    bgColor = 'bg-rose-500/10';
  } else if (score < 75) {
    strokeColor = 'stroke-amber-400';
    glowColor = 'shadow-amber-500/20';
    textColor = 'text-amber-400';
    bgColor = 'bg-amber-500/10';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          className="stroke-gray-800"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            filter: `drop-shadow(0 0 3px var(--color-primary-glow))`
          }}
        />
      </svg>
      {showText && (
        <span className={`absolute text-xs font-bold font-sans ${textColor}`}>
          {score}
        </span>
      )}
    </div>
  );
};

export default MiniChart;
