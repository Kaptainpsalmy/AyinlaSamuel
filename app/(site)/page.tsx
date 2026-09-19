export default function Home() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col justify-center gap-5 px-4 py-24 sm:px-6">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-2">
        <span className="inline-block h-2 w-2 rounded-full bg-ok" /> Available for work, Lagos
      </p>
      <h1 className="text-[clamp(2.5rem,9vw,7rem)] font-bold leading-[0.95] tracking-[-0.04em]">
        Ayinla Samuel
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Backend and AI Engineer. The full site is being built section by section.
        Try the command palette with Cmd or Ctrl + K.
      </p>
    </section>
  );
}
