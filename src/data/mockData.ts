import type { Official, Agency, Election, TrendingIssue, StateSentiment } from '../types';

export const NATIONAL_CONFIDENCE_INDEX = {
  score: 54.3,
  level: 'Moderate Confidence',
  changeWeekly: +6.4,
  direction: 'up' as const,
  lastUpdated: 'Today at 08:30 AM',
  sparkline: [42, 44, 46, 45, 48, 50, 49, 52, 51, 54.3],
};

export const PLATFORM_STATS = {
  verifiedCitizens: '1.25M+',
  agenciesTracked: 542,
  officialsRated: '18.4K',
  electionsTracked: 36,
  totalVotesCast: '3.82M',
  marketCapTrust: '₦12.48B',
  volume24h: '₦380.6M',
  sentimentBullish: 62,
  sentimentBearish: 38,
};

export const OFFICIALS: Official[] = [
  {
    id: 'tinubu',
    name: 'Bola Ahmed Tinubu',
    role: 'President, Federal Republic of Nigeria',
    party: 'APC',
    partyColor: '#10B981',
    category: 'executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    state: 'Lagos State',
    trustIndex: 61.45,
    change24h: +3.56,
    change7d: +3.95,
    ratingsCount: 18432,
    approval: { positive: 54, neutral: 25, negative: 21 },
    radar: {
      economy: 56.1,
      security: 50.2,
      healthcare: 45.3,
      education: 52.6,
      infrastructure: 68.4,
      integrity: 49.0
    },
    sparkline: [56.2, 57.0, 56.8, 58.4, 59.1, 60.3, 61.45],
    bio: '16th President of Nigeria. Leading the Renewed Hope agenda focused on monetary reforms, macroeconomic stabilization, and infrastructure development.',
    assumedOffice: 'May 29, 2023',
    keyInitiatives: [
      'National Fuel Subsidy Removal & FX Unification',
      'Lagos-Calabar Coastal Superhighway Project',
      'Nigerian Student Loan Fund (NELFUND)',
      'Consumer Credit Corporation (CrediCorp)'
    ],
    recentReviews: [
      {
        id: 'r1',
        author: 'Amina Yusuf',
        state: 'Lagos State',
        rating: 4,
        comment: 'The monetary stabilization is beginning to show stability in the FX market. Inflation remains high, but long-term structural reforms are visible.',
        timeAgo: '2h ago',
        isVerified: true,
        upvotes: 142
      },
      {
        id: 'r2',
        author: 'Chinedu Okafor',
        state: 'Enugu State',
        rating: 3,
        comment: 'Road infrastructure in the South East needs equal urgency to the coastal highway. The student loan rollout was commendable.',
        timeAgo: '5h ago',
        isVerified: true,
        upvotes: 89
      }
    ]
  },
  {
    id: 'peter-obi',
    name: 'Peter Gregory Obi',
    role: 'Labour Party Leader & Statesman',
    party: 'LP',
    partyColor: '#F97316',
    category: 'opposition',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    state: 'Anambra State',
    trustIndex: 72.10,
    change24h: +4.84,
    change7d: +6.12,
    ratingsCount: 24910,
    approval: { positive: 74, neutral: 16, negative: 10 },
    radar: {
      economy: 78.5,
      security: 68.2,
      healthcare: 74.0,
      education: 82.1,
      infrastructure: 71.5,
      integrity: 85.3
    },
    sparkline: [66.5, 67.8, 69.0, 68.7, 70.2, 71.3, 72.1],
    bio: 'Former Governor of Anambra State and 2023 Presidential candidate. Widely followed advocate for transitioning Nigeria from consumption to production and prudent fiscal governance.',
    assumedOffice: 'Active Opposition Leader',
    keyInitiatives: [
      'Consumption to Production National Philosophy',
      'Human Capital Development & Primary Health Advocacy',
      'Public Procurement Fiscal Auditing'
    ],
    recentReviews: [
      {
        id: 'po1',
        author: 'Emeka Okoro',
        state: 'Anambra State',
        rating: 5,
        comment: 'Unwavering consistency on fiscal discipline and data-driven governance. Continues to keep public leadership accountable.',
        timeAgo: '1h ago',
        isVerified: true,
        upvotes: 312
      }
    ]
  },
  {
    id: 'tunji-ojo',
    name: 'Dr. Olubunmi Tunji-Ojo',
    role: 'Minister of Interior',
    party: 'APC',
    partyColor: '#10B981',
    category: 'minister',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    state: 'Ondo State',
    trustIndex: 74.50,
    change24h: +5.30,
    change7d: +8.40,
    ratingsCount: 16820,
    approval: { positive: 78, neutral: 14, negative: 8 },
    radar: {
      economy: 65.0,
      security: 76.5,
      healthcare: 58.0,
      education: 60.0,
      infrastructure: 79.2,
      integrity: 81.4
    },
    sparkline: [64.0, 66.5, 68.0, 70.1, 71.8, 73.2, 74.5],
    bio: 'Minister of Interior widely praised for clearing over 200,000 international passport backlogs in weeks and automating digital civil registry workflows.',
    assumedOffice: 'August 21, 2023',
    keyInitiatives: [
      'Complete Digitalization of Nigerian Passport Application',
      'Automated E-Gates at International Airports',
      'Decongestion & Reform of Correctional Centers'
    ],
    recentReviews: [
      {
        id: 'to1',
        author: 'Tunde Bakare',
        state: 'Ogun State',
        rating: 5,
        comment: 'Renewed my international passport without giving a single dime to an agent. This is the definition of public sector innovation.',
        timeAgo: '3h ago',
        isVerified: true,
        upvotes: 215
      }
    ]
  },
  {
    id: 'alex-otti',
    name: 'Dr. Alex Otti',
    role: 'Executive Governor, Abia State',
    party: 'LP',
    partyColor: '#F97316',
    category: 'governor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    state: 'Abia State',
    trustIndex: 76.80,
    change24h: +3.80,
    change7d: +5.60,
    ratingsCount: 14320,
    approval: { positive: 81, neutral: 12, negative: 7 },
    radar: {
      economy: 82.0,
      security: 74.5,
      healthcare: 78.0,
      education: 75.0,
      infrastructure: 84.5,
      integrity: 86.0
    },
    sparkline: [69.2, 71.0, 72.8, 74.0, 75.3, 75.9, 76.8],
    bio: 'First-term Governor of Abia State. Economists and former bank CEO who commissioned the landmark Geometric Power plant in Aba and initiated city-wide urban reconstruction.',
    assumedOffice: 'May 29, 2023',
    keyInitiatives: [
      'Commissioning of Aba Ring-fenced Geometric Power Grid',
      'Massive Rehabilitation of Port Harcourt Road & Aba Roads',
      'Elimination of Pension Arrears for Retired Civil Servants'
    ],
    recentReviews: [
      {
        id: 'ao1',
        author: 'Ifeanyi Nwachukwu',
        state: 'Abia State',
        rating: 5,
        comment: 'Aba has 24/7 power in several commercial areas now thanks to Geometric. The commercial revival is genuine and felt on the ground.',
        timeAgo: '4h ago',
        isVerified: true,
        upvotes: 198
      }
    ]
  },
  {
    id: 'sanwo-olu',
    name: 'Babajide Olusola Sanwo-Olu',
    role: 'Executive Governor, Lagos State',
    party: 'APC',
    partyColor: '#10B981',
    category: 'governor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    state: 'Lagos State',
    trustIndex: 62.15,
    change24h: +1.60,
    change7d: +2.40,
    ratingsCount: 21800,
    approval: { positive: 61, neutral: 22, negative: 17 },
    radar: {
      economy: 72.0,
      security: 60.5,
      healthcare: 63.0,
      education: 64.0,
      infrastructure: 79.5,
      integrity: 56.0
    },
    sparkline: [58.4, 59.2, 60.1, 60.8, 61.2, 61.8, 62.15],
    bio: 'Governor of Lagos State championing the THEMES+ development agenda. Overseeing the operational launch of both the Lagos Blue Rail and Red Rail transit networks.',
    assumedOffice: 'May 29, 2019',
    keyInitiatives: [
      'Commercial Operations of Lagos Blue & Red Line Urban Rail',
      'Fourth Mainland Bridge Financing & Engineering Scaffolding',
      'Lekki Deep Sea Port Intermodal Corridor Integration'
    ],
    recentReviews: [
      {
        id: 'bs1',
        author: 'Fatima Bello',
        state: 'Lagos State',
        rating: 4,
        comment: 'Taking the Red Line train from Ikeja has shaved 2 hours off my daily commute. Public transportation is finally making real strides in Lagos.',
        timeAgo: '6h ago',
        isVerified: true,
        upvotes: 164
      }
    ]
  },
  {
    id: 'bosun-tijani',
    name: 'Dr. Bosun Tijani',
    role: 'Minister of Communications, Innovation & Digital Economy',
    party: 'Federal Cabinet',
    partyColor: '#3B82F6',
    category: 'minister',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    state: 'Ogun State',
    trustIndex: 68.40,
    change24h: +2.90,
    change7d: +4.10,
    ratingsCount: 11200,
    approval: { positive: 70, neutral: 18, negative: 12 },
    radar: {
      economy: 71.0,
      security: 62.0,
      healthcare: 55.0,
      education: 78.0,
      infrastructure: 74.0,
      integrity: 76.0
    },
    sparkline: [62.0, 63.5, 64.8, 66.2, 67.0, 67.8, 68.4],
    bio: 'Tech entrepreneur and co-founder of Co-Creation Hub (CcHUB) now leading Nigeria’s 3MTT (Three Million Technical Talents) program and National Artificial Intelligence Strategy.',
    assumedOffice: 'August 21, 2023',
    keyInitiatives: [
      '3MTT Initiative (3 Million Technical Talents Training)',
      'National AI Strategy & Compute Infrastructure Roadmap',
      '90,000km National Fiber Optic Backbone Fund'
    ],
    recentReviews: [
      {
        id: 'bt1',
        author: 'David Adeyemi',
        state: 'Oyo State',
        rating: 5,
        comment: 'The 3MTT learning hubs in Ibadan are vibrant. Giving Nigerian youth actual software engineering and AI skills.',
        timeAgo: '12h ago',
        isVerified: true,
        upvotes: 110
      }
    ]
  },
  {
    id: 'wike',
    name: 'Nyesom Ezenwo Wike',
    role: 'Minister of the Federal Capital Territory (FCT)',
    party: 'PDP / FEC',
    partyColor: '#DC2626',
    category: 'minister',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    state: 'Rivers State',
    trustIndex: 48.70,
    change24h: -1.30,
    change7d: +2.10,
    ratingsCount: 17540,
    approval: { positive: 49, neutral: 21, negative: 30 },
    radar: {
      economy: 54.0,
      security: 51.0,
      healthcare: 42.0,
      education: 46.0,
      infrastructure: 88.0,
      integrity: 44.0
    },
    sparkline: [46.1, 47.4, 48.0, 50.2, 49.6, 49.2, 48.7],
    bio: 'Former Governor of Rivers State serving as Minister of FCT. High-octane administrator recognized for completing stalled Abuja expressways and revamping Abuja Light Rail.',
    assumedOffice: 'August 21, 2023',
    keyInitiatives: [
      'Commercial Relaunch of Abuja Metro Rail System',
      'Completion of Decades-Abandoned Inner Southern Expressway',
      'Stringent Property Ground Rent & Master Plan Enforcement'
    ],
    recentReviews: [
      {
        id: 'nw1',
        author: 'Suleiman Garba',
        state: 'FCT Abuja',
        rating: 4,
        comment: 'You cannot deny his speed on road construction in the city center. Abuja roads look much better, though enforcement can be harsh.',
        timeAgo: '8h ago',
        isVerified: true,
        upvotes: 95
      }
    ]
  },
  {
    id: 'soludo',
    name: 'Prof. Charles Chukwuma Soludo',
    role: 'Executive Governor, Anambra State',
    party: 'APGA',
    partyColor: '#EAB308',
    category: 'governor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    state: 'Anambra State',
    trustIndex: 65.30,
    change24h: +2.10,
    change7d: +3.40,
    ratingsCount: 12900,
    approval: { positive: 64, neutral: 20, negative: 16 },
    radar: {
      economy: 74.0,
      security: 61.0,
      healthcare: 67.0,
      education: 72.0,
      infrastructure: 76.0,
      integrity: 71.0
    },
    sparkline: [60.0, 61.5, 62.4, 63.8, 64.2, 64.8, 65.3],
    bio: 'Former Governor of Central Bank of Nigeria and current Governor of Anambra State. Pioneering dual-duallized road infrastructure and urban renewal across Awka and Onitsha.',
    assumedOffice: 'March 17, 2022',
    keyInitiatives: [
      'Over 400km of Engineered Asphalt Roads across Anambra',
      'Free Basic Healthcare and Maternity Services in General Hospitals',
      'Massive Public Teacher Recruitment on Merit'
    ],
    recentReviews: [
      {
        id: 'cs1',
        author: 'Nnamdi Eze',
        state: 'Anambra State',
        rating: 4,
        comment: 'Soludo has done heavy work in road construction and public school teachers recruitment. Up for re-election in Nov 2025.',
        timeAgo: '14h ago',
        isVerified: true,
        upvotes: 122
      }
    ]
  },
  {
    id: 'atiku',
    name: 'Atiku Abubakar',
    role: 'Former Vice President & PDP Leader',
    party: 'PDP',
    partyColor: '#DC2626',
    category: 'opposition',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    state: 'Adamawa State',
    trustIndex: 43.20,
    change24h: -1.82,
    change7d: -2.30,
    ratingsCount: 15300,
    approval: { positive: 42, neutral: 27, negative: 31 },
    radar: {
      economy: 66.0,
      security: 50.0,
      healthcare: 48.0,
      education: 55.0,
      infrastructure: 58.0,
      integrity: 46.0
    },
    sparkline: [46.0, 45.4, 44.8, 44.2, 43.8, 43.5, 43.2],
    bio: 'Vice President of Nigeria (1999–2007) and standard-bearer for the Peoples Democratic Party in the 2023 elections. Proponent of privatization and political restructuring.',
    assumedOffice: 'Opposition Statesman',
    keyInitiatives: [
      'National Political Restructuring & Devolution of Powers',
      'Private Sector-Led Industrialization Policy',
      'Educational Endowments (American University of Nigeria)'
    ],
    recentReviews: [
      {
        id: 'aa1',
        author: 'Ibrahim Danladi',
        state: 'Kano State',
        rating: 3,
        comment: 'A veteran statesman with sound private-sector economic ideas, but PDP needs internal cohesion ahead of 2027.',
        timeAgo: '18h ago',
        isVerified: true,
        upvotes: 78
      }
    ]
  },
  {
    id: 'kwankwaso',
    name: 'Rabiu Musa Kwankwaso',
    role: 'National Leader, New Nigeria Peoples Party (NNPP)',
    party: 'NNPP',
    partyColor: '#EF4444',
    category: 'opposition',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
    state: 'Kano State',
    trustIndex: 50.20,
    change24h: +2.45,
    change7d: +3.10,
    ratingsCount: 11400,
    approval: { positive: 56, neutral: 24, negative: 20 },
    radar: {
      economy: 54.0,
      security: 55.0,
      healthcare: 62.0,
      education: 78.0,
      infrastructure: 68.0,
      integrity: 60.0
    },
    sparkline: [47.5, 48.2, 48.9, 49.3, 49.8, 50.0, 50.2],
    bio: 'Founder of the Kwankwasiyya political movement. Former Kano State Governor renowned for massive overseas postgraduate scholarship sponsorships for thousands of youth.',
    assumedOffice: 'NNPP National Leader',
    keyInitiatives: [
      'Kwankwasiyya Education & Overseas STEM Scholarships',
      'Free Maternal and Child Healthcare Systems',
      'Youth Political Mobilization across Northern Nigeria'
    ],
    recentReviews: [
      {
        id: 'rk1',
        author: 'Sani Abdullahi',
        state: 'Kano State',
        rating: 4,
        comment: 'His impact on education and youth sponsorships remains unmatched in the North. Highly disciplined grassroots leader.',
        timeAgo: '1d ago',
        isVerified: true,
        upvotes: 140
      }
    ]
  }
];

