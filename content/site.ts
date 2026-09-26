/** Single source of truth for identity, socials, bio, and navigation. */
export const site = {
  name: "Ayinla Samuel Olorunwa",
  shortName: "Ayinla Samuel",
  brand: "PsalmNova",
  role: "Full-Stack Software Engineer, Backend & AI focus",
  roleShort: "Backend & AI Engineer",
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
  // 3-paragraph bio: full-stack framing, backend and AI as the specialization,
  // frontend shown as an owned skill (Samuel designs and builds his own UI).
  bio: [
    "I am a Full-Stack Software Engineer who specializes in backend and AI. I build scalable APIs, backend systems, automation platforms, and intelligent AI-powered applications using Python, FastAPI, Django, Flask, Node.js, and Laravel, and I design and build my own product interfaces with React, Next.js, and TypeScript.",
    "My experience includes backend architecture, asynchronous processing, authentication systems, Redis-based task queues, database optimization, third-party API integrations, and cloud deployment workflows. I also specialize in AI systems engineering, including agentic AI workflows, Retrieval-Augmented Generation (RAG), multi-agent systems, and intelligent automation.",
    "I own the complete product experience, from the interface down to the API and the pipeline in between. My focus is backend and AI engineering, and I enjoy designing reliable production-grade systems that solve real-world problems efficiently and at scale.",
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
  { href: "/lab", label: "Lab" },
  { href: "/play", label: "Play" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
] as const;
