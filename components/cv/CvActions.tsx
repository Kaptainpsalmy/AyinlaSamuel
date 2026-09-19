"use client";
import { Printer, Download } from "lucide-react";
import { toast } from "@/components/common/Toast";

export function CvActions() {
  async function downloadPdf() {
    try {
      const res = await fetch("/api/py/resume");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "Ayinla-Samuel-CV.pdf"; a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast("Opening print dialog (PDF export coming soon)");
      window.print();
    }
  }
  return (
    <div className="flex gap-3 print:hidden">
      <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas hover:opacity-90">
        <Download size={15} /> Download PDF
      </button>
      <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm hover:border-accent">
        <Printer size={15} /> Print
      </button>
    </div>
  );
}
