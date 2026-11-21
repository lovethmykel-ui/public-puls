import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  Share2,
  ShieldCheck,
  Send,
  Plus,
  Lock,
  X,
  AtSign,
  Bookmark,
  Pin,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, SegmentedControl, Switch } from 'glisse';
import { OFFICIALS, AGENCIES, AI_DAILY_BRIEF } from '../data/mockData';
import type { ForumPost, ForumReply } from '../types';
import { filterForumPosts, type ForumFeedFilter } from '../utils/civicMath';
import { triggerHaptic } from '../utils/telegram';

interface ForumViewProps {
  posts: ForumPost[];
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onCreatePost: (post: ForumPost) => void;
  onAddReply: (postId: string, reply: ForumReply) => void;
}

const FEED_TABS = [
  { value: 'trending', label: 'Trending' },
  { value: 'latest', label: 'Latest' },
  { value: 'uprated', label: 'Uprated' },
  { value: 'downrated', label: 'Downrated' },
];

const TOPICS = [
  { id: 'all', label: 'All Topics' },
  { id: '#PassportReform', label: '#PassportReform' },
  { id: '#AbaPowerGrid', label: '#AbaPowerGrid' },
  { id: '#RefineryCrude', label: '#RefineryCrude' },
  { id: '#PoliceAccountability', label: '#PoliceAccountability' },
  { id: '#NELFUND', label: '#NELFUND' },
];

