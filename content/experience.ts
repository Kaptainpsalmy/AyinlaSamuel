/**
 * Employment history. All dates verified from README.md.
 * Copy rules applied: NDA startups carry no names; the own startup is NOT "Aegis"
 * and has no product name; BEMA start shown as year only.
 */
export type Role = {
  company: string;
  role: string;
  start: string;
  end: string; // "Present" for ongoing
  type: "Internship" | "Full-time" | "Contract" | "Freelance" | "Founder";
  blurb: string; // one line on what the company does
  points: string[]; // what Samuel built/did
  confidential?: boolean;
};

export const experience: Role[] = [
  {
    company: "Sabre Travel Network",
    role: "Backend Developer",
    start: "Mar 2026",
    end: "Aug 2026",
    type: "Internship",
    blurb:
      "A travel technology company operating the Sabre Global Distribution System (GDS) and related airline reservation and distribution solutions across Central and West Africa.",
    points: [
      "Built the SabreCWA Assessment Platform backend: FastAPI, async SQLAlchemy, JWT auth, seven question types, auto-grading, anti-cheat, certificates, and analytics.",
      "Built a WhatsApp helpdesk RAG bot (Groq, pgvector, hybrid retrieval) that answers Sabre-format questions and reduces human support load.",
      "Built the IASG Cooperative backend (Django REST, Flutterwave payments, savings and loans) serving five affiliated companies.",
      "Built a flight price-monitor microservice with idempotent alerts when a fare drops by 10 percent or more.",
    ],
  },
  {
    company: "BEMA Integrated Services",
    role: "Software Engineer / Full Stack",
    start: "2026",
    end: "Present",
    type: "Full-time",
    blurb:
      "A faith-driven, technology-focused organization and Christian music ministry that develops digital platforms such as BemaHub and provides tech, fintech, marketing, and content solutions for gospel music, faith-based organizations, and Christian creators.",
    points: [
      "Own the BemaHub backend: a WordPress plugin exposing the BMH REST API for campaigns, wallet and Recognized Impact ledger, referral logic, events, and protected media.",
      "Integrated Paystack and PayPal payments, S3 signed media, and a 149-test launch-readiness verification suite.",
    ],
  },
  {
    company: "Computer Engineering, LAUTECH",
    role: "Data Scientist / AI-ML",
    start: "2024",
    end: "Present",
    type: "Contract",
    blurb: "Ladoke Akintola University of Technology, Ogbomoso.",
    points: [
      "Built several software tools using MATLAB and Python for research and analysis.",
    ],
  },
  {
    company: "Freelance / Contract",
    role: "Backend & AI Software Engineer",
    start: "2022",
    end: "Present",
    type: "Freelance",
    blurb: "Independent backend and AI engineering for a range of clients.",
    points: [
      "Designed and shipped scalable backend systems and RESTful APIs with FastAPI, Django, Flask, Node.js, and Laravel.",
      "Built authentication systems, admin dashboards, background task queues, and database-driven applications.",
      "Delivered AI-powered applications: LLM workflows, agentic systems, and automation pipelines.",
    ],
  },
  {
    company: "Confidential early-stage startups",
    role: "Backend Developer",
    start: "",
    end: "",
    type: "Contract",
    blurb: "Backend engineering for early-stage startups under NDA.",
    points: [
      "Backend development for confidential early-stage startups. Details under NDA.",
    ],
    confidential: true,
  },
  {
    company: "Own venture (in research and development)",
    role: "Founder / Backend",
    start: "",
    end: "Present",
    type: "Founder",
    blurb: "An early-stage venture currently in research and development.",
    points: [
      "Founding and building an early-stage venture, currently in the research phase.",
    ],
    confidential: true,
  },
];
