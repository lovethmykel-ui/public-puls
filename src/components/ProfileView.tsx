import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  Star,
  MessageSquare,
  Users,
  History,
  Bookmark,
  Lock,
  HelpCircle,
  Share2,
  Plus,
  X,
  Check,
  Calendar,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, SegmentedControl } from 'glisse';
import amaraAvatar from '../assets/images/citizen_amara_1795210837859.jpg';
import { Sparkline } from './Sparkline';
import type { Official, Agency } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface ProfileViewProps {
  isVerified: boolean;
  officials: Official[];
  agencies: Agency[];
  bookmarkedIds: string[];
  onOpenVerification: () => void;
  onSelectOfficial: (official: Official) => void;
  onSelectAgency: (agency: Agency) => void;
}

type TimeframeKey = '24h' | '7d' | '30d' | 'All';
type ActivityTab = 'all' | 'officials' | 'agencies';

const TIMEFRAME_ITEMS = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'All', label: 'All' },
];

const ACTIVITY_ITEMS = [
  { value: 'all', label: 'All' },
  { value: 'officials', label: 'Officials' },
  { value: 'agencies', label: 'Agencies' },
];

const INFLUENCE_SERIES: Record<TimeframeKey, { data: number[]; delta: string }> = {
  '24h': { data: [8290, 8310, 8305, 8340, 8380, 8405, 8420], delta: '+130 (24h)' },
  '7d': { data: [7640, 7790, 7850, 8010, 8190, 8310, 8420], delta: '+780 (7d)' },
  '30d': { data: [6400, 6820, 7100, 7040, 7510, 7890, 8150, 8420], delta: '+2,020 (30d)' },
  All: { data: [3100, 4200, 5100, 5890, 6420, 7280, 7910, 8420], delta: '+5,320 (All)' },
};

type DrawerType = 'ratings' | 'watchlist' | 'ledger' | 'faq' | null;

