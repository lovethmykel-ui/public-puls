import React, { useState } from 'react';
import {
  X,
  Share2,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Star,
  ThumbsUp,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkline } from './Sparkline';
import type { Agency } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface AgencyModalProps {
  agency: Agency | null;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onClose: () => void;
  onRate: (agency: Agency) => void;
}

export const AgencyModal: React.FC<AgencyModalProps> = ({
  agency,
  isBookmarked = false,
  onToggleBookmark,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'reviews'>('overview');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!agency) return null;

  const isPositive = agency.change24h >= 0;

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator
        .share({
          title: `${agency.name} - PublicPulse Nigeria`,
          text: `${agency.acronym} holds a ${agency.trustIndex.toFixed(1)}/100 trust score on PublicPulse.`,
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

          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close agency details"
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onToggleBookmark?.(agency.id);
                }}
                aria-label={isBookmarked ? 'Remove agency bookmark' : 'Bookmark agency'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isBookmarked
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/[0.06] text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share agency profile"
                className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-[#00E676]" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden p-2.5 shrink-0">
                <img
                  src={agency.logo}
                  alt={agency.acronym}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                  {agency.acronym}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{agency.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {agency.headTitle}: <span className="text-slate-200">{agency.head}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b border-white/[0.08]">
              {(['overview', 'metrics', 'reviews'] as const).map((tab) => {
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
                      <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#00E676] rounded-full" />
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
                      <span className="text-xs text-slate-400">Institutional Trust Score</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-bold text-white font-mono tabular-nums">
                          {agency.trustIndex.toFixed(1)}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs font-bold font-mono tabular-nums ${
                        isPositive ? 'text-[#00E676]' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>{isPositive ? `+${agency.change7d}% 7D` : `${agency.change7d}% 7D`}</span>
                    </div>
                  </div>

                  <div className="mt-3 chart-dot-grid rounded-xl p-2">
                    <Sparkline
                      data={agency.sparkline}
                      width={310}
                      height={75}
                      isPositive={isPositive}
                      strokeWidth={2.5}
                      showGradient={true}
                      showDot={true}
                      responsive={true}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Transparency', val: agency.metrics.transparency },
                    { label: 'Effectiveness', val: agency.metrics.effectiveness },
                    { label: 'Integrity', val: agency.metrics.integrity },
                    { label: 'Perception', val: agency.metrics.publicPerception },
                  ].map((m) => (
                    <div key={m.label} className="surface-card rounded-2xl p-3">
                      <span className="text-xs text-slate-400">{m.label}</span>
                      <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                        {m.val}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="surface-card rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 font-['Outfit']">
                    Statutory Mandate
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{agency.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="surface-card rounded-2xl p-4 space-y-4">
                {[
                  { label: 'Transparency & Freedom of Information', score: agency.metrics.transparency },
                  { label: 'Operational Enforcement Effectiveness', score: agency.metrics.effectiveness },
                  { label: 'Procedural Integrity & Due Process', score: agency.metrics.integrity },
                  { label: 'Citizen Perception & Service Delivery', score: agency.metrics.publicPerception },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold text-white font-mono tabular-nums">
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00E676] rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {agency.recentReviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-white">{rev.author}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                        <span className="text-slate-400">· {rev.state}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rev.timeAgo}</span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {rev.upvotes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                onRate(agency);
              }}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-[#00E676] hover:bg-[#00cf6a] text-black font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-black" />
              <span>Audit &amp; Rate Institution</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
