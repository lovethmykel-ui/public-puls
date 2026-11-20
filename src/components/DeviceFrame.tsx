import React from 'react';
import type { NavTab } from '../types';

interface DeviceFrameProps {
  activeTab?: NavTab;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ activeTab = 'home', children }) => {
  const glowClass =
    activeTab === 'officials'
      ? 'from-blue-600/18 via-blue-950/5 to-transparent'
      : activeTab === 'elections'
      ? 'from-amber-500/14 via-amber-950/5 to-transparent'
      : 'from-emerald-500/16 via-emerald-950/5 to-transparent';

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 relative overflow-x-hidden flex flex-col">
      {/* Subtle atmospheric top wash matching mini-app reference headers */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b ${glowClass} z-0 transition-colors duration-500`}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
