import React from 'react';
import { Activity, Bell, ShieldCheck, Sparkles } from 'lucide-react';
import type { NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface HeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  isVerified?: boolean;
  unreadCount?: number;
  onOpenVerification?: () => void;
  onOpenNotifications?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'officials', label: 'Officials' },
  { id: 'forum', label: 'Voice' },
  { id: 'elections', label: 'Elections' },
  { id: 'profile', label: 'Profile' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  isVerified = true,
  unreadCount = 3,
  onOpenVerification,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 px-4 sm:px-6 flex items-center justify-between gap-4 bg-[#08090C]/80 backdrop-blur-xl border-b border-white/[0.06] safe-top">
      {/* Zone 1: Single-line Brand Wordmark */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic('selection');
          onChangeTab('home');
        }}
        className="flex items-center gap-2.5 min-h-[44px] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]/60 rounded-xl"
      >
        <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-white font-['Outfit'] whitespace-nowrap shrink-0">
          PublicPulse
        </span>
      </button>

      {/* Zone 2: Desktop Single-Line Navigation */}
      <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                onChangeTab(item.id);
              }}
              className={`relative py-4 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-white ${
                isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#00E676]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Verification Action + Notifications */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification?.();
          }}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors active:scale-95 ${
            isVerified
              ? 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-100 border border-white/[0.08]'
              : 'bg-[#00E676] text-black hover:bg-[#00cf6a]'
          }`}
        >
          {isVerified ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00E676] shrink-0" />
              <span>Verified</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Verify ID</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenNotifications?.();
          }}
          className="relative w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shrink-0"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#00E676] text-black text-[10px] font-bold flex items-center justify-center tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
