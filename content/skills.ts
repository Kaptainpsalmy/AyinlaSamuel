/** Skills grouped by domain (enhancement over the flat list on the current site). */
export type SkillGroup = { label: string; skills: string[] };

export const skills: SkillGroup[] = [
  {
    label: "Backend",
    skills: ["Python", "FastAPI", "Django", "Flask", "Node.js", "PHP", "Laravel"],
  },
  {
    label: "AI & ML",
    skills: ["RAG", "Agentic AI", "LLM integration", "scikit-learn", "Pandas", "NumPy"],
  },
  {
    // Frontend is an owned skill: Samuel designs and builds all his own product UI.
    label: "Frontend",
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "JavaScript", "UI implementation"],
  },
  {
    label: "Data & Infra",
    skills: ["PostgreSQL", "Redis", "MongoDB", "Docker", "Git"],
  },
];

/** Flat list for compact displays. */
export const allSkills = skills.flatMap((g) => g.skills);
