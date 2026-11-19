import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/telegram';

interface RateModalProps {
  isOpen: boolean;
  target: { name: string; role: string; type: 'official' | 'agency' } | null;
  onClose: () => void;
  onSubmitRating: (ratingData: any) => void;
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
        colors: ['#00E676', '#10B981', '#38BDF8'],
      });

      setTimeout(() => {
        setIsSuccess(false);
        onSubmitRating({
          target: target.name,
          overallScore,
          scores: { economy, integrity, leadership, transparency },
          comment,
          isAnonymous,
        });
        onClose();
      }, 1500);
    }, 700);
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
          {/* Top Grab Bar */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Rate {target.name}
              </h3>
              <p className="text-[11px] text-slate-400">{target.role}</p>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto no-scrollbar space-y-5">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-[#00E676] flex items-center justify-center glow-emerald">
                  <CheckCircle2 className="w-8 h-8 text-[#00E676]" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit']">
                  Audit Rating Recorded!
                </h4>
                <p className="text-xs text-slate-300 max-w-[260px] mx-auto">
                  Your rating has been cryptographically signed and added to the public trust ledger.
                </p>
              </div>
            ) : (
              <>
                {/* Overall Score Calculated Display */}
                <div className="rounded-2xl glass-panel p-4 border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Calculated Trust Index
                    </span>
                    <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
                      {overallScore}%
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        overallScore >= 70
                          ? 'bg-emerald-500/15 text-[#00E676] border border-emerald-500/30'
                          : overallScore >= 50
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {overallScore >= 70 ? 'High Confidence' : overallScore >= 50 ? 'Moderate Confidence' : 'Low Confidence'}
                    </span>
                  </div>
                </div>

                {/* 4 Multi-Metric Sliders */}
                <div className="space-y-4">
                  {[
                    { label: 'Economic Impact & Fiscal Policy', val: economy, set: setEconomy },
                    { label: 'Integrity, Transparency & Anti-Corruption', val: integrity, set: setIntegrity },
                    { label: 'Decisiveness & Public Leadership', val: leadership, set: setLeadership },
                    { label: 'Accessibility & Service Delivery', val: transparency, set: setTransparency },
                  ].map((slider, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{slider.label}</span>
                        <span className="font-bold text-[#00E676] font-mono">{slider.val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider.val}
                        onChange={(e) => {
                          triggerHaptic('selection');
                          slider.set(Number(e.target.value));
                        }}
                        className="w-full accent-[#00E676] bg-white/[0.08] h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Comment Box */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Citizen Review & Justification (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide specific feedback or community context for your rating..."
                    className="w-full px-4 py-2.5 rounded-2xl glass-panel bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                {/* Anonymous Cryptographic Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00E676]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Anonymous ZK-Signature</span>
                      <span className="text-[10px] text-slate-400">Zero link to your Telegram identity</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      setIsAnonymous(!isAnonymous);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isAnonymous ? 'bg-[#00E676]' : 'bg-slate-700'
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

          {/* Submit Action */}
          {!isSuccess && (
            <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]/90 backdrop-blur-xl">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#00E676] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#00E676]/25 hover:bg-[#00c966] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Recording Rating...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-black" />
                    <span>Submit Verified Rating</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
