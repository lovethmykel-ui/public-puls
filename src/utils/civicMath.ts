import type { Agency, ForumPost, Official, Review } from '../types';

export interface VoteableEntity {
  trustIndex: number;
  upvotesCount: number;
  downvotesCount: number;
  ratingsCount: number;
  userVote?: 'up' | 'down' | null;
  recentReviews: Review[];
}

export function applyEntityVote<T extends VoteableEntity>(
  entity: T,
  direction: 'up' | 'down'
): T {
  const currentVote = entity.userVote ?? null;
  let upvotes = entity.upvotesCount;
  let downvotes = entity.downvotesCount;
  let newVote: 'up' | 'down' | null = direction;

  if (currentVote === direction) {
    newVote = null;
    if (direction === 'up') {
      upvotes = Math.max(0, upvotes - 1);
    } else {
      downvotes = Math.max(0, downvotes - 1);
    }
  } else {
    if (currentVote === 'up') upvotes = Math.max(0, upvotes - 1);
    if (currentVote === 'down') downvotes = Math.max(0, downvotes - 1);
    if (direction === 'up') upvotes += 1;
    else downvotes += 1;
  }

  const totalVotes = upvotes + downvotes;
  const computedTrust =
    totalVotes > 0 ? Math.min(99.9, Math.max(1, (upvotes / totalVotes) * 100)) : entity.trustIndex;

  return {
    ...entity,
    userVote: newVote,
    upvotesCount: upvotes,
    downvotesCount: downvotes,
    trustIndex: Number(computedTrust.toFixed(1)),
  };
}

export interface AuditRatingInput {
  overallScore: number;
  comment: string;
  isAnonymous: boolean;
}

export function applyAuditRating<T extends VoteableEntity>(
  entity: T,
  input: AuditRatingInput
): T {
  const clampedScore = Math.min(100, Math.max(0, input.overallScore));
  const currentCount = Math.max(1, entity.ratingsCount);
  const nextCount = currentCount + 1;
  // Weighted update so a single citizen rating visibly nudges the index realistically
  const weight = Math.max(0.02, Math.min(0.08, 150 / nextCount));
  const nextTrust = entity.trustIndex * (1 - weight) + clampedScore * weight;

  const stars = Math.min(5, Math.max(1, Math.round(clampedScore / 20)));
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    author: input.isAnonymous ? 'Verified Citizen (ZK)' : 'Amara Uche',
    state: 'Lagos State',
    rating: stars,
    comment:
      input.comment.trim() ||
      `Submitted ${clampedScore}/100 multi-pillar civic audit score.`,
    timeAgo: 'Just now',
    isVerified: true,
    upvotes: 1,
  };

  return {
    ...entity,
    trustIndex: Number(nextTrust.toFixed(1)),
    ratingsCount: nextCount,
    upvotesCount: clampedScore >= 50 ? entity.upvotesCount + 1 : entity.upvotesCount,
    downvotesCount: clampedScore < 50 ? entity.downvotesCount + 1 : entity.downvotesCount,
    recentReviews: [newReview, ...entity.recentReviews],
  };
}

export type OfficialFilter = 'all' | 'executive' | 'governors' | 'ministers' | 'agencies';

export function filterOfficials(
  officials: Official[],
  filter: OfficialFilter,
  query: string
): Official[] {
  const q = query.trim().toLowerCase();

  return officials.filter((official) => {
    if (filter === 'agencies') return false;
    if (filter === 'executive' && official.category !== 'executive') return false;
    if (filter === 'governors' && official.category !== 'governor') return false;
    if (filter === 'ministers' && official.category !== 'minister') return false;

    if (q.length > 0) {
      return (
        official.name.toLowerCase().includes(q) ||
        official.role.toLowerCase().includes(q) ||
        official.state.toLowerCase().includes(q) ||
        official.party.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export function filterAgencies(agencies: Agency[], query: string): Agency[] {
  const q = query.trim().toLowerCase();
  if (!q) return agencies;

  return agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(q) ||
      agency.acronym.toLowerCase().includes(q) ||
      agency.sector.toLowerCase().includes(q) ||
      agency.head.toLowerCase().includes(q)
  );
}

export type ForumFeedFilter = 'trending' | 'latest' | 'uprated' | 'downrated';

const TAG_KEYWORDS: Record<string, string[]> = {
  '#PassportReform': ['passport', 'tunji-ojo', 'interior'],
  '#AbaPowerGrid': ['aba', 'geometric', 'power', 'alex otti'],
  '#RefineryCrude': ['crude', 'refiner', 'nnpcl', 'fuel', 'naira'],
  '#PoliceAccountability': ['police', 'npf', 'highway', 'patrol', 'security'],
  '#NELFUND': ['student loan', 'nelfund', 'ibadan', 'tinubu'],
};

export function filterForumPosts(
  posts: ForumPost[],
  activeFilter: ForumFeedFilter,
  searchTag: string
): ForumPost[] {
  const filtered = posts.filter((post) => {
    if (activeFilter === 'uprated' && post.taggedEntity?.voteAction !== 'uprated') {
      return false;
    }
    if (activeFilter === 'downrated' && post.taggedEntity?.voteAction !== 'downrated') {
      return false;
    }

    if (searchTag !== 'all') {
      const keywords = TAG_KEYWORDS[searchTag] || [searchTag.replace('#', '').toLowerCase()];
      const haystack = `${post.content} ${post.taggedEntity?.name || ''} ${post.state}`.toLowerCase();
      return keywords.some((kw) => haystack.includes(kw));
    }

    return true;
  });

  if (activeFilter === 'trending') {
    return [...filtered].sort((a, b) => b.upvotes + b.repliesCount * 5 - (a.upvotes + a.repliesCount * 5));
  }

  return filtered;
}
