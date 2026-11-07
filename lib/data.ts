export const profile = {
  name: "Serhii Khomenko",
  title: "Senior Software Engineer",
  role:
    "Senior Software Engineer · Product-minded Full-Stack (Frontend-heavy) · React · Next.js · Node.js · TypeScript · AI/LLM · Remote",
  location: "Lviv, Ukraine",
  summary:
    "Frontend-focused Software Engineer with 7+ years of product development experience and practical backend experience with Node.js, REST APIs, MongoDB, GraphQL, and Socket.IO. I build end-to-end features across React and TypeScript applications, backend business logic, third-party integrations, payments, real-time workflows, AWS deployments, and CI/CD - in fintech, Web3, eCommerce, and AI-powered products for distributed EU and US teams.",
  cvUrl: "/cv/Serhii_Khomenko_Software_Engineer.pdf",
  links: {
    linkedin: "https://linkedin.com/in/serhiikhomenko",
    telegram: "https://t.me/KhSerhii",
    github: "https://github.com/KhomenkoSerhii",
  },
};

export type Job = {
  company: string;
  location: string;
  period: string;
  title: string;
  product: string;
  /** shown as the commit message on the experience git line */
  commit: string;
  /** the one line the site shows for this role; the full list lives in the CV */
  summary: string;
  /** short "how I worked" points, shown for the main role only */
  practice?: string[];
  stack: string[];
  highlights: string[];
};

