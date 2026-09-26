"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { CompactFrame, QuickStartButton } from "./TakeABreakShell";

// The game (board, images, confetti, facts) loads on the first click, not with
// every page: until then the sidebar only needs its start button.
const loadGame = () => import("./TakeABreak").then((m) => m.TakeABreak);
const TakeABreak = dynamic(loadGame, {
  ssr: false,
  loading: () => (
    <CompactFrame>
      <QuickStartButton aria-busy disabled />
    </CompactFrame>
  ),
});

export function LazyTakeABreak() {
  const [play, setPlay] = useState(false);
  if (play) return <TakeABreak compact autoStart />;
  return (
    <CompactFrame>
      {/* hovering or focusing warms the chunk so the click feels instant */}
      <QuickStartButton onPointerEnter={loadGame} onFocus={loadGame} onClick={() => setPlay(true)} />
    </CompactFrame>
  );
}
