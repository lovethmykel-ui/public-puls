import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Slider, Switch } from 'glisse';
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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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
        colors: ['#FFFFFF', '#E5E5E5', '#A3A3A3'],
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="rate-modal-title"
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
            <div className="min-w-0">
              <h3
                id="rate-modal-title"
                className="text-sm font-bold text-white font-['Outfit'] truncate"
              >
                Audit {target.name}
              </h3>
              <p className="text-xs text-neutral-400 truncate">{target.role}</p>
            </div>

            <Button
              type="button"
              variant="glass"
              icon={<X className="w-4 h-4" />}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close rating modal"
              className="!h-9 !w-9 shrink-0"
            />
          </div>

          <div className="p-5 overflow-y-auto no-scrollbar space-y-5">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/[0.08] border-2 border-white/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#E5E5E5]" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit']">
                  Audit Rating Recorded
                </h4>
                <p className="text-xs text-neutral-300 max-w-[260px] mx-auto">
                  Your verified audit score has been applied to {target.name}&apos;s public trust index.
                </p>
              </div>
            ) : (
              <>
                <div className="surface-card rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-400">Calculated Trust Index</span>
                    <div className="text-3xl font-bold text-white font-mono tabular-nums mt-0.5">
                      {overallScore}%
                    </div>
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      overallScore >= 70
                        ? 'text-white'
                        : overallScore >= 50
                        ? 'text-neutral-300'
                        : 'text-neutral-400'
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
                    <div key={slider.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor={slider.id} className="text-neutral-300 font-medium">
                          {slider.label}
                        </label>
                        <span className="font-bold text-white font-mono tabular-nums">
                          {slider.val}%
                        </span>
                      </div>
                      <Slider
                        id={slider.id}
                        min={0}
                        max={100}
                        step={1}
                        value={slider.val}
                        onValueChange={(value) => {
                          triggerHaptic('selection');
                          slider.set(Math.round(value));
                        }}
                        aria-label={slider.label}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="audit-comment" className="text-xs font-semibold text-neutral-300 block">
                    Review &amp; Justification (Optional)
                  </label>
                  <textarea
                    id="audit-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide specific evidence or local context..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#141414] border border-white/[0.1] text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="surface-card rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#E5E5E5]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Anonymous ZK-Signature
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Zero link to your Telegram identity
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      triggerHaptic('selection');
                      setIsAnonymous(checked);
                    }}
                    aria-label="Anonymous ZK-Signature"
                  />
                </div>
              </>
            )}
          </div>

          {!isSuccess && (
            <div className="p-4 border-t border-white/[0.08] bg-[#101010]/90">
              <Button
                type="button"
                variant="filled"
                icon={<Send className="w-4 h-4" />}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full !h-12 !text-sm"
              >
                {isSubmitting ? 'Recording Audit...' : 'Submit Verified Rating'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
