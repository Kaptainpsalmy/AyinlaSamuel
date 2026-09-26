"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shuffle, Trophy, RotateCcw, Timer, Sparkles, Eye } from "lucide-react";
import { facts } from "@/content/facts";
import { burstConfetti } from "@/lib/confetti";
import { CompactFrame, QuickStartButton } from "./TakeABreakShell";

/**
 * "Take a break": a drag-and-swap picture puzzle. Pick up a tile and drop it
 * on another; they swap. Solve it to reveal the picture, earn confetti and a
 * "did you know..." fact about Samuel, then play again for the next fact.
 *
 * Two shapes:
 *  - compact (sidebar): tiny board, minimal chrome, a link to the full page.
 *  - full (the /play page): timer presets, best time, the fact reveal, confetti.
 *
 * Board is a length-9 array of tile indices 0..8 (no blank; every tile shows).
 * The facts themselves stay English: they are claims about Samuel's work.
 */

// `label` is a message key under game.image.
const IMAGES = [
  { src: "/images/puzzle/engineer.jpg", label: "engineer" },
  { src: "/images/puzzle/portrait.jpg", label: "portrait" },
  { src: "/images/puzzle/office.jpg", label: "office" },
  { src: "/images/puzzle/portrait2.jpg", label: "portrait2" },
  { src: "/images/puzzle/ai.jpg", label: "ai" },
  { src: "/images/puzzle/code.jpg", label: "code" },
  { src: "/images/puzzle/money.jpg", label: "money" },
];

const N = 3;
const SIZE = N * N;
const SOLVED = Array.from({ length: SIZE }, (_, i) => i);
const TIMER_OPTIONS = [0, 60, 120, 180]; // seconds; 0 = no timer
const BEST_KEY = "takeabreak.best";

