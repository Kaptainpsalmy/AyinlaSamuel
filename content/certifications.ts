/** 5 certifications. HackerRank carries a verify link. */
export type Certification = { title: string; issuer: string; year?: string; link?: string };

export const certifications: Certification[] = [
  { title: "IBM Data Science Methodology", issuer: "IBM", year: "2026" },
  { title: "Tools for Data Science", issuer: "IBM", year: "2026" },
  { title: "What is Data Science?", issuer: "IBM", year: "2026" },
  { title: "Python Certification", issuer: "HackerRank", link: "https://www.hackerrank.com/certificates/iframe/eefa525fc35f" },
  { title: "Backend Developer, SickleSense Project", issuer: "Futurize Founder Academy", year: "2025" },
];
