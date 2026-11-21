import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  ArrowBigUp,
  ArrowBigDown,
  X,
  Trophy,
} from 'lucide-react';
import type { Official, Agency } from '../types';
import { filterAgencies, filterOfficials, type OfficialFilter } from '../utils/civicMath';
import { triggerHaptic } from '../utils/telegram';

interface OfficialsViewProps {
  officials: Official[];
  agencies: Agency[];
  externalSearchQuery?: string;
  onExternalSearchConsumed?: () => void;
  onVoteOfficial: (officialId: string, direction: 'up' | 'down') => void;
  onVoteAgency: (agencyId: string, direction: 'up' | 'down') => void;
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
  onOpenRateModal: (target: { name: string; role: string; type: 'official' | 'agency' }) => void;
}

type LeaderboardSegment = 'officials' | 'agencies' | 'all';

export const OfficialsView: React.FC<OfficialsViewProps> = ({
  officials,
  agencies,
  externalSearchQuery,
  onExternalSearchConsumed,
  onVoteOfficial,
  onVoteAgency,
  onSelectOfficial,
  onSelectAgency,
  onOpenRateModal,
}) => {
  const [segment, setSegment] = useState<LeaderboardSegment>('all');
  const [categoryFilter, setCategoryFilter] = useState<OfficialFilter>('all');
  const [sortBy, setSortBy] = useState<'score' | 'movers'>('score');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (externalSearchQuery && externalSearchQuery.trim()) {
      setSearchQuery(externalSearchQuery);
      setSegment('all');
      setCategoryFilter('all');
      onExternalSearchConsumed?.();
    }
  }, [externalSearchQuery, onExternalSearchConsumed]);

  const effectiveOfficialFilter: OfficialFilter =
    segment === 'agencies' ? 'agencies' : categoryFilter;

  const filteredOfficials = filterOfficials(officials, effectiveOfficialFilter, searchQuery).sort(
    (a, b) => (sortBy === 'movers' ? b.change24h - a.change24h : b.trustIndex - a.trustIndex)
  );

  const showAgencies = segment === 'all' || segment === 'agencies';
  const filteredAgencies = showAgencies
    ? filterAgencies(agencies, searchQuery).sort((a, b) =>
        sortBy === 'movers' ? b.change24h - a.change24h : b.trustIndex - a.trustIndex
      )
    : [];

  // Unified ranked list for Podium + Leaderboard
  type RankedItem =
    | { kind: 'official'; item: Official; score: number; change: number }
    | { kind: 'agency'; item: Agency; score: number; change: number };

  const unifiedRanked: RankedItem[] = [
    ...filteredOfficials.map((o) => ({
      kind: 'official' as const,
      item: o,
      score: o.trustIndex,
      change: o.change24h,
    })),
    ...filteredAgencies.map((a) => ({
      kind: 'agency' as const,
      item: a,
      score: a.trustIndex,
      change: a.change24h,
    })),
  ].sort((a, b) => (sortBy === 'movers' ? b.change - a.change : b.score - a.score));

  const showPodium = searchQuery.trim() === '' && unifiedRanked.length >= 3;
  const podiumTop3 = showPodium ? unifiedRanked.slice(0, 3) : [];
  const listEntries = showPodium ? unifiedRanked.slice(3) : unifiedRanked;

  const avgTrust =
    unifiedRanked.length > 0
      ? (unifiedRanked.reduce((acc, r) => acc + r.score, 0) / unifiedRanked.length).toFixed(1)
      : '0.0';

  const renderPodiumCard = (entry: RankedItem, rank: 1 | 2 | 3) => {
    const isOfficial = entry.kind === 'official';
    const name = isOfficial ? entry.item.name : entry.item.acronym;
    const sub = isOfficial ? entry.item.party : entry.item.sector.split('&')[0].trim();
    const imgSrc = isOfficial ? entry.item.avatar : entry.item.logo;

    const badgeColor =
      rank === 1
        ? 'bg-white text-black'
        : rank === 2
        ? 'bg-slate-300 text-black'
        : 'bg-slate-600 text-white';

    return (
      <button
        key={`${entry.kind}-${entry.item.id}`}
        type="button"
        onClick={() => {
          triggerHaptic('light');
          if (isOfficial) onSelectOfficial(entry.item);
          else onSelectAgency(entry.item);
        }}
        className={`flex flex-col items-center text-center group focus-visible:outline-none ${
          rank === 1 ? '-mt-4' : 'mt-2'
        }`}
      >
        <div className="relative mb-2">
          <div
            className={`rounded-full overflow-hidden flex items-center justify-center ring-2 transition-transform group-hover:scale-105 ${
              rank === 1
                ? 'w-20 h-20 sm:w-24 sm:h-24 ring-white/60'
                : 'w-16 h-16 sm:w-20 sm:h-20 ring-white/15'
            } ${!isOfficial ? 'bg-white p-2' : 'bg-[#151A25]'}`}
          >
            <img
              src={imgSrc}
              alt={name}
              referrerPolicy="no-referrer"
              className={`w-full h-full ${isOfficial ? 'object-cover' : 'object-contain'}`}
            />
          </div>
          <span
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tabular-nums shadow-md ${badgeColor}`}
          >
            #{rank}
          </span>
        </div>

        <span className="text-xs sm:text-sm font-bold text-white mt-2 line-clamp-1 max-w-[110px] sm:max-w-[140px]">
          {name}
        </span>
        <span className="text-[11px] text-slate-400 truncate max-w-[110px]">{sub}</span>
        <span className="mt-1 text-xs font-bold font-mono tabular-nums text-slate-200">
          {entry.score.toFixed(1)}/100
        </span>
      </button>
    );
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12 space-y-5">
      {/* Centered Hero Title matching fomo Leaderboard */}
      <div className="text-center space-y-1 pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
          Accountability Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Live citizen rankings for elected officials &amp; federal institutions
        </p>
      </div>

      {/* Full-Width 3-Tab Underline Navigation (fomo pattern) */}
      <div className="grid grid-cols-3 border-b border-white/[0.08]">
        {(
          [
            { id: 'all', label: 'All Ranked' },
            { id: 'officials', label: 'Officials' },
            { id: 'agencies', label: 'Agencies' },
          ] as const
        ).map((tab) => {
          const isActive = segment === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                setSegment(tab.id);
                if (tab.id === 'agencies') setCategoryFilter('all');
              }}
              className={`relative min-h-[44px] py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search + Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search official, state, ministry, or agency..."
            aria-label="Search officials and agencies"
            className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl bg-[#12151E] border border-white/[0.08] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {segment !== 'agencies' && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-x-auto no-scrollbar max-w-full">
              {(['all', 'executive', 'governors', 'ministers'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setCategoryFilter(f);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    categoryFilter === f
                      ? 'bg-white/[0.12] text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSortBy((prev) => (prev === 'score' ? 'movers' : 'score'));
            }}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-semibold text-slate-200 whitespace-nowrap shrink-0 ml-auto"
          >
            Sort: {sortBy === 'score' ? 'Score' : '24h'}
          </button>
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      {showPodium && (
        <section
          aria-label="Top 3 ranked leaders"
          className="relative rounded-3xl surface-card pt-8 pb-6 px-4 overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(226,232,240,0.09),transparent_70%)] pointer-events-none"
          />
          <div className="relative z-10 grid grid-cols-3 gap-2 items-end max-w-lg mx-auto">
            {renderPodiumCard(podiumTop3[1], 2)}
            {renderPodiumCard(podiumTop3[0], 1)}
            {renderPodiumCard(podiumTop3[2], 3)}
          </div>
        </section>
      )}

      {/* Summary Benchmark Card */}
      <div className="surface-card rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/[0.07] text-slate-200 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Filtered Cohort Average</div>
            <div className="text-sm font-bold text-white font-['Outfit'] tabular-nums">
              {unifiedRanked.length} Tracked Entities
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {avgTrust}/100
          </div>
          <div className="text-[11px] text-slate-400">Citizen Consensus</div>
        </div>
      </div>

      {/* Ranked Rows (fomo clean borderless hairline list) */}
      {unifiedRanked.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No matching officials or agencies</p>
          <p className="text-xs text-slate-400">
            Try clearing your search query or switching category tabs.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setSegment('all');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-white/[0.08] text-xs font-semibold text-white hover:bg-white/[0.12]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {listEntries.map((entry, idx) => {
            const rank = showPodium ? idx + 4 : idx + 1;
            const isOfficial = entry.kind === 'official';
            const isPositive = entry.change >= 0;
            const name = isOfficial ? entry.item.name : entry.item.acronym;
            const subtitle = isOfficial
              ? `${entry.item.role} · ${entry.item.state}`
              : `${entry.item.name} · ${entry.item.head}`;
            const imgSrc = isOfficial ? entry.item.avatar : entry.item.logo;

            return (
              <div
                key={`${entry.kind}-${entry.item.id}`}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-6 text-xs font-mono font-semibold text-slate-500 tabular-nums shrink-0">
                    {rank}.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      if (isOfficial) onSelectOfficial(entry.item);
                      else onSelectAgency(entry.item);
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left group min-h-[44px]"
                  >
                    <div
                      className={`w-11 h-11 overflow-hidden shrink-0 ring-1 ring-white/15 ${
                        !isOfficial ? 'bg-white p-1.5 rounded-xl' : 'rounded-full'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full ${isOfficial ? 'object-cover' : 'object-contain'}`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-slate-200 transition-colors">
                          {name}
                        </span>
                        {isOfficial && (
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
                    </div>
                  </button>
                </div>

                {/* Right: Compact Actions + Score */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('medium');
                      onOpenRateModal(
                        isOfficial
                          ? { name: entry.item.name, role: entry.item.role, type: 'official' }
                          : { name: entry.item.name, role: entry.item.headTitle, type: 'agency' }
                      );
                    }}
                    className="hidden sm:inline-flex min-h-[34px] items-center px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Audit
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        if (isOfficial) onVoteOfficial(entry.item.id, 'up');
                        else onVoteAgency(entry.item.id, 'up');
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                        entry.item.userVote === 'up'
                          ? 'bg-white text-black'
                          : 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.12]'
                      }`}
                      aria-label={`Uprate ${name}`}
                      aria-pressed={entry.item.userVote === 'up'}
                    >
                      <ArrowBigUp className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        if (isOfficial) onVoteOfficial(entry.item.id, 'down');
                        else onVoteAgency(entry.item.id, 'down');
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors active:scale-95 ${
                        entry.item.userVote === 'down'
                          ? 'bg-white/[0.22] border border-white/40 text-white'
                          : 'bg-white/[0.05] text-slate-200 hover:bg-white/[0.12]'
                      }`}
                      aria-label={`Downrate ${name}`}
                      aria-pressed={entry.item.userVote === 'down'}
                    >
                      <ArrowBigDown className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="text-right min-w-[58px]">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {entry.score.toFixed(1)}
                    </div>
                    <div
                      className={`text-[11px] font-semibold font-mono tabular-nums flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 text-slate-200" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-slate-200" />
                      )}
                      <span>{isPositive ? `+${entry.change}%` : `${entry.change}%`}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
