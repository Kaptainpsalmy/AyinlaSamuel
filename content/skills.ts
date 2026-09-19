/** 18 skills grouped by domain (enhancement over the flat list on the current site). */
export type SkillGroup = { label: string; skills: string[] };

export const skills: SkillGroup[] = [
  {
    label: "Backend",
    skills: ["Python", "FastAPI", "Django", "Flask", "Node.js", "PHP", "Laravel"],
  },
  {
    label: "AI & ML",
    skills: ["scikit-learn", "Pandas", "NumPy"],
  },
  {
    label: "Frontend",
    skills: ["JavaScript", "React", "Next.js"],
  },
  {
    label: "Data & Infra",
    skills: ["PostgreSQL", "Redis", "MongoDB", "Docker", "Git"],
  },
];

/** Flat list for compact displays. */
export const allSkills = skills.flatMap((g) => g.skills);
