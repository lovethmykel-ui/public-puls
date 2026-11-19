import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Fingerprint, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { triggerHaptic } from '../utils/telegram';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState('080 1234 5678');
  const [nin, setNin] = useState('12345678901');
  const [selectedState, setSelectedState] = useState('Lagos State');
  const [selectedLga, setSelectedLga] = useState('Ikeja');
  const [selectedWard, setSelectedWard] = useState('Ikeja Ward 05');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    triggerHaptic('medium');
    if (step === 3) {
      // Simulate Face Liveness Scan
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setStep(4);
      }, 1600);
      return;
    }

    if (step === 4) {
      setStep(5);
      // Trigger Apple-grade celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E676', '#10B981', '#ffffff', '#38BDF8'],
      });
      triggerHaptic('success');
      return;
    }

    if (step === 5) {
      onComplete();
      onClose();
      return;
    }

    setStep((prev) => prev + 1);
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
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                Step {step} of 5: {step === 1 ? 'Verify Phone' : step === 2 ? 'Verify NIN' : step === 3 ? 'Face Verification' : step === 4 ? 'Select Constituency' : 'Verification Complete!'}
              </span>
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

          {/* Step Progress Line */}
          <div className="h-1 w-full bg-white/[0.05]">
            <div
              className="h-full bg-[#00E676] transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="p-6 overflow-y-auto no-scrollbar space-y-5">
            {step === 1 && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00E676]">
                  <Phone className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Verify Your Mobile / Telegram ID
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
                    We will send a 6-digit cryptographic verification code to your authorized account.
                  </p>
                </div>

                <div className="space-y-2 text-left pt-2">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase">
                    Phone Number / Telegram Auth
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <Lock className="w-3 h-3 text-[#00E676]" />
                  <span>Encrypted Zero-Knowledge Hashing Protocol</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Fingerprint className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Verify Your 11-Digit NIN
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
                    Enter your 11-digit National Identity Number. Zero-Knowledge proofs ensure your raw NIN is never stored.
                  </p>
                </div>

                <div className="space-y-2 text-left pt-2">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase">
                    National Identity Number (NIN)
                  </label>
                  <input
                    type="text"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0" />
                  <div className="text-[11px] text-slate-300">
                    <span className="font-bold text-[#00E676]">NIN Verified Match:</span> Amara Uche
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-full p-1 border-2 border-dashed border-[#00E676]/60 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Face scan"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {isScanning && (
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-1 bg-[#00E676] shadow-lg shadow-[#00E676]"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Liveness Face Check
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
                    Please look at the camera in good lighting. Keeps bots and duplicate accounts off the platform.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-[11px] text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Biometrics processed locally on-device</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Select Your Constituency
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This determines which state, senatorial district, and LGA polls you vote on.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      <option value="Lagos State" className="bg-[#0C0F17]">Lagos State</option>
                      <option value="Anambra State" className="bg-[#0C0F17]">Anambra State</option>
                      <option value="Kano State" className="bg-[#0C0F17]">Kano State</option>
                      <option value="Rivers State" className="bg-[#0C0F17]">Rivers State</option>
                      <option value="FCT Abuja" className="bg-[#0C0F17]">FCT Abuja</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Local Government Area (LGA)</label>
                    <select
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    >
                      <option value="Ikeja" className="bg-[#0C0F17]">Ikeja</option>
                      <option value="Alimosho" className="bg-[#0C0F17]">Alimosho</option>
                      <option value="Eti-Osa" className="bg-[#0C0F17]">Eti-Osa</option>
                      <option value="Surulere" className="bg-[#0C0F17]">Surulere</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ward</label>
                    <input
                      type="text"
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-[#00E676] flex items-center justify-center glow-emerald">
                  <ShieldCheck className="w-10 h-10 text-[#00E676]" />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#00E676] uppercase tracking-wider">
                    Official Civic Credential Issued
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-['Outfit'] mt-1">
                    You Are Now a Verified Citizen!
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 max-w-[280px] mx-auto leading-relaxed">
                    You can now vote on public policy, rate government officials with 100% voting power, and shape a more transparent Nigeria.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl glass-panel border border-emerald-500/20 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Citizen ID:</span>
                    <span className="text-white font-mono font-bold">NG-VRF-8849-01</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Voting Power:</span>
                    <span className="text-[#00E676] font-mono font-bold">100% Unlocked</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Constituency:</span>
                    <span className="text-white font-medium">Lagos State • Ikeja</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0C0F17]/90 backdrop-blur-xl">
            <button
              onClick={handleNextStep}
              disabled={isScanning}
              className="w-full py-3.5 rounded-2xl bg-[#00E676] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#00E676]/25 hover:bg-[#00c966] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <span>Scanning Liveness...</span>
              ) : step === 5 ? (
                <span>Go to Dashboard</span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