export const experience: Job[] = [
  {
    company: "Calyptus",
    location: "London, UK",
    period: "Sep 2023 - Present",
    title: "Software Engineer",
    product: "Video-based AI talent platform used by 100+ companies",
    commit: "feat: frontend from zero",
    summary: "Founding frontend engineer. Built the product from zero and kept it shipping for three years.",
    practice: [
      "Worked with the CEO from idea to release: how to build it, building it, fixing it",
      "Shipped hotfixes fast whenever production needed them",
      "Turned what users asked for in feedback into released changes, quickly",
      "Built new features end to end: React front end, Node.js API, AI matching",
      "Built the Stripe payment flows the platform takes money through",
    ],
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "Vite",
      "Redux Toolkit",
      "TanStack Query",
      "Socket.IO",
      "Styled Components",
      "Tailwind CSS",
      "REST APIs",
      "OpenAI API",
      "Wagmi",
      "Viem",
      "RainbowKit",
      "Stripe",
      "Testing Library",
      "Sentry",
      "AWS",
      "CI/CD",
      "AI-assisted development",
    ],
    highlights: [
      "Built the full React/TypeScript front end from zero and owned its architecture for three years, serving 100k+ users and adopted by leading Web3 companies",
      "Contributed to Node.js backend tasks supporting product features, including API integrations, business logic, and real-time Socket.IO flows",
      "Integrated LLM-powered candidate-job matching, smart search, and automated profile parsing with backend and OpenAI APIs, removing manual profile review from the workflow",
      "Designed UX for streaming AI responses: incremental rendering, progress states, and graceful fallbacks for model latency and errors",
      "Built a scalable component architecture with shadcn/Radix that standardised the UI and sped up feature delivery across internal and customer-facing dashboards",
      "Built internal dashboards and admin tools for platform operations, user management, and Stripe payment workflows",
      "Set up and maintained CI/CD pipelines and AWS deployments, streamlining releases and improving delivery reliability",
      "Delivered real-time matching and profile features with resilient loading, error, and reconnection handling across client-server flows",
      "Improved application performance by ~35% through code splitting, lazy loading, and optimised real-time updates",
      "Use Cursor, Claude, and Copilot daily for prompt-driven development and workflow automation, partnering with backend and product teams to improve AI output surfaced in the UI",
    ],
  },
  {
    company: "Avenga",
    location: "London, UK",
    period: "Jul 2022 - Jun 2023",
    title: "Software Engineer",
    product: "Insurance Technology Portal",
    commit: "feat: insurance portal",
    summary: "Insurance portal: search across 5+ data sources and a first load ~25-35% faster.",
    stack: ["React", "TypeScript", "REST APIs", "Contentful", "Auth0", "AWS", "CI/CD"],
    highlights: [
      "Built a scalable search system with advanced filtering, sorting, and faceted navigation, improving content discoverability",
      "Reduced initial load time by ~25-35% and response times by ~20% through lazy loading and bundle optimisation",
      "Defined API contracts and aligned frontend-backend interactions for efficient data indexing and search accuracy",
      "Integrated 5+ third-party data sources to enrich search results and increase the relevance of displayed information",
      "Delivered a responsive, mobile-first UI with secure Auth0-based access flows",
    ],
  },
  {
    company: "Perfectial",
    location: "USA",
    period: "Mar 2021 - Jul 2022",
    title: "Software Engineer",
    product: "Crypto & Payment Infrastructure",
    commit: "feat: crypto + payments",
    summary: "Crypto payments dashboard with ~20% fewer payment errors and ~30% less lag under load.",
    stack: ["React", "Redux", "TypeScript", "web3", "Solidity", "REST APIs", "Jest"],
    highlights: [
      "Integrated payment providers, REST APIs, wallets, and blockchain interactions, reducing payment processing errors by ~20%",
      "Built a crypto payments dashboard enabling users to manage transactions, wallets, and payment flows in a unified interface",
      "Architected scalable Redux state management for high-frequency transaction data with improved reliability and maintainability",
      "Reduced UI latency by ~30% under high load and ensured stable operation during peak transaction periods",
      "Collaborated with backend and blockchain teams on API contracts and consistent data flow across systems",
      "Improved UX for complex financial operations, reducing user friction and support requests",
    ],
  },
  {
    company: "StarApps",
    location: "UK · USA",
    period: "Oct 2019 - Feb 2021",
    title: "Front End Developer",
    product: "Corporate Management App & Online Store",
    commit: "init: first production apps",
    summary: "HR tools and an online store, where the cart and checkout I built lifted conversion ~15%.",
    stack: ["Node.js", "JavaScript", "React", "REST APIs", "MongoDB", "SASS"],
    highlights: [
      "Built and maintained Node.js REST APIs, business logic, and MongoDB data integrations for the HR and eCommerce modules",
      "Developed and scaled core HR modules including Leave, Timesheets, Attendance, and Reporting for daily internal operations",
      "Improved performance across key workflows by ~25%, resolved critical production issues, and delivered responsive UI architecture for desktop and mobile",
      "Built product listings, cart, checkout, and related API integrations that lifted conversion by ~15%",
      "Created a reusable UI component library that accelerated feature delivery and improved maintainability",
      "Delivered account management for a gaming platform, an internal admin dashboard, and a real-time mobile chat experience",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI / LLM",
    items: [
      "LLM & OpenAI API",
      "Prompt engineering",
      "Streaming UX",
      "Claude Code",
      "GitHub Copilot",
      "ChatGPT",
      "Gemini",
    ],
  },
  {
    group: "Core",
    items: [
      "React.js",
      "Next.js",
      "Redux",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "React Hooks",
      "Git",
      "Webpack",
      "Vite",
    ],
  },
  {
    group: "Frontend",
    items: [
      "HTML",
      "CSS",
      "SASS",
      "BEM",
      "Material-UI",
      "Ant Design",
      "Tailwind",
      "shadcn",
      "Radix",
    ],
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "REST APIs",
      "MongoDB",
      "GraphQL",
      "Apollo",
      "Socket.IO",
      "API integrations",
      "Business logic",
    ],
  },
  {
    group: "DevOps",
    items: ["Docker", "AWS", "CI/CD", "GitHub Actions"],
  },
  {
    group: "Testing",
    items: ["Jest", "Enzyme", "React Testing Library", "Cypress", "Playwright"],
  },
  {
    group: "Other",
    items: [
      "Vue",
      "Angular",
      "React Native",
      "Stripe",
      "Contentful",
      "Auth0",
      "Kibana",
      "Mixpanel",
      "web3",
      "Solidity",
    ],
  },
];

// proficiency tiers: per-skill level (0..1) and years - rendered as a spec sheet
export type SkillEntry = { name: string; level: number; years: string };

