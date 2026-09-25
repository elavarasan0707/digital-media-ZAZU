import { ServiceItem, CaseStudyItem, ProcessStep, TestimonialItem, BlogPostItem, AgencyContactConfig } from '../types';
import caseStudyAnalytics from '../assets/images/case_study_analytics_1790255994838.jpg';
import caseStudyBranding from '../assets/images/case_study_branding_1790256011773.jpg';
import zazuHeroAbstract from '../assets/images/zazu_hero_abstract_1790255957518.jpg';
import zazuEmblem3D from '../assets/images/zazu_emblem_3d_1790255979167.jpg';

export const initialAgencyConfig: AgencyContactConfig = {
  email: 'digitalmediazazu@gmail.com',
  phone: '+91 9789504702',
  whatsapp: '+91 9789504702',
  location: 'Tirumangalam, Tamil Nadu, India',
  tagline: 'WE DON’T JUST CREATE CONTENT. WE CREATE BUSINESS IMPACT.',
  bookingUrl: 'https://calendly.com',
  instagram: 'https://www.instagram.com/zazudigitalmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
  linkedin: 'https://www.linkedin.com/in/vijayakumar-s-2a48a8394/',
  aboutVijayakumar: `Vijayakumar is the creative professional behind Zazu Digital Media, focused on delivering creative and effective digital marketing solutions.
He has a strong interest in digital media, content creation, and brand promotion.
He creates engaging content based on the needs of different brands and businesses.
His work includes creative content creation and professional video creation.
He also specializes in video editing to make content more attractive and engaging.
Along with content creation, he handles social media marketing and promotions.
He works on digital marketing strategies to help businesses grow their online presence.
He also focuses on Search Engine Marketing (SEM) and online advertising.
His approach combines creativity, marketing knowledge, and audience-focused strategies.
He has worked on multiple projects across different digital marketing requirements.
Each project is handled with attention to quality, creativity, and business goals.
From developing an idea to creating and promoting the final content, he manages different stages of the digital marketing process.
Through Zazu Digital Media, he aims to provide creative digital solutions that help brands communicate effectively with their target audience.
His goal is to create meaningful content that connects brands with people.
He continuously explores new creative ideas and digital marketing trends.
With creativity and practical experience, he turns ideas into digital experiences.
Zazu Digital Media – Creative Ideas, Digital Content & Smart Marketing.`
};

