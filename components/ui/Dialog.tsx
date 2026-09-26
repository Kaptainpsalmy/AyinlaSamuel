"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Lightweight accessible modal. Built on the native <dialog> element so focus
 * trapping, Esc-to-close, and the top layer come from the platform (no extra
 * dependency). Both themes via tokens. cmdk owns the command palette; this is
 * for ordinary modals.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Backdrop click: the dialog element itself is the click target only
        // when the ::backdrop (outside the content box) is clicked.
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100vw-2rem)] max-w-lg rounded-[22px] border border-line bg-canvas p-0 text-ink",
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="font-medium">{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
