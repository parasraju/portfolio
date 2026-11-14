import type { TerminalTheme } from "./themes";

type Streak = { a: number; r: number; speed: number; len: number; color: string; width: number; spin: number };

const TAU = Math.PI * 2;
const COLLAPSE_MS = 1050;
const OPEN_MS = 1000;

const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function setHole(root: HTMLElement, radius: number) {
  const value = radius > 0.5 ? `radial-gradient(circle at 50% 50%, transparent ${radius}px, #000 ${radius + 1.5}px)` : "";
  root.style.maskImage = value;
  root.style.setProperty("-webkit-mask-image", value);
}

export function runBlackHole(root: HTMLElement, theme: TerminalTheme, onOpen: () => void): Promise<void> {
  return new Promise((resolve) => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const diag = Math.hypot(w, h) / 2;
    const horizon = Math.max(26, Math.min(w, h) * 0.075);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const canvas = document.createElement("canvas");
    canvas.className = "ti-hole";
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    root.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";

    const palette = [theme.fg, theme.fn, theme.keyword, theme.string, theme.comment, theme.number, theme.fg];
    const count = Math.round(Math.min(340, 140 + (w * h) / 9000));
    const spawn = (outer: boolean): Streak => ({
      a: Math.random() * TAU,
      r: outer ? diag * (0.9 + Math.random() * 0.35) : horizon * 1.4 + Math.random() * diag * 1.1,
      speed: 0.55 + Math.random() * 0.9,
      len: 0.12 + Math.random() * 0.5,
      color: palette[(Math.random() * palette.length) | 0],
      width: 0.6 + Math.random() * 1.3,
      spin: 0.8 + Math.random() * 0.6,
    });
    const streaks = Array.from({ length: count }, () => spawn(false));

    const content = Array.from(root.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== canvas && !el.classList.contains("ti-splash"),
    );
    content.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.transformOrigin = `${cx - r.left}px ${cy - r.top}px`;
      el.animate(
        [
          { transform: "scale(1) rotate(0deg)", opacity: 1, filter: "blur(0px)" },
          { transform: "scale(0.02) rotate(-40deg)", opacity: 0, filter: "blur(5px)" },
        ],
        { duration: COLLAPSE_MS, easing: "cubic-bezier(0.55, 0, 0.8, 0.3)", fill: "forwards" },
      );
    });

    const start = performance.now();
    let last = start;
    let opened = false;

    const frame = (now: number) => {
      const elapsed = now - start;
      const dt = Math.min(40, now - last) / 1000;
      last = now;
      const collapse = Math.min(1, elapsed / COLLAPSE_MS);
      const open = Math.max(0, Math.min(1, (elapsed - COLLAPSE_MS) / OPEN_MS));

      if (open > 0 && !opened) {
        opened = true;
        onOpen();
      }

      const portal = easeInOutCubic(open) * diag * 1.08;
      const rim = Math.max(horizon * easeOutCubic(collapse), portal + horizon * 0.55 * (1 - open));
      setHole(root, portal);

      ctx.clearRect(0, 0, w, h);
      const fadeIn = Math.min(1, elapsed / 260);
      const pull = 0.35 + 1.4 * easeInCubic(collapse) * (1 - open * 0.4);

      for (const s of streaks) {
        const near = Math.max(rim, s.r);
        const omega = (s.spin * 2.4 * Math.sqrt(diag / near)) * (0.5 + collapse);
        s.a += omega * dt;
        s.r -= s.speed * diag * pull * dt * (0.4 + (diag / near) * 0.12);
        if (s.r < rim * 1.02) {
          if (open < 0.85) Object.assign(s, spawn(true));
          else s.r = rim * 1.02;
        }
        const depth = Math.min(1, (s.r - rim) / (diag * 0.6));
        const alpha = fadeIn * (0.25 + 0.75 * (1 - depth)) * (1 - open * open);
        if (alpha <= 0.01) continue;
        const arc = s.len * (0.6 + 1.6 * (1 - depth));
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width * (0.7 + 0.8 * (1 - depth));
        ctx.beginPath();
        ctx.arc(cx, cy, s.r, s.a - arc, s.a);
        ctx.stroke();
      }

      if (rim > 0.5) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(cx, cy, rim, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.9 * (1 - open);
        ctx.strokeStyle = theme.fn;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = theme.fn;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, rim + 1.5, 0, TAU);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (open >= 1) {
        resolve();
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}
