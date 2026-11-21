import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { Button } from 'glisse';
import type { NavTab, Official, Agency, ForumPost, ForumReply } from './types';
import { OFFICIALS, AGENCIES, FORUM_POSTS } from './data/mockData';
import {
  applyAuditRating,
  applyEntityVote,
  type AuditRatingInput,
} from './utils/civicMath';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ForumView } from './components/ForumView';
import { OfficialsView } from './components/OfficialsView';
import { ElectionsView } from './components/ElectionsView';
import { ProfileView } from './components/ProfileView';
import { PoliticianModal } from './components/PoliticianModal';
import { AgencyModal } from './components/AgencyModal';
import { VerificationModal } from './components/VerificationModal';
import { RateModal, type RateTarget } from './components/RateModal';
import { DeviceFrame } from './components/DeviceFrame';
import { initTelegramApp } from './utils/telegram';

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'EFCC Trust Index surged +12.4%',
    detail: 'Institutional enforcement rating reached 87.6/100 across 22.4K audits.',
    time: '18m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Anambra 2025 Polling Update',
    detail: 'Confidence model updated with 1,420 new verified citizen entries.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Zero-Knowledge Credential Active',
    detail: 'Your 100% voting weight is verified for Lagos State · Ikeja Ward 05.',
    time: '1d ago',
    unread: true,
  },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [officials, setOfficials] = useState<Official[]>(OFFICIALS);
  const [agencies, setAgencies] = useState<Agency[]>(AGENCIES);
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [selectedOfficialId, setSelectedOfficialId] = useState<string | null>(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [indexSearchQuery, setIndexSearchQuery] = useState('');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [rateTarget, setRateTarget] = useState<RateTarget | null>(null);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    initTelegramApp();
  }, []);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNotificationsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNotificationsOpen]);

  const selectedOfficial = officials.find((o) => o.id === selectedOfficialId) || null;
  const selectedAgency = agencies.find((a) => a.id === selectedAgencyId) || null;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleVoteOfficial = (officialId: string, direction: 'up' | 'down') => {
    setOfficials((prev) =>
      prev.map((o) => (o.id === officialId ? applyEntityVote(o, direction) : o))
    );
  };

  const handleVoteAgency = (agencyId: string, direction: 'up' | 'down') => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? applyEntityVote(a, direction) : a))
    );
  };

  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.userVote === direction) {
          return {
            ...p,
            userVote: undefined,
            upvotes: direction === 'up' ? p.upvotes - 1 : p.upvotes,
            downvotes: direction === 'down' ? p.downvotes - 1 : p.downvotes,
          };
        }
        const wasUp = p.userVote === 'up';
        const wasDown = p.userVote === 'down';
        return {
          ...p,
          userVote: direction,
          upvotes: direction === 'up' ? p.upvotes + 1 : wasUp ? p.upvotes - 1 : p.upvotes,
          downvotes: direction === 'down' ? p.downvotes + 1 : wasDown ? p.downvotes - 1 : p.downvotes,
        };
      })
    );
  };

  const handleCreatePost = (newPost: ForumPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleAddReply = (postId: string, reply: ForumReply) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              repliesCount: p.repliesCount + 1,
              replies: [...p.replies, reply],
            }
          : p
      )
    );
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitAuditRating = (target: RateTarget, data: AuditRatingInput) => {
    if (target.type === 'official') {
      setOfficials((prev) =>
        prev.map((o) => (o.id === target.id ? applyAuditRating(o, data) : o))
      );
    } else {
      setAgencies((prev) =>
        prev.map((a) => (a.id === target.id ? applyAuditRating(a, data) : a))
      );
    }
  };

  const handleRateOfficial = (official: Official) => {
    setSelectedOfficialId(null);
    setRateTarget({
      id: official.id,
      name: official.name,
      role: official.role,
      type: 'official',
    });
  };

  const handleRateAgency = (agency: Agency) => {
    setSelectedAgencyId(null);
    setRateTarget({
      id: agency.id,
      name: agency.name,
      role: agency.headTitle,
      type: 'agency',
    });
  };

  return (
    <DeviceFrame activeTab={activeTab}>
      <div className="flex-1 flex flex-col relative w-full min-h-full">
        <Header
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          officials={officials}
          agencies={agencies}
          onSelectOfficial={(official) => setSelectedOfficialId(official.id)}
          onSelectAgency={(agency) => setSelectedAgencyId(agency.id)}
          onSubmitSearchToIndex={(q) => {
            setIndexSearchQuery(q);
            setActiveTab('officials');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isVerified={isVerified}
          unreadCount={unreadCount}
          onOpenVerification={() => setIsVerificationOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 w-full relative pt-14 sm:pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 'home' && (
                <HomeView
                  officials={officials}
                  onVoteOfficial={handleVoteOfficial}
                  onSelectOfficial={(official) => setSelectedOfficialId(official.id)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenVerification={() => setIsVerificationOpen(true)}
                />
              )}

              {activeTab === 'forum' && (
                <ForumView
                  posts={posts}
                  onVotePost={handleVotePost}
                  onCreatePost={handleCreatePost}
                  onAddReply={handleAddReply}
                />
              )}

              {activeTab === 'officials' && (
                <OfficialsView
                  officials={officials}
                  agencies={agencies}
                  searchQuery={indexSearchQuery}
                  onSearchQueryChange={setIndexSearchQuery}
                  onVoteOfficial={handleVoteOfficial}
                  onVoteAgency={handleVoteAgency}
                  onSelectOfficial={(official) => setSelectedOfficialId(official.id)}
                  onSelectAgency={(agency) => setSelectedAgencyId(agency.id)}
                  onOpenRateModal={(target) => {
                    const matchedOff = officials.find((o) => o.name === target.name);
                    const matchedAg = agencies.find((a) => a.name === target.name);
                    setRateTarget({
                      id: matchedOff?.id || matchedAg?.id || '',
                      ...target,
                    });
                  }}
                />
              )}

              {activeTab === 'elections' && <ElectionsView />}

              {activeTab === 'profile' && (
                <ProfileView
                  isVerified={isVerified}
                  officials={officials}
                  agencies={agencies}
                  bookmarkedIds={bookmarkedIds}
                  onOpenVerification={() => setIsVerificationOpen(true)}
                  onSelectOfficial={(official) => setSelectedOfficialId(official.id)}
                  onSelectAgency={(agency) => setSelectedAgencyId(agency.id)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Navigation
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Entity & Action Modals */}
        <PoliticianModal
          official={selectedOfficial}
          isBookmarked={selectedOfficial ? bookmarkedIds.includes(selectedOfficial.id) : false}
          onToggleBookmark={handleToggleBookmark}
          onVote={handleVoteOfficial}
          onClose={() => setSelectedOfficialId(null)}
          onRate={handleRateOfficial}
        />

        <AgencyModal
          agency={selectedAgency}
          isBookmarked={selectedAgency ? bookmarkedIds.includes(selectedAgency.id) : false}
          onToggleBookmark={handleToggleBookmark}
          onClose={() => setSelectedAgencyId(null)}
          onRate={handleRateAgency}
        />

        <VerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          onComplete={() => setIsVerified(true)}
        />

        <RateModal
          isOpen={rateTarget !== null}
          target={rateTarget}
          onClose={() => setRateTarget(null)}
          onSubmitRating={handleSubmitAuditRating}
        />

        {/* Notifications Drawer */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
              <div
                className="absolute inset-0"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="notifications-title"
                initial={{ y: '100%', opacity: 0.8 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden"
              >
                <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#E5E5E5]" />
                    <h3
                      id="notifications-title"
                      className="text-sm font-bold text-white font-['Outfit']"
                    >
                      Civic Alerts
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                        }
                        className="text-xs font-semibold text-neutral-200 hover:text-white hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-[#E5E5E5]" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    <Button
                      type="button"
                      variant="glass"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => setIsNotificationsOpen(false)}
                      aria-label="Close notifications"
                      className="!h-9 !w-9"
                    />
                  </div>
                </div>

                <div className="divide-y divide-white/[0.06] overflow-y-auto no-scrollbar">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                        )
                      }
                      className="w-full px-5 py-4 text-left hover:bg-white/[0.03] transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <p className="text-xs text-neutral-400 leading-relaxed">{item.detail}</p>
                        <span className="text-[11px] text-neutral-500 block">{item.time}</span>
                      </div>
                      {item.unread && (
                        <span
                          aria-label="Unread"
                          className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DeviceFrame>
  );
};

export default App;