export const servicesData: ServiceItem[] = [
  {
    id: 'digital-marketing',
    number: '01',
    title: 'Digital Marketing',
    shortDescription: 'Holistic growth architecture uniting omni-channel acquisition, conversion rate optimization, and revenue attribution.',
    iconName: 'Compass',
    deliverables: ['Full-Funnel Strategy', 'Omnichannel Media Planning', 'Growth Auditing', 'Multi-Touch Attribution Setup'],
    metricsSample: 'Integrated Cross-Channel Campaign Architecture',
    image: caseStudyAnalytics
  },
  {
    id: 'social-media-marketing',
    number: '02',
    title: 'Social Media Marketing',
    shortDescription: 'High-converting social distribution engines that turn passive scrolling into loyal brand advocates and customers.',
    iconName: 'Share2',
    deliverables: ['Editorial Calendar Production', 'Community Engagement Protocols', 'Influencer Collaboration', 'Performance Paid Amplification'],
    metricsSample: 'High-Retention Organic & Paid Social Reach',
    image: zazuHeroAbstract
  },
  {
    id: 'seo',
    number: '03',
    title: 'SEO (Search Engine Optimization)',
    shortDescription: 'Technical, semantic, and authoritative search strategies that capture high-intent buyers at the top of Google results.',
    iconName: 'Search',
    deliverables: ['Technical SEO Audits & Core Web Vitals', 'Semantic Entity Architecture', 'High-Authority Backlink Acquisition', 'Local & National SERP Dominance'],
    metricsSample: 'Sustainable Inbound Commercial Organic Traffic',
    image: caseStudyAnalytics
  },
  {
    id: 'google-ads',
    number: '04',
    title: 'Google Ads (PPC)',
    shortDescription: 'Precision pay-per-click management targeting ready-to-buy searchers with maximized return on ad spend (ROAS).',
    iconName: 'Target',
    deliverables: ['High-Intent Search Campaigns', 'Performance Max (PMax) Optimization', 'Negative Keyword Sculpting', 'Bidding Algorithm Optimization'],
    metricsSample: 'Optimized Target Cost Per Acquisition (tCPA)',
    image: caseStudyAnalytics
  },
  {
    id: 'content-creation',
    number: '05',
    title: 'Content Creation',
    shortDescription: 'Bespoke photography, short-form reels, 3D motion clips, and copywriting designed specifically for digital formats.',
    iconName: 'Sparkles',
    deliverables: ['Short-Form Vertical Video (Reels/TikTok/Shorts)', 'High-End Product Photography Mockups', 'Direct-Response Ad Copywriting', 'Visual Storyboards'],
    metricsSample: 'High-Engagement Digital Asset Suite',
    image: zazuEmblem3D
  },
  {
    id: 'branding',
    number: '06',
    title: 'Branding & Visual Identity',
    shortDescription: 'Distinctive brand positioning, identity systems, design guidelines, and tone of voice that command premium market value.',
    iconName: 'Crown',
    deliverables: ['Brand Positioning & Narrative', 'Complete Design Systems & Styleguides', 'Typography & Palette Direction', 'Corporate Collateral & Asset Kits'],
    metricsSample: 'Cohesive Luxury Brand Equity',
    image: caseStudyBranding
  },
  {
    id: 'video-marketing',
    number: '07',
    title: 'Video Marketing',
    shortDescription: 'Cinematic brand films, explainer videos, and performance video ads that capture emotion and drive conversions.',
    iconName: 'Video',
    deliverables: ['Direct-Response Video Ad Hooks', 'Brand Documentaries & Stories', 'Motion Graphics & 3D Title Sequences', 'Multi-Platform Video Resizing'],
    metricsSample: 'Elevated Video Hook-Rate & Watch-Time',
    image: zazuHeroAbstract
  },
  {
    id: 'website-marketing',
    number: '08',
    title: 'Website Marketing',
    shortDescription: 'High-conversion landing pages and CRO experiments designed to turn site traffic into paying customers.',
    iconName: 'Layout',
    deliverables: ['Conversion Architecture & Wireframing', 'A/B Split Testing & Heatmap Analysis', 'Copywriting Optimized for Speed & Conversion', 'Page Speed & Core Web Vitals Optimization'],
    metricsSample: 'Lifted Session-to-Lead Conversion Rate',
    image: caseStudyBranding
  }
];

export const whyChooseData = [
  {
    number: '01',
    title: 'Strategy Before Execution',
    description: 'We never waste client budget on haphazard ads. Every deliverable is preceded by competitor benchmarking, target audience profiling, and high-level funnel architecture.'
  },
  {
    number: '02',
    title: 'Creative Content That Connects',
    description: 'Generic templates are invisible. Our in-house creative production marries direct-response psychology with luxury visual polish that demands viewer attention.'
  },
  {
    number: '03',
    title: 'Data-Driven Marketing',
    description: 'No guesswork. We rely on clean server-side conversion tracking, granular cohort analytics, and statistical significance testing to validate every decision.'
  },
  {
    number: '04',
    title: 'Transparent Communication',
    description: 'Direct Slack access, clear bi-weekly sprint reviews, and live executive dashboards. You always know exactly what was executed, what was spent, and what was achieved.'
  },
  {
    number: '05',
    title: 'Focused on Real Business Growth',
    description: 'Likes and vanity impressions do not pay the bills. We orient our entire agency around pipeline velocity, qualified inbound leads, and measurable bottom-line revenue.'
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    name: 'DISCOVER',
    tagline: 'Deep Audit & Competitive Intelligence',
    description: 'We dissect your historical analytics, customer acquisition unit economics, brand assets, and top 5 market competitors to identify high-leverage growth opportunities.',
    deliverables: ['Growth Gap Audit', 'Competitor Teardown', 'Customer ICP Profiling']
  },
  {
    number: '02',
    name: 'STRATEGIZE',
    tagline: 'Custom Full-Funnel Architecture',
    description: 'We construct a 90-day actionable roadmap encompassing channel allocation, creative testing cadence, budget distribution, and revenue targets.',
    deliverables: ['90-Day Sprint Roadmap', 'Offer & Hook Positioning', 'Measurement Protocol']
  },
  {
    number: '03',
    name: 'CREATE',
    tagline: 'High-Impact Creative Production',
    description: 'Our creative team crafts direct-response landing pages, video creatives, ad copy iterations, and brand assets engineered for immediate resonance.',
    deliverables: ['Landing Page Prototypes', 'Multi-Hook Video Ads', 'Visual Ad Matrix']
  },
  {
    number: '04',
    name: 'LAUNCH',
    tagline: 'Precision Campaign Deployment',
    description: 'We orchestrate multi-channel campaign rollouts with server-side tracking, granular UTM taxonomy, and automated audience segmentation.',
    deliverables: ['Pixel & CAPI Validation', 'Campaign Deployment', 'Bid Management Setup']
  },
  {
    number: '05',
    name: 'ANALYZE',
    tagline: 'Daily Tracking & Cohort Calibration',
    description: 'We monitor lead velocity, engagement depth, and ad fatigue daily. Winning angles receive increased budget while underperformers are pruned.',
    deliverables: ['Live Reporting Dashboard', 'Creative Fatigue Watch', 'Weekly Executive Summaries']
  },
  {
    number: '06',
    name: 'GROW',
    tagline: 'Predictable Scale & Channel Expansion',
    description: 'With profitable customer acquisition economics established, we systematically scale budgets and introduce secondary distribution channels.',
    deliverables: ['Horizontal Channel Expansion', 'LTV Maximization Systems', 'Quarterly Growth Sprints']
  }
];

