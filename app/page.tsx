export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "clamp(1.5rem, 6vw, 6rem)",
        background: "#0e0e10",
        color: "#f2f2f0",
        fontFamily:
          "'Space Grotesk', system-ui, -apple-system, sans-serif",
      }}
    >
      <p
        style={{
          fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#6f6fff",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#3ddc84",
            display: "inline-block",
          }}
        />
        Under construction · Lagos
      </p>
      <h1
        style={{
          fontSize: "clamp(2.5rem, 9vw, 7rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          margin: 0,
        }}
      >
        Ayinla Samuel
      </h1>
      <p style={{ color: "#9a9a9c", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", maxWidth: 560 }}>
        Backend &amp; AI Engineer — new portfolio in progress.
        Built with Next.js 16 + FastAPI. Kinetic Minimal.
      </p>
    </main>
  );
}

export const metadata = {
  title: "Ayinla Samuel — PsalmNova",
  description: "Backend & AI Engineer. Portfolio under construction.",
};
