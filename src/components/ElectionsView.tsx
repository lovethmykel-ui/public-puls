import React, { useState, useEffect } from 'react';
import { 
  Vote, 
  MapPin
} from 'lucide-react';
import { ELECTIONS, STATE_SENTIMENT_DATA } from '../data/mockData';
import { triggerHaptic } from '../utils/telegram';

export const ElectionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [selectedZone, setSelectedZone] = useState<string>('All');

  // Real-time Countdown Timer for Anambra 2025
  const anambraTarget = new Date('2025-11-08T08:00:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = anambraTarget - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 172, hours: 14, minutes: 38, seconds: 45 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [anambraTarget]);

  const featuredElection = ELECTIONS[0];
  const generalElection = ELECTIONS[1];

  const zones = ['All', 'South West', 'South East', 'South South', 'North West', 'North Central', 'North East'];
  const filteredStates = selectedZone === 'All' 
    ? STATE_SENTIMENT_DATA 
    : STATE_SENTIMENT_DATA.filter((s) => s.zone === selectedZone);

  return (
    <div className="space-y-4 px-4 pb-28">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
          Elections Intelligence Center
        </h2>
        <p className="text-xs text-slate-400">Real-time forecasts, off-cycle timelines & polling consensus</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        {(['upcoming', 'ongoing', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab(tab);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#00E676] text-black shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Election Card (Anambra 2025) */}
      <div className="rounded-3xl glass-panel p-5 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            Next Major Election
          </span>
          <span className="text-xs text-slate-400 font-medium">{featuredElection.dateStr}</span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit'] mt-1">
          {featuredElection.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#00E676]" />
          <span>{featuredElection.location}</span>
        </p>

        {/* Live Countdown Display */}
        <div className="grid grid-cols-4 gap-2 my-4">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-xl font-extrabold text-white font-mono tracking-tight">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Poll Forecast Progress Bars */}
        <div className="border-t border-white/[0.06] pt-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-['Outfit']">
              Election Forecast (Who is Leading?)
            </span>
            <span className="text-[10px] font-semibold text-[#00E676] bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Confidence {featuredElection.confidence}%
            </span>
          </div>

          <div className="space-y-2">
            {featuredElection.candidates.map((cand, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cand.partyColor }} />
                    {cand.name} ({cand.party})
                  </span>
                  <span className="font-bold text-white font-mono">{cand.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cand.percentage}%`,
                      backgroundColor: cand.partyColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2027 General Elections Presidential Forecast */}
      <div className="rounded-3xl glass-panel p-5 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Vote className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                {generalElection.title}
              </h4>
              <p className="text-[10px] text-slate-400">National Probability Consensus Model</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{generalElection.dateStr}</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed my-3">
          {generalElection.overview}
        </p>

        <div className="space-y-2.5">
          {generalElection.candidates.map((cand, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-3 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{cand.name}</span>
                    <span
                      className="px-1.5 py-0.2 rounded text-[8px] font-bold text-white uppercase"
                      style={{ backgroundColor: cand.partyColor }}
                    >
                      {cand.party}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{cand.status}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-white font-mono">{cand.percentage}%</div>
                <div className="text-[10px] text-slate-400">Vote Probability</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nigeria 36 States Regional Heat Map & Zone Breakdown */}
      <div className="rounded-3xl glass-panel p-5 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
            Geopolitical Sentiment Map
          </h4>
          <span className="text-[11px] text-[#00E676] font-semibold">Live Polling</span>
        </div>

        {/* Zone Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedZone(zone);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedZone === zone
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* State Sentiment List */}
        <div className="space-y-2 pt-1">
          {filteredStates.map((state) => (
            <div
              key={state.code}
              className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{state.name} State</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300">
                    {state.zone}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Gov: {state.governor} • Top Issue: {state.topIssue}
                </p>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-bold font-mono ${
                    state.sentimentScore >= 70
                      ? 'text-[#00E676]'
                      : state.sentimentScore >= 60
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                >
                  {state.sentimentScore}%
                </div>
                <div className="text-[9px] text-slate-400 uppercase">Approval</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
