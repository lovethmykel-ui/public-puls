import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowBigUp,
  ArrowBigDown,
  ShieldCheck,
  Activity,
  Vote,
  Lock,
} from 'lucide-react';
import { SegmentedControl } from 'glisse';
import { Sparkline } from './Sparkline';
import {
  NATIONAL_CONFIDENCE_INDEX,
  PLATFORM_STATS,
  TRENDING_ISSUES,
  AI_DAILY_BRIEF,
} from '../data/mockData';
import type { Official, NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface HomeViewProps {
  officials: Official[];
  onVoteOfficial: (officialId: string, direction: 'up' | 'down') => void;
  onSelectOfficial: (official: Official) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenVerification: () => void;
}

type TimeframeKey = '24h' | '7d' | '30d' | 'All';

const TIMEFRAME_ITEMS = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'All', label: 'All' },
];

const CONFIDENCE_SERIES: Record<TimeframeKey, { data: number[]; delta: string }> = {
  '24h': { data: [52.8, 53.1, 53.0, 53.5, 53.9, 54.1, 54.3], delta: '+1.5% 24h' },
  '7d': { data: NATIONAL_CONFIDENCE_INDEX.sparkline, delta: `+${NATIONAL_CONFIDENCE_INDEX.changeWeekly}% 7d` },
  '30d': { data: [41.2, 43.0, 44.5, 43.8, 46.2, 49.0, 50.5, 52.1, 54.3], delta: '+13.1% 30d' },
  All: { data: [38.0, 41.5, 40.2, 44.8, 47.0, 46.4, 50.1, 51.9, 54.3], delta: '+16.3% All' },
};