export const ForumView: React.FC<ForumViewProps> = ({
  posts,
  onVotePost,
  onCreatePost,
  onAddReply,
}) => {
  const [activeFilter, setActiveFilter] = useState<ForumFeedFilter>('trending');
  const [searchTag, setSearchTag] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [briefExpanded, setBriefExpanded] = useState(false);

  // Compose modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('tunji-ojo');
  const [voteAction, setVoteAction] = useState<'uprated' | 'downrated'>('uprated');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorState, setAuthorState] = useState('Lagos State');

  // Threaded replies modal state
  const [activeThreadPostId, setActiveThreadPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (!isComposeOpen && !activeThreadPostId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsComposeOpen(false);
        setActiveThreadPostId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isComposeOpen, activeThreadPostId]);

  const activeThreadPost = posts.find((p) => p.id === activeThreadPostId) || null;
  const filteredPosts = filterForumPosts(posts, activeFilter, searchTag);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    triggerHaptic('medium');

    const selectedOfficial = OFFICIALS.find((o) => o.id === selectedEntityId);
    const selectedAgency = AGENCIES.find((a) => a.id === selectedEntityId);

    let taggedEntity: ForumPost['taggedEntity'];
    if (selectedOfficial) {
      taggedEntity = {
        name: selectedOfficial.name,
        role: selectedOfficial.role,
        type: 'official',
        voteAction,
      };
    } else if (selectedAgency) {
      taggedEntity = {
        name: selectedAgency.name,
        role: selectedAgency.sector,
        type: 'agency',
        voteAction,
      };
    }

    const created: ForumPost = {
      id: `post-${crypto.randomUUID()}`,
      author: isAnonymous ? 'Anonymous Citizen' : 'Amara Uche',
      handle: isAnonymous ? '@zk_citizen' : '@amara_ng',
      isVerified: true,
      state: authorState,
      timestamp: 'Just now',
      content: newContent.trim(),
      taggedEntity,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      repliesCount: 0,
      sharesCount: 0,
      replies: [],
    };

    onCreatePost(created);
    setNewContent('');
    setIsComposeOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThreadPost) return;

    triggerHaptic('medium');

    const newReply: ForumReply = {
      id: `rep-${crypto.randomUUID()}`,
      author: 'Amara Uche',
      handle: '@amara_ng',
      isVerified: true,
      state: 'Lagos State',
      timestamp: 'Just now',
      content: replyContent.trim(),
      upvotes: 1,
      hasUpvoted: true,
    };

    onAddReply(activeThreadPost.id, newReply);
    setReplyContent('');
  };

  const handleSharePost = (post: ForumPost) => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator
        .share({
          title: `PublicPulse: ${post.author}`,
          text: post.content,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(post.content).catch(() => {});
      setCopiedId(post.id);
      setTimeout(() => setCopiedId((prev) => (prev === post.id ? null : prev)), 1800);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="px-4 sm:px-6 pt-4 pb-28 md:pb-12 max-w-3xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Outfit']">
            The People&apos;s Voice
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Uncensored civic ledger · Zero-Knowledge signed
          </p>
        </div>

        <Button
          type="button"
          variant="filled"
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          onClick={() => {
            triggerHaptic('medium');
            setIsComposeOpen(true);
          }}
          className="!h-10 !px-4 !text-xs shrink-0"
        >
          Speak Up
        </Button>
      </div>

      {/* Liquid Glass Feed Segmented Control */}
      <div className="overflow-x-auto no-scrollbar">
        <SegmentedControl
          aria-label="Forum feed filter"
          items={FEED_TABS}
          value={activeFilter}
          onValueChange={(value) => {
            triggerHaptic('selection');
            setActiveFilter(value as ForumFeedFilter);
          }}
          className="lg-segmented-4"
        />
      </div>

      {/* Topic Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setSearchTag(topic.id);
            }}
            className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              searchTag === topic.id
                ? 'bg-white text-black'
                : 'bg-white/[0.05] text-neutral-400 hover:text-white'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Pinned Recap Card */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">PublicPulse</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5E5E5]" />
            <span>· {AI_DAILY_BRIEF.date}</span>
          </div>
          <span className="flex items-center gap-1 text-neutral-400">
            <Pin className="w-3 h-3 text-[#E5E5E5]" />
            <span>Pinned</span>
          </span>
        </div>

        <div className="surface-card rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-bold text-white font-['Outfit']">
            Recap: {AI_DAILY_BRIEF.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            · {AI_DAILY_BRIEF.summary}
          </p>
          {briefExpanded && (
            <ul className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              {AI_DAILY_BRIEF.bulletPoints.map((b, i) => (
                <li key={i} className="text-xs text-neutral-400 leading-relaxed">
                  · {b}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setBriefExpanded((v) => !v)}
            className="text-xs font-semibold text-neutral-200 hover:text-white hover:underline pt-0.5"
          >
            {briefExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>

      {/* Clean Hairline-Separated Feed List */}
      {filteredPosts.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-white">No posts match this filter</p>
          <div className="flex justify-center">
            <Button
              type="button"
              variant="glass"
              onClick={() => {
                setActiveFilter('trending');
                setSearchTag('all');
              }}
              className="!h-9 !px-4 !text-xs"
            >
              Show All Posts
            </Button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {filteredPosts.map((post) => {
            const isSaved = Boolean(bookmarkedIds[post.id]);
            const isCopied = copiedId === post.id;

            return (
              <article key={post.id} className="py-4 space-y-2.5">
                {/* Author Line */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/[0.1] flex items-center justify-center text-xs font-bold text-neutral-200 shrink-0">
                      {getInitials(post.author)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white">{post.author}</span>
                        {post.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#E5E5E5] shrink-0" />
                        )}
                        <span className="text-xs text-neutral-400 font-mono">{post.handle}</span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        {post.state} · {post.timestamp}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Tagged Action Line */}
                {post.taggedEntity && (
                  <div className="pl-[52px]">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        post.taggedEntity.voteAction === 'uprated'
                          ? 'bg-white/[0.1] border-white/[0.16] text-white'
                          : post.taggedEntity.voteAction === 'downrated'
                          ? 'bg-white/[0.04] border-white/[0.08] text-neutral-300'
                          : 'bg-white/[0.06] border-white/[0.1] text-neutral-200'
                      }`}
                    >
                      {post.taggedEntity.voteAction === 'uprated'
                        ? 'Uprated'
                        : post.taggedEntity.voteAction === 'downrated'
                        ? 'Downrated'
                        : 'Audited'}{' '}
                      @{post.taggedEntity.name}
                    </span>
                  </div>
                )}

                {/* Body Content */}
                <p className="pl-[52px] text-sm text-neutral-200 leading-relaxed">{post.content}</p>

                {/* Clean Action Bar */}
                <div className="pl-[52px] flex items-center justify-between pt-1 text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onVotePost(post.id, 'up')}
                      aria-pressed={post.userVote === 'up'}
                      className={`min-h-[36px] px-2.5 rounded-full flex items-center gap-1 transition-colors border ${
                        post.userVote === 'up'
                          ? 'bg-white/[0.14] border-white/25 text-white font-bold'
                          : 'border-transparent hover:bg-white/[0.05] hover:text-white'
                      }`}
                      aria-label={`Uprate post by ${post.author}`}
                    >
                      <ArrowBigUp
                        className={`w-4 h-4 text-[#E5E5E5] ${post.userVote === 'up' ? 'fill-[#E5E5E5]' : ''}`}
                      />
                      <span className="font-mono tabular-nums">{post.upvotes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onVotePost(post.id, 'down')}
                      aria-pressed={post.userVote === 'down'}
                      className={`min-h-[36px] px-2 rounded-full flex items-center gap-1 transition-colors border ${
                        post.userVote === 'down'
                          ? 'bg-white/[0.12] border-white/25 text-white font-bold'
                          : 'border-transparent hover:bg-white/[0.05] hover:text-white'
                      }`}
                      aria-label={`Downrate post by ${post.author}`}
                    >
                      <ArrowBigDown
                        className={`w-4 h-4 text-[#E5E5E5] ${post.userVote === 'down' ? 'fill-[#E5E5E5]' : ''}`}
                      />
                      {post.downvotes > 0 && (
                        <span className="font-mono tabular-nums">{post.downvotes}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setActiveThreadPostId(post.id);
                      }}
                      className="min-h-[36px] px-2.5 rounded-full flex items-center gap-1.5 hover:bg-white/[0.05] hover:text-white transition-colors"
                      aria-label={`Open ${post.repliesCount} replies`}
                    >
                      <MessageSquare className="w-4 h-4 text-[#E5E5E5]" />
                      <span className="font-mono tabular-nums">{post.repliesCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSharePost(post)}
                      className="min-h-[36px] px-2.5 rounded-full flex items-center gap-1 hover:bg-white/[0.05] hover:text-white transition-colors"
                      aria-label="Share post"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-[#E5E5E5]" />
                      ) : (
                        <Share2 className="w-4 h-4 text-[#E5E5E5]" />
                      )}
                      <span className="font-mono tabular-nums">
                        {isCopied ? 'Copied' : post.sharesCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setBookmarkedIds((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                      }}
                      aria-pressed={isSaved}
                      className={`min-h-[36px] min-w-[36px] rounded-full flex items-center justify-center transition-colors border ${
                        isSaved
                          ? 'bg-white/[0.12] border-white/25'
                          : 'border-transparent hover:bg-white/[0.05]'
                      }`}
                      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark post'}
                    >
                      <Bookmark
                        className={`w-4 h-4 text-[#E5E5E5] ${isSaved ? 'fill-[#E5E5E5]' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* COMPOSE POST MODAL */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsComposeOpen(false)} />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="compose-modal-title"
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
                <h3
                  id="compose-modal-title"
                  className="text-sm font-bold text-white font-['Outfit']"
                >
                  Publish Civic Statement
                </h3>
                <Button
                  type="button"
                  variant="glass"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => setIsComposeOpen(false)}
                  aria-label="Close composer"
                  className="!h-9 !w-9"
                />
              </div>

              <form onSubmit={handleSubmitPost} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
                <div className="space-y-1.5">
                  <label
                    htmlFor="tag-entity-select"
                    className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5"
                  >
                    <AtSign className="w-3.5 h-3.5 text-[#E5E5E5]" />
                    <span>Tag Official or Agency</span>
                  </label>
                  <select
                    id="tag-entity-select"
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <optgroup label="Public Officials">
                      {OFFICIALS.map((o) => (
                        <option key={o.id} value={o.id} className="bg-[#141414]">
                          {o.name} ({o.role})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Agencies & Commissions">
                      {AGENCIES.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#141414]">
                          {a.acronym} — {a.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setVoteAction('uprated');
                    }}
                    className={`min-h-[44px] py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                      voteAction === 'uprated'
                        ? 'bg-white/[0.14] text-white border-white/30'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    <ArrowBigUp className="w-4 h-4 text-[#E5E5E5] fill-[#E5E5E5]" />
                    <span>Uprate (+1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setVoteAction('downrated');
                    }}
                    className={`min-h-[44px] py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                      voteAction === 'downrated'
                        ? 'bg-white/[0.14] text-white border-white/30'
                        : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/[0.06]'
                    }`}
                  >
                    <ArrowBigDown className="w-4 h-4 text-[#E5E5E5] fill-[#E5E5E5]" />
                    <span>Downrate (-1)</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label htmlFor="post-body-input" className="sr-only">
                    Statement content
                  </label>
                  <textarea
                    id="post-body-input"
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share on-the-ground reality, policy feedback, or evidence..."
                    maxLength={320}
                    className="w-full p-3.5 rounded-2xl bg-[#141414] border border-white/[0.1] text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 font-mono tabular-nums">
                    <span>Zero-Knowledge Signed</span>
                    <span>{newContent.length}/320</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="state-select" className="text-xs font-semibold text-neutral-300">
                    Constituency
                  </label>
                  <select
                    id="state-select"
                    value={authorState}
                    onChange={(e) => setAuthorState(e.target.value)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#141414] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <option value="Lagos State">Lagos State</option>
                    <option value="FCT Abuja">FCT Abuja</option>
                    <option value="Abia State">Abia State</option>
                    <option value="Anambra State">Anambra State</option>
                    <option value="Kano State">Kano State</option>
                    <option value="Rivers State">Rivers State</option>
                    <option value="Oyo State">Oyo State</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl surface-card">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#E5E5E5]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Post Anonymously</span>
                      <span className="text-[11px] text-neutral-400">Unlinks phone and handle</span>
                    </div>
                  </div>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      triggerHaptic('selection');
                      setIsAnonymous(checked);
                    }}
                    aria-label="Post anonymously"
                  />
                </div>

                <Button
                  type="submit"
                  variant="filled"
                  icon={<Send className="w-4 h-4" />}
                  disabled={!newContent.trim()}
                  className="w-full !h-12 !text-sm"
                >
                  Publish to Ledger
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* THREADED REPLIES MODAL */}
      <AnimatePresence>
        {activeThreadPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setActiveThreadPostId(null)} />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="thread-modal-title"
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md glass-sheet border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
                <h3
                  id="thread-modal-title"
                  className="text-sm font-bold text-white font-['Outfit']"
                >
                  Thread Replies
                </h3>
                <Button
                  type="button"
                  variant="glass"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => setActiveThreadPostId(null)}
                  aria-label="Close thread"
                  className="!h-9 !w-9"
                />
              </div>

              <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
                <div className="surface-card rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">{activeThreadPost.author}</span>
                    <span className="text-neutral-400 font-mono">{activeThreadPost.handle}</span>
                    <span className="text-neutral-400">· {activeThreadPost.timestamp}</span>
                  </div>
                  <p className="text-sm text-neutral-200 leading-relaxed">{activeThreadPost.content}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-semibold text-neutral-400 block">
                    Replies ({activeThreadPost.replies.length})
                  </span>

                  {activeThreadPost.replies.length === 0 ? (
                    <div className="text-center py-6 text-neutral-400 text-xs">
                      No replies yet. Start the discussion below.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                      {activeThreadPost.replies.map((reply) => (
                        <div key={reply.id} className="py-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{reply.author}</span>
                              {reply.isVerified && (
                                <ShieldCheck className="w-3 h-3 text-[#E5E5E5]" />
                              )}
                              <span className="text-neutral-400">· {reply.state}</span>
                            </div>
                            <span className="text-neutral-400">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <form
                onSubmit={handleSendReply}
                className="p-4 border-t border-white/[0.08] bg-[#101010]/90 flex gap-2 items-center"
              >
                <label htmlFor="reply-input" className="sr-only">
                  Reply to thread
                </label>
                <input
                  id="reply-input"
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write an anonymous reply..."
                  className="flex-1 min-h-[42px] px-4 py-2 rounded-full bg-[#161616] border border-white/[0.1] text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
                />
                <Button
                  type="submit"
                  variant="filled"
                  icon={<Send className="w-4 h-4" />}
                  disabled={!replyContent.trim()}
                  aria-label="Send reply"
                  className="!h-10 !w-10 shrink-0"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
