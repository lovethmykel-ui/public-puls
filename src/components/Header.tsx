import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ShieldCheck,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import type { Agency, NavTab, Official } from '../types';
import { searchCivicEntities } from '../utils/civicMath';
import { triggerHaptic } from '../utils/telegram';

interface HeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  officials: Official[];
  agencies: Agency[];
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
  onSubmitSearchToIndex: (query: string) => void;
  isVerified?: boolean;
  unreadCount?: number;
  onOpenVerification?: () => void;
  onOpenNotifications?: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'officials', label: 'Officials' },
  { id: 'forum', label: 'Voice' },
  { id: 'elections', label: 'Elections' },
  { id: 'profile', label: 'Profile' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  officials,
  agencies,
  onSelectOfficial,
  onSelectAgency,
  onSubmitSearchToIndex,
  isVerified = true,
  unreadCount = 3,
  onOpenVerification,
  onOpenNotifications,
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const results = searchCivicEntities(officials, agencies, trimmedQuery, 7);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleSelectResult = (item: (typeof results)[number]) => {
    triggerHaptic('selection');
    setIsDropdownOpen(false);
    setQuery('');
    if (item.kind === 'official') {
      const found = officials.find((o) => o.id === item.id);
      if (found) onSelectOfficial(found);
    } else {
      const found = agencies.find((a) => a.id === item.id);
      if (found) onSelectAgency(found);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      e.currentTarget.blur();
    } else if (e.key === 'Enter' && trimmedQuery) {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectResult(results[0]);
      } else {
        setIsDropdownOpen(false);
        onSubmitSearchToIndex(trimmedQuery);
      }
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#08090C]/92 backdrop-blur-xl border-b border-white/[0.07] safe-top">
      <div className="max-w-6xl mx-auto h-16 px-3.5 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-5">
        {/* Zone 1: Custom Uploaded Logo + Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setIsDropdownOpen(false);
            onChangeTab('home');
          }}
          aria-label="PublicPulse Home"
          className="flex items-center gap-2.5 min-h-[44px] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
        >
          <img
            src="/assets/aistudio/Untitled_design_60f6d4cb.png"
            alt="PublicPulse logo"
            className="w-7 h-7 object-contain shrink-0"
          />
          <span className="hidden sm:inline font-bold text-[17px] tracking-tight text-white font-['Outfit'] whitespace-nowrap shrink-0">
            PublicPulse
          </span>
        </button>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6 shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setIsDropdownOpen(false);
                  onChangeTab(item.id);
                }}
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Global Header Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 min-w-0 max-w-sm lg:max-w-xs xl:max-w-sm"
        >
          <div className="relative flex items-center">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 w-4 h-4 text-slate-200 shrink-0"
            />
            <input
              type="text"
              role="searchbox"
              inputMode="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                if (trimmedQuery) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search leaders & agencies..."
              aria-label="Search officials or agencies"
              aria-expanded={isDropdownOpen && trimmedQuery.length > 0}
              className="w-full h-10 pl-9 pr-8 rounded-full bg-[#12151E] border border-white/[0.08] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/30 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsDropdownOpen(false);
                }}
                aria-label="Clear header search"
                className="absolute right-2 w-6 h-6 rounded-full flex items-center justify-center text-slate-200 hover:bg-white/[0.08]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Dropdown */}
          {isDropdownOpen && trimmedQuery.length > 0 && (
            <div
              role="region"
              aria-label="Search results"
              className="absolute left-0 right-0 sm:min-w-[320px] top-[calc(100%+8px)] rounded-2xl bg-[#0D1018]/98 backdrop-blur-2xl border border-white/[0.1] shadow-2xl overflow-hidden z-50"
            >
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center space-y-1.5">
                  <p className="text-xs font-semibold text-white">
                    No match for &ldquo;{trimmedQuery}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Try searching by official name, state, or agency acronym.
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-white/[0.06] max-h-80 overflow-y-auto no-scrollbar">
                    {results.map((item) => {
                      const isPositive = item.change24h >= 0;
                      return (
                        <button
                          key={`${item.kind}-${item.id}`}
                          type="button"
                          onClick={() => handleSelectResult(item)}
                          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 overflow-hidden shrink-0 ring-1 ring-white/15 ${
                                item.kind === 'agency'
                                  ? 'rounded-xl bg-white p-1'
                                  : 'rounded-full bg-[#151A25]'
                              }`}
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full ${
                                  item.kind === 'agency' ? 'object-contain' : 'object-cover'
                                }`}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {item.kind === 'official' ? 'Official' : 'Agency'} · {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-white font-mono tabular-nums">
                              {item.trustIndex.toFixed(1)}
                            </div>
                            <div className="text-[10px] font-mono tabular-nums text-slate-400 inline-flex items-center justify-end gap-0.5">
                              {isPositive ? (
                                <ArrowUpRight className="w-3 h-3 text-slate-200" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 text-slate-200" />
                              )}
                              <span>
                                {isPositive ? `+${item.change24h}%` : `${item.change24h}%`}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      const q = trimmedQuery;
                      setIsDropdownOpen(false);
                      onSubmitSearchToIndex(q);
                    }}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border-t border-white/[0.07] text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>Browse all in Index</span>
                    <ChevronRight className="w-4 h-4 text-slate-200" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Verification Action + Notifications (Unified Monochrome Icons) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              onOpenVerification?.();
            }}
            aria-label={isVerified ? 'Verified Citizen ID' : 'Verify Citizen ID'}
            className={`h-10 px-2.5 sm:px-3.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors active:scale-95 ${
              isVerified
                ? 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-100 border border-white/[0.08]'
                : 'bg-white text-black hover:bg-slate-200'
            }`}
          >
            {isVerified ? (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-200 shrink-0" />
                <span className="hidden sm:inline">Verified</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Verify ID</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onOpenNotifications?.();
            }}
            className="relative w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-200 hover:text-white active:scale-95 transition-all shrink-0"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-4 h-4 text-slate-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