export const AGENCIES: Agency[] = [
  {
    id: 'efcc',
    name: 'Economic and Financial Crimes Commission',
    acronym: 'EFCC',
    head: 'Ola Olukoyede',
    headTitle: 'Executive Chairman',
    sector: 'Anti-Corruption & Law Enforcement',
    category: 'enforcement',
    logo: '🛡️',
    trustIndex: 87.6,
    change24h: +12.4,
    change7d: +14.2,
    ratingsCount: 22400,
    metrics: {
      transparency: 85.3,
      effectiveness: 89.1,
      integrity: 88.7,
      publicPerception: 87.4
    },
    approval: { positive: 78, neutral: 15, negative: 7 },
    sparkline: [72.0, 75.4, 78.0, 81.2, 84.0, 86.1, 87.6],
    description: 'Nigeria’s foremost law enforcement agency mandated to combat financial crimes, cyber fraud, and illicit public capital flight.',
    recentReviews: [
      {
        id: 'e1',
        author: 'Kayode Alabi',
        state: 'Osun State',
        rating: 5,
        comment: 'Recovering billions in stolen funds and shifting focus toward institutional prevention under Olukoyede has restored public credibility.',
        timeAgo: '3h ago',
        isVerified: true,
        upvotes: 180
      }
    ]
  },
  {
    id: 'nnpcl',
    name: 'Nigerian National Petroleum Company Limited',
    acronym: 'NNPCL',
    head: 'Mele Kyari',
    headTitle: 'Group Chief Executive Officer',
    sector: 'Energy & Natural Resources',
    category: 'economy',
    logo: '⛽',
    trustIndex: 45.3,
    change24h: -6.7,
    change7d: -4.2,
    ratingsCount: 31200,
    metrics: {
      transparency: 42.1,
      effectiveness: 48.0,
      integrity: 44.5,
      publicPerception: 46.2
    },
    approval: { positive: 40, neutral: 22, negative: 38 },
    sparkline: [52.0, 50.4, 49.0, 48.2, 47.0, 46.1, 45.3],
    description: 'Commercial state oil company managing petroleum assets, crude supply to domestic refineries, and national energy security.',
    recentReviews: [
      {
        id: 'n1',
        author: 'Osato Igbinovia',
        state: 'Edo State',
        rating: 2,
        comment: 'Crude supply to local refineries must be transparent. The fuel pricing adjustments need clearer communication to citizens.',
        timeAgo: '7h ago',
        isVerified: true,
        upvotes: 210
      }
    ]
  },
  {
    id: 'npf',
    name: 'Nigeria Police Force',
    acronym: 'NPF',
    head: 'Kayode Egbetokun',
    headTitle: 'Inspector General of Police (IGP)',
    sector: 'Internal Security & Public Safety',
    category: 'security',
    logo: '👮',
    trustIndex: 72.0,
    change24h: +2.4,
    change7d: +3.8,
    ratingsCount: 28900,
    metrics: {
      transparency: 66.0,
      effectiveness: 74.0,
      integrity: 71.5,
      publicPerception: 72.0
    },
    approval: { positive: 68, neutral: 18, negative: 14 },
    sparkline: [65.0, 66.8, 68.2, 69.5, 70.4, 71.2, 72.0],
    description: 'Principal law enforcement agency responsible for maintaining public order, crime prevention, and community safety across 36 states.',
    recentReviews: [
      {
        id: 'p1',
        author: 'Danjuma Bako',
        state: 'Kaduna State',
        rating: 4,
        comment: 'Highway patrols on the Abuja-Kaduna expressway have significantly improved security over the past several months.',
        timeAgo: '9h ago',
        isVerified: true,
        upvotes: 115
      }
    ]
  },
  {
    id: 'inec',
    name: 'Independent National Electoral Commission',
    acronym: 'INEC',
    head: 'Prof. Mahmood Yakubu',
    headTitle: 'National Chairman',
    sector: 'Electoral Democracy & Governance',
    category: 'regulatory',
    logo: '🗳️',
    trustIndex: 63.2,
    change24h: +1.8,
    change7d: -2.1,
    ratingsCount: 34500,
    metrics: {
      transparency: 62.0,
      effectiveness: 64.5,
      integrity: 61.0,
      publicPerception: 63.2
    },
    approval: { positive: 58, neutral: 21, negative: 21 },
    sparkline: [62.0, 61.4, 60.8, 62.1, 62.9, 63.0, 63.2],
    description: 'Electoral management body overseeing continuous voter registration, party regulations, and conduct of state and federal elections.',
    recentReviews: [
      {
        id: 'i1',
        author: 'Blessing Udoh',
        state: 'Akwa Ibom State',
        rating: 3,
        comment: 'BVAS and IReV technological reliability in the upcoming off-cycle elections in Anambra will be the litmus test for 2027.',
        timeAgo: '11h ago',
        isVerified: true,
        upvotes: 145
      }
    ]
  },
  {
    id: 'nafdac',
    name: 'National Agency for Food & Drug Administration',
    acronym: 'NAFDAC',
    head: 'Prof. Mojisola Adeyeye',
    headTitle: 'Director General',
    sector: 'Public Health & Product Safety',
    category: 'social',
    logo: '💊',
    trustIndex: 81.2,
    change24h: +3.2,
    change7d: +5.1,
    ratingsCount: 19100,
    metrics: {
      transparency: 82.0,
      effectiveness: 83.5,
      integrity: 84.0,
      publicPerception: 81.2
    },
    approval: { positive: 79, neutral: 14, negative: 7 },
    sparkline: [75.0, 76.8, 77.9, 79.2, 80.0, 80.8, 81.2],
    description: 'Regulator safeguarding public health by ensuring the safety, quality, and efficacy of food, drugs, cosmetics, and medical devices.',
    recentReviews: [
      {
        id: 'naf1',
        author: 'Dr. Stella Obi',
        state: 'Lagos State',
        rating: 5,
        comment: 'Persistent enforcement against counterfeit medications in open markets has saved countless lives. Strong institutional record.',
        timeAgo: '1d ago',
        isVerified: true,
        upvotes: 220
      }
    ]
  },
  {
    id: 'firs',
    name: 'Federal Inland Revenue Service',
    acronym: 'FIRS',
    head: 'Zacch Adedeji',
    headTitle: 'Executive Chairman',
    sector: 'Taxation & Fiscal Revenue',
    category: 'economy',
    logo: '📊',
    trustIndex: 79.5,
    change24h: +4.1,
    change7d: +6.3,
    ratingsCount: 14800,
    metrics: {
      transparency: 81.0,
      effectiveness: 82.5,
      integrity: 80.0,
      publicPerception: 79.5
    },
    approval: { positive: 76, neutral: 16, negative: 8 },
    sparkline: [71.5, 73.0, 74.8, 76.2, 77.9, 78.8, 79.5],
    description: 'Premier tax authority driving digital taxpayer self-service, non-oil revenue mobilization, and simplified SME tax filing.',
    recentReviews: [
      {
        id: 'fir1',
        author: 'Adeolu Martins',
        state: 'Oyo State',
        rating: 4,
        comment: 'Digital tax clearance certificates now take less than 48 hours online. Clear improvement in institutional bureaucracy.',
        timeAgo: '1d ago',
        isVerified: true,
        upvotes: 95
      }
    ]
  }
];

