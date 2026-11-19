import React from 'react';
import { Home, Users, Vote, User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-1 pointer-events-none">
      <div className="pointer-events-auto relative flex items-center justify-between py-2 px-3 rounded-full bg-[#0D1017]/85 backdrop-blur-2xl border border-white/[0.09] shadow-2xl shadow-black/85">
        {/* 1. HOME TAB */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onChangeTab('home');
          }}
          className="relative flex items-center justify-center p-3 transition-transform active:scale-90"
          aria-label="Home"
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="navGlow"
              className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Home
            className={`w-5 h-5 transition-colors ${
              activeTab === 'home' ? 'text-[#00E676]' : 'text-slate-400 hover:text-slate-200'
            }`}
          />
          {activeTab === 'home' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] glow-emerald-sm" />
          )}
        </button>

        {/* 2. OFFICIALS TAB */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onChangeTab('officials');
          }}
          className="relative flex items-center justify-center p-3 transition-transform active:scale-90"
          aria-label="Officials & Agencies"
        >
          {activeTab === 'officials' && (
            <motion.div
              layoutId="navGlow"
              className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Users
            className={`w-5 h-5 transition-colors ${
              activeTab === 'officials' ? 'text-[#00E676]' : 'text-slate-400 hover:text-slate-200'
            }`}
          />
          {activeTab === 'officials' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] glow-emerald-sm" />
          )}
        </button>

        {/* 3. CENTER LOGO BUTTON: FORUM / THE PEOPLE'S VOICE */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onChangeTab('forum');
          }}
          className="relative -top-2 flex items-center justify-center transition-transform active:scale-95 group"
          aria-label="The People's Voice Forum"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              activeTab === 'forum'
                ? 'bg-[#00E676] text-black shadow-[#00E676]/40 ring-4 ring-[#00E676]/20 scale-105'
                : 'bg-gradient-to-tr from-[#0F291E] to-[#10B981]/30 text-[#00E676] border border-[#00E676]/40 shadow-black/60 hover:scale-105'
            }`}
          >
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          {activeTab === 'forum' && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E676] glow-emerald" />
          )}
        </button>

        {/* 4. ELECTIONS TAB */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onChangeTab('elections');
          }}
          className="relative flex items-center justify-center p-3 transition-transform active:scale-90"
          aria-label="Elections"
        >
          {activeTab === 'elections' && (
            <motion.div
              layoutId="navGlow"
              className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Vote
            className={`w-5 h-5 transition-colors ${
              activeTab === 'elections' ? 'text-[#00E676]' : 'text-slate-400 hover:text-slate-200'
            }`}
          />
          {activeTab === 'elections' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] glow-emerald-sm" />
          )}
        </button>

        {/* 5. PROFILE TAB */}
        <button
          onClick={() => {
            triggerHaptic('selection');
            onChangeTab('profile');
          }}
          className="relative flex items-center justify-center p-3 transition-transform active:scale-90"
          aria-label="Profile"
        >
          {activeTab === 'profile' && (
            <motion.div
              layoutId="navGlow"
              className="absolute inset-0 bg-white/[0.08] rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <User
            className={`w-5 h-5 transition-colors ${
              activeTab === 'profile' ? 'text-[#00E676]' : 'text-slate-400 hover:text-slate-200'
            }`}
          />
          {activeTab === 'profile' && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E676] glow-emerald-sm" />
          )}
        </button>
      </div>
    </nav>
  );
};