export const HomeView: React.FC<HomeViewProps> = ({
  officials,
  onVoteOfficial,
  onSelectOfficial,
  onNavigateTab,
  onOpenVerification,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const topMovers = [...officials].sort((a, b) => b.change24h - a.change24h).slice(0, 4);
  const currentSeries = CONFIDENCE_SERIES[timeframe];

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Hero Confidence Curve + Stats Strip + Bento Discovery */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Hero Confidence Index Curve */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-neutral-400">
                  National Confidence Index · {NATIONAL_CONFIDENCE_INDEX.lastUpdated}
                </p>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-['Outfit'] tabular-nums">
                    {NATIONAL_CONFIDENCE_INDEX.score}
                    <span className="text-2xl text-neutral-500 font-semibold">%</span>
                  </h1>
                  <span className="text-sm font-semibold text-neutral-200 tabular-nums">
                    {currentSeries.delta}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {NATIONAL_CONFIDENCE_INDEX.level} · {PLATFORM_STATS.totalVotesCast} verified ballots
                </p>
              </div>

              {/* Liquid Glass Timeframe Segmented Control */}
              <div className="shrink-0">
                <SegmentedControl
                  aria-label="Confidence timeframe"
                  items={TIMEFRAME_ITEMS}
                  value={timeframe}
                  onValueChange={(value) => {
                    triggerHaptic('selection');
                    setTimeframe(value as TimeframeKey);
                  }}
                  className="lg-segmented-compact"
                />
              </div>
            </div>

            {/* Full-Width Dotted Chart Canvas */}
            <div className="rounded-2xl chart-dot-grid border border-white/[0.06] bg-[#101010] px-3 pt-4 pb-2 overflow-hidden">
              <Sparkline
                data={currentSeries.data}
                width={560}
                height={112}
                color="#E5E5E5"
                strokeWidth={2.5}
                showGradient={true}
                showDot={true}
                responsive={true}
              />
            </div>

            {/* Single Elevated Platform Summary Strip */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.07] grid grid-cols-2 sm:grid-cols-4 gap-px shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {[
                { label: 'Verified Citizens', value: PLATFORM_STATS.verifiedCitizens },
                { label: 'Agencies Tracked', value: String(PLATFORM_STATS.agenciesTracked) },
                { label: 'Officials Rated', value: PLATFORM_STATS.officialsRated },
                { label: 'Elections Live', value: String(PLATFORM_STATS.electionsTracked) },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#141414] px-4 py-3">
                  <div className="text-base font-bold text-white font-['Outfit'] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Clean Specular-Rim Bento Action Grid */}
          <section aria-label="Quick civic actions" className="grid grid-cols-2 gap-3">
            {/* Full-Width Primary Feature Banner */}
            <button
              type="button"
              aria-label="Open The People's Voice Forum"
              onClick={() => {
                triggerHaptic('medium');
                onNavigateTab('forum');
              }}
              className="col-span-2 group relative overflow-hidden rounded-[22px] surface-card-interactive p-5 text-left"
            >
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 bottom-0 w-48 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.07),transparent_70%)] pointer-events-none"
              />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="max-w-sm">
                  <h2 className="text-lg font-bold text-white font-['Outfit'] tracking-tight">
                    The People&apos;s Voice Forum
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                    Speak truth to power, uprate performance, and audit leadership without censorship.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-[#E5E5E5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </button>

            {/* Left Half Bento Card */}
            <button
              type="button"
              aria-label="Open Zero-Knowledge ID Verification"
              onClick={() => {
                triggerHaptic('medium');
                onOpenVerification();
              }}
              className="group relative overflow-hidden rounded-[22px] surface-card-interactive p-4 sm:p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#E5E5E5] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                Zero-Knowledge ID
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-snug">
                Vote anonymously with full cryptographic proof
              </p>
            </button>

            {/* Right Half Bento Card */}
            <button
              type="button"
              aria-label="Open Elections Center"
              onClick={() => {
                triggerHaptic('medium');
                onNavigateTab('elections');
              }}
              className="group relative overflow-hidden rounded-[22px] surface-card-interactive p-4 sm:p-5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#E5E5E5] flex items-center justify-center mb-3">
                <Vote className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
                Elections Center
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-snug">
                Anambra &amp; 2027 national polling models
              </p>
            </button>
          </section>

          {/* 3. Daily Intelligence Brief */}
          <section className="surface-card rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Daily Intelligence Brief
              </h3>
              <span className="text-xs text-neutral-400">{AI_DAILY_BRIEF.date}</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {AI_DAILY_BRIEF.summary}
            </p>
            <ul className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              {AI_DAILY_BRIEF.bulletPoints.slice(0, 2).map((point, idx) => (
                <li key={idx} className="text-xs text-neutral-400 leading-relaxed flex gap-2">
                  <span className="text-neutral-200 font-bold">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT COLUMN: Clean Hairline Accountability Index + Trending Issues */}
        <div className="lg:col-span-5 space-y-6">
          {/* 4. Accountability Index */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Accountability Index
              </h2>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  onNavigateTab('officials');
                }}
                className="min-h-[40px] px-2 text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-0.5 whitespace-nowrap"
              >
                <span>Leaderboard</span>
                <ChevronRight className="w-4 h-4 text-[#E5E5E5]" />
              </button>
            </div>

            <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
              {topMovers.map((official, idx) => {
                const isPositive = official.change24h >= 0;
                return (
                  <div
                    key={official.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onSelectOfficial(official);
                      }}
                      className="flex-1 min-w-0 flex items-center gap-3 text-left group min-h-[44px]"
                    >
                      <span className="w-5 text-xs font-mono font-semibold text-neutral-500 tabular-nums shrink-0">
                        {idx + 1}.
                      </span>
                      <div className="relative shrink-0">
                        <img
                          src={official.avatar}
                          alt={official.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-white/15"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white truncate group-hover:text-neutral-200 transition-colors">
                            {official.name}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E5E5E5] shrink-0" />
                        </div>
                        <p className="text-xs text-neutral-400 truncate">
                          {official.party} · {official.state}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white font-mono tabular-nums">
                          {official.trustIndex.toFixed(1)}
                        </div>
                        <div
                          className={`text-[11px] font-semibold font-mono tabular-nums flex items-center justify-end gap-0.5 ${
                            isPositive ? 'text-neutral-200' : 'text-neutral-400'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3 text-[#E5E5E5]" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-[#E5E5E5]" />
                          )}
                          <span>
                            {isPositive ? `+${official.change24h}%` : `${official.change24h}%`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('medium');
                            onVoteOfficial(official.id, 'up');
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 border ${
                            official.userVote === 'up'
                              ? 'bg-white/[0.16] border-white/35 text-[#E5E5E5]'
                              : 'bg-white/[0.05] border-transparent text-[#E5E5E5] hover:bg-white/[0.12]'
                          }`}
                          aria-label={`Uprate ${official.name}`}
                          aria-pressed={official.userVote === 'up'}
                        >
                          <ArrowBigUp
                            className={`w-4 h-4 ${
                              official.userVote === 'up' ? 'fill-[#E5E5E5]' : 'fill-current'
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('medium');
                            onVoteOfficial(official.id, 'down');
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 border ${
                            official.userVote === 'down'
                              ? 'bg-white/[0.16] border-white/35 text-[#E5E5E5]'
                              : 'bg-white/[0.05] border-transparent text-[#E5E5E5] hover:bg-white/[0.12]'
                          }`}
                          aria-label={`Downrate ${official.name}`}
                          aria-pressed={official.userVote === 'down'}
                        >
                          <ArrowBigDown
                            className={`w-4 h-4 ${
                              official.userVote === 'down' ? 'fill-[#E5E5E5]' : 'fill-current'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Trending Civic Issues */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-white font-['Outfit']">
                Trending Civic Issues
              </h2>
              <span className="text-xs text-neutral-400">24h Mentions</span>
            </div>

            <div className="surface-card rounded-2xl divide-y divide-white/[0.06]">
              {TRENDING_ISSUES.slice(0, 4).map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    onNavigateTab('forum');
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{issue.title}</div>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">
                      {issue.category} · {issue.summary}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {issue.mentions}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono tabular-nums ${
                        issue.changePercent >= 0 ? 'text-neutral-200' : 'text-neutral-400'
                      }`}
                    >
                      {issue.changePercent >= 0 ? `+${issue.changePercent}%` : `${issue.changePercent}%`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