export const ELECTIONS: Election[] = [
  {
    id: 'anambra-2025',
    title: 'Anambra Governorship Election',
    type: 'governorship',
    dateStr: 'November 8, 2025',
    targetDate: '2025-11-08T08:00:00Z',
    location: 'Anambra State (21 LGAs)',
    status: 'upcoming',
    leadingCandidate: 'Prof. Chukwuma Soludo',
    confidence: 84,
    candidates: [
      {
        name: 'Chukwuma Soludo',
        party: 'APGA',
        partyColor: '#EAB308',
        percentage: 45,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        status: 'Incumbent Governor'
      },
      {
        name: 'Paul Chukwuma',
        party: 'APC',
        partyColor: '#10B981',
        percentage: 28,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'Challenger'
      },
      {
        name: 'Valentine Ozigbo / LP',
        party: 'LP',
        partyColor: '#F97316',
        percentage: 19,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'Opposition Contender'
      },
      {
        name: 'Other Candidates',
        party: 'Others',
        partyColor: '#64748B',
        percentage: 8,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'Coalition'
      }
    ],
    overview: 'High-stakes off-cycle governorship race in the South East commercial hub. Soludo defends his record of infrastructure and education reforms against formidable APC and Labour Party mobilization.'
  },
  {
    id: 'general-2027',
    title: '2027 Presidential General Election',
    type: 'presidential',
    dateStr: 'February 27, 2027',
    targetDate: '2027-02-27T08:00:00Z',
    location: 'Nigeria (36 States + FCT)',
    status: 'upcoming',
    leadingCandidate: 'Bola Ahmed Tinubu',
    confidence: 68,
    candidates: [
      {
        name: 'Bola Ahmed Tinubu',
        party: 'APC',
        partyColor: '#10B981',
        percentage: 41.3,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'Incumbent'
      },
      {
        name: 'Peter Gregory Obi',
        party: 'LP',
        partyColor: '#F97316',
        percentage: 31.7,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'Challenger'
      },
      {
        name: 'Atiku Abubakar',
        party: 'PDP',
        partyColor: '#DC2626',
        percentage: 23.4,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        status: 'Challenger'
      },
      {
        name: 'Rabiu Kwankwaso',
        party: 'NNPP',
        partyColor: '#EF4444',
        percentage: 3.6,
        avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
        status: 'Challenger'
      }
    ],
    overview: 'National civic consensus forecast compiled from over 418,000 verified citizen polling entries across 774 Local Government Areas.'
  }
];

