import React, { useState } from 'react';
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

const INFLUENCE_SERIES: Record<'24h' | '7d' | '30d' | 'All', { data: number[]; delta: string }> = {
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
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'All'>('7d');
  const [activityTab, setActivityTab] = useState<'all' | 'officials' | 'agencies'>('all');
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

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
      {/* Top Action Icons Row (fomo IMG_6341 style) */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleShareProfile}
          aria-label="Share citizen profile"
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-200 transition-colors"
        >
          {copiedShare ? <Check className="w-4 h-4 text-[#00E676]" /> : <Share2 className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setActiveDrawer('ledger');
          }}
          aria-label="Voting ledger history"
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-200 transition-colors"
        >
          <History className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification();
          }}
          aria-label="Zero-Knowledge identity settings"
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-200 transition-colors"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Identity Header (fomo IMG_6341 exact layout) */}
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
              <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#00E676] text-black flex items-center justify-center ring-2 ring-[#08090C]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              onOpenVerification();
            }}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00cf6a] text-black text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerified ? 'ZK Credential' : 'Verify ID'}</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight">
            Amara Uche
          </h1>
          <p className="text-sm text-slate-400 font-mono">@amara_ng · Ikeja Ward 05</p>

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
              <input
                type="text"
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Write a short civic bio..."
                maxLength={90}
                className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#12151E] border border-white/[0.12] text-xs text-white focus:outline-none focus:border-[#00E676]"
              />
              <button
                type="submit"
                className="min-h-[38px] px-3 rounded-xl bg-[#00E676] text-black text-xs font-bold"
              >
                Save
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBioDraft(bio);
                setIsEditingBio(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E676] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{bio || 'Add a civic bio'}</span>
            </button>
          )}
        </div>

        {/* Clean Unboxed Stats */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong className="text-white font-mono tabular-nums">26</strong>{' '}
              <span className="text-slate-400">Following</span>
            </span>
            <span>
              <strong className="text-white font-mono tabular-nums">
                {152 + ratedOfficials.length + ratedAgencies.length}
              </strong>{' '}
              <span className="text-slate-400">Audits</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              43 Reviews
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              100% Voting Weight
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Joined May 2025
            </span>
          </div>
        </div>
      </section>

      {/* Hero Influence Curve (fomo IMG_6341 exact layout) */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-white font-['Outfit'] tabular-nums">
              8,420
              <span className="text-xl text-slate-500 font-semibold">.00</span>
            </div>
            <div className="text-xs font-semibold text-[#00E676] font-mono tabular-nums mt-0.5">
              {series.delta} <span className="text-slate-400 font-sans font-normal">Influence</span>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            {(['24h', '7d', '30d', 'All'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setTimeframe(tf);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-white/[0.12] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl chart-dot-grid border border-white/[0.05] bg-[#0B0D13] px-3 pt-4 pb-2 overflow-hidden">
          <Sparkline
            data={series.data}
            width={560}
            height={110}
            color="#00E676"
            strokeWidth={2.5}
            showGradient={true}
            showDot={true}
            responsive={true}
          />
        </div>
      </section>

      {/* Single Elevated Voting Power Strip (fomo "Cash balance" strip) */}
      <div className="surface-card rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[#00E676] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Civic Voting Power</div>
            <div className="text-lg font-bold text-white font-['Outfit'] tabular-nums">
              {isVerified ? '100% Strength' : '25% Unverified'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            onOpenVerification();
          }}
          className="min-h-[40px] px-3.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-xs font-semibold text-white whitespace-nowrap"
        >
          {isVerified ? 'Manage ZK' : 'Verify Now'}
        </button>
      </div>

      {/* Activity & Account Records */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-white font-['Outfit']">
            Citizen Records
          </h2>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            {(['all', 'officials', 'agencies'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setActivityTab(tab);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  activityTab === tab ? 'bg-white/[0.12] text-white' : 'text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
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
                        <div className="text-xs text-slate-400 truncate">
                          {isOfficialItem ? item.role : item.name}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#00E676] tabular-nums shrink-0">
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
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-slate-300 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{row.label}</div>
                      <div className="text-xs text-slate-400 truncate">{row.meta}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
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
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md bg-[#0C0F17] border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
                <h3 className="text-sm font-bold text-white font-['Outfit']">
                  {activeDrawer === 'ratings'
                    ? 'Your Votes & Audits'
                    : activeDrawer === 'watchlist'
                    ? 'Tracked Watchlist'
                    : activeDrawer === 'ledger'
                    ? 'Immutable ZK Voting Ledger'
                    : 'Zero-Knowledge Privacy & FAQ'}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(null)}
                  aria-label="Close drawer"
                  className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto no-scrollbar space-y-3">
                {activeDrawer === 'ratings' && (
                  <>
                    {ratedOfficials.length === 0 && ratedAgencies.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">
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
                              <div className="text-xs text-slate-400">{o.role}</div>
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                o.userVote === 'up' ? 'text-[#00E676]' : 'text-red-400'
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
                              <div className="text-xs text-slate-400">{a.name}</div>
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                a.userVote === 'up' ? 'text-[#00E676]' : 'text-red-400'
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
                            <div className="text-xs text-slate-400">{o.party} · {o.state}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#00E676] tabular-nums">
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
                          <span className="font-mono text-[#00E676]">{tx.hash}</span>
                          <span className="text-slate-400">{tx.time}</span>
                        </div>
                        <div className="text-slate-200 font-medium">{tx.action}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDrawer === 'faq' && (
                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
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