function shuffled(): number[] {
  let b: number[];
  do {
    b = [...SOLVED];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
  } while (b.every((v, i) => v === i));
  return b;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, "0")}`;
}

/**
 * `autoStart` begins a shuffled game on mount: the sidebar loads this component
 * on the first click of its start button (see LazyTakeABreak), so it opens
 * straight into play. Only ever mounted on the client in that case.
 */
export function TakeABreak({ compact = false, autoStart = false }: { compact?: boolean; autoStart?: boolean }) {
  const t = useTranslations("game");
  const [imgIndex, setImgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [board, setBoard] = useState<number[]>(() => (autoStart ? shuffled() : SOLVED));
  const [started, setStarted] = useState(autoStart);
  const [won, setWon] = useState(false);
  const [showReward, setShowReward] = useState(false); // reward pops up a beat after the win
  const [drag, setDrag] = useState<number | null>(null);
  const [overPos, setOverPos] = useState<number | null>(null);
  const [peek, setPeek] = useState(false); // "reveal full picture" hint

  // timer (full mode only)
  const [limit, setLimit] = useState(0); // chosen seconds; 0 = off
  const [elapsed, setElapsed] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const image = IMAGES[imgIndex];
  const label = t(`image.${image.label}`);

  useEffect(() => {
    try {
      const v = localStorage.getItem(BEST_KEY);
      if (v) setBest(Number(v));
    } catch {}
  }, []);

  const stopTimer = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  const start = useCallback(
    (advanceImg = false) => {
      stopTimer();
      setImgIndex((n) => (advanceImg ? (n + 1) % IMAGES.length : n));
      setBoard(shuffled());
      setStarted(true);
      setWon(false);
      setShowReward(false);
      setTimedOut(false);
      setPeek(false);
      setDrag(null);
      setElapsed(0);
      if (!compact) {
        tickRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      }
    },
    [compact, stopTimer],
  );

  // time-out watch (full mode with a limit)
  useEffect(() => {
    if (compact || won || timedOut || limit === 0 || !started) return;
    if (elapsed >= limit) {
      setTimedOut(true);
      stopTimer();
    }
  }, [elapsed, limit, won, timedOut, started, compact, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // Let the solved picture breathe for a couple of seconds before the reward
  // card pops up, so the win lands first.
  useEffect(() => {
    if (!won) return;
    const id = window.setTimeout(() => setShowReward(true), 2500);
    return () => window.clearTimeout(id);
  }, [won]);

  // Side effects (timer, confetti, storage) run here, never inside a state
  // updater: React may call updaters twice in development, which would fire
  // the confetti twice.
  const doSwap = useCallback(
    (from: number, to: number) => {
      if (from === to || won || timedOut) return;
      const next = [...board];
      [next[from], next[to]] = [next[to], next[from]];
      setBoard(next);
      if (!next.every((v, i) => v === i)) return;

      setWon(true);
      stopTimer();
      burstConfetti(compact ? 60 : 140);
      if (!compact && (best === null || elapsed < best)) {
        setBest(elapsed);
        try { localStorage.setItem(BEST_KEY, String(elapsed)); } catch {}
      }
    },
    [board, won, timedOut, compact, best, elapsed, stopTimer],
  );

  const playMore = useCallback(() => {
    setFactIndex((f) => (f + 1) % facts.length);
    start(true);
  }, [start]);

  const tile = (pos: number) => {
    const piece = board[pos];
    const tr = Math.floor(piece / N);
    const tc = piece % N;
    const isOver = overPos === pos && drag !== null && drag !== pos;
    return (
      <button
        key={pos}
        draggable={!won && !timedOut}
        onDragStart={() => setDrag(pos)}
        onDragOver={(e) => {
          e.preventDefault();
          setOverPos(pos);
        }}
        onDragEnd={() => {
          setDrag(null);
          setOverPos(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (drag !== null) doSwap(drag, pos);
          setDrag(null);
          setOverPos(null);
        }}
        // touch + keyboard: tap/Enter to pick, then tap/Enter another to swap
        onClick={() => {
          if (won || timedOut) return;
          if (drag === null) setDrag(pos);
          else {
            doSwap(drag, pos);
            setDrag(null);
          }
        }}
        aria-label={drag === pos ? t("tilePicked", { n: piece + 1 }) : t("tile", { n: piece + 1 })}
        aria-pressed={drag === pos}
        className={
          "relative overflow-hidden rounded-md ring-1 transition-transform duration-150 " +
          (drag === pos ? "ring-2 ring-accent scale-95 " : "ring-line ") +
          (isOver ? "ring-2 ring-accent-2 " : "") +
          (won || timedOut ? "cursor-default " : "cursor-grab active:cursor-grabbing")
        }
      >
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${image.src})`,
            backgroundSize: `${N * 100}% ${N * 100}%`,
            backgroundPosition: `${(tc / (N - 1)) * 100}% ${(tr / (N - 1)) * 100}%`,
          }}
        />
      </button>
    );
  };

  const boardWidth = compact ? "100%" : "min(82vw, 420px)";
  const solvedText = compact ? t("solved") : t("solvedIn", { time: fmt(elapsed) });

  const Board = (
    <div
      role="group"
      aria-label={t("boardLabel", { label })}
      className="relative grid aspect-square grid-cols-3 gap-1 rounded-xl bg-card p-1"
      style={{ width: boardWidth }}
    >
      {board.map((_, pos) => tile(pos))}

      {/* peek hint: the full target picture, shown while "reveal" is on */}
      {peek && !won && !timedOut && (
        <div className="pointer-events-none absolute inset-1 overflow-hidden rounded-md ring-2 ring-accent">
          <Image src={image.src} alt={t("targetAlt", { label })} fill sizes="420px" className="object-cover" />
          <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
            {t("target")}
          </span>
        </div>
      )}

      {/* revealed picture behind the overlay */}
      {(won || timedOut) && (
        <div className="pointer-events-none absolute inset-1 overflow-hidden rounded-md">
          <Image src={image.src} alt={label} fill sizes="420px" className="object-cover" />
        </div>
      )}

      {/* time-up ribbon */}
      {timedOut && !won && (
        <div role="status" className="pointer-events-none absolute inset-x-1 bottom-1 flex items-center gap-1.5 rounded-b-md bg-black/65 px-2 py-1.5 text-xs text-white">
          {t("timeUp")}
        </div>
      )}

      {/* just-solved ribbon: shows for the ~2.5s beat before the reward pops up,
          so the completed picture lands first */}
      {won && !showReward && (
        <div role="status" className="pointer-events-none absolute inset-x-1 bottom-1 flex items-center justify-center gap-1.5 rounded-b-md bg-black/65 px-2 py-2 text-sm font-medium text-white">
          <Trophy size={14} className="text-ok" /> {solvedText}
        </div>
      )}

      {/* WIN reward pop-up, on top of the board, after the beat */}
      {won && showReward && (
        <div className="absolute inset-1 flex items-center justify-center rounded-md bg-black/55 p-3 backdrop-blur-[2px] animate-fade-in-up">
          <div
            className={
              "w-full rounded-xl border border-line bg-canvas text-center shadow-2xl " +
              (compact ? "max-w-[15rem] p-3" : "max-w-[19rem] p-4")
            }
          >
            <p className={"flex items-center justify-center gap-1.5 font-medium text-ok-ink " + (compact ? "text-xs" : "text-sm")}>
              <Trophy size={compact ? 13 : 15} /> {solvedText}
            </p>
            <p className={"mt-2 font-semibold uppercase tracking-wide text-accent-2 " + (compact ? "text-[11px]" : "text-xs")}>
              {t("didYouKnow")}
            </p>
            <p lang="en" className={"mt-1 leading-snug text-ink " + (compact ? "text-[13px]" : "text-sm")}>
              {facts[factIndex]}
            </p>
            <button
              onClick={playMore}
              className={
                "mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent font-medium text-white hover:opacity-90 " +
                (compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm")
              }
            >
              <Sparkles size={compact ? 12 : 14} /> {t("playMore")}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ---- compact (sidebar) ----
  if (compact) {
    return (
      <CompactFrame>
        {!started ? (
          <QuickStartButton onClick={() => start(false)} />
        ) : (
          <>
            {Board}
            {/* the win reward (fact + play more) is the overlay on the board; this
                row is just the quiet controls while playing */}
            {!won && (
              <div className="mt-2 flex items-center justify-between gap-2">
                <button onClick={() => start(false)} className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-ink">
                  <RotateCcw size={11} /> {t("shuffle")}
                </button>
                <button
                  onClick={() => setPeek((v) => !v)}
                  aria-pressed={peek}
                  className={"inline-flex items-center gap-1 text-[11px] " + (peek ? "text-accent-2" : "text-muted hover:text-ink")}
                >
                  <Eye size={11} /> {peek ? t("hide") : t("reveal")}
                </button>
                <Link href="/play" className="text-[11px] text-muted hover:text-accent-2">
                  {t("bigger")}
                </Link>
              </div>
            )}
          </>
        )}
      </CompactFrame>
    );
  }

  // ---- full (/play page) ----
  return (
    <div className="flex flex-col items-center gap-5">
      {!started ? (
        <>
          <div className="relative overflow-hidden rounded-xl ring-1 ring-line" style={{ width: boardWidth }}>
            <Image src={image.src} alt={label} width={420} height={420} className="aspect-square w-full object-cover" loading="eager" fetchPriority="high" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted" role="group" aria-label={t("timeYourself")}>
              <Timer size={15} />
              <span>{t("timeYourself")}:</span>
              {TIMER_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setLimit(s)}
                  aria-pressed={limit === s}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-colors " +
                    (limit === s ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")
                  }
                >
                  {s === 0 ? t("noTimer") : t("minutes", { n: s / 60 })}
                </button>
              ))}
            </div>
            <button
              onClick={() => start(false)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90"
            >
              <Shuffle size={16} /> {t("start")}
            </button>
            <p className="max-w-sm text-center text-xs text-muted">{t("howTo")}</p>
          </div>
        </>
      ) : (
        <>
          {/* timer + best */}
          <div className="flex items-center gap-4 font-mono text-sm">
            <span className={timedOut ? "text-warn-ink" : "text-ink"}>
              {limit > 0 ? t("left", { time: fmt(Math.max(0, limit - elapsed)) }) : fmt(elapsed)}
            </span>
            {best !== null && <span className="text-muted">{t("best", { time: fmt(best) })}</span>}
          </div>

          {Board}

          {/* the win reward pops up ON the board (overlay above). These are the
              controls while playing. */}
          {!won && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPeek((v) => !v)}
                aria-pressed={peek}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors " +
                  (peek ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink")
                }
              >
                <Eye size={14} /> {peek ? t("hidePicture") : t("revealPicture")}
              </button>
              <button onClick={() => start(false)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm text-muted hover:text-ink">
                <RotateCcw size={14} /> {t("reshuffle")}
              </button>
              <button onClick={() => start(true)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink">
                <Shuffle size={14} /> {t("newPicture")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