export const TRENDING_ISSUES: TrendingIssue[] = [
  {
    id: 'issue-1',
    title: 'Inflation & Cost of Living',
    category: 'Economy',
    mentions: '128.4K',
    changePercent: +18.2,
    sentiment: 'critical',
    summary: 'Food inflation and transportation costs dominate citizen discourse across all 6 geopolitical zones.'
  },
  {
    id: 'issue-2',
    title: 'Security & Rural Food Corridors',
    category: 'National Security',
    mentions: '94.2K',
    changePercent: +12.5,
    sentiment: 'critical',
    summary: 'Protection of agrarian belts in North Central and highway surveillance in the South West.'
  },
  {
    id: 'issue-3',
    title: 'Foreign Exchange & Naira Stability',
    category: 'Monetary Policy',
    mentions: '86.1K',
    changePercent: -4.3,
    sentiment: 'moderate',
    summary: 'CBN interventions and FX reserves rebuilding bring stabilization signals to business imports.'
  },
  {
    id: 'issue-4',
    title: 'Electricity Tariff & National Grid',
    category: 'Infrastructure',
    mentions: '64.8K',
    changePercent: +7.1,
    sentiment: 'moderate',
    summary: 'Band A service delivery hours and decentralized state-level electricity generation licenses.'
  },
  {
    id: 'issue-5',
    title: 'Student Loan Fund (NELFUND)',
    category: 'Education',
    mentions: '52.3K',
    changePercent: +24.0,
    sentiment: 'positive',
    summary: 'Disbursement of upkeep stipends and tuition fees to federal and state university students nationwide.'
  }
];

