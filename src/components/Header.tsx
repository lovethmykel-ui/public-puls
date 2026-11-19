import React from 'react';
import { Activity, Bell, ShieldCheck, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface HeaderProps {
  userName?: string;
  isVerified?: boolean;
  onOpenVerification?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Amara',
  isVerified = true,
  onOpenVerification,
  onOpenNotifications,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="px-5 pt-3 pb-4">
      {/* Brand & Top Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00E676]/20 to-[#10B981]/5 border border-[#00E676]/30 flex items-center justify-center glow-emerald-sm">
            <Activity className="w-4 h-4 text-[#00E676] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[17px] tracking-tight text-white font-['Outfit']">PublicPulse</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-[#00E676] border border-emerald-500/30">
                Nigeria
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenNotifications?.();
            }}
            className="relative w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#08090C]" />
          </button>
        </div>
      </div>

      {/* Greeting & Verification Pill */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
            {getGreeting()}, {userName}
            <span className="inline-block hover:rotate-12 transition-transform cursor-pointer">✌️</span>
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Your voice shapes a better Nigeria.
          </p>
        </div>

        {/* Verification Status Pill */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification?.();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all active:scale-95 ${
            isVerified
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-[#00E676]'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}
        >
          {isVerified ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Verified Citizen</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Verified</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
