import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Bookmark, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Star,
  ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkline } from './Sparkline';
import type { Agency } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface AgencyModalProps {
  agency: Agency | null;
  onClose: () => void;
  onRate: (agency: Agency) => void;
}

export const AgencyModal: React.FC<AgencyModalProps> = ({
  agency,
  onClose,
  onRate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'reviews'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!agency) return null;

  const isPositive = agency.change24h >= 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
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
                  isBookmarked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.05] text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  if (navigator.share) {
                    navigator.share({
                      title: `${agency.name} - PublicPulse Nigeria`,
                      text: `Check out ${agency.acronym}'s public trust rating on PublicPulse Nigeria!`,
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

          {/* Modal Body */}
          <div className="overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
            {/* Header Card */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center overflow-hidden p-2 shadow-xl flex-shrink-0">
                <img
                  src={agency.logo}
                  alt={agency.acronym}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                    {agency.acronym}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Federal Agency
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{agency.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Executive Head: <span className="text-slate-200">{agency.head}</span>
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {(['overview', 'metrics', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    triggerHaptic('selection');
                    setActiveTab(tab);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white/[0.1] text-blue-400 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Trust Score Hero Banner */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Institutional Trust Score
                      </span>
                      <div className="text-3xl font-extrabold text-white font-mono mt-1">
                        {agency.trustIndex.toFixed(1)}%
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                        isPositive ? 'bg-emerald-500/10 text-[#00E676]' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPositive ? `+${agency.change7d}% 7D` : `${agency.change7d}% 7D`}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Sparkline
                      data={agency.sparkline}
                      width={310}
                      height={75}
                      isPositive={isPositive}
                      strokeWidth={2.5}
                      showGradient={true}
                      showDot={true}
                    />
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase">Transparency</span>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">
                      {agency.metrics.transparency}%
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase">Effectiveness</span>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">
                      {agency.metrics.effectiveness}%
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase">Integrity</span>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">
                      {agency.metrics.integrity}%
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl glass-panel border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase">Public Perception</span>
                    <div className="text-lg font-bold text-white font-mono mt-0.5">
                      {agency.metrics.publicPerception}%
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit'] mb-1.5">
                    Statutory Mandate
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{agency.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-3">
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit']">
                    Audited Institutional Metrics
                  </h4>

                  {[
                    { label: 'Transparency & Freedom of Information', score: agency.metrics.transparency },
                    { label: 'Operational Enforcement Effectiveness', score: agency.metrics.effectiveness },
                    { label: 'Procedural Integrity & Due Process', score: agency.metrics.integrity },
                    { label: 'Citizen Perception & Service Delivery', score: agency.metrics.publicPerception },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="font-bold text-white font-mono">{item.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Outfit']">
                  Public Feedback
                </h4>

                {agency.recentReviews.map((rev) => (
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

          {/* Sticky CTA */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]/90 backdrop-blur-xl">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onRate(agency);
              }}
              className="w-full py-3.5 rounded-2xl bg-blue-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Rate This Institution</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
