/** Single source of truth for identity, socials, and navigation. */
export const site = {
  name: "Ayinla Samuel Olorunwa",
  shortName: "Ayinla Samuel",
  brand: "PsalmNova",
  role: "Backend & AI Software Engineer",
  location: "Lagos, Nigeria",
  email: "kaptainpsalmy@gmail.com",
  phone: "+234 903 929 5254",
  githubUser: "kaptainpsalmy",
  socials: {
    github: "https://github.com/kaptainpsalmy",
    linkedin: "https://www.linkedin.com/in/ayinla-samuel-9a4053294",
    twitter: "https://twitter.com/kaptainpsalmy",
    whatsapp: "https://wa.me/2349039295254",
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