export const skillTiers: {
  label: string;
  note: string;
  accent: "default" | "ai";
  items: SkillEntry[];
}[] = [
  {
    label: "EVERY DAY",
    note: "7+ years",
    accent: "default",
    items: [
      { name: "React", level: 1, years: "7+y" },
      { name: "TypeScript", level: 1, years: "7+y" },
      { name: "JavaScript", level: 1, years: "7+y" },
      { name: "HTML & CSS", level: 0.95, years: "7+y" },
      { name: "SASS", level: 0.85, years: "7+y" },
      { name: "Git", level: 0.95, years: "7+y" },
    ],
  },
  {
    label: "CURRENT FOCUS",
    note: "AI · 2+ years",
    accent: "ai",
    items: [
      { name: "LLM & OpenAI API", level: 0.8, years: "2+y" },
      { name: "Streaming UX", level: 0.8, years: "2+y" },
      { name: "Prompt Engineering", level: 0.75, years: "2+y" },
      { name: "Claude Code", level: 0.75, years: "2y" },
    ],
  },
  {
    label: "IN PRODUCTION",
    note: "3-5 years",
    accent: "default",
    items: [
      { name: "Next.js", level: 0.7, years: "5y" },
      { name: "REST APIs", level: 0.7, years: "6y" },
      { name: "Redux", level: 0.65, years: "5y" },
      { name: "Node.js", level: 0.6, years: "4y" },
      { name: "WebSocket", level: 0.6, years: "4y" },
      { name: "Tailwind", level: 0.6, years: "3y" },
      { name: "shadcn/Radix", level: 0.55, years: "2y" },
      { name: "Jest", level: 0.55, years: "4y" },
      { name: "Cypress", level: 0.5, years: "3y" },
      { name: "Playwright", level: 0.5, years: "2y" },
      { name: "Webpack", level: 0.5, years: "4y" },
      { name: "Material-UI", level: 0.5, years: "3y" },
      { name: "Ant Design", level: 0.5, years: "3y" },
      { name: "Vite", level: 0.5, years: "3y" },
    ],
  },
  {
    label: "HANDS-ON",
    note: "project-based",
    accent: "default",
    items: [
      { name: "AWS", level: 0.4, years: "projects" },
      { name: "CI/CD", level: 0.4, years: "projects" },
      { name: "web3", level: 0.4, years: "projects" },
      { name: "Docker", level: 0.35, years: "projects" },
      { name: "GitHub Actions", level: 0.35, years: "projects" },
      { name: "GraphQL", level: 0.35, years: "projects" },
      { name: "Apollo", level: 0.35, years: "projects" },
      { name: "MongoDB", level: 0.35, years: "projects" },
      { name: "Stripe", level: 0.3, years: "projects" },
      { name: "Auth0", level: 0.3, years: "projects" },
      { name: "Contentful", level: 0.3, years: "projects" },
      { name: "Kibana", level: 0.3, years: "projects" },
      { name: "Mixpanel", level: 0.3, years: "projects" },
      { name: "React Native", level: 0.3, years: "projects" },
      { name: "Vue", level: 0.25, years: "projects" },
      { name: "Angular", level: 0.2, years: "projects" },
    ],
  },
];

