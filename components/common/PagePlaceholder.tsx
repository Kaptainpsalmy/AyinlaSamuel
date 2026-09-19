export function PagePlaceholder({ title, note }: { title: string; note?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-2">In progress</p>
      <h1 className="mt-3 text-5xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-lg text-muted">
        {note ?? "This section is being built. The shell, navigation, and command palette are live."}
      </p>
    </section>
  );
}
