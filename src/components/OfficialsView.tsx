import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  ArrowBigUp,
  ArrowBigDown,
  Trophy,
  ArrowUpDown,
  Check,
  X,
} from 'lucide-react';
import { Button, Menu, SegmentedControl } from 'glisse';
import type { Official, Agency } from '../types';
import { filterAgencies, filterOfficials, type OfficialFilter } from '../utils/civicMath';
import { triggerHaptic } from '../utils/telegram';

interface OfficialsViewProps {
  officials: Official[];
  agencies: Agency[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onVoteOfficial: (officialId: string, direction: 'up' | 'down') => void;
  onVoteAgency: (agencyId: string, direction: 'up' | 'down') => void;
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
  onOpenRateModal: (target: { name: string; role: string; type: 'official' | 'agency' }) => void;
}

type LeaderboardSegment = 'officials' | 'agencies' | 'all';

const SEGMENT_ITEMS = [
  { value: 'all', label: 'All Ranked' },
  { value: 'officials', label: 'Officials' },
  { value: 'agencies', label: 'Agencies' },
];

const CATEGORY_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'executive', label: 'Executive' },
  { value: 'governors', label: 'Governors' },
  { value: 'ministers', label: 'Ministers' },
];

export const OfficialsView: React.FC<OfficialsViewProps> = ({
  officials,
  agencies,
  searchQuery,
  onSearchQueryChange,
  onVoteOfficial,
  onVoteAgency,
  onSelectOfficial,
  onSelectAgency,
  onOpenRateModal,
}) => {
  const [segment, setSegment] = useState<LeaderboardSegment>('all');
  const [categoryFilter, setCategoryFilter] = useState<OfficialFilter>('all');
  const [sortBy, setSortBy] = useState<'score' | 'movers'>('score');

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
        ? 'bg-neutral-300 text-black'
        : 'bg-neutral-700 text-white';

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
            } ${!isOfficial ? 'bg-white p-2' : 'bg-[#1A1A1A]'}`}
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
        <span className="text-[11px] text-neutral-400 truncate max-w-[110px]">{sub}</span>
        <span className="mt-1 text-xs font-bold font-mono tabular-nums text-neutral-200">
          {entry.score.toFixed(1)}/100
        </span>
      </button>
    );
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12 space-y-5">
      {/* Centered Hero Title */}
      <div className="text-center space-y-1 pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
          Accountability Index
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Live citizen rankings for elected officials &amp; federal institutions
        </p>
      </div>

      {/* Liquid Glass 3-Segment Index Switcher */}
      <div className="flex justify-center">
        <SegmentedControl
          aria-label="Index segment"
          items={SEGMENT_ITEMS}
          value={segment}
          onValueChange={(value) => {
            triggerHaptic('selection');
            const next = value as LeaderboardSegment;
            setSegment(next);
            if (next === 'agencies') setCategoryFilter('all');
          }}
          className="lg-segmented-3"
        />
      </div>

      {/* Active Global Search Filter Chip (relies on static Header SearchField, no duplicate bar) */}
      {searchQuery.trim() !== '' && (
        <div className="surface-card rounded-full pl-4 pr-2 py-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 text-xs text-neutral-300">
            <Search className="w-3.5 h-3.5 text-[#E5E5E5] shrink-0" />
            <span className="truncate">
              Filtered by <strong className="text-white">&ldquo;{searchQuery}&rdquo;</strong>
            </span>
          </div>
          <Button
            type="button"
            variant="glass"
            icon={<X className="w-3.5 h-3.5" />}
            onClick={() => onSearchQueryChange('')}
            aria-label="Clear active search filter"
            className="!h-8 !px-3 !text-xs shrink-0"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Category Filter & Liquid Glass Sort Menu */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {segment !== 'agencies' ? (
          <div className="overflow-x-auto no-scrollbar max-w-full">
            <SegmentedControl
              aria-label="Official category"
              items={CATEGORY_ITEMS}
              value={categoryFilter}
              onValueChange={(value) => {
                triggerHaptic('selection');
                setCategoryFilter(value as OfficialFilter);
              }}
              className="lg-segmented-4"
            />
          </div>
        ) : (
          <div className="text-xs text-neutral-400">
            Showing federal ministries &amp; commissions
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="text-xs font-medium text-neutral-400 whitespace-nowrap">
            Sort: <strong className="text-neutral-100">{sortBy === 'score' ? 'Score' : '24h'}</strong>
          </span>
          <Menu
            aria-label="Sort rankings"
            align="end"
            icon={<ArrowUpDown className="w-4 h-4" />}
            items={[
              {
                label: 'Trust Score (High to Low)',
                icon: sortBy === 'score' ? <Check className="w-4 h-4" /> : undefined,
                onSelect: () => {
                  triggerHaptic('selection');
                  setSortBy('score');
                },
              },
              {
                label: '24h Biggest Movers',
                icon: sortBy === 'movers' ? <Check className="w-4 h-4" /> : undefined,
                onSelect: () => {
                  triggerHaptic('selection');
                  setSortBy('movers');
                },
              },
            ]}
          />
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
            className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none"
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
          <div className="w-10 h-10 rounded-full bg-white/[0.07] text-[#E5E5E5] flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Filtered Cohort Average</div>
            <div className="text-sm font-bold text-white font-['Outfit'] tabular-nums">
              {unifiedRanked.length} Tracked {unifiedRanked.length === 1 ? 'Entity' : 'Entities'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {avgTrust}/100
          </div>
          <div className="text-[11px] text-neutral-400">Citizen Consensus</div>
        </div>
      </div>

      {/* Ranked Rows */}
      {unifiedRanked.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-white">No matching officials or agencies</p>
          <p className="text-xs text-neutral-400">
            Try clearing your search query or switching category tabs.
          </p>
          <div className="pt-1 flex justify-center">
            <Button
              type="button"
              variant="glass"
              onClick={() => {
                onSearchQueryChange('');
                setCategoryFilter('all');
                setSegment('all');
              }}
              className="!h-9 !px-4 !text-xs"
            >
              Reset Filters
            </Button>
          </div>
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
                  <span className="w-6 text-xs font-mono font-semibold text-neutral-500 tabular-nums shrink-0">
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
                        <span className="text-sm font-semibold text-white truncate group-hover:text-neutral-200 transition-colors">
                          {name}
                        </span>
                        {isOfficial && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E5E5E5] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">{subtitle}</p>
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
                    className="hidden sm:inline-flex min-h-[34px] items-center px-3.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-semibold text-neutral-200 transition-colors"
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
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 border ${
                        entry.item.userVote === 'up'
                          ? 'bg-white/[0.16] border-white/35 text-[#E5E5E5]'
                          : 'bg-white/[0.05] border-transparent text-[#E5E5E5] hover:bg-white/[0.12]'
                      }`}
                      aria-label={`Uprate ${name}`}
                      aria-pressed={entry.item.userVote === 'up'}
                    >
                      <ArrowBigUp
                        className={`w-4 h-4 ${
                          entry.item.userVote === 'up' ? 'fill-[#E5E5E5]' : 'fill-current'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        if (isOfficial) onVoteOfficial(entry.item.id, 'down');
                        else onVoteAgency(entry.item.id, 'down');
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 border ${
                        entry.item.userVote === 'down'
                          ? 'bg-white/[0.16] border-white/35 text-[#E5E5E5]'
                          : 'bg-white/[0.05] border-transparent text-[#E5E5E5] hover:bg-white/[0.12]'
                      }`}
                      aria-label={`Downrate ${name}`}
                      aria-pressed={entry.item.userVote === 'down'}
                    >
                      <ArrowBigDown
                        className={`w-4 h-4 ${
                          entry.item.userVote === 'down' ? 'fill-[#E5E5E5]' : 'fill-current'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-right min-w-[58px]">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {entry.score.toFixed(1)}
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
