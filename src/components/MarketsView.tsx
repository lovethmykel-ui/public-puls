import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Building2
} from 'lucide-react';
import { Sparkline } from './Sparkline';
import { OFFICIALS, AGENCIES, PLATFORM_STATS } from '../data/mockData';
import type { Official, Agency } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface MarketsViewProps {
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  onSelectOfficial,
  onSelectAgency,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'politicians' | 'institutions'>('all');
  const [marketSort, setMarketSort] = useState<'gainers' | 'losers'>('gainers');
  const [searchQuery, setSearchQuery] = useState('');

  // Combined list formatted for unified table
  const allAssets = [
    ...OFFICIALS.map((o) => ({
      type: 'official' as const,
      id: o.id,
      name: o.name,
      subtitle: o.role,
      tag: o.party,
      tagColor: o.partyColor,
      price: o.trustIndex,
      change24h: o.change24h,
      sparkline: o.sparkline,
      avatar: o.avatar,
      logo: '',
      raw: o,
    })),
    ...AGENCIES.map((a) => ({
      type: 'agency' as const,
      id: a.id,
      name: a.name,
      subtitle: a.sector,
      tag: a.acronym,
      tagColor: '#3B82F6',
      price: a.trustIndex,
      change24h: a.change24h,
      sparkline: a.sparkline,
      avatar: '',
      logo: a.logo,
      raw: a,
    })),
  ];

  // Filtering
  const filteredAssets = allAssets.filter((item) => {
    if (activeCategory === 'politicians' && item.type !== 'official') return false;
    if (activeCategory === 'institutions' && item.type !== 'agency') return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sorting
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (marketSort === 'gainers') {
      return b.change24h - a.change24h;
    }
    return a.change24h - b.change24h;
  });

  return (
    <div className="space-y-4 px-4 pb-28">
      {/* Title & Search */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
            Political Stock Market
          </h2>
          <p className="text-xs text-slate-400">Public Trust & Confidence Index Exchange</p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#00E676] text-xs font-bold font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>PPI 1,254.36</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search politicians, parties, agencies..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676]/50 transition-colors"
        />
      </div>

      {/* Market Overview Card */}
      <div className="rounded-3xl glass-panel p-4 border border-white/[0.08]">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Citizen Audits</span>
            <div className="text-lg font-extrabold text-white font-mono mt-0.5">
              {PLATFORM_STATS.totalCitizenAudits}
            </div>
            <span className="text-[10px] text-[#00E676] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +2.31% Today
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">24h Civic Volume</span>
            <div className="text-lg font-extrabold text-white font-mono mt-0.5">
              {PLATFORM_STATS.volume24h}
            </div>
            <span className="text-[10px] text-[#00E676] font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +5.12% 24h
            </span>
          </div>
        </div>

        {/* Sentiment Gauge */}
        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-[#00E676] font-semibold">
              Bullish {PLATFORM_STATS.sentimentBullish}%
            </span>
            <span className="text-slate-400 font-normal">Market Sentiment</span>
            <span className="text-red-400 font-semibold">
              Bearish {PLATFORM_STATS.sentimentBearish}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-red-500/30 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#00E676] rounded-full transition-all duration-700"
              style={{ width: `${PLATFORM_STATS.sentimentBullish}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills & Gainers/Losers Switcher */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'politicians', 'institutions'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('selection');
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gainers vs Losers Subtabs */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setMarketSort('gainers');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                marketSort === 'gainers'
                  ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => {
                triggerHaptic('selection');
                setMarketSort('losers');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                marketSort === 'losers'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Losers
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Showing {sortedAssets.length} assets
          </div>
        </div>
      </div>

      {/* Asset Table / List */}
      <div className="space-y-2">
        {sortedAssets.map((asset) => {
          const isPositive = asset.change24h >= 0;

          return (
            <div
              key={asset.id}
              onClick={() => {
                triggerHaptic('light');
                if (asset.type === 'official') {
                  onSelectOfficial(asset.raw as Official);
                } else {
                  onSelectAgency(asset.raw as Agency);
                }
              }}
              className="glass-card-interactive rounded-2xl p-3.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {asset.avatar ? (
                  <div className="relative">
                    <img
                      src={asset.avatar}
                      alt={asset.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <span
                      className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[8px] font-bold text-white uppercase"
                      style={{ backgroundColor: asset.tagColor }}
                    >
                      {asset.tag}
                    </span>
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
                    {asset.logo ? (
                      <img src={asset.logo} alt={asset.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold text-white tracking-tight">{asset.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{asset.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  <Sparkline
                    data={asset.sparkline}
                    width={65}
                    height={28}
                    isPositive={isPositive}
                    showDot={false}
                  />
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="text-sm font-bold text-white font-mono">
                    {asset.price.toFixed(1)} / 100
                  </div>
                  <div
                    className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-[#00E676]' : 'text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{isPositive ? `+${asset.change24h}%` : `${asset.change24h}%`}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