export const ProfileView: React.FC<ProfileViewProps> = ({
  isVerified,
  officials,
  agencies,
  bookmarkedIds,
  onOpenVerification,
  onSelectOfficial,
  onSelectAgency,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [activityTab, setActivityTab] = useState<ActivityTab>('all');
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  useEffect(() => {
    if (!activeDrawer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDrawer(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDrawer]);

  const series = INFLUENCE_SERIES[timeframe];

  const ratedOfficials = officials.filter((o) => o.userVote != null);
  const ratedAgencies = agencies.filter((a) => a.userVote != null);

  const handleShareProfile = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator
        .share({
          title: 'Amara Uche — PublicPulse Citizen Profile',
          text: 'Verified Citizen Influence Score: 8,420 on PublicPulse Nigeria.',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12 max-w-4xl mx-auto w-full space-y-6">
      {/* Top Action Icons Row */}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="glass"
          icon={copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          onClick={handleShareProfile}
          aria-label="Share citizen profile"
          className="!h-10 !w-10"
        />
        <Button
          type="button"
          variant="glass"
          icon={<History className="w-4 h-4" />}
          onClick={() => {
            triggerHaptic('light');
            setActiveDrawer('ledger');
          }}
          aria-label="Voting ledger history"
          className="!h-10 !w-10"
        />
        <Button
          type="button"
          variant="glass"
          icon={<Lock className="w-4 h-4" />}
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification();
          }}
          aria-label="Zero-Knowledge identity settings"
          className="!h-10 !w-10"
        />
      </div>

      {/* Profile Identity Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative">
            <img
              src={amaraAvatar}
              alt="Amara Uche"
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-white/15"
            />
            {isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center ring-2 ring-[#0C0C0C]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="filled"
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => {
              triggerHaptic('selection');
              onOpenVerification();
            }}
            className="!h-10 !px-4 !text-xs whitespace-nowrap"
          >
            {isVerified ? 'ZK Credential' : 'Verify ID'}
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight">
            Amara Uche
          </h1>
          <p className="text-sm text-neutral-400 font-mono">@amara_ng · Ikeja Ward 05</p>

          {/* Editable Bio Link */}
          {isEditingBio ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBio(bioDraft.trim());
                setIsEditingBio(false);
              }}
              className="mt-2.5 flex items-center gap-2 max-w-md"
            >
              <label htmlFor="bio-draft-input" className="sr-only">
                Civic bio
              </label>
              <input
                id="bio-draft-input"
                type="text"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Write a short civic bio..."
                maxLength={90}
                className="flex-1 min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#141414] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-white/40"
              />
              <Button type="submit" variant="filled" className="!h-9 !px-3.5 !text-xs">
                Save
              </Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBioDraft(bio);
                setIsEditingBio(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white hover:underline"
            >
              <Plus className="w-3.5 h-3.5 text-[#E5E5E5]" />
              <span>{bio || 'Add a civic bio'}</span>
            </button>
          )}
        </div>

        {/* Clean Unboxed Stats */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong className="text-white font-mono tabular-nums">26</strong>{' '}
              <span className="text-neutral-400">Following</span>
            </span>
            <span>
              <strong className="text-white font-mono tabular-nums">
                {152 + ratedOfficials.length + ratedAgencies.length}
              </strong>{' '}
              <span className="text-neutral-400">Audits</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#E5E5E5]" />
              43 Reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#E5E5E5]" />
              100% Voting Weight
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#E5E5E5]" />
              Joined May 2025
            </span>
          </div>
        </div>
      </section>

      {/* Hero Influence Curve */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white font-['Outfit'] tabular-nums">
              8,420
              <span className="text-xl text-neutral-500 font-semibold">.00</span>
            </div>
            <div className="text-xs font-semibold text-neutral-200 font-mono tabular-nums mt-0.5">
              {series.delta} <span className="text-neutral-400 font-sans font-normal">Influence</span>
            </div>
          </div>

          <SegmentedControl
            aria-label="Influence timeframe"
            items={TIMEFRAME_ITEMS}
            value={timeframe}
            onValueChange={(value) => {
              triggerHaptic('selection');
              setTimeframe(value as TimeframeKey);
            }}
            className="lg-segmented-compact"
          />
        </div>

        <div className="rounded-2xl chart-dot-grid border border-white/[0.06] bg-[#101010] px-3 pt-4 pb-2 overflow-hidden">
          <Sparkline
            data={series.data}
            width={560}
            height={110}
            color="#E5E5E5"
            strokeWidth={2.5}
            showGradient={true}
            showDot={true}
            responsive={true}
          />
        </div>
      </section>

      {/* Single Elevated Voting Power Strip */}
      <div className="surface-card rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#E5E5E5] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Civic Voting Power</div>
            <div className="text-lg font-bold text-white font-['Outfit'] tabular-nums">
              {isVerified ? '100% Strength' : '25% Unverified'}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="glass"
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification();
          }}
          className="!h-9 !px-3.5 !text-xs whitespace-nowrap"
        >
          {isVerified ? 'Manage ZK' : 'Verify Now'}
        </Button>
      </div>

      {/* Activity & Account Records */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white font-['Outfit']">
            Citizen Records
          </h2>
          <SegmentedControl
            aria-label="Citizen records filter"
            items={ACTIVITY_ITEMS}
            value={activityTab}
            onValueChange={(value) => {
              triggerHaptic('selection');
              setActivityTab(value as ActivityTab);
            }}
            className="lg-segmented-3"
          />
        </div>

        {activityTab !== 'all' ? (
          <div className="surface-card rounded-2xl divide-y divide-white/[0.06]">
            {(activityTab === 'officials' ? officials.slice(0, 4) : agencies.slice(0, 4)).map(
              (item) => {
                const isOfficialItem = 'party' in item;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      if (isOfficialItem) onSelectOfficial(item);
                      else onSelectAgency(item);
                    }}
                    className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={isOfficialItem ? item.avatar : item.logo}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className={`w-9 h-9 shrink-0 ${
                          isOfficialItem
                            ? 'rounded-full object-cover'
                            : 'rounded-xl bg-white p-1 object-contain'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {isOfficialItem ? item.name : item.acronym}
                        </div>
                        <div className="text-xs text-neutral-400 truncate">
                          {isOfficialItem ? item.role : item.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-100 tabular-nums shrink-0">
                      {item.trustIndex.toFixed(1)}/100
                    </span>
                  </button>
                );
              }
            )}
          </div>
        ) : (
          <div className="surface-card rounded-2xl divide-y divide-white/[0.06]">
            {[
              {
                label: 'Recent Votes & Audits',
                meta: `${ratedOfficials.length + ratedAgencies.length} session actions`,
                icon: Star,
                action: () => setActiveDrawer('ratings'),
              },
              {
                label: 'Saved Watchlist',
                meta: `${bookmarkedIds.length} bookmarked`,
                icon: Bookmark,
                action: () => setActiveDrawer('watchlist'),
              },
              {
                label: 'Immutable Voting Ledger',
                meta: 'ZK-signed receipts',
                icon: History,
                action: () => setActiveDrawer('ledger'),
              },
              {
                label: 'Following Officials',
                meta: '26 leaders',
                icon: Users,
                action: () => setActiveDrawer('watchlist'),
              },
              {
                label: 'Zero-Knowledge Privacy & FAQ',
                meta: 'How anonymity works',
                icon: HelpCircle,
                action: () => setActiveDrawer('faq'),
              },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <button
                  key={row.label}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    row.action();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#E5E5E5] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{row.label}</div>
                      <div className="text-xs text-neutral-400 truncate">{row.meta}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#E5E5E5] shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Record Drawer */}
      <AnimatePresence>
        {activeDrawer && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setActiveDrawer(null)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-drawer-title"
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
                <h3
                  id="profile-drawer-title"
                  className="text-sm font-bold text-white font-['Outfit']"
                >
                  {activeDrawer === 'ratings'
                    ? 'Your Votes & Audits'
                    : activeDrawer === 'watchlist'
                    ? 'Tracked Watchlist'
                    : activeDrawer === 'ledger'
                    ? 'Immutable ZK Voting Ledger'
                    : 'Zero-Knowledge Privacy & FAQ'}
                </h3>
                <Button
                  type="button"
                  variant="glass"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => setActiveDrawer(null)}
                  aria-label="Close drawer"
                  className="!h-9 !w-9"
                />
              </div>

              <div className="p-5 overflow-y-auto no-scrollbar space-y-3">
                {activeDrawer === 'ratings' && (
                  <>
                    {ratedOfficials.length === 0 && ratedAgencies.length === 0 ? (
                      <p className="text-xs text-neutral-400 text-center py-6">
                        Uprate, downrate, or audit any official or agency to see your live session log here.
                      </p>
                    ) : (
                      <div className="divide-y divide-white/[0.06]">
                        {ratedOfficials.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              setActiveDrawer(null);
                              onSelectOfficial(o);
                            }}
                            className="w-full py-3 flex items-center justify-between text-left"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">{o.name}</div>
                              <div className="text-xs text-neutral-400">{o.role}</div>
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                o.userVote === 'up' ? 'text-white' : 'text-neutral-400'
                              }`}
                            >
                              {o.userVote === 'up' ? 'Uprated' : 'Downrated'}
                            </span>
                          </button>
                        ))}
                        {ratedAgencies.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => {
                              setActiveDrawer(null);
                              onSelectAgency(a);
                            }}
                            className="w-full py-3 flex items-center justify-between text-left"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">{a.acronym}</div>
                              <div className="text-xs text-neutral-400">{a.name}</div>
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                a.userVote === 'up' ? 'text-white' : 'text-neutral-400'
                              }`}
                            >
                              {a.userVote === 'up' ? 'Uprated' : 'Downrated'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeDrawer === 'watchlist' && (
                  <div className="divide-y divide-white/[0.06]">
                    {officials.slice(0, 4).map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          setActiveDrawer(null);
                          onSelectOfficial(o);
                        }}
                        className="w-full py-3 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={o.avatar}
                            alt={o.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">{o.name}</div>
                            <div className="text-xs text-neutral-400">
                              {o.party} · {o.state}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-100 tabular-nums">
                          {o.trustIndex.toFixed(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {activeDrawer === 'ledger' && (
                  <div className="space-y-2.5 text-xs">
                    {[
                      { hash: '0x94fa...31c8', action: 'Uprated Dr. Alex Otti (Abia)', time: '2h ago' },
                      { hash: '0x42b1...88e2', action: 'Audited EFCC Institutional Integrity', time: '1d ago' },
                      { hash: '0x71d9...05a4', action: 'ZK NIN Proof Attestation Issued', time: 'May 2025' },
                    ].map((tx) => (
                      <div key={tx.hash} className="surface-card rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-neutral-200">{tx.hash}</span>
                          <span className="text-neutral-400">{tx.time}</span>
                        </div>
                        <div className="text-neutral-200 font-medium">{tx.action}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDrawer === 'faq' && (
                  <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                    <p>
                      <strong className="text-white block mb-0.5">How is my identity protected?</strong>
                      Your 11-digit NIN is hashed locally into a cryptographic nullifier. PublicPulse never stores your raw NIN or links your Telegram ID to your votes.
                    </p>
                    <p>
                      <strong className="text-white block mb-0.5">How are Trust Scores computed?</strong>
                      Citizen scores combine weighted verified audits across transparency, service delivery, and integrity with live 24-hour sentiment deltas.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
