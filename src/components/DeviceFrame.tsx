import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Sparkles } from 'lucide-react';
import { isTelegramEnvironment } from '../utils/telegram';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'fullscreen'>('iphone');

  useEffect(() => {
    // If inside Telegram WebApp, always edge-to-edge
    if (isTelegramEnvironment()) {
      setIsDesktop(false);
      return;
    }

    const checkViewport = () => {
      setIsDesktop(window.innerWidth > 640);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // On Mobile or in Telegram, render native full screen
  if (!isDesktop || deviceMode === 'fullscreen') {
    return (
      <div className="min-h-screen bg-[#08090C] text-slate-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen flex flex-col relative">
          {isDesktop && (
            <div className="fixed top-3 right-3 z-50">
              <button
                onClick={() => setDeviceMode('iphone')}
                className="px-3 py-1.5 rounded-full glass-panel bg-black/60 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 shadow-xl hover:bg-black/90 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Show iPhone Frame</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }

  // On Desktop, display Apple iPhone 16 Pro chassis
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050608] via-[#090C12] to-[#040608] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient Canvas Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E676]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Control Toolbar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#00E676]" />
          <span>Telegram Mini App • Apple iOS Spec</span>
        </div>

        <button
          onClick={() => setDeviceMode('fullscreen')}
          className="px-3 py-1.5 rounded-full glass-panel bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Expand View</span>
        </button>
      </div>

      {/* iPhone 16 Pro Chassis */}
      <div className="relative w-[390px] h-[830px] rounded-[52px] bg-[#0E1118] p-3 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95)] ring-1 ring-white/20 flex flex-col">
        {/* Outer Titanium Edge Reflection */}
        <div className="absolute inset-0 rounded-[52px] border-[3px] border-slate-700/50 pointer-events-none" />

        {/* Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full bg-black z-50 flex items-center justify-between px-2.5 pointer-events-none ring-1 ring-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-[#1A1E29] ring-1 ring-white/20" />
        </div>

        {/* Inner Screen Bezel */}
        <div className="w-full h-full rounded-[44px] overflow-hidden bg-[#08090C] relative flex flex-col no-scrollbar">
          {/* iOS Top Status Bar Padding */}
          <div className="h-10 w-full flex-shrink-0 flex items-center justify-between px-7 pt-2 text-[11px] font-bold text-white z-40 pointer-events-none font-mono">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-white">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-white/60 p-0.5 flex items-center">
                <div className="h-full w-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Body Inside Screen */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/40 pointer-events-none z-50" />
        </div>
      </div>
    </div>
  );
};
