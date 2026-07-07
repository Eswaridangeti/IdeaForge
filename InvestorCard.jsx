import React from 'react';
import { DollarSign, CheckCircle2, XCircle, TrendingUp, Cpu, HelpCircle, Eye } from 'lucide-react';

const InvestorCard = ({ type, opinion, invest, reason }) => {
  const isInvest = invest.toLowerCase() === 'yes';

  // Customize card based on investor type
  const getStyle = () => {
    switch (type) {
      case 'Aggressive Investor':
        return {
          icon: <TrendingUp className="w-4 h-4 text-rose-400" />,
          bgColor: 'from-rose-500/10 to-transparent',
          borderColor: 'border-rose-500/20',
          titleColor: 'text-rose-300',
          avatar: '🦈',
          name: 'Shark O\'Leary (Aggressive)'
        };
      case 'Product Expert':
        return {
          icon: <Cpu className="w-4 h-4 text-amber-400" />,
          bgColor: 'from-amber-500/10 to-transparent',
          borderColor: 'border-amber-500/20',
          titleColor: 'text-amber-300',
          avatar: '🛠️',
          name: 'Lori Product (Expert)'
        };
      case 'Skeptical Investor':
        return {
          icon: <HelpCircle className="w-4 h-4 text-sky-400" />,
          borderColor: 'border-sky-500/20',
          bgColor: 'from-sky-500/10 to-transparent',
          titleColor: 'text-sky-300',
          avatar: '🤨',
          name: 'Skeptic Herjavec (Critic)'
        };
      case 'Visionary Investor':
        return {
          icon: <Eye className="w-4 h-4 text-purple-400" />,
          borderColor: 'border-purple-500/20',
          bgColor: 'from-purple-500/10 to-transparent',
          titleColor: 'text-purple-300',
          avatar: '🔮',
          name: 'Barbara Vision (Impact)'
        };
      default:
        return {
          icon: <DollarSign className="w-4 h-4 text-primary" />,
          borderColor: 'border-white/10',
          bgColor: 'from-white/5 to-transparent',
          titleColor: 'text-white',
          avatar: '💼',
          name: 'Venture Capitalist'
        };
    }
  };

  const info = getStyle();

  return (
    <div className={`relative flex flex-col justify-between p-5 rounded-2xl border ${info.borderColor} bg-gradient-to-b ${info.bgColor} backdrop-blur-md transition-all duration-300 hover:scale-[1.02]`}>
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{info.avatar}</span>
            <div>
              <h4 className="text-xs font-bold text-white leading-3">{info.name}</h4>
              <span className="text-[10px] text-gray-500 font-medium">{type}</span>
            </div>
          </div>

          {/* Investment decision badge */}
          {isInvest ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-extrabold text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              INVEST
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-extrabold text-rose-400">
              <XCircle className="w-3 h-3" />
              PASS
            </span>
          )}
        </div>

        {/* Opinion quote */}
        <p className="text-xs text-gray-300 italic leading-relaxed">
          &ldquo;{opinion}&rdquo;
        </p>
      </div>

      {/* Reason section */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
          Core Reason
        </span>
        <p className="text-[11px] text-gray-400 font-medium leading-normal">
          {reason}
        </p>
      </div>
    </div>
  );
};

export default InvestorCard;
