import { projects } from "@/.velite";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";

export const metadata = {
  title: "Projects",
  description: "Backend and AI systems I have designed, built, and shipped.",
};

type SP = { [key: string]: string | string[] | undefined };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" ? sp.type : "";
  const stack = typeof sp.stack === "string" ? sp.stack : "";
  const q = (typeof sp.q === "string" ? sp.q : "").toLowerCase().trim();
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  // all unique stacks for the filter chips
  const allStacks = Array.from(new Set(projects.flatMap((p) => p.stack))).sort();

  let list = projects.filter((p) => {
    if (type && p.type !== type) return false;
    if (stack && !p.stack.includes(stack)) return false;
    if (q) {
      const hay = (p.title + " " + p.tagline + " " + p.stack.join(" ") + " " + p.categories.join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    if (sort === "newest") return b.year.localeCompare(a.year);
    if (sort === "az") return a.title.localeCompare(b.title);
    // featured: featured first, then by order
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">Projects</h1>
        <p className="mt-3 max-w-xl text-muted">
          Everything I have designed, built, and shipped. Backend systems, AI, and the
          infrastructure in between.
        </p>
      </header>

      <ProjectFilters stacks={allStacks} />

      <p className="mt-6 font-mono text-xs text-muted">
        {list.length} {list.length === 1 ? "project" : "projects"}
      </p>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted">No projects match these filters.</p>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}
