import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { Button, SearchField, TabBar } from 'glisse';
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

const NAV_ITEMS: { value: NavTab; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'officials', label: 'Officials' },
  { value: 'forum', label: 'Voice' },
  { value: 'elections', label: 'Elections' },
  { value: 'profile', label: 'Profile' },
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
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0C0C0C]/88 backdrop-blur-2xl border-b border-white/[0.08] safe-top">
      <div className="max-w-6xl mx-auto h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Zone 1: Custom Uploaded Logo + Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setIsDropdownOpen(false);
            onChangeTab('home');
          }}
          aria-label="PublicPulse Home"
          className="flex items-center gap-2.5 min-h-[40px] whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full"
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

        {/* Zone 2: Desktop Glisse Liquid Glass TabBar */}
        <div className="hidden lg:flex items-center shrink-0">
          <TabBar
            aria-label="Primary navigation"
            className="lg-tab-bar-desktop"
            items={NAV_ITEMS}
            value={activeTab}
            onValueChange={(value) => {
              triggerHaptic('selection');
              setIsDropdownOpen(false);
              onChangeTab(value as NavTab);
            }}
          />
        </div>

        {/* Global Glisse Liquid Glass Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 min-w-0 max-w-sm lg:max-w-[260px] xl:max-w-xs"
        >
          <SearchField
            value={query}
            onValueChange={(val) => {
              setQuery(val);
              setIsDropdownOpen(val.trim().length > 0);
            }}
            onFocus={() => {
              if (trimmedQuery) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search officials..."
            aria-label="Search officials or agencies"
            aria-expanded={isDropdownOpen && trimmedQuery.length > 0}
          />

          {/* Instant Search Dropdown */}
          {isDropdownOpen && trimmedQuery.length > 0 && (
            <div
              role="region"
              aria-label="Search results"
              className="absolute left-0 right-0 sm:min-w-[320px] top-[calc(100%+8px)] rounded-2xl glass-sheet border border-white/[0.12] overflow-hidden z-50"
            >
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center space-y-1.5">
                  <p className="text-xs font-semibold text-white">
                    No match for &ldquo;{trimmedQuery}&rdquo;
                  </p>
                  <p className="text-[11px] text-neutral-400">
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
                          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 overflow-hidden shrink-0 ring-1 ring-white/15 ${
                                item.kind === 'agency'
                                  ? 'rounded-xl bg-white p-1'
                                  : 'rounded-full bg-[#1A1A1A]'
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
                              <div className="text-[11px] text-neutral-400 truncate">
                                {item.kind === 'official' ? 'Official' : 'Agency'} · {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-white font-mono tabular-nums">
                              {item.trustIndex.toFixed(1)}
                            </div>
                            <div className="text-[10px] font-mono tabular-nums text-neutral-400 inline-flex items-center justify-end gap-0.5">
                              {isPositive ? (
                                <ArrowUpRight className="w-3 h-3 text-[#E5E5E5]" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 text-[#E5E5E5]" />
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
                      setQuery('');
                      onSubmitSearchToIndex(q);
                    }}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border-t border-white/[0.08] text-xs font-semibold text-[#E5E5E5] flex items-center justify-between transition-colors"
                  >
                    <span>Browse all in Index</span>
                    <ChevronRight className="w-4 h-4 text-[#E5E5E5]" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Glisse Glass Action Buttons (Unified Monochrome Icons) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="sm:hidden">
            <Button
              type="button"
              variant={isVerified ? 'glass' : 'filled'}
              icon={isVerified ? <ShieldCheck /> : <UserCheck />}
              aria-label={isVerified ? 'Verified Citizen ID' : 'Verify Citizen ID'}
              onClick={() => {
                triggerHaptic('selection');
                onOpenVerification?.();
              }}
            />
          </div>
          <div className="hidden sm:block">
            <Button
              type="button"
              variant={isVerified ? 'glass' : 'filled'}
              icon={isVerified ? <ShieldCheck /> : <UserCheck />}
              aria-label={isVerified ? 'Verified Citizen ID' : 'Verify Citizen ID'}
              onClick={() => {
                triggerHaptic('selection');
                onOpenVerification?.();
              }}
            >
              {isVerified ? 'Verified' : 'Verify ID'}
            </Button>
          </div>

          <div className="relative shrink-0">
            <Button
              type="button"
              variant="glass"
              icon={<Bell />}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              onClick={() => {
                triggerHaptic('light');
                onOpenNotifications?.();
              }}
            />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-white text-[#0C0C0C] text-[10px] font-bold flex items-center justify-center tabular-nums"
              >
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
