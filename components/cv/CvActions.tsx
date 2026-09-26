"use client";
import { useTranslations } from "next-intl";
import { Printer, Download } from "lucide-react";
import { toast } from "@/components/common/Toast";

export function CvActions() {
  const t = useTranslations("cv");
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
      // PDF service unreachable: the page itself is print-styled, so print it.
      toast(t("pdfFallback"));
      window.print();
    }
  }
  return (
    <div className="flex gap-3 print:hidden">
      <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas hover:opacity-90">
        <Download size={15} /> {t("downloadPdf")}
      </button>
      <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm hover:border-accent">
        <Printer size={15} /> {t("print")}
      </button>
    </div>
  );
}
