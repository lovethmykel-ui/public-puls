export type NavTab = 'home' | 'markets' | 'officials' | 'elections' | 'profile';

export interface Official {
  id: string;
  name: string;
  role: string;
  party: string;
  partyColor: string;
  category: 'executive' | 'governor' | 'minister' | 'legislative' | 'opposition';
  avatar: string;
  state: string;
  trustIndex: number; // e.g., 61.45
  change24h: number;   // e.g., +3.56
  change7d: number;
  ratingsCount: number;
  approval: {
    positive: number;
    neutral: number;
    negative: number;
  };
  radar: {
    economy: number;
    security: number;
    healthcare: number;
    education: number;
    infrastructure: number;
    integrity: number;
  };
  sparkline: number[];
  bio: string;
  assumedOffice: string;
  keyInitiatives: string[];
  recentReviews: Review[];
}

export interface Agency {
  id: string;
  name: string;
  acronym: string;
  head: string;
  headTitle: string;
  sector: string;
  category: 'security' | 'economy' | 'regulatory' | 'infrastructure' | 'social' | 'enforcement';
  logo: string;
  trustIndex: number;
  change24h: number;
  change7d: number;
  ratingsCount: number;
  metrics: {
    transparency: number;
    effectiveness: number;
    integrity: number;
    publicPerception: number;
  };
  approval: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sparkline: number[];
  description: string;
  recentReviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  state: string;
  rating: number; // 1 to 5
  comment: string;
  timeAgo: string;
  isVerified: boolean;
  upvotes: number;
}

export interface Candidate {
  name: string;
  party: string;
  partyColor: string;
  percentage: number;
  avatar: string;
  status?: string;
}

export interface Election {
  id: string;
  title: string;
  type: 'governorship' | 'presidential' | 'senatorial';
  dateStr: string;
  targetDate: string; // ISO string for live countdown
  location: string;
  status: 'upcoming' | 'ongoing' | 'past';
  leadingCandidate: string;
  confidence: number;
  candidates: Candidate[];
  overview: string;
}

export interface TrendingIssue {
  id: string;
  title: string;
  category: string;
  mentions: string;
  changePercent: number;
  sentiment: 'critical' | 'moderate' | 'positive';
  summary: string;
}

export interface StateSentiment {
  code: string;
  name: string;
  zone: 'North West' | 'North East' | 'North Central' | 'South West' | 'South South' | 'South East';
  sentimentScore: number; // 0 - 100
  governor: string;
  dominantParty: string;
  topIssue: string;
}