export const sampleAnalyticsData = {
  summaryMetrics: [
    { label: 'Sample Ad Spend Efficiency', value: '4.8x ROAS', subtitle: 'Target Benchmark Portfolio Average' },
    { label: 'Sample Lead Cost Reduction', value: '-38.4%', subtitle: 'Following Conversion Optimization' },
    { label: 'Sample Inbound Lead Velocity', value: '+164%', subtitle: '90-Day Full-Funnel Growth Framework' },
    { label: 'Sample Qualified Conversion Rate', value: '5.2%', subtitle: 'High-Intent Landing Page Traffic' }
  ],
  funnelStages: [
    { name: 'Target Impressions', volume: '1,420,000', percentage: '100%', note: 'Qualified Audience Reach' },
    { name: 'Engaged Clicks', volume: '68,400', percentage: '4.8%', note: 'High CTR Direct Response Hooks' },
    { name: 'Landing Page Visits', volume: '62,200', percentage: '91% of Clicks', note: 'Fast Load & Core Web Vitals' },
    { name: 'Lead Form Submissions', volume: '3,840', percentage: '6.2% On-Site', note: 'Validated Contact Data' },
    { name: 'Qualified Consultations', volume: '892', percentage: '23.2% of Leads', note: 'Calendar Booked Appointments' }
  ],
  timeframeData: {
    '30D': {
      traffic: [32, 45, 58, 64, 78, 92, 108],
      leads: [12, 18, 24, 31, 38, 46, 54],
      roas: '4.4x',
      leadsTotal: '482'
    },
    '90D': {
      traffic: [28, 44, 72, 98, 134, 172, 218],
      leads: [10, 22, 41, 63, 94, 128, 164],
      roas: '4.8x',
      leadsTotal: '1,420'
    },
    '180D': {
      traffic: [22, 54, 105, 168, 245, 340, 480],
      leads: [8, 29, 68, 122, 198, 286, 390],
      roas: '5.1x',
      leadsTotal: '3,840'
    }
  }
};

