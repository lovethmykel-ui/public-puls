import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  Fingerprint,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from 'glisse';
import confetti from 'canvas-confetti';
import amaraAvatar from '../assets/images/citizen_amara_1795210837859.jpg';
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

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    triggerHaptic('medium');
    if (step === 3) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setStep(4);
      }, 1600);
      return;
    }

    if (step === 4) {
      setStep(5);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#E5E5E5', '#A3A3A3'],
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="verification-modal-title"
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Top Grab Bar */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
            <span
              id="verification-modal-title"
              className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']"
            >
              Step {step} of 5 ·{' '}
              {step === 1
                ? 'Verify Phone'
                : step === 2
                ? 'Verify NIN'
                : step === 3
                ? 'Face Verification'
                : step === 4
                ? 'Select Constituency'
                : 'Complete'}
            </span>

            <Button
              type="button"
              variant="glass"
              icon={<X className="w-4 h-4" />}
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Close verification modal"
              className="!h-9 !w-9"
            />
          </div>

          {/* Step Progress Line */}
          <div className="h-1 w-full bg-white/[0.05]">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="p-6 overflow-y-auto no-scrollbar space-y-5">
            {step === 1 && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-[#E5E5E5]">
                  <Phone className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Verify Your Mobile / Telegram ID
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[260px] mx-auto">
                    We will send a 6-digit cryptographic verification code to your authorized account.
                  </p>
                </div>

                <div className="space-y-2 text-left pt-2">
                  <label
                    htmlFor="verify-phone-input"
                    className="text-[11px] font-semibold text-neutral-300 uppercase block"
                  >
                    Phone Number / Telegram Auth
                  </label>
                  <Input
                    id="verify-phone-input"
                    type="text"
                    value={phone}
                    onValueChange={setPhone}
                    icon={<Phone className="w-4 h-4" />}
                    className="!h-11 font-mono"
                  />
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                  <Lock className="w-3 h-3 text-[#E5E5E5]" />
                  <span>Encrypted Zero-Knowledge Hashing Protocol</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-[#E5E5E5]">
                  <Fingerprint className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Verify Your 11-Digit NIN
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[260px] mx-auto">
                    Enter your 11-digit National Identity Number. Zero-Knowledge proofs ensure your raw NIN is never stored.
                  </p>
                </div>

                <div className="space-y-2 text-left pt-2">
                  <label
                    htmlFor="verify-nin-input"
                    className="text-[11px] font-semibold text-neutral-300 uppercase block"
                  >
                    National Identity Number (NIN)
                  </label>
                  <Input
                    id="verify-nin-input"
                    type="text"
                    value={nin}
                    onValueChange={setNin}
                    maxLength={11}
                    icon={<Fingerprint className="w-4 h-4" />}
                    className="!h-11 font-mono tracking-widest"
                  />
                </div>

                <div className="p-3 rounded-2xl surface-card text-left flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E5E5E5] shrink-0" />
                  <div className="text-[11px] text-neutral-300">
                    <span className="font-bold text-white">NIN Verified Match:</span> Amara Uche
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-full p-1 border-2 border-dashed border-white/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={amaraAvatar}
                    alt="Citizen face liveness preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {isScanning && (
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-1 bg-white shadow-lg shadow-white/40"
                    />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Liveness Face Check
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[260px] mx-auto">
                    Please look at the camera in good lighting. Keeps bots and duplicate accounts off the platform.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] text-[11px] text-neutral-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5E5E5]" />
                  <span>Biometrics processed locally on-device</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-3xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-[#E5E5E5] mb-2">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Select Your Constituency
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    This determines which state, senatorial district, and LGA polls you vote on.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label
                      htmlFor="verify-state-select"
                      className="text-[11px] font-semibold text-neutral-300 block mb-1"
                    >
                      State
                    </label>
                    <select
                      id="verify-state-select"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="Lagos State" className="bg-[#141414]">Lagos State</option>
                      <option value="Anambra State" className="bg-[#141414]">Anambra State</option>
                      <option value="Kano State" className="bg-[#141414]">Kano State</option>
                      <option value="Rivers State" className="bg-[#141414]">Rivers State</option>
                      <option value="FCT Abuja" className="bg-[#141414]">FCT Abuja</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="verify-lga-select"
                      className="text-[11px] font-semibold text-neutral-300 block mb-1"
                    >
                      Local Government Area (LGA)
                    </label>
                    <select
                      id="verify-lga-select"
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="Ikeja" className="bg-[#141414]">Ikeja</option>
                      <option value="Alimosho" className="bg-[#141414]">Alimosho</option>
                      <option value="Eti-Osa" className="bg-[#141414]">Eti-Osa</option>
                      <option value="Surulere" className="bg-[#141414]">Surulere</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="verify-ward-input"
                      className="text-[11px] font-semibold text-neutral-300 block mb-1"
                    >
                      Ward
                    </label>
                    <Input
                      id="verify-ward-input"
                      type="text"
                      value={selectedWard}
                      onValueChange={setSelectedWard}
                      className="!h-11 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.08] border-2 border-white/40 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-[#E5E5E5]" />
                </div>

                <div>
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Official Civic Credential Issued
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-['Outfit'] mt-1">
                    You Are Now a Verified Citizen!
                  </h3>
                  <p className="text-xs text-neutral-300 mt-2 max-w-[280px] mx-auto leading-relaxed">
                    You can now vote on public policy, rate government officials with 100% voting power, and shape a more transparent Nigeria.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl surface-card text-left space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Citizen ID:</span>
                    <span className="text-white font-mono font-bold">NG-VRF-8849-01</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Voting Power:</span>
                    <span className="text-white font-mono font-bold">100% Unlocked</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Constituency:</span>
                    <span className="text-white font-medium">Lagos State • Ikeja</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#101010]/90">
            <Button
              type="button"
              variant="filled"
              icon={step < 5 && !isScanning ? <ArrowRight className="w-4 h-4" /> : undefined}
              onClick={handleNextStep}
              disabled={isScanning}
              className="w-full !h-12 !text-sm"
            >
              {isScanning
                ? 'Scanning Liveness...'
                : step === 5
                ? 'Go to Dashboard'
                : 'Continue'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
