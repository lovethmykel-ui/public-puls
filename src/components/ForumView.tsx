import React, { useState } from 'react';
import { 
  MessageSquare, 
  ArrowBigUp, 
  ArrowBigDown, 
  Share2, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Lock, 
  X,
  AtSign,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FORUM_POSTS, OFFICIALS, AGENCIES } from '../data/mockData';
import type { ForumPost, ForumReply } from '../types';
import { triggerHaptic } from '../utils/telegram';

export const ForumView: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'latest' | 'uprated' | 'downrated'>('trending');
  const [searchTag, setSearchTag] = useState<string>('all');
  
  // Compose modal state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('tunji-ojo');
  const [voteAction, setVoteAction] = useState<'uprated' | 'downrated' | 'neutral'>('uprated');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorState, setAuthorState] = useState('Lagos State');

  // Threaded replies modal state
  const [activeThreadPost, setActiveThreadPost] = useState<ForumPost | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const trendingTags = ['all', '#NoCensorship', '#PassportReform', '#AbaPowerGrid', '#RefineryCrude', '#PoliceAccountability', '#Anambra2025'];

  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    triggerHaptic('light');
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;

        if (p.userVote === direction) {
          // undo vote
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

  const handleCreatePost = (e: React.FormEvent) => {
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

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: isAnonymous ? `Anonymous Citizen #${Math.floor(1000 + Math.random() * 9000)}` : 'Amara Uche',
      handle: isAnonymous ? '@verified_citizen' : '@amara_ng',
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

    setPosts([newPost, ...posts]);
    setNewContent('');
    setIsComposeOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThreadPost) return;

    triggerHaptic('medium');

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: 'Amara Uche (Verified)',
      handle: '@amara_ng',
      isVerified: true,
      state: 'Lagos State',
      timestamp: 'Just now',
      content: replyContent.trim(),
      upvotes: 1,
      hasUpvoted: true,
    };

    const updatedPost = {
      ...activeThreadPost,
      repliesCount: activeThreadPost.repliesCount + 1,
      replies: [...activeThreadPost.replies, newReply],
    };

    setActiveThreadPost(updatedPost);
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    setReplyContent('');
  };

  // Filtered posts
  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'uprated') return p.taggedEntity?.voteAction === 'uprated';
    if (activeFilter === 'downrated') return p.taggedEntity?.voteAction === 'downrated';
    return true;
  });

  return (
    <div className="space-y-3.5 px-4 pb-28">
      {/* Header */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
              The People's Voice
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#00E676] border border-emerald-500/30">
              Uncensored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Decentralized civic square • Speak up & hold leaders accountable
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setIsComposeOpen(true);
          }}
          className="px-3.5 py-2 rounded-2xl bg-[#00E676] text-black text-xs font-bold shadow-lg shadow-[#00E676]/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Speak Up</span>
        </button>
      </div>

      {/* Trending Hashtag Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              triggerHaptic('selection');
              setSearchTag(tag);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
              searchTag === tag
                ? 'bg-white text-black font-bold'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Subtabs: Trending / Latest / Uprated / Downrated */}
      <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        {(['trending', 'latest', 'uprated', 'downrated'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              triggerHaptic('selection');
              setActiveFilter(tab);
            }}
            className={`flex-1 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeFilter === tab
                ? 'bg-white/[0.1] text-[#00E676] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feed List (X.com / Twitter Style) */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-3xl glass-panel p-4 border border-white/[0.08] hover:border-white/[0.14] transition-all"
          >
            {/* Author Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                {post.avatar ? (
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white tracking-tight">{post.author}</span>
                    {post.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />}
                    <span className="text-xs text-slate-400 font-mono">{post.handle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{post.state}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.04]">
                  Zero-Knowledge Signed
                </span>
              </div>
            </div>

            {/* Tagged Public Official / Agency Chip */}
            {post.taggedEntity && (
              <div className="mt-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                    post.taggedEntity.voteAction === 'uprated'
                      ? 'bg-emerald-500/15 text-[#00E676] border border-emerald-500/30'
                      : post.taggedEntity.voteAction === 'downrated'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {post.taggedEntity.voteAction === 'uprated' ? (
                    <ArrowBigUp className="w-3.5 h-3.5 fill-current" />
                  ) : post.taggedEntity.voteAction === 'downrated' ? (
                    <ArrowBigDown className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <AtSign className="w-3 h-3" />
                  )}
                  <span>
                    {post.taggedEntity.voteAction === 'uprated'
                      ? 'Uprated'
                      : post.taggedEntity.voteAction === 'downrated'
                      ? 'Downrated'
                      : 'Audited'}{' '}
                    @{post.taggedEntity.name}
                  </span>
                </span>
              </div>
            )}

            {/* Content Body */}
            <p className="text-sm text-slate-200 mt-2.5 leading-relaxed">
              {post.content}
            </p>

            {/* Interaction Footer Bar */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] text-xs text-slate-400">
              {/* Uprate & Downrate voting buttons */}
              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-1.5 py-0.5">
                <button
                  onClick={() => handleVotePost(post.id, 'up')}
                  className={`flex items-center gap-1 p-1 rounded-lg transition-colors ${
                    post.userVote === 'up'
                      ? 'text-[#00E676] font-bold'
                      : 'hover:text-[#00E676]'
                  }`}
                  aria-label="Uprate post"
                >
                  <ArrowBigUp className={`w-4 h-4 ${post.userVote === 'up' ? 'fill-current' : ''}`} />
                  <span className="font-mono text-xs">{post.upvotes}</span>
                </button>

                <div className="w-px h-3 bg-white/10 mx-0.5" />

                <button
                  onClick={() => handleVotePost(post.id, 'down')}
                  className={`flex items-center gap-1 p-1 rounded-lg transition-colors ${
                    post.userVote === 'down'
                      ? 'text-red-400 font-bold'
                      : 'hover:text-red-400'
                  }`}
                  aria-label="Downrate post"
                >
                  <ArrowBigDown className={`w-4 h-4 ${post.userVote === 'down' ? 'fill-current' : ''}`} />
                  {post.downvotes > 0 && <span className="font-mono text-xs">{post.downvotes}</span>}
                </button>
              </div>

              {/* Threaded Replies Button */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setActiveThreadPost(post);
                }}
                className="flex items-center gap-1.5 hover:text-[#00E676] transition-colors px-2 py-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="font-mono">{post.repliesCount}</span>
                <span className="hidden sm:inline">Replies</span>
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  if (navigator.share) {
                    navigator.share({
                      title: `PublicPulse: ${post.author} on @${post.taggedEntity?.name || 'PublicOffice'}`,
                      text: post.content,
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                className="flex items-center gap-1 hover:text-white transition-colors px-2 py-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-mono">{post.sharesCount}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => triggerHaptic('selection')}
                className="p-1 hover:text-[#00E676] transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* COMPOSE POST MODAL / DRAWER */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsComposeOpen(false)} />

            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md bg-[#0C0F17] border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                    Speak Truth to Power (Uncensored)
                  </span>
                </div>
                <button
                  onClick={() => setIsComposeOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
                {/* Tag an Official or Agency */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>Tag Public Office Holder or Agency:</span>
                  </label>
                  <select
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-panel bg-white/[0.04] border border-white/[0.1] text-xs text-white focus:outline-none"
                  >
                    <optgroup label="Public Officials">
                      {OFFICIALS.map((o) => (
                        <option key={o.id} value={o.id} className="bg-[#0C0F17]">
                          {o.name} ({o.role})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Agencies & Commissions">
                      {AGENCIES.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#0C0F17]">
                          {a.acronym} — {a.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Vote Action (Uprate vs Downrate) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 block">
                    Citizen Audit Action:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setVoteAction('uprated');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        voteAction === 'uprated'
                          ? 'bg-emerald-500/20 text-[#00E676] border border-emerald-500/40'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <ArrowBigUp className="w-4 h-4 fill-current" />
                      <span>Uprate (+1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setVoteAction('downrated');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        voteAction === 'downrated'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <ArrowBigDown className="w-4 h-4 fill-current" />
                      <span>Downrate (-1)</span>
                    </button>
                  </div>
                </div>

                {/* Post Content Textarea */}
                <div className="space-y-1">
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share on-the-ground reality, policy feedback, or evidence without fear..."
                    maxLength={320}
                    className="w-full p-3.5 rounded-2xl glass-panel bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Cryptographically shielded on the public ledger</span>
                    <span>{newContent.length}/320</span>
                  </div>
                </div>

                {/* State Tag */}
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Constituency State:</label>
                  <select
                    value={authorState}
                    onChange={(e) => setAuthorState(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white focus:outline-none"
                  >
                    <option value="Lagos State" className="bg-[#0C0F17]">Lagos State</option>
                    <option value="FCT Abuja" className="bg-[#0C0F17]">FCT Abuja</option>
                    <option value="Abia State" className="bg-[#0C0F17]">Abia State</option>
                    <option value="Anambra State" className="bg-[#0C0F17]">Anambra State</option>
                    <option value="Kano State" className="bg-[#0C0F17]">Kano State</option>
                    <option value="Rivers State" className="bg-[#0C0F17]">Rivers State</option>
                    <option value="Oyo State" className="bg-[#0C0F17]">Oyo State</option>
                  </select>
                </div>

                {/* Anonymity Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00E676]" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Post Anonymously</span>
                      <span className="text-[10px] text-slate-400">Completely unlinks your phone and SIM</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setIsAnonymous(!isAnonymous);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      isAnonymous ? 'bg-[#00E676]' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-black transition-transform ${
                        isAnonymous ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="w-full py-3.5 rounded-2xl bg-[#00E676] text-black font-bold text-sm tracking-wide shadow-xl shadow-[#00E676]/25 hover:bg-[#00c966] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Publish to Public Ledger</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* THREADED REPLIES MODAL (X.COM STYLE) */}
      <AnimatePresence>
        {activeThreadPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setActiveThreadPost(null)} />

            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative z-10 w-full max-w-md bg-[#0C0F17] border-t sm:border border-white/[0.12] sm:rounded-3xl rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
                <h3 className="text-sm font-bold text-white font-['Outfit']">Threaded Conversation</h3>
                <button
                  onClick={() => setActiveThreadPost(null)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thread Content */}
              <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
                {/* Parent Post */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{activeThreadPost.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{activeThreadPost.handle}</span>
                    <span className="text-[10px] text-slate-400">• {activeThreadPost.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{activeThreadPost.content}</p>
                </div>

                {/* Replies Line */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Citizen Replies ({activeThreadPost.replies.length})
                  </span>

                  {activeThreadPost.replies.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No replies yet. Be the first citizen to respond!
                    </div>
                  ) : (
                    activeThreadPost.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-3 rounded-2xl glass-panel border border-white/[0.05] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{reply.author}</span>
                            {reply.isVerified && <ShieldCheck className="w-3 h-3 text-[#00E676]" />}
                            <span className="text-[10px] text-slate-400">• {reply.state}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{reply.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-white/[0.08] bg-[#0C0F17]/90 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Reply anonymously to this thread..."
                  className="flex-1 px-4 py-2.5 rounded-2xl glass-panel bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00E676]"
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-[#00E676] text-black font-bold text-xs disabled:opacity-50 flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