// LinkedIn recommendations (full texts, verbatim)
export const recommendations = [
  {
    name: "Dan Jones",
    role: "CEO & Co-Founder, Calyptus",
    relation: "Was senior to Serhii",
    featured: true,
    quote:
      "Can highly recommend Serhii - Serhii was often believed to have a twin/doubled himself, because he moved so quickly and produced a very high quality of work. Any startup would be lucky to have him.",
  },
  {
    name: "Angus Crombie",
    role: "Head of Platform, Calyptus",
    relation: "Managed Serhii directly",
    featured: false,
    quote:
      "Serhii was our Founding Frontend engineer at Calyptus. He spent three years with us building the core of the platform. Authentication, payments, onboarding, our points system, admin tooling. He did not join a functioning system, he built it!\n\nWhat stood out most was how consistent he was. We went through a lot of change over those three years, multiple pivots, new integrations, shifting priorities, and he just kept shipping. He never made it dramatic and he never let quality slip.\n\nHe is also genuinely good with AI tooling and always keen to bring new automations and processes into his workflow that can increase output efficiency and quality.\n\nI would recommend Serhii without hesitation. Happy to speak to anyone directly.",
  },
  {
    name: "Callum Crombie",
    role: "Co-Founder, Calyptus",
    relation: "Was senior to Serhii",
    featured: false,
    quote:
      "Serhii worked with us at Calyptus for three years. He was our Lead Frontend Engineer and ultimately built almost everything that we shipped. He writes clean, reliable code, turns tricky designs into polished interfaces, and is just as comfortable untangling legacy code as building new features from scratch. His use of AI was impressive and led to huge speed improvements across the team.\n\nHe's also a great teammate: dependable, communicative, and always ready to help. Any team would be lucky to have him. Recommend him without reservation and happy to speak to anyone that would like a reference.",
  },
  {
    name: "Maksym Zaiats",
    role: "Senior SDET · QA Lead, Calyptus",
    relation: "Worked on the same team",
    featured: false,
    quote:
      "Working with Serhii as a QA/SDET engineer was a genuinely great experience - I can confidently say he is one of the most QA-friendly frontend developers I've worked with.\n\nHe consistently wrote predictable, well-structured UI that made it easy to build reliable automated tests. No mystery selectors, no layout surprises - just clean, testable components. When bugs came up, Serhii was fast to respond and never made it feel like a battle. We'd often jump on things together and close them out the same day.\n\nI especially appreciated the times he stayed available in the evening to help me work through tricky issues. That's not something you can take for granted, and it made a real difference.\n\nWith strong expertise in React, TypeScript, Next.js, Redux, and GraphQL, Serhii combines technical excellence with a highly collaborative mindset. He consistently delivers high-quality frontend solutions while making everyone around him more effective. He raises the bar not only for frontend quality but also for how engineering teams collaborate.",
  },
  {
    name: "Roman Snihur",
    role: "Backend Software Engineer, Calyptus",
    relation: "Worked on the same team",
    featured: false,
    quote:
      "Serhiy joined us at Calyptus in early 2023, and he instantly stood out as one of the sharpest front-end engineers I've ever worked with. He doesn't just execute tasks-he drives features forward, blending deep technical skills in React and TypeScript with a strong understanding of product value. Whether launching advanced flows or integrating smart mechanics, his work is always clean, scalable, and impactful. Serhiy is an absolute asset to any engineering team looking for world-class talent. Highly recommended!",
  },
  {
    name: "Ross Kolodyazhnyi",
    role: "Entrepreneur · Multiple-Exit Founder",
    relation: "Worked on the same team",
    featured: false,
    quote:
      "I've met Serhii Khomenko in early 2023 on the interview on frontend engineer role at Calyptus, and he quickly became one of the strongest engineers I've worked with.\n\nSince early 2023, Serhii has helped build one of the best products in the industry, consistently going far beyond the brief across new features, redesigns, blockchain and Web3 flows, fintech mechanics, and AI-powered experiences.\n\nHis work across React, Next.js, NestJS, Node.js design tools, frontend engineering and other technologies has been exceptional: thoughtful, scalable, and commercially valuable. He also uses AI in a genuinely high-quality way: to move faster and improve outcomes, without creating generic AI slop.\n\nI'd recommend Serhii to anyone looking for a world-class engineer, and I'd be glad to work with him again in the future.",
  },
];

// short excerpt shown right under the hero; must stay a verbatim part of that person's quote
// Dan Jones's recommendation, word for word, split so the last sentence lands in bold
export const pullQuote = {
  author: "Dan Jones",
  lead: "Can highly recommend Serhii - Serhii was often believed to have a twin/doubled himself, because he moved so quickly and produced a very high quality of work.",
  punch: "Any startup would be lucky to have him.",
};

export type Project = {
  name: string;
  tag: string;
  accent: "default" | "ai";
  description: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "Browser Extension",
    tag: "CHROME · MANIFEST V3",
    accent: "default",
    description:
      "Recruiter-facing tool built end to end: content script injecting UI into third-party pages, background service worker, cross-context message passing, and chrome.storage state.",
    stack: ["TypeScript", "Manifest V3", "Service Worker", "chrome.storage"],
  },
  {
    name: "AI Chat Assistant",
    tag: "STREAMING LLM UI",
    accent: "ai",
    description:
      "Streaming LLM chat UI (OpenAI API) with incremental rendering, conversation state, and graceful error and loading handling - the same pattern powering the assistant on this site.",
    stack: ["React", "TypeScript", "OpenAI API", "Streaming"],
  },
  {
    name: "Real-Time Chat App",
    tag: "WEBSOCKET",
    accent: "default",
    description:
      "WebSocket-based messaging with live presence and reconnection handling, optimised for mobile performance.",
    stack: ["React Native", "WebSocket", "Live Presence"],
  },
];

// one screen of a product tour; width/height are the screenshot's real pixels
export type WorkScreen = {
  src: string;
  title: string;
  path: string;
  caption: string;
  width: number;
  height: number;
};

// shipped work shown in the portfolio; screenshots live in public/works/<name>/.
// every work is shown as a screen deck with a full tour; the first screen is the cover.
export type Work = {
  name: string;
  url?: string;
  host?: string;
  role: string;
  description: string;
  stack: string[];
  kind: "freelance" | "product" | "side";
  year: string;
  screens: WorkScreen[];
  /** kept in the data but left off the site for now */
  hidden?: boolean;
};

