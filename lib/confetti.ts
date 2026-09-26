/**
 * Tiny dependency-free confetti burst on a throwaway full-screen canvas.
 * Respects prefers-reduced-motion (does nothing). Uses the site's accent plus a
 * couple of celebratory hues. Auto-removes when the pieces settle.
 */
export function burstConfetti(count = 120) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const colors = ["#2b2bff", "#5b5bff", "#12b76a", "#ffb020", "#ff6584"];
  const pieces = Array.from({ length: count }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 120,
    y: canvas.height / 2 + (Math.random() - 0.5) * 60,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -14 - 4,
    size: Math.random() * 6 + 4,
    color: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));

  let frame = 0;
  const gravity = 0.4;

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (frame > 60) p.life -= 0.02;
      if (p.life > 0 && p.y < canvas.height + 20) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }
    frame++;
    if (alive && frame < 240) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(tick);
}
