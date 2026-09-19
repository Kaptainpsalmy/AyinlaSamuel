export const metadata = { title: "Licenses", description: "Credits and attribution." };

const credits = [
  { name: "Next.js", note: "React framework", license: "MIT" },
  { name: "React", note: "UI library", license: "MIT" },
  { name: "Tailwind CSS", note: "Styling", license: "MIT" },
  { name: "Motion", note: "Animation", license: "MIT" },
  { name: "cmdk", note: "Command palette", license: "MIT" },
  { name: "Lucide", note: "Icons", license: "ISC" },
  { name: "Velite", note: "Content pipeline", license: "MIT" },
  { name: "Shiki", note: "Code highlighting", license: "MIT" },
  { name: "Space Grotesk", note: "Display and body typeface", license: "OFL" },
  { name: "JetBrains Mono", note: "Monospace typeface", license: "OFL" },
  { name: "FastAPI", note: "Python backend", license: "MIT" },
];

export default function LicensesPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight">Licenses</h1>
        <p className="mt-3 text-muted">
          This site is built with open-source software. Credit where it is due.
        </p>
      </header>
      <div className="divide-y divide-line rounded-xl border border-line">
        {credits.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-sm text-muted">{c.note}</span>
            </div>
            <span className="font-mono text-xs text-muted">{c.license}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Screenshots and project content are the work of Ayinla Samuel Olorunwa, except where
        a project is credited to a client or employer.
      </p>
    </section>
  );
}
