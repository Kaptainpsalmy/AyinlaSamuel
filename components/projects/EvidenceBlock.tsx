import Image from "next/image";
import { BadgeCheck, FileText, ExternalLink } from "lucide-react";

type Evidence = {
  swagger?: string;
  transcript?: string;
  benchmark?: string[];
  verified?: string;
};

export function EvidenceBlock({ evidence, live }: { evidence?: Evidence; live?: string }) {
  if (!evidence) return null;
  const { verified, swagger, transcript, benchmark } = evidence;
  return (
    <aside className="rounded-[22px] border border-accent/30 bg-accent/5 p-6">
      <div className="flex items-center gap-2 text-accent-2">
        <BadgeCheck size={18} />
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest">Proof it works</h2>
      </div>

      {verified && <p className="mt-3 text-sm leading-relaxed text-ink">{verified}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs hover:border-accent">
            <ExternalLink size={13} /> Live site
          </a>
        )}
        {swagger && (
          <a href={swagger} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs hover:border-accent">
            <FileText size={13} /> API docs
          </a>
        )}
        {transcript && (
          <a href={transcript} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs hover:border-accent">
            <FileText size={13} /> Run transcript
          </a>
        )}
      </div>

      {benchmark && benchmark.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {benchmark.map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-canvas">
              <Image src={src} alt="Benchmark chart" fill sizes="50vw" className="object-contain p-2" />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
