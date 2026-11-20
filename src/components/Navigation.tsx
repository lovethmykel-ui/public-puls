import React from 'react';
import { Home, Trophy, Activity, Vote, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'officials', label: 'Index', icon: Trophy },
  { id: 'forum', label: 'Voice', icon: Activity },
  { id: 'elections', label: 'Polls', icon: Vote },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto pointer-events-none safe-bottom"
    >
      <div className="pointer-events-auto dock-glass rounded-full p-1.5 grid grid-cols-5 items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                onChangeTab(tab.id);
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative min-h-[46px] rounded-full flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E676]/60"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavCapsule"
                  className="absolute inset-0 rounded-full bg-white/[0.11]"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon
                className={`relative z-10 w-[19px] h-[19px] transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] tracking-tight leading-none whitespace-nowrap ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
