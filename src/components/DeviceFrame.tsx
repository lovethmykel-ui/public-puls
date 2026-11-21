import React from 'react';
import type { NavTab } from '../types';

interface DeviceFrameProps {
  activeTab?: NavTab;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E5E5E5] relative overflow-x-hidden flex flex-col">
      {/* Subtle pure-neutral optical wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.045] via-white/[0.01] to-transparent z-0"
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
