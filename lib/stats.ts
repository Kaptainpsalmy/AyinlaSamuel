/**
 * Derived portfolio figures for the sidebar. Everything is computed from the
 * content data, never hardcoded, so the rail can never drift from reality (the
 * reference site's own lesson: a hardcoded "5+ years" had gone two years stale).
 */
import { projects } from "@/.velite";
import { experience } from "@/content/experience";
import { site } from "@/content/site";

export function getSidebarStats() {
  // Distinct real employers (a founder's own venture counts; NDA ones still
  // count as a company even without a public name).
  const companyCount = new Set(experience.map((r) => r.company)).size;

  // Projects shipped: everything authored in the content pipeline.
  const projectCount = projects.length;

  // Years of experience: earliest start year in the employment history to now.
  const startYears = experience
    .map((r) => {
      const m = r.start.match(/\d{4}/);
      return m ? Number(m[0]) : null;
    })
    .filter((n): n is number => n !== null);
  const earliest = startYears.length ? Math.min(...startYears) : null;
  const computed = earliest ? new Date().getFullYear() - earliest : 0;
  // Fall back to the authored figure (e.g. "4+") if the dates cannot be parsed.
  const years = computed > 0 ? computed : parseInt(site.yearsExperience, 10) || 0;

  // `years` is a number so each language can phrase it ("4+ years experience").
  return { companyCount, projectCount, years };
}