export const works: Work[] = [
  {
    name: "Calyptus",
    host: "calyptus.co",
    role: "Founding frontend engineer · employer and candidate apps, Node.js API work",
    description:
      "Video-based AI talent platform used by 100+ companies. I built the React/TypeScript product from zero: AI matching and search, candidate review, assessments, onboarding and payments, and worked on the API and real-time pieces behind them.",
    stack: ["React", "TypeScript", "TanStack Query", "Socket.IO", "OpenAI API", "Stripe", "Node.js"],
    kind: "product",
    year: "2023 - 2026",
    screens: [
      {
        src: "/works/calyptus/candidate-pool.png",
        title: "Candidate pool",
        path: "/company/candidate-pool",
        caption:
          "AI-ranked matches for each role. Natural-language search, a Best fit / Strict toggle, and live progress while the model re-scores candidates in batches.",
        width: 2286,
        height: 1432,
      },
      {
        src: "/works/calyptus/candidate-drawer.png",
        title: "Candidate review",
        path: "/company/candidate-pool/profile",
        caption:
          "Full profile in a side drawer: interview, AI fluency and experience scores, work history and portfolio, without losing your place in the pool.",
        width: 2178,
        height: 3092,
      },
      {
        src: "/works/calyptus/saved-search.png",
        title: "Saved search",
        path: "/company/saved-search",
        caption:
          "Twenty-plus filters across skills, scores, salary and location, kept as removable chips and saved as reusable search templates.",
        width: 1354,
        height: 1634,
      },
      {
        src: "/works/calyptus/assessments.png",
        title: "Assessments",
        path: "/company/assessments",
        caption:
          "AI fluency and skills tests per role: custom or AI-suggested tasks, sent to candidates in one click, with tested and pending counts.",
        width: 2216,
        height: 1562,
      },
      {
        src: "/works/calyptus/candidate-profile.png",
        title: "Candidate profile",
        path: "/profile",
        caption:
          "The candidate side: inline-editable profile, completion meter, work preferences, and Autopilot that applies to matching roles automatically.",
        width: 1926,
        height: 2776,
      },
    ],
  },  {
    name: "Fintech IQ",
    hidden: true,
    url: "https://credit-flow-dev.vercel.app/",
    role: "Multi-page website · build and deployment",
    description:
      "Seven-page site for a Swiss-regulated digital asset intermediary: OTC execution, crypto-fiat exchange and settlement. A restrained dark design that makes a compliance-heavy service easy to follow, with product-style interface visuals instead of stock imagery.",
    stack: ["Next.js", "React", "CSS", "Vercel"],
    kind: "freelance",
    year: "2026",
    screens: [
      {
        src: "/works/fintech-iq/home.jpg",
        title: "Home",
        path: "/",
        caption:
          "Hero with a settlement-dashboard visual, a four-step settlement status strip, and cards that route to every section of the site.",
        width: 2160,
        height: 3242,
      },
      {
        src: "/works/fintech-iq/services.jpg",
        title: "Services",
        path: "/services",
        caption:
          "A settlement desk mockup above nine service rows, each with its eligibility note, plus supported assets and settlement currencies.",
        width: 2160,
        height: 6572,
      },
      {
        src: "/works/fintech-iq/how-it-works.jpg",
        title: "How it works",
        path: "/how-it-works",
        caption:
          "Five-step process from onboarding to monitoring as an accordion, paired with a process-control panel for the current step.",
        width: 2160,
        height: 2751,
      },
      {
        src: "/works/fintech-iq/compliance.jpg",
        title: "Compliance",
        path: "/compliance",
        caption:
          "Regulatory standing, an eight-part compliance framework grid, and an FAQ that answers the hard questions before onboarding.",
        width: 2160,
        height: 5186,
      },
      {
        src: "/works/fintech-iq/contact.jpg",
        title: "Contact",
        path: "/contact",
        caption: "Request form for institutional clients with a service picker, followed by the Zug office.",
        width: 2160,
        height: 4353,
      },
    ],
  },
  {
    name: "Minute Minder",
    hidden: true,
    url: "https://minuteminder.io/",
    role: "Product website · build and deployment",
    description:
      "Marketing site for a Chrome extension that adds a calendar-synced timer to Google Meet. Five pages that turn a small utility into a clear product story: features shown as live UI, a 30-second setup guide, pricing tiers, and a privacy page that explains every permission.",
    stack: ["HTML", "CSS", "JavaScript", "Vercel"],
    kind: "freelance",
    year: "2026",
    screens: [
      {
        src: "/works/minute-minder/home.jpg",
        title: "Home",
        path: "/",
        caption:
          "Hero with an in-call timer mockup, a pain-point section, feature cards, how it works, reviews from the Chrome Web Store, and an FAQ.",
        width: 2160,
        height: 10352,
      },
      {
        src: "/works/minute-minder/features.jpg",
        title: "Features",
        path: "/features",
        caption:
          "Each feature shown as working UI: calendar sync, an editable reminder, the green-yellow-red timer states, the AI agenda, analytics and team views.",
        width: 2160,
        height: 7185,
      },
      {
        src: "/works/minute-minder/how-to-use.jpg",
        title: "How to use",
        path: "/how-to-use",
        caption: "A three-step setup guide with the real install, Google sign-in and in-call screens, plus quick fixes for common issues.",
        width: 2160,
        height: 5130,
      },
      {
        src: "/works/minute-minder/pricing.jpg",
        title: "Pricing",
        path: "/pricing",
        caption: "Four plans from a free timer to enterprise, with the most popular tier highlighted and a custom-plan contact.",
        width: 2160,
        height: 3429,
      },
      {
        src: "/works/minute-minder/security.jpg",
        title: "Privacy",
        path: "/security",
        caption:
          "What the extension can and cannot do, why it needs each permission, and a privacy FAQ, written to answer the trust question up front.",
        width: 2160,
        height: 4367,
      },
    ],
  },
];

