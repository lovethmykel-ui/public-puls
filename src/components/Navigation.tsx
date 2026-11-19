import React from 'react';
import { Home, TrendingUp, Users, Vote, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'markets' as NavTab, label: 'Markets', icon: TrendingUp },
    { id: 'officials' as NavTab, label: 'Officials', icon: Users },
    { id: 'elections' as NavTab, label: 'Elections', icon: Vote },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-3 pt-2 pointer-events-none">
      <div className="pointer-events-auto relative flex items-center justify-around py-2 px-1.5 rounded-full bg-[#0F1219]/80 backdrop-blur-2xl border border-white/[0.09] shadow-2xl shadow-black/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('selection');
                onChangeTab(tab.id);
              }}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 transition-colors focus:outline-none select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white/[0.07] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-[#00E676] scale-110' : 'text-slate-400 hover:text-slate-200'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] glow-emerald-sm" />
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-[#00E676] font-semibold' : 'text-slate-400'
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
