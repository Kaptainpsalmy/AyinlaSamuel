/** 8 services (verbatim from the current site). Icon names are lucide icons. */
export type Service = { icon: string; title: string; description: string };

export const services: Service[] = [
  { icon: "Bot", title: "Agentic AI Systems", description: "Autonomous AI agents, multi-agent architectures, tool integration, and LLM-powered workflows." },
  { icon: "Brain", title: "RAG & LLM Solutions", description: "Retrieval-Augmented Generation systems, LLM integration, and intelligent document processing." },
  { icon: "Server", title: "Backend Development", description: "FastAPI, Django, Node.js, Laravel. RESTful APIs, authentication, microservices, and scalable architectures." },
  { icon: "Code", title: "Full Stack Python", description: "End-to-end Python solutions from backend APIs to AI-powered applications." },
  { icon: "Database", title: "Database & Caching", description: "PostgreSQL, Redis, MongoDB. Optimized queries and high-performance caching strategies." },
  { icon: "Cloud", title: "Containerization & Deployment", description: "Docker containerization, production deployments, and scalable infrastructure." },
  { icon: "LineChart", title: "Data Science & Analytics", description: "Predictive analytics, feature engineering, and data pipeline development." },
  { icon: "Workflow", title: "Async Processing", description: "Background workers, task queues, and real-time processing with Redis." },
];
