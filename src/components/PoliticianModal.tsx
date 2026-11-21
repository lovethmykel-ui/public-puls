import React, { useState, useEffect } from 'react';
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
import { Button, SegmentedControl } from 'glisse';
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

type ModalTab = 'overview' | 'performance' | 'reviews';

const TAB_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'performance', label: 'Performance' },
  { value: 'reviews', label: 'Reviews' },
];

export const PoliticianModal: React.FC<PoliticianModalProps> = ({
  official,
  isBookmarked = false,
  onToggleBookmark,
  onVote,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1W');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!official) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [official, onClose]);

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
          role="dialog"
          aria-modal="true"
          aria-labelledby="official-modal-title"
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <Button
              type="button"
              variant="glass"
              icon={<X className="w-4 h-4" />}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close official details"
              className="!h-9 !w-9"
            />

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="glass"
                icon={
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-[#E5E5E5]' : ''}`}
                  />
                }
                onClick={() => {
                  triggerHaptic('selection');
                  onToggleBookmark?.(official.id);
                }}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? 'Remove from watchlist' : 'Save to watchlist'}
                className="!h-9 !w-9"
              />

              <Button
                type="button"
                variant="glass"
                icon={copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                onClick={handleShare}
                aria-label="Share official profile"
                className="!h-9 !w-9"
              />
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
                  <h3
                    id="official-modal-title"
                    className="text-lg font-bold text-white tracking-tight font-['Outfit'] truncate"
                  >
                    {official.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-[#E5E5E5] shrink-0" />
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">{official.role}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                  <Calendar className="w-3 h-3 shrink-0 text-[#E5E5E5]" />
                  <span>
                    {official.party} · {official.assumedOffice}
                  </span>
                </div>
              </div>
            </div>

            {/* Liquid Glass Sub-Tabs */}
            <div className="flex justify-center">
              <SegmentedControl
                aria-label="Official detail sections"
                items={TAB_ITEMS}
                value={activeTab}
                onValueChange={(value) => {
                  triggerHaptic('selection');
                  setActiveTab(value as ModalTab);
                }}
                className="lg-segmented-3"
              />
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="surface-card rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-neutral-400">Public Trust Index</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-bold text-white font-mono tabular-nums">
                          {official.trustIndex.toFixed(1)}
                        </span>
                        <span className="text-xs font-semibold text-neutral-400 font-mono">/ 100</span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs font-bold font-mono tabular-nums ${
                        isPositive ? 'text-white' : 'text-neutral-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#E5E5E5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-[#E5E5E5]" />
                      )}
                      <span>{isPositive ? `+${official.change7d}% 7D` : `${official.change7d}% 7D`}</span>
                    </div>
                  </div>

                  <div className="mt-3 chart-dot-grid rounded-xl p-2 bg-[#101010]">
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
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          selectedTimeframe === tf
                            ? 'bg-white/[0.14] text-white'
                            : 'text-neutral-400 hover:text-neutral-200'
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
                    <span className="text-xs text-neutral-400 font-mono tabular-nums">
                      {official.ratingsCount.toLocaleString()} ratings
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/[0.1]">
                      <div className="text-base font-bold text-white font-mono tabular-nums">
                        {official.approval.positive}%
                      </div>
                      <div className="text-[11px] text-neutral-400">Positive</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <div className="text-base font-bold text-neutral-200 font-mono tabular-nums">
                        {official.approval.neutral}%
                      </div>
                      <div className="text-[11px] text-neutral-400">Neutral</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-base font-bold text-neutral-400 font-mono tabular-nums">
                        {official.approval.negative}%
                      </div>
                      <div className="text-[11px] text-neutral-400">Negative</div>
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
                    className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                      official.userVote === 'up'
                        ? 'bg-white/[0.16] border-white/35 text-white'
                        : 'bg-[#161616] border-white/[0.08] text-neutral-200 hover:border-white/25'
                    }`}
                  >
                    <ArrowBigUp
                      className={`w-4 h-4 text-[#E5E5E5] ${official.userVote === 'up' ? 'fill-[#E5E5E5]' : ''}`}
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
                    className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                      official.userVote === 'down'
                        ? 'bg-white/[0.16] border-white/35 text-white'
                        : 'bg-[#161616] border-white/[0.08] text-neutral-200 hover:border-white/25'
                    }`}
                  >
                    <ArrowBigDown
                      className={`w-4 h-4 text-[#E5E5E5] ${official.userVote === 'down' ? 'fill-[#E5E5E5]' : ''}`}
                    />
                    <span className="font-mono tabular-nums">
                      Downrate ({official.downvotesCount.toLocaleString()})
                    </span>
                  </button>
                </div>

                {/* Bio & Initiatives */}
                <div className="surface-card rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 font-['Outfit']">
                    Leadership Mandate
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{official.bio}</p>
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    {official.keyInitiatives.map((init, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E5E5E5] shrink-0" />
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
                <p className="text-xs text-neutral-400 mb-2">
                  Citizen audits across 6 core performance sectors
                </p>
                <RadarChart data={official.radar} size={250} color="#E5E5E5" />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {official.recentReviews.map((rev) => (
                  <div key={rev.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-white">{rev.author}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E5E5E5]" />
                        <span className="text-neutral-400">· {rev.state}</span>
                      </div>
                      <div className="flex items-center text-[#E5E5E5]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-[#E5E5E5] fill-[#E5E5E5]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{rev.timeAgo}</span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-[#E5E5E5]" />
                        {rev.upvotes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky CTA Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#101010]/90">
            <Button
              type="button"
              variant="filled"
              icon={<Star className="w-4 h-4 fill-current" />}
              onClick={() => {
                triggerHaptic('medium');
                onRate(official);
              }}
              className="w-full !h-12 !text-sm"
            >
              Audit &amp; Rate Official
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