// services - flagship cards + compact secondary list
export const services = {
  intro:
    "Available for full-time roles and selected freelance projects. Everything below is backed by shipped production work - ask the AI assistant for details.",
  featured: [
    {
      title: "Vibe-Code Rescue",
      tag: "FLAGSHIP",
      icon: "rescue" as const,
      accent: "ai" as const,
      tagline: "Your AI-built app works - until it doesn't.",
      metric: null,
      bullets: [
        "Deep review of AI-generated codebases: security, performance, architecture",
        "Refactoring to production standards without losing what already ships",
        "Deploy pipeline, monitoring and a clear technical roadmap",
      ],
    },
    {
      title: "AI Features & Assistants",
      tag: "LIVE DEMO ON THIS SITE",
      icon: "ai" as const,
      accent: "ai" as const,
      tagline: "LLM-powered UX that ships - like the assistant in the corner.",
      metric: null,
      bullets: [
        "Chat assistants trained on your product, docs or data",
        "Streaming UX: incremental rendering, fallbacks, latency handling",
        "Provider strategy with cost control: Gemini, Claude, OpenAI, Groq",
      ],
    },
    {
      title: "Performance Sprint",
      tag: "MEASURABLE",
      icon: "performance" as const,
      accent: "default" as const,
      tagline: "Slow apps lose users. I find out why - with numbers.",
      metric: "~35% faster",
      bullets: [
        "Core Web Vitals, bundle and rendering audit with prioritised fixes",
        "Proven results: ~35% faster loads, ~30% lower UI latency under load",
        "Before/after metrics report you can show stakeholders",
      ],
    },
    {
      title: "Web3 Frontend",
      tag: "NICHE",
      icon: "web3" as const,
      accent: "default" as const,
      tagline: "Wallets, dApps and crypto payments that feel like Web2.",
      metric: "−20% errors",
      bullets: [
        "Wallet connection flows and transaction UX",
        "Crypto payment dashboards - cut payment errors by ~20%",
        "Contract-aware frontend: events, calls, failure states",
      ],
    },
  ],
  secondary: [
    { title: "MVP Development", blurb: "idea to deployed product in weeks" },
    { title: "Payments", blurb: "Stripe, checkout flows, subscriptions" },
    { title: "Real-Time", blurb: "WebSocket chats, live dashboards" },
    { title: "Search UX", blurb: "faceted search, -30% time-to-find" },
    { title: "Design Systems", blurb: "testable shadcn/Radix libraries" },
    { title: "AI Tooling for Teams", blurb: "adopt Claude Code without chaos" },
  ],
};

/** the works the site shows */
export const shownWorks = works.filter((work) => !work.hidden);
