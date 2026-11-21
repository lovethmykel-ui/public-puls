import React, { useState, useEffect } from 'react';
import { MapPin, Vote } from 'lucide-react';
import { ELECTIONS, STATE_SENTIMENT_DATA } from '../data/mockData';
import { triggerHaptic } from '../utils/telegram';

export const ElectionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [selectedZone, setSelectedZone] = useState<string>('All');

  const upcomingPrimary = ELECTIONS.find((e) => e.status === 'upcoming') || ELECTIONS[0];
  const countdownTarget = new Date(upcomingPrimary.targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 99,
    hours: 8,
    minutes: 21,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const difference = countdownTarget - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  const filteredElections = ELECTIONS.filter((e) => e.status === activeTab);

  const zones = [
    'All',
    'South West',
    'South East',
    'South South',
    'North West',
    'North Central',
    'North East',
  ];

  const filteredStates =
    selectedZone === 'All'
      ? STATE_SENTIMENT_DATA
      : STATE_SENTIMENT_DATA.filter((s) => s.zone === selectedZone);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Outfit']">
          Elections Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Verified citizen polling forecasts &amp; state-by-state approval consensus
        </p>
      </div>

      {/* Full-Width Underline Tabs */}
      <div className="grid grid-cols-3 border-b border-white/[0.08]">
        {(['upcoming', 'ongoing', 'past'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab(tab);
              }}
              className={`relative min-h-[44px] py-2.5 text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Filtered Elections List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredElections.map((election, idx) => (
            <section
              key={election.id}
              className="surface-card rounded-3xl p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">
                    {election.dateStr} · Confidence{' '}
                    <span className="text-white font-mono font-semibold tabular-nums">
                      {election.confidence}%
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-['Outfit'] mt-1">
                    {election.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-200" />
                    <span>{election.location}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-200 shrink-0">
                  <Vote className="w-5 h-5" />
                </div>
              </div>

              {/* Countdown for first upcoming race */}
              {election.status === 'upcoming' && idx === 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="py-2.5 px-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center"
                    >
                      <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {election.overview}
              </p>

              {/* Candidate Forecast Bars */}
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                {election.candidates.map((cand, candIdx) => (
                  <div key={cand.name} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/15 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-white truncate block">
                            {cand.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {cand.party}
                            {cand.status ? ` · ${cand.status}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-white font-mono tabular-nums shrink-0">
                        {cand.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          candIdx === 0
                            ? 'bg-white'
                            : candIdx === 1
                            ? 'bg-slate-300/75'
                            : candIdx === 2
                            ? 'bg-slate-400/55'
                            : 'bg-slate-500/45'
                        }`}
                        style={{ width: `${cand.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* RIGHT COLUMN: State Geopolitical Sentiment */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Geopolitical Sentiment
            </h2>
            <span className="text-xs text-slate-300 font-semibold">Live Polling</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {zones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedZone(zone);
                }}
                className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedZone === zone
                    ? 'bg-white text-black'
                    : 'bg-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          <div className="surface-card rounded-2xl divide-y divide-white/[0.06]">
            {filteredStates.map((state) => (
              <div
                key={state.code}
                className="px-4 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {state.name} State
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {state.zone} · {state.topIssue}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-bold font-mono tabular-nums ${
                      state.sentimentScore >= 70
                        ? 'text-white'
                        : state.sentimentScore >= 60
                        ? 'text-slate-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {state.sentimentScore}%
                  </div>
                  <div className="text-[11px] text-slate-400">Approval</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
