import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Award, 
  Vote, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowBigUp,
  ArrowBigDown,
  ShieldCheck,
  Flame,
  Activity
} from 'lucide-react';
import { Sparkline } from './Sparkline';
import { 
  NATIONAL_CONFIDENCE_INDEX, 
  PLATFORM_STATS, 
  OFFICIALS, 
  TRENDING_ISSUES, 
  AI_DAILY_BRIEF
} from '../data/mockData';
import type { Official, NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface HomeViewProps {
  onSelectOfficial: (official: Official) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenVerification: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectOfficial,
  onNavigateTab,
  onOpenVerification,
}) => {
  const [officialsList, setOfficialsList] = useState(OFFICIALS);
  const topGainers = [...officialsList].sort((a, b) => b.change24h - a.change24h).slice(0, 4);

  const handleQuickVote = (e: React.MouseEvent, officialId: string, direction: 'up' | 'down') => {
    e.stopPropagation();
    triggerHaptic('medium');

    setOfficialsList((prev) =>
      prev.map((o) => {
        if (o.id !== officialId) return o;
        const currentVote = o.userVote;
        let newScore = o.trustIndex;
        let upvotes = o.upvotesCount;
        let downvotes = o.downvotesCount;
        let userVote: 'up' | 'down' | undefined = direction;

        if (currentVote === direction) {
          // undo vote
          userVote = undefined;
          if (direction === 'up') {
            upvotes--;
            newScore = Math.max(1, newScore - 0.5);
          } else {
            downvotes--;
            newScore = Math.min(100, newScore + 0.5);
          }
        } else {
          if (direction === 'up') {
            upvotes++;
            if (currentVote === 'down') downvotes--;
            newScore = Math.min(100, newScore + 0.8);
          } else {
            downvotes++;
            if (currentVote === 'up') upvotes--;
            newScore = Math.max(1, newScore - 0.8);
          }
        }

        return {
          ...o,
          trustIndex: Number(newScore.toFixed(1)),
          upvotesCount: upvotes,
          downvotesCount: downvotes,
          userVote,
        };
      })
    );
  };

  return (
    <div className="space-y-5 pb-24">
      {/* 1. National Confidence Index Hero Card */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-3xl glass-panel p-5 border border-white/[0.08] shadow-2xl">
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#00E676]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                <span>National Confidence Index</span>
              </div>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-white font-['Outfit']">
                  {NATIONAL_CONFIDENCE_INDEX.score}%
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#00E676] border border-emerald-500/30">
                  {NATIONAL_CONFIDENCE_INDEX.level}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#00E676] text-xs font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{NATIONAL_CONFIDENCE_INDEX.changeWeekly}% 7d</span>
            </div>
          </div>

          {/* Sparkline Curve */}
          <div className="mt-4 pt-1 flex items-center justify-between">
            <div className="flex-1">
              <Sparkline
                data={NATIONAL_CONFIDENCE_INDEX.sparkline}
                width={280}
                height={65}
                color="#00E676"
                strokeWidth={2.5}
                showGradient={true}
                showDot={true}
              />
            </div>
            <div className="text-right pl-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Live Trend</p>
              <p className="text-xs font-semibold text-white mt-0.5">Bullish (+6.4%)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats Grid (4 Tiles) */}
      <section className="px-4">
        <div className="grid grid-cols-4 gap-2.5">
          <div className="glass-panel rounded-2xl p-3 text-center border border-white/[0.06]">
            <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#00E676]">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-white font-['Outfit']">{PLATFORM_STATS.verifiedCitizens}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">Verified Citizens</div>
          </div>

          <div className="glass-panel rounded-2xl p-3 text-center border border-white/[0.06]">
            <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-white font-['Outfit']">{PLATFORM_STATS.agenciesTracked}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">Agencies</div>
          </div>

          <div className="glass-panel rounded-2xl p-3 text-center border border-white/[0.06]">
            <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-white font-['Outfit']">{PLATFORM_STATS.officialsRated}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">Officials Rated</div>
          </div>

          <div className="glass-panel rounded-2xl p-3 text-center border border-white/[0.06]">
            <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Vote className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm font-bold text-white font-['Outfit']">{PLATFORM_STATS.electionsTracked}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">Elections</div>
          </div>
        </div>
      </section>

      {/* 3. The People's Voice Center Shortcut */}
      <section className="px-4">
        <div 
          onClick={() => {
            triggerHaptic('medium');
            onNavigateTab('forum');
          }}
          className="rounded-3xl p-4 glass-panel border border-[#00E676]/30 bg-gradient-to-r from-emerald-950/50 via-[#0B1510] to-slate-900/60 flex items-center justify-between cursor-pointer hover:border-[#00E676]/60 transition-all shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00E676] text-black flex items-center justify-center shadow-lg shadow-[#00E676]/30 animate-pulse">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                  The People's Voice Forum
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00E676]">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Speak truth to power • Uprate or downrate without fear of censorship
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#00E676]" />
        </div>
      </section>

      {/* 4. Accountability Index & Quick Uprate/Downrate Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-['Outfit']">
              Citizen Accountability Index (1 - 100)
            </h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic('selection');
              onNavigateTab('officials');
            }}
            className="text-xs font-semibold text-[#00E676] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {topGainers.map((official) => {
            const isPositive = official.change24h >= 0;
            return (
              <div
                key={official.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectOfficial(official);
                }}
                className="glass-card-interactive rounded-2xl p-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={official.avatar}
                      alt={official.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[8px] font-bold text-white uppercase"
                      style={{ backgroundColor: official.partyColor }}
                    >
                      {official.party}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-white tracking-tight">{official.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{official.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rating Score out of 100 (NO NAIRA) */}
                  <div className="text-right min-w-[65px]">
                    <div className="text-sm font-extrabold text-white font-mono">
                      {official.trustIndex.toFixed(1)}
                      <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </div>
                    <div
                      className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-[#00E676]' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{isPositive ? `+${official.change24h}%` : `${official.change24h}%`}</span>
                    </div>
                  </div>

                  {/* Direct Uprate (▲) & Downrate (▼) Buttons */}
                  <div className="flex flex-col gap-1 pl-1">
                    <button
                      onClick={(e) => handleQuickVote(e, official.id, 'up')}
                      className={`p-1 rounded-lg transition-colors ${
                        official.userVote === 'up'
                          ? 'bg-[#00E676] text-black shadow-md'
                          : 'bg-white/[0.05] text-slate-400 hover:text-[#00E676] hover:bg-white/[0.09]'
                      }`}
                      aria-label="Uprate official"
                    >
                      <ArrowBigUp className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => handleQuickVote(e, official.id, 'down')}
                      className={`p-1 rounded-lg transition-colors ${
                        official.userVote === 'down'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-white/[0.05] text-slate-400 hover:text-red-400 hover:bg-white/[0.09]'
                      }`}
                      aria-label="Downrate official"
                    >
                      <ArrowBigDown className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. AI Daily Civic Brief Card */}
      <section className="px-4">
        <div className="rounded-3xl glass-panel p-4 border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-purple-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                  AI Daily Intelligence Brief
                </h4>
                <p className="text-[10px] text-slate-400">{AI_DAILY_BRIEF.date}</p>
              </div>
            </div>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Verified Analysis
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {AI_DAILY_BRIEF.summary}
          </p>

          <div className="space-y-1.5 border-t border-white/[0.06] pt-2.5">
            {AI_DAILY_BRIEF.bulletPoints.slice(0, 2).map((point, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trending Issues Now */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-['Outfit']">
              Trending Civic Issues
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-time Mentions</span>
        </div>

        <div className="space-y-2">
          {TRENDING_ISSUES.slice(0, 3).map((issue) => (
            <div
              key={issue.id}
              className="glass-panel rounded-2xl p-3 border border-white/[0.06] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 uppercase">
                    {issue.category}
                  </span>
                  <span className="text-xs font-semibold text-white">{issue.title}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[220px]">
                  {issue.summary}
                </p>
              </div>

              <div className="text-right pl-2">
                <div className="text-xs font-bold text-white font-mono">{issue.mentions}</div>
                <div
                  className={`text-[10px] font-semibold ${
                    issue.sentiment === 'critical' ? 'text-amber-400' : 'text-[#00E676]'
                  }`}
                >
                  +{issue.changePercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Anonymous Civic Power Banner */}
      <section className="px-4">
        <div className="rounded-3xl p-4 glass-panel border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E676] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" />
              <span>Zero-Knowledge Verification</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-[210px] leading-snug">
              Cast verified votes and rate officials without linking your identity or SIM card.
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenVerification();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#00E676] text-black text-xs font-bold shadow-lg shadow-[#00E676]/25 hover:bg-[#00c966] active:scale-95 transition-all"
          >
            Get Verified
          </button>
        </div>
      </section>
    </div>
  );
};
