export const profile = {
  name: "Serhii Khomenko",
  role: "Senior Frontend Engineer · React / TypeScript",
  location: "Lviv, Ukraine",
  summary:
    "Senior Frontend Engineer with 7+ years in React, TypeScript, and Next.js, specialising in AI-powered product UX - LLM features in production, streaming model responses, and agentic development workflows (Claude Code daily). Measurable impact across fintech, Web3, and eCommerce: ~35% faster apps, +15% conversion, platforms serving 100k+ users.",
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
  stack: string[];
  highlights: string[];
};

export const experience: Job[] = [
  {
    company: "Calyptus",
    location: "London, UK",
    period: "Sep 2023 - Present",
    title: "Software Engineer",
    product: "AI-powered talent platform",
    stack: [
      "React",
      "TypeScript",
      "shadcn/Radix",
      "WebSocket",
      "LLM/OpenAI API",
      "Stripe",
      "web3",
      "AWS",
      "CI/CD",
    ],
    highlights: [
      "Owned and built the full React/TypeScript front-end architecture serving 100k+ users, adopted by leading Web3 companies",
      "Integrated LLM-powered features end-to-end (candidate-job matching, smart search, automated profile parsing), wiring the front-end to AI/LLM APIs",
      "Designed UX for streaming AI responses: incremental rendering, progress states, and graceful fallbacks for model latency and errors",
      "Collaborated with backend and product on prompt design and response formatting to improve the quality of AI output in the UI",
      "Built internal dashboards, admin tools, and Stripe payment workflows; set up CI/CD pipelines and AWS deployments",
      "Improved application performance by ~35% via code splitting, lazy loading, and real-time update optimisation",
    ],
  },
  {
    company: "Avenga",
    location: "London, UK",
    period: "Jul 2022 - Jun 2023",
    title: "Software Engineer",
    product: "Insurance Technology Portal",
    stack: ["React", "TypeScript", "REST APIs", "Contentful", "Auth0", "AWS", "CI/CD"],
    highlights: [
      "Built a scalable faceted search system (filtering, sorting, navigation) that cut time-to-find by ~30%",
      "Reduced initial load time by ~25-35% and response times by ~20% via lazy loading and bundle optimisation",
      "Defined API contracts and aligned frontend-backend interactions for efficient data indexing and search accuracy",
      "Integrated 5+ third-party data sources to enrich search results and improve relevance",
      "Delivered responsive, mobile-first UI consistent across all devices",
    ],
  },
  {
    company: "Perfectial",
    location: "USA",
    period: "Mar 2021 - Jul 2022",
    title: "Software Engineer",
    product: "Crypto & Payment Infrastructure",
    stack: ["React", "Redux", "TypeScript", "web3", "Solidity", "REST APIs", "Jest"],
    highlights: [
      "Built a crypto payments dashboard for transactions, wallets, and payment flows in a unified interface",
      "Integrated multiple payment providers and blockchain interactions, cutting payment errors by ~20%",
      "Architected scalable Redux state management for high-frequency transaction data",
      "Reduced UI latency by ~30% during peak transaction periods under high load",
    ],
  },
  {
    company: "StarApps",
    location: "UK · USA",
    period: "Oct 2019 - Feb 2021",
    title: "Front End Developer",
    product: "Corporate Management App & Online Store",
    stack: ["React", "JavaScript", "Node.js", "REST APIs", "MongoDB", "SASS"],
    highlights: [
      "Developed and scaled core HR modules (Leave, Timesheets, Attendance, Reporting) used daily by internal teams",
      "Built e-commerce features (listings, cart, checkout) and REST API integrations that lifted conversion by ~15%",
      "Worked as a backend developer in Node.js: built and maintained REST APIs, business logic, and data integrations powering the HR and e-commerce modules",
      "Improved performance by ~25%, resolved critical production issues, and built a reusable UI component library",
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
    items: ["Node.js", "MongoDB", "GraphQL", "Apollo", "REST APIs", "WebSocket"],
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
    name: "Angus Crombie",
    role: "Head of Platform, Calyptus",
    relation: "Managed Serhii directly",
    featured: true,
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
