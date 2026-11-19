import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Star, 
  Building2,
  ArrowUpRight, 
  ArrowDownRight,
  ArrowBigUp,
  ArrowBigDown
} from 'lucide-react';
import { OFFICIALS, AGENCIES } from '../data/mockData';
import type { Official, Agency } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface OfficialsViewProps {
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
  onOpenRateModal: (target: { name: string; role: string; type: 'official' | 'agency' }) => void;
}

export const OfficialsView: React.FC<OfficialsViewProps> = ({
  onSelectOfficial,
  onSelectAgency,
  onOpenRateModal,
}) => {
  const [officialsList, setOfficialsList] = useState<Official[]>(OFFICIALS);
  const [agenciesList, setAgenciesList] = useState<Agency[]>(AGENCIES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'executive' | 'governors' | 'ministers' | 'agencies'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOfficialVote = (e: React.MouseEvent, officialId: string, direction: 'up' | 'down') => {
    e.stopPropagation();
    triggerHaptic('medium');
    setOfficialsList((prev) =>
      prev.map((off) => {
        if (off.id !== officialId) return off;

        const currentVote = off.userVote;
        let upvotes = off.upvotesCount || 100;
        let downvotes = off.downvotesCount || 20;
        let newVote: 'up' | 'down' | null = direction;

        if (currentVote === direction) {
          newVote = null;
          if (direction === 'up') upvotes = Math.max(0, upvotes - 1);
          else downvotes = Math.max(0, downvotes - 1);
        } else {
          if (currentVote === 'up') upvotes = Math.max(0, upvotes - 1);
          if (currentVote === 'down') downvotes = Math.max(0, downvotes - 1);
          if (direction === 'up') upvotes += 1;
          else downvotes += 1;
        }

        const totalVotes = upvotes + downvotes;
        const newTrust = totalVotes > 0 ? (upvotes / totalVotes) * 100 : off.trustIndex;

        return {
          ...off,
          userVote: newVote,
          upvotesCount: upvotes,
          downvotesCount: downvotes,
          trustIndex: Number(newTrust.toFixed(1)),
        };
      })
    );
  };

  const handleAgencyVote = (e: React.MouseEvent, agencyId: string, direction: 'up' | 'down') => {
    e.stopPropagation();
    triggerHaptic('medium');
    setAgenciesList((prev) =>
      prev.map((ag) => {
        if (ag.id !== agencyId) return ag;

        const currentVote = ag.userVote;
        let upvotes = ag.upvotesCount || 80;
        let downvotes = ag.downvotesCount || 20;
        let newVote: 'up' | 'down' | null = direction;

        if (currentVote === direction) {
          newVote = null;
          if (direction === 'up') upvotes = Math.max(0, upvotes - 1);
          else downvotes = Math.max(0, downvotes - 1);
        } else {
          if (currentVote === 'up') upvotes = Math.max(0, upvotes - 1);
          if (currentVote === 'down') downvotes = Math.max(0, downvotes - 1);
          if (direction === 'up') upvotes += 1;
          else downvotes += 1;
        }

        const totalVotes = upvotes + downvotes;
        const newTrust = totalVotes > 0 ? (upvotes / totalVotes) * 100 : ag.trustIndex;

        return {
          ...ag,
          userVote: newVote,
          upvotesCount: upvotes,
          downvotesCount: downvotes,
          trustIndex: Number(newTrust.toFixed(1)),
        };
      })
    );
  };

  const filteredOfficials = officialsList.filter((official) => {
    if (selectedFilter === 'executive' && official.category !== 'executive') return false;
    if (selectedFilter === 'governors' && official.category !== 'governor') return false;
    if (selectedFilter === 'ministers' && official.category !== 'minister') return false;
    if (selectedFilter === 'agencies') return false;

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        official.name.toLowerCase().includes(q) ||
        official.role.toLowerCase().includes(q) ||
        official.state.toLowerCase().includes(q) ||
        official.party.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const showAgencies = selectedFilter === 'all' || selectedFilter === 'agencies';
  const filteredAgencies = agenciesList.filter((agency) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        agency.name.toLowerCase().includes(q) ||
        agency.acronym.toLowerCase().includes(q) ||
        agency.sector.toLowerCase().includes(q) ||
        agency.head.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 px-4 pb-28">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
          Officials & Institutions Directory
        </h2>
        <p className="text-xs text-slate-400">Public servants, cabinet ministers & state agencies (1 - 100 Index)</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, state, ministry, or agency..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676]/50 transition-colors"
        />
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {(['all', 'executive', 'governors', 'ministers', 'agencies'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => {
              triggerHaptic('selection');
              setSelectedFilter(filter);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/20 font-bold'
                : 'bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Officials List */}
      <div className="space-y-2.5">
        {selectedFilter !== 'agencies' && (
          <>
            {filteredOfficials.map((official) => {
              const isPositive = official.change24h >= 0;

              return (
                <div
                  key={official.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectOfficial(official);
                  }}
                  className="glass-card-interactive rounded-2xl p-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={official.avatar}
                          alt={official.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
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
                          <h4 className="text-sm font-bold text-white tracking-tight">{official.name}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{official.role}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                          <span>{official.state}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {official.trustIndex >= 70 ? '4.8' : official.trustIndex >= 60 ? '4.2' : '3.6'}
                          </span>
                          <span className="text-[10px] text-slate-400">({official.ratingsCount.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="text-base font-extrabold text-white font-mono">
                        {official.trustIndex.toFixed(1)}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </div>
                      <div
                        className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 mt-0.5 ${
                          isPositive ? 'text-[#00E676]' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{isPositive ? `+${official.change24h}%` : `${official.change24h}%`}</span>
                      </div>
                    </div>
                  </div>

                  {/* One-Tap Uprate/Downrate & Rate Modal Action Strip */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOfficialVote(e, official.id, 'up')}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                          official.userVote === 'up'
                            ? 'bg-emerald-500/25 border-[#00E676] text-[#00E676] shadow-sm'
                            : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-emerald-500/10'
                        }`}
                        title="Uprate official"
                      >
                        <ArrowBigUp className={`w-3.5 h-3.5 ${official.userVote === 'up' ? 'fill-[#00E676]' : ''}`} />
                        <span>{(official.upvotesCount || 1420).toLocaleString()}</span>
                      </button>

                      <button
                        onClick={(e) => handleOfficialVote(e, official.id, 'down')}
                        className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                          official.userVote === 'down'
                            ? 'bg-red-500/25 border-red-500 text-red-400 shadow-sm'
                            : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-red-500/10'
                        }`}
                        title="Downrate official"
                      >
                        <ArrowBigDown className={`w-3.5 h-3.5 ${official.userVote === 'down' ? 'fill-red-400' : ''}`} />
                        <span>{(official.downvotesCount || 340).toLocaleString()}</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic('medium');
                        onOpenRateModal({
                          name: official.name,
                          role: official.role,
                          type: 'official',
                        });
                      }}
                      className="px-3 py-1 rounded-xl bg-white/[0.06] hover:bg-emerald-500/20 text-[#00E676] hover:text-emerald-300 border border-white/[0.08] text-xs font-semibold active:scale-95 transition-all"
                    >
                      Audit & Review
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Agencies Section */}
        {showAgencies && filteredAgencies.length > 0 && (
          <div className="pt-3">
            {selectedFilter === 'all' && (
              <div className="flex items-center gap-1.5 mb-2.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit']">
                  Federal Agencies & Commissions
                </h3>
              </div>
            )}

            <div className="space-y-2.5">
              {filteredAgencies.map((agency) => {
                const isPositive = agency.change24h >= 0;

                return (
                  <div
                    key={agency.id}
                    onClick={() => {
                      triggerHaptic('light');
                      onSelectAgency(agency);
                    }}
                    className="glass-card-interactive rounded-2xl p-4 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0 shadow-sm">
                          <img
                            src={agency.logo}
                            alt={agency.acronym}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white tracking-tight">{agency.acronym}</h4>
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-400">
                              Agency
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[170px]">{agency.name}</p>
                          <p className="text-[11px] text-slate-400 mt-1">Head: {agency.head}</p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <div className="text-base font-extrabold text-white font-mono">
                          {agency.trustIndex.toFixed(1)}
                          <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </div>
                        <div
                          className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 mt-0.5 ${
                            isPositive ? 'text-[#00E676]' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{isPositive ? `+${agency.change24h}%` : `${agency.change24h}%`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Agency One-Tap Uprate/Downrate & Rate Modal */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleAgencyVote(e, agency.id, 'up')}
                          className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                            agency.userVote === 'up'
                              ? 'bg-blue-500/25 border-blue-400 text-blue-400 shadow-sm'
                              : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-blue-500/10'
                          }`}
                          title="Uprate agency"
                        >
                          <ArrowBigUp className={`w-3.5 h-3.5 ${agency.userVote === 'up' ? 'fill-blue-400' : ''}`} />
                          <span>{(agency.upvotesCount || 890).toLocaleString()}</span>
                        </button>

                        <button
                          onClick={(e) => handleAgencyVote(e, agency.id, 'down')}
                          className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
                            agency.userVote === 'down'
                              ? 'bg-red-500/25 border-red-500 text-red-400 shadow-sm'
                              : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white hover:bg-red-500/10'
                          }`}
                          title="Downrate agency"
                        >
                          <ArrowBigDown className={`w-3.5 h-3.5 ${agency.userVote === 'down' ? 'fill-red-400' : ''}`} />
                          <span>{(agency.downvotesCount || 190).toLocaleString()}</span>
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('medium');
                          onOpenRateModal({
                            name: agency.name,
                            role: agency.headTitle,
                            type: 'agency',
                          });
                        }}
                        className="px-3 py-1 rounded-xl bg-white/[0.06] hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-white/[0.08] text-xs font-semibold active:scale-95 transition-all"
                      >
                        Audit & Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