export const STATE_SENTIMENT_DATA: StateSentiment[] = [
  { code: 'LA', name: 'Lagos', zone: 'South West', sentimentScore: 64, governor: 'Babajide Sanwo-Olu', dominantParty: 'APC', topIssue: 'Transportation & Housing' },
  { code: 'AB', name: 'Abia', zone: 'South East', sentimentScore: 78, governor: 'Alex Otti', dominantParty: 'LP', topIssue: 'Power Supply & Commerce' },
  { code: 'AN', name: 'Anambra', zone: 'South East', sentimentScore: 68, governor: 'Chukwuma Soludo', dominantParty: 'APGA', topIssue: 'Governorship 2025 & Roads' },
  { code: 'KN', name: 'Kano', zone: 'North West', sentimentScore: 58, governor: 'Abba Kabir Yusuf', dominantParty: 'NNPP', topIssue: 'Education & Grain Prices' },
  { code: 'RV', name: 'Rivers', zone: 'South South', sentimentScore: 52, governor: 'Siminalayi Fubara', dominantParty: 'PDP', topIssue: 'Political Autonomy & Budget' },
  { code: 'AK', name: 'Akwa Ibom', zone: 'South South', sentimentScore: 72, governor: 'Umo Eno', dominantParty: 'PDP', topIssue: 'Aviation & Rural Agriculture' },
  { code: 'OY', name: 'Oyo', zone: 'South West', sentimentScore: 70, governor: 'Seyi Makinde', dominantParty: 'PDP', topIssue: 'Agribusiness & Healthcare' },
  { code: 'FC', name: 'FCT Abuja', zone: 'North Central', sentimentScore: 55, governor: 'Nyesom Wike (Minister)', dominantParty: 'FEC', topIssue: 'Road Infrastructure & Security' },
  { code: 'KD', name: 'Kaduna', zone: 'North West', sentimentScore: 54, governor: 'Uba Sani', dominantParty: 'APC', topIssue: 'Rural Security & Debt Servicing' },
  { code: 'EN', name: 'Enugu', zone: 'South East', sentimentScore: 66, governor: 'Peter Mbah', dominantParty: 'PDP', topIssue: 'Water Supply & Smart Schools' }
];

export const AI_DAILY_BRIEF = {
  date: 'November 19, 2026',
  title: 'Public Intelligence Daily Brief',
  summary: 'National confidence index holds steady at 54.3% (+6.4% 7D). Ministerial performances in Interior and Technology register notable citizen trust surges, while off-cycle Anambra election fever intensifies voter verification registrations.',
  bulletPoints: [
    'Public confidence in interior administration hit record 74.5% following automated passport delivery.',
    'Security confidence gained +2.4% after coordinated police and military joint operations in the Middle Belt.',
    'Over 14,200 new citizens completed Zero-Knowledge anonymous verification in the past 24 hours.',
    'Economic sentiment ticked up slightly as food price volatility softened in key South West and North Central markets.'
  ]
};
