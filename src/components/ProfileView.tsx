import React from 'react';
import { 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  Users, 
  History, 
  Bookmark, 
  Lock, 
  HelpCircle, 
  Info, 
  LogOut,
  Zap
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface ProfileViewProps {
  onOpenVerification: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenVerification }) => {
  return (
    <div className="space-y-4 px-4 pb-28">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
          Citizen Profile & Credentials
        </h2>
        <p className="text-xs text-slate-400">Zero-Knowledge identity, influence score & voting records</p>
      </div>

      {/* Citizen Card */}
      <div className="rounded-3xl glass-panel p-5 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Amara Uche"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#00E676]/40 shadow-xl"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#00E676] flex items-center justify-center ring-2 ring-[#08090C]">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                Amara Uche
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#00E676] border border-emerald-500/30">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">Lagos State, Ikeja LGA (Ward 05)</p>
            <p className="text-[11px] text-slate-400 mt-1">Verified Citizen since May 2025</p>
          </div>
        </div>

        {/* Voting Power Widget */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Zap className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Civic Voting Power</span>
            </div>
            <span className="font-extrabold text-[#00E676] font-mono text-sm">100% Strength</span>
          </div>
          <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-[#00E676] rounded-full w-full" />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Maximum weighting unlocked through verified NIN cryptographic proof and liveness check.
          </p>
        </div>

        {/* Influence & Activity Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-white/[0.06] text-center">
          <div>
            <div className="text-sm font-bold text-white font-mono">8,420</div>
            <div className="text-[9px] text-slate-400 uppercase mt-0.5">Influence</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">152</div>
            <div className="text-[9px] text-slate-400 uppercase mt-0.5">Ratings</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">43</div>
            <div className="text-[9px] text-slate-400 uppercase mt-0.5">Reviews</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">26</div>
            <div className="text-[9px] text-slate-400 uppercase mt-0.5">Following</div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="rounded-3xl glass-panel p-2 border border-white/[0.08] divide-y divide-white/[0.05]">
        {[
          { label: 'My Ratings & Audits', count: '152', icon: Star, onClick: () => {} },
          { label: 'My Published Comments', count: '43', icon: MessageSquare, onClick: () => {} },
          { label: 'Following Officials', count: '26', icon: Users, onClick: () => {} },
          { label: 'Saved Watchlist', count: '15', icon: Bookmark, onClick: () => {} },
          { label: 'Immutable Voting Ledger', icon: History, onClick: () => {} },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('light');
                item.onClick();
              }}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.03] transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.count && (
                  <span className="text-xs font-bold text-slate-400 font-mono">{item.count}</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Security & Privacy Settings */}
      <div className="rounded-3xl glass-panel p-2 border border-white/[0.08] divide-y divide-white/[0.05]">
        <button
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification();
          }}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#00E676]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Zero-Knowledge Identity Vault</span>
              <span className="text-[10px] text-slate-400">Cryptographically unlink SIM & Phone</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => triggerHaptic('light')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-300">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Help, Security & FAQ</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => triggerHaptic('light')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-300">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">About PublicPulse Nigeria</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => triggerHaptic('warning')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-red-500/[0.05] transition-colors rounded-xl text-red-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Wipe Local Device Session</span>
          </div>
        </button>
      </div>
    </div>
  );
};
