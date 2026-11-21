import React, { useState } from 'react';
import { X, Send, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { AuditRatingInput } from '../utils/civicMath';
import { triggerHaptic } from '../utils/telegram';

export interface RateTarget {
  id: string;
  name: string;
  role: string;
  type: 'official' | 'agency';
}

interface RateModalProps {
  isOpen: boolean;
  target: RateTarget | null;
  onClose: () => void;
  onSubmitRating: (target: RateTarget, ratingData: AuditRatingInput) => void;
}

export const RateModal: React.FC<RateModalProps> = ({
  isOpen,
  target,
  onClose,
  onSubmitRating,
}) => {
  const [economy, setEconomy] = useState(65);
  const [integrity, setIntegrity] = useState(70);
  const [leadership, setLeadership] = useState(60);
  const [transparency, setTransparency] = useState(75);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !target) return null;

  const overallScore = Math.round((economy + integrity + leadership + transparency) / 4);

  const handleSubmit = () => {
    triggerHaptic('medium');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerHaptic('success');

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#E2E8F0', '#94A3B8'],
      });

      onSubmitRating(target, {
        overallScore,
        comment,
        isAnonymous,
      });

      setTimeout(() => {
        setIsSuccess(false);
        setComment('');
        onClose();
      }, 1200);
    }, 500);
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

          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white font-['Outfit'] truncate">
                Audit {target.name}
              </h3>
              <p className="text-xs text-slate-400 truncate">{target.role}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close rating modal"
              className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto no-scrollbar space-y-5">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.08] border-2 border-white/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit']">
                  Audit Rating Recorded
                </h4>
                <p className="text-xs text-slate-300 max-w-[260px] mx-auto">
                  Your verified audit score has been applied to {target.name}&apos;s public trust index.
                </p>
              </div>
            ) : (
              <>
                <div className="surface-card rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Calculated Trust Index</span>
                    <div className="text-3xl font-bold text-white font-mono tabular-nums mt-0.5">
                      {overallScore}%
                    </div>
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      overallScore >= 70
                        ? 'text-white'
                        : overallScore >= 50
                        ? 'text-slate-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {overallScore >= 70
                      ? 'High Confidence'
                      : overallScore >= 50
                      ? 'Moderate Confidence'
                      : 'Low Confidence'}
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'slider-econ', label: 'Economic Impact & Fiscal Policy', val: economy, set: setEconomy },
                    { id: 'slider-integ', label: 'Integrity & Anti-Corruption', val: integrity, set: setIntegrity },
                    { id: 'slider-lead', label: 'Decisiveness & Public Leadership', val: leadership, set: setLeadership },
                    { id: 'slider-trans', label: 'Accessibility & Service Delivery', val: transparency, set: setTransparency },
                  ].map((slider) => (
                    <div key={slider.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor={slider.id} className="text-slate-300 font-medium">
                          {slider.label}
                        </label>
                        <span className="font-bold text-white font-mono tabular-nums">
                          {slider.val}%
                        </span>
                      </div>
                      <input
                        id={slider.id}
                        type="range"
                        min="0"
                        max="100"
                        value={slider.val}
                        onChange={(e) => {
                          triggerHaptic('selection');
                          slider.set(Number(e.target.value));
                        }}
                        className="w-full accent-white bg-white/[0.08] h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="audit-comment" className="text-xs font-semibold text-slate-300 block">
                    Review &amp; Justification (Optional)
                  </label>
                  <textarea
                    id="audit-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide specific evidence or local context..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#12151E] border border-white/[0.1] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="surface-card rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-slate-200" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Anonymous ZK-Signature
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Zero link to your Telegram identity
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAnonymous}
                    aria-label="Anonymous ZK-Signature"
                    onClick={() => {
                      triggerHaptic('selection');
                      setIsAnonymous((v) => !v);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isAnonymous ? 'bg-white' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-black transition-transform ${
                        isAnonymous ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 rounded-2xl bg-white hover:bg-slate-200 text-black font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Recording Audit...' : 'Submit Verified Rating'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
