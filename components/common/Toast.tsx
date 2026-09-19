"use client";
import { useEffect, useState, useCallback } from "react";

type Toast = { id: number; message: string };

/** Fire a toast from anywhere: document.dispatchEvent(new CustomEvent("toast", { detail: "text" })) */
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    function onToast(e: Event) {
      const message = (e as CustomEvent<string>).detail;
      if (!message) return;
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message }]);
      setTimeout(() => remove(id), 3000);
    }
    document.addEventListener("toast", onToast);
    return () => document.removeEventListener("toast", onToast);
  }, [remove]);

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2"
      aria-live="polite"
      role="status"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-full border border-line bg-card px-4 py-2 text-sm text-ink shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

/** Helper so callers do not repeat the event boilerplate. */
export function toast(message: string) {
  document.dispatchEvent(new CustomEvent("toast", { detail: message }));
}
