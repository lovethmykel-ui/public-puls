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
  ArrowBigDown,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkline } from './Sparkline';
import { RadarChart } from './RadarChart';
import type { Official } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface PoliticianModalProps {
  official: Official | null;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onVote?: (officialId: string, direction: 'up' | 'down') => void;
  onClose: () => void;
  onRate: (official: Official) => void;
}

export const PoliticianModal: React.FC<PoliticianModalProps> = ({
  official,
  isBookmarked = false,
  onToggleBookmark,
  onVote,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'reviews'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1W');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!official) return null;

  const isPositive = official.change24h >= 0;

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator
        .share({
          title: `${official.name} - PublicPulse Nigeria`,
          text: `${official.name} has a ${official.trustIndex.toFixed(1)}/100 Citizen Trust Index on PublicPulse.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md bg-[#0C0F17] border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close official details"
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onToggleBookmark?.(official.id);
                }}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? 'Remove from watchlist' : 'Save to watchlist'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                  isBookmarked
                    ? 'bg-white/[0.15] border-white/30 text-slate-200'
                    : 'bg-white/[0.06] border-transparent text-slate-200 hover:bg-white/[0.1]'
                }`}
              >
                <Bookmark className={`w-4 h-4 text-slate-200 ${isBookmarked ? 'fill-slate-200' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share official profile"
                className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-200 hover:bg-white/[0.1]"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-slate-200" />
                ) : (
                  <Share2 className="w-4 h-4 text-slate-200" />
                )}
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={official.avatar}
                  alt={official.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit'] truncate">
                    {official.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-slate-200 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{official.role}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3 shrink-0 text-slate-200" />
                  <span>
                    {official.party} · {official.assumedOffice}
                  </span>
                </div>
              </div>
            </div>

            {/* Underline Sub-Tabs */}
            <div className="grid grid-cols-3 border-b border-white/[0.08]">
              {(['overview', 'performance', 'reviews'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setActiveTab(tab);
                    }}
                    className={`relative min-h-[40px] py-2 text-xs font-semibold capitalize transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <span className="absolute inset-x-3 bottom-0 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="surface-card rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Public Trust Index</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-bold text-white font-mono tabular-nums">
                          {official.trustIndex.toFixed(1)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs font-bold font-mono tabular-nums ${
                        isPositive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-200" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-slate-200" />
                      )}
                      <span>{isPositive ? `+${official.change7d}% 7D` : `${official.change7d}% 7D`}</span>
                    </div>
                  </div>

                  <div className="mt-3 chart-dot-grid rounded-xl p-2">
                    <Sparkline
                      data={official.sparkline}
                      width={310}
                      height={75}
                      isPositive={isPositive}
                      strokeWidth={2.5}
                      showGradient={true}
                      showDot={true}
                      responsive={true}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.06]">
                    {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection');
                          setSelectedTimeframe(tf);
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          selectedTimeframe === tf
                            ? 'bg-white/[0.12] text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Summary */}
                <div className="surface-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white font-['Outfit']">
                      Sentiment Split
                    </span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {official.ratingsCount.toLocaleString()} ratings
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/[0.1]">
                      <div className="text-base font-bold text-white font-mono tabular-nums">
                        {official.approval.positive}%
                      </div>
                      <div className="text-[11px] text-slate-400">Positive</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <div className="text-base font-bold text-slate-200 font-mono tabular-nums">
                        {official.approval.neutral}%
                      </div>
                      <div className="text-[11px] text-slate-400">Neutral</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-base font-bold text-slate-400 font-mono tabular-nums">
                        {official.approval.negative}%
                      </div>
                      <div className="text-[11px] text-slate-400">Negative</div>
                    </div>
                  </div>
                </div>

                {/* Direct Citizen Vote */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onVote?.(official.id, 'up');
                    }}
                    aria-pressed={official.userVote === 'up'}
                    className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      official.userVote === 'up'
                        ? 'bg-white/[0.14] border-white/35 text-white'
                        : 'bg-[#12151E] border-white/[0.08] text-slate-200 hover:border-white/25'
                    }`}
                  >
                    <ArrowBigUp
                      className={`w-4 h-4 text-slate-200 ${official.userVote === 'up' ? 'fill-slate-200' : ''}`}
                    />
                    <span className="font-mono tabular-nums">
                      Uprate ({official.upvotesCount.toLocaleString()})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onVote?.(official.id, 'down');
                    }}
                    aria-pressed={official.userVote === 'down'}
                    className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      official.userVote === 'down'
                        ? 'bg-white/[0.1] border-white/25 text-white'
                        : 'bg-[#12151E] border-white/[0.08] text-slate-200 hover:border-white/25'
                    }`}
                  >
                    <ArrowBigDown
                      className={`w-4 h-4 text-slate-200 ${official.userVote === 'down' ? 'fill-slate-200' : ''}`}
                    />
                    <span className="font-mono tabular-nums">
                      Downrate ({official.downvotesCount.toLocaleString()})
                    </span>
                  </button>
                </div>

                {/* Bio & Initiatives */}
                <div className="surface-card rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 font-['Outfit']">
                    Leadership Mandate
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{official.bio}</p>
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    {official.keyInitiatives.map((init, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                        <span>{init}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="surface-card rounded-2xl p-4 text-center">
                <h4 className="text-xs font-bold text-white font-['Outfit'] mb-1">
                  Governance Pillar Radar
                </h4>
                <p className="text-xs text-slate-400 mb-2">
                  Citizen audits across 6 core performance sectors
                </p>
                <RadarChart data={official.radar} size={250} color="#E2E8F0" />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {official.recentReviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-white">{rev.author}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-200" />
                        <span className="text-slate-400">· {rev.state}</span>
                      </div>
                      <div className="flex items-center text-slate-200">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-slate-200 fill-slate-200" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rev.timeAgo}</span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-slate-200" />
                        {rev.upvotes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky CTA Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onRate(official);
              }}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-black" />
              <span>Audit &amp; Rate Official</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