export const caseStudiesData: CaseStudyItem[] = [
  {
    id: 'case-paid-advertising',
    title: 'Omnichannel B2B Customer Acquisition Engine',
    category: 'Paid Advertising',
    clientType: 'Enterprise Cloud & SaaS Consultancy (Representative Sample)',
    challenge: 'High cost per lead through generic Google search and saturated LinkedIn sponsored messages with sluggish sales pipeline velocity.',
    solution: 'Designed an account-based remarketing loop combining Google Search high-intent capture with multi-channel interactive thought leadership video clips.',
    sampleMetrics: [
      { label: 'Sample ROAS', value: '4.6x' },
      { label: 'Sample CPL Reduction', value: '-42%' },
      { label: 'Sample Demo Bookings', value: '340+' }
    ],
    deliverables: ['Interactive Assessment Funnel', 'Dynamic Search Campaigns', 'CBO Retargeting Matrix'],
    image: caseStudyAnalytics
  },
  {
    id: 'case-branding',
    title: 'Luxury Brand Identity & Digital Re-Positioning',
    category: 'Branding',
    clientType: 'Boutique Architectural & Design Studio (Representative Sample)',
    challenge: 'Outdated visual assets and lack of coherent digital voice resulting in lost deals to premium regional competitors.',
    solution: 'Engineered a modern obsidian-and-gold visual identity system, custom typography guidelines, and a high-performance portfolio showcase.',
    sampleMetrics: [
      { label: 'Sample Inquiries', value: '+118%' },
      { label: 'Average Deal Size', value: '+₹3,50,000' },
      { label: 'Brand Recognition', value: 'Top 3' }
    ],
    deliverables: ['Brand Guidelines Book', 'High-Fidelity Web Design', 'Executive Typography System'],
    image: caseStudyBranding
  },
  {
    id: 'case-seo',
    title: 'Organic Search Authority & High-Intent Dominance',
    category: 'SEO',
    clientType: 'National Commercial Financial Services (Representative Sample)',
    challenge: 'Zero presence on commercial keywords, penalization from older thin content, and slow site performance on mobile devices.',
    solution: 'Revamped site architecture with semantic entity hubs, pruned dead pages, optimized Core Web Vitals to 98/100, and built authoritative industry links.',
    sampleMetrics: [
      { label: 'Sample Organic Clicks', value: '+280%' },
      { label: 'Top 3 Keywords', value: '142' },
      { label: 'Organic Inbound Growth', value: '520/mo' }
    ],
    deliverables: ['Entity Content Clusters', 'Technical Performance Refactor', 'Editorial Backlink Campaign'],
    image: zazuHeroAbstract
  },
  {
    id: 'case-social-media',
    title: 'Direct-Response Short-Form Social Distribution',
    category: 'Social Media',
    clientType: 'High-Growth Consumer Lifestyle Brand (Representative Sample)',
    challenge: 'Stagnant follower growth and negligible direct conversions from social channels despite frequent posting.',
    solution: 'Implemented a repeatable 3-hook video testing system with native creators, pairing viral trends with direct-to-cart promotional incentives.',
    sampleMetrics: [
      { label: 'Sample Video Views', value: '4.2M' },
      { label: 'Sample Engagement Lift', value: '+310%' },
      { label: 'Direct Social Revenue', value: 'Sample ₹15,50,000' }
    ],
    deliverables: ['60 Short-Form Video Assets', 'Creator Management', 'Automated DM Funnel'],
    image: zazuEmblem3D
  },
  {
    id: 'case-content-marketing',
    title: 'High-Impact Visual Content & Video Asset Production',
    category: 'Content Creation',
    clientType: 'Direct-to-Consumer & Healthtech Advisory (Representative Sample)',
    challenge: 'Low engagement on static assets and rising ad fatigue requiring authentic, high-converting video and creative content.',
    solution: 'Engineered a batch-production content engine with 30 short-form reels, high-resolution product visuals, and direct-response ad copy.',
    sampleMetrics: [
      { label: 'Sample Engagement Lift', value: '+310%' },
      { label: 'Sample Watch Time', value: '4.8x' },
      { label: 'Sample Creative ROAS', value: '5.2x' }
    ],
    deliverables: ['30 High-Retention Video Clips', 'Dynamic Visual Ad Matrix', 'Direct-Response Copywriting'],
    image: caseStudyAnalytics
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'testimonial-1',
    clientName: 'Alexander Hayes',
    businessName: 'Apex Capital Ventures',
    role: 'Managing Partner',
    testimonial: 'ZAZU Digital Media redefined our digital brand positioning. Their strategic discipline ensured we didn’t just create noise; our inbound qualified investor inquiries increased dramatically within the first quarter.',
    avatarInitials: 'AH',
    stars: 5,
    highlight: 'Strategy & Brand Transformation'
  },
  {
    id: 'testimonial-2',
    clientName: 'Elena Rostova',
    businessName: 'Vanguard Architectural Lab',
    role: 'Founder & Principal Architect',
    testimonial: 'Working with ZAZU felt like having an elite internal growth team. From the obsidian visual identity to high-converting campaigns, every rupee invested was backed by clean data and measurable returns.',
    avatarInitials: 'ER',
    stars: 5,
    highlight: 'Performance Ads & Brand Identity'
  },
  {
    id: 'testimonial-3',
    clientName: 'Marcus Sterling',
    businessName: 'Horizon Logistics Group',
    role: 'Chief Commercial Officer',
    testimonial: 'The transparency and communication from ZAZU is unmatched. Weekly sprint breakdowns, concrete lead metrics, and a genuine focus on bottom-line business impact rather than vanity statistics.',
    avatarInitials: 'MS',
    stars: 5,
    highlight: 'SEO & Commercial Growth'
  }
];

