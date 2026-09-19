import { services } from "@/content/services";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/common/Icon";

export const metadata = { title: "Services", description: "What I can build for you." };

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <h1 className="text-5xl font-bold tracking-tight">Services</h1>
        <p className="mt-3 max-w-xl text-muted">
          Backend and AI engineering, from APIs to agentic systems.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.title}>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-2">
              <Icon name={s.icon} />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
