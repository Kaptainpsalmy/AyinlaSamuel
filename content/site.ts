/** Single source of truth for identity, socials, bio, and navigation. */
export const site = {
  name: "Ayinla Samuel Olorunwa",
  shortName: "Ayinla Samuel",
  brand: "PsalmNova",
  role: "Backend & AI Software Engineer",
  tagline:
    "I build intelligent and automated solutions using Python, AI, and modern backend technologies.",
  location: "Lagos, Nigeria",
  locationFull: "Alagbado, Lagos, Nigeria",
  yearsExperience: "4+",
  email: "kaptainpsalmy@gmail.com",
  emailAlt: "ayinlasamuel099@gmail.com",
  phone: "+234 903 929 5254",
  phoneAlt: "+234 810 829 9099",
  githubUser: "kaptainpsalmy",
  available: true,
  socials: {
    github: "https://github.com/kaptainpsalmy",
    linkedin: "https://www.linkedin.com/in/ayinla-samuel-9a4053294",
    twitter: "https://twitter.com/kaptainpsalmy",
    whatsapp: "https://wa.me/2349039295254",
  },
  // 3-paragraph bio (verbatim from current site, lightly tightened).
  bio: [
    "I am a Backend and AI Software Engineer focused on building scalable APIs, backend systems, automation platforms, and intelligent AI-powered applications using Python, FastAPI, Django, Flask, Node.js, and Laravel.",
    "My experience includes backend architecture, asynchronous processing, authentication systems, Redis-based task queues, database optimization, third-party API integrations, and cloud deployment workflows. I also specialize in AI systems engineering, including agentic AI workflows, Retrieval-Augmented Generation (RAG), multi-agent systems, and intelligent automation.",
    "I enjoy designing reliable production-grade software systems that combine modern backend engineering with advanced AI capabilities to solve real-world problems efficiently and at scale.",
  ],
  education: {
    degree: "B.Tech, Computer Engineering",
    school: "Ladoke Akintola University of Technology (LAUTECH)",
    location: "Ogbomoso, Nigeria",
  },
} as const;

/** Primary navigation, matching the reference site's surface. */
export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
] as const;
