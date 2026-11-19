import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Star,
  CheckCircle2,
  Calendar,
  ThumbsUp,
  ArrowBigUp,
  ArrowBigDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkline } from './Sparkline';
import { RadarChart } from './RadarChart';
import type { Official } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface PoliticianModalProps {
  official: Official | null;
  onClose: () => void;
  onRate: (official: Official) => void;
}

export const PoliticianModal: React.FC<PoliticianModalProps> = ({
  official,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'reviews'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1W');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(official?.userVote || null);
  const [upvotes, setUpvotes] = useState(official?.upvotesCount || 1420);
  const [downvotes, setDownvotes] = useState(official?.downvotesCount || 340);

  if (!official) return null;

  const handleVote = (direction: 'up' | 'down') => {
    triggerHaptic('medium');
    if (userVote === direction) {
      setUserVote(null);
      if (direction === 'up') setUpvotes((v) => Math.max(0, v - 1));
      else setDownvotes((v) => Math.max(0, v - 1));
    } else {
      if (userVote === 'up') setUpvotes((v) => Math.max(0, v - 1));
      if (userVote === 'down') setDownvotes((v) => Math.max(0, v - 1));
      setUserVote(direction);
      if (direction === 'up') setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    }
  };

  const isPositive = official.change24h >= 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md bg-[#0C0F17] border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Top Grab Bar for Mobile Sheet */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('selection');
                  setIsBookmarked(!isBookmarked);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isBookmarked ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/[0.05] text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  if (navigator.share) {
                    navigator.share({
                      title: `${official.name} - PublicPulse Nigeria`,
                      text: `Check out ${official.name}'s trust rating on PublicPulse Nigeria!`,
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={official.avatar}
                  alt={official.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/15 shadow-xl"
                />
                <span
                  className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[9px] font-bold text-white uppercase"
                  style={{ backgroundColor: official.partyColor }}
                >
                  {official.party}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                    {official.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{official.role}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Assumed Office: {official.assumedOffice}</span>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {(['overview', 'performance', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    triggerHaptic('selection');
                    setActiveTab(tab);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white/[0.1] text-[#00E676] shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Trust Index Hero Banner */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Public Trust Index
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-extrabold text-white font-mono">
                          {official.trustIndex.toFixed(1)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        isPositive ? 'bg-emerald-500/10 text-[#00E676]' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPositive ? `+${official.change7d}% (7D)` : `${official.change7d}% (7D)`}</span>
                    </div>
                  </div>

                  {/* Sparkline & Timeframe Selector */}
                  <div className="mt-4">
                    <Sparkline
                      data={official.sparkline}
                      width={310}
                      height={75}
                      isPositive={isPositive}
                      strokeWidth={2.5}
                      showGradient={true}
                      showDot={true}
                    />

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06]">
                      {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => {
                            triggerHaptic('selection');
                            setSelectedTimeframe(tf);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                            selectedTimeframe === tf
                              ? 'bg-emerald-500/20 text-[#00E676]'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating Summary Breakdown */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white font-['Outfit']">Rating Summary</span>
                    <span className="text-[11px] text-slate-400">
                      Based on {official.ratingsCount.toLocaleString()} ratings
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mt-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-base font-bold text-[#00E676]">{official.approval.positive}%</div>
                      <div className="text-[10px] text-slate-400">Positive</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-base font-bold text-amber-400">{official.approval.neutral}%</div>
                      <div className="text-[10px] text-slate-400">Neutral</div>
                    </div>
                    <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="text-base font-bold text-red-400">{official.approval.negative}%</div>
                      <div className="text-[10px] text-slate-400">Negative</div>
                    </div>
                  </div>
                </div>

                {/* Instant Citizen Accountability Voting */}
                <div className="rounded-2xl glass-panel p-3.5 border border-white/[0.08] bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <span className="text-xs font-bold text-white font-['Outfit'] block">Citizen Direct Vote</span>
                      <span className="text-[10px] text-slate-400">Encrypted, non-traceable one-tap vote</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Zero-Knowledge
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleVote('up')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                        userVote === 'up'
                          ? 'bg-emerald-500/25 border-[#00E676] text-[#00E676] shadow-lg shadow-emerald-500/20'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-emerald-500/10'
                      }`}
                    >
                      <ArrowBigUp className={`w-4 h-4 ${userVote === 'up' ? 'fill-[#00E676]' : ''}`} />
                      <span>Uprate ({upvotes.toLocaleString()})</span>
                    </button>

                    <button
                      onClick={() => handleVote('down')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                        userVote === 'down'
                          ? 'bg-red-500/25 border-red-500 text-red-400 shadow-lg shadow-red-500/20'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-red-500/10'
                      }`}
                    >
                      <ArrowBigDown className={`w-4 h-4 ${userVote === 'down' ? 'fill-red-400' : ''}`} />
                      <span>Downrate ({downvotes.toLocaleString()})</span>
                    </button>
                  </div>
                </div>

                {/* Bio & Key Initiatives */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit']">
                    Leadership Profile & Mandate
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{official.bio}</p>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                      Key Tracked Initiatives:
                    </span>
                    <div className="space-y-1.5">
                      {official.keyInitiatives.map((init, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                          <span>{init}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08] text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit'] mb-1">
                    Multi-Vector Performance Radar
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Aggregated citizen audits across 6 core governance pillars
                  </p>
                  <RadarChart data={official.radar} size={250} color="#00E676" />
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit']">
                    Verified Citizen Reviews
                  </h4>
                  <span className="text-[11px] text-slate-400">{official.recentReviews.length} Reviews</span>
                </div>

                {official.recentReviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl glass-panel p-3.5 border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{rev.author}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                        <span className="text-[10px] text-slate-400">• {rev.state}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>{rev.timeAgo}</span>
                      <div className="flex items-center gap-1 text-slate-300">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{rev.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Apple-grade CTA Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]/90 backdrop-blur-xl">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onRate(official);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#00E676] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#00E676]/25 hover:bg-[#00c966] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-black text-black" />
              <span>Rate This Official</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
