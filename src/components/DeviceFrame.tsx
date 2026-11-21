import React from 'react';
import type { NavTab } from '../types';

interface DeviceFrameProps {
  activeTab?: NavTab;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 relative overflow-x-hidden flex flex-col">
      {/* Subtle monochrome atmospheric wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-200/[0.06] via-slate-400/[0.015] to-transparent z-0"
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
