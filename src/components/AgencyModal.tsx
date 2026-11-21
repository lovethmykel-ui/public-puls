import React, { useState, useEffect } from 'react';
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
import { Button, SegmentedControl } from 'glisse';
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

type ModalTab = 'overview' | 'metrics' | 'reviews';

const TAB_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'metrics', label: 'Metrics' },
  { value: 'reviews', label: 'Reviews' },
];

export const AgencyModal: React.FC<AgencyModalProps> = ({
  agency,
  isBookmarked = false,
  onToggleBookmark,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!agency) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [agency, onClose]);

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
          role="dialog"
          aria-modal="true"
          aria-labelledby="agency-modal-title"
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <Button
              type="button"
              variant="glass"
              icon={<X className="w-4 h-4" />}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close agency details"
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
                  onToggleBookmark?.(agency.id);
                }}
                aria-pressed={isBookmarked}
                aria-label={isBookmarked ? 'Remove agency bookmark' : 'Bookmark agency'}
                className="!h-9 !w-9"
              />

              <Button
                type="button"
                variant="glass"
                icon={copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                onClick={handleShare}
                aria-label="Share agency profile"
                className="!h-9 !w-9"
              />
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
                <h3
                  id="agency-modal-title"
                  className="text-lg font-bold text-white tracking-tight font-['Outfit']"
                >
                  {agency.acronym}
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">{agency.name}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {agency.headTitle}: <span className="text-neutral-200">{agency.head}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <SegmentedControl
                aria-label="Agency detail sections"
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
                      <span className="text-xs text-neutral-400">Institutional Trust Score</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-3xl font-bold text-white font-mono tabular-nums">
                          {agency.trustIndex.toFixed(1)}
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
                      <span>{isPositive ? `+${agency.change7d}% 7D` : `${agency.change7d}% 7D`}</span>
                    </div>
                  </div>

                  <div className="mt-3 chart-dot-grid rounded-xl p-2 bg-[#101010]">
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
                      <span className="text-xs text-neutral-400">{m.label}</span>
                      <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                        {m.val}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="surface-card rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-neutral-300 font-['Outfit']">
                    Statutory Mandate
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{agency.description}</p>
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
                      <span className="text-neutral-300">{item.label}</span>
                      <span className="font-bold text-white font-mono tabular-nums">
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/85 rounded-full"
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

          <div className="p-4 border-t border-white/[0.08] bg-[#101010]/90">
            <Button
              type="button"
              variant="filled"
              icon={<Star className="w-4 h-4 fill-current" />}
              onClick={() => {
                triggerHaptic('medium');
                onRate(agency);
              }}
              className="w-full !h-12 !text-sm"
            >
              Audit &amp; Rate Institution
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
