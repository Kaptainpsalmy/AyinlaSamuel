import { skills } from "@/content/skills";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Skills", description: "Backend, AI/ML, data, and infrastructure." };

export default function SkillsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">Skills</h1>
        <p className="mt-3 text-muted">The tools I build with, grouped by domain.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {skills.map((group) => (
          <Card key={group.label}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-accent-2">{group.label}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((s) => <Badge key={s} className="text-sm">{s}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
