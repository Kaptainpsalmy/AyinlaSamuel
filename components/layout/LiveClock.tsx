"use client";
import { useEffect, useState } from "react";

/**
 * Live Lagos clock for the sidebar signal block. Renders nothing until mounted
 * so server and client markup match (avoids a hydration mismatch on the time).
 */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setNow(fmt());
    const id = window.setInterval(() => setNow(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {now ?? "--:--:--"} WAT
    </span>
  );
}