export const blogPostsData: BlogPostItem[] = [
  {
    id: 'post-1',
    title: 'The Death of Vanity Metrics: Why Business Impact is the Only Digital Metric That Matters in 2026',
    category: 'Digital Marketing',
    readTime: '5 min read',
    date: 'September 2026',
    excerpt: 'How modern businesses are abandoning passive impressions to prioritize pipeline velocity, CAC efficiency, and attributable customer lifetime value.',
    content: 'For over a decade, digital agencies sold businesses on vanity numbers: impressions, likes, and arbitrary reach. In 2026, algorithmic distribution and customer sophistication have shifted the paradigm. Sustainable growth requires connecting every creative dollar to verifiable unit economics and revenue pipelines.'
  },
  {
    id: 'post-2',
    title: 'Semantic Entity Architecture: How Modern SEO Outranks Competitors in the AI Era',
    category: 'SEO',
    readTime: '6 min read',
    date: 'September 2026',
    excerpt: 'Moving past simple keyword stuffing into knowledge graphs, entity relationships, and authoritative topical mapping that search engines prioritize.',
    content: 'Search engines no longer match strings of text; they map concepts, brand entities, and user intent. When your website provides comprehensive topical depth and technical precision, it becomes the undisputed canonical source in your industry.'
  },
  {
    id: 'post-3',
    title: 'The 3-Second Hook Rule: Structuring Short-Form Video for Commercial Conversion',
    category: 'Social Media',
    readTime: '4 min read',
    date: 'September 2026',
    excerpt: 'The psychological anatomy of high-performing video ads across Meta, TikTok, and YouTube Shorts that stop the scroll and trigger immediate curiosity.',
    content: 'Capturing user attention in the first three seconds requires an unmistakable visual pattern interrupt, a clear problem statement, and an immediate promise of value. We break down the creative formula that powers our top client campaigns.'
  },
  {
    id: 'post-4',
    title: 'Scaling Paid Advertising in 2026: Balancing Broad Targeting with Dynamic Creative Testing',
    category: 'Paid Advertising',
    readTime: '7 min read',
    date: 'August 2026',
    excerpt: 'Why algorithmic ad platforms perform best with creative diversification rather than hyper-niche audience exclusions.',
    content: 'Modern machine learning ad engines thrive when given strong direct-response creative variations. Instead of tweaking narrow demographics, successful growth teams focus 80% of their energy on developing distinctive creative angles and irresistible offers.'
  },
  {
    id: 'post-5',
    title: 'Content Marketing That Converts: Building High-Authority Lead Magnets for B2B',
    category: 'Content Marketing',
    readTime: '5 min read',
    date: 'August 2026',
    excerpt: 'Why generic PDF checklists fail and how proprietary industry benchmark reports generate seven-figure corporate sales pipelines.',
    content: 'Decision makers don’t want generic advice they could find via search. They crave proprietary data, industry benchmark metrics, and decision-making frameworks that give them a competitive advantage in their boardrooms.'
  },
  {
    id: 'post-6',
    title: 'From Attention to Revenue: The 5 Foundations of High-Velocity Business Growth',
    category: 'Business Growth',
    readTime: '6 min read',
    date: 'July 2026',
    excerpt: 'A comprehensive operational breakdown of how modern digital brands turn cold audience attention into predictable, recurring revenue.',
    content: 'Sustainable growth is an operational system, not a lottery ticket. When you align customer acquisition channels with seamless qualification, high-converting landing pages, and post-purchase retention, business growth becomes compounding.'
  }
];

export const sampleBookingSlots = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '01:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:30 PM', available: true }
];
