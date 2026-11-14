import type { TerminalTheme } from "./themes";

const TW = 240;
const TH = 264;
const X0 = -1;
const X1 = 1;
const Y0 = -1.1;
const Y1 = 1.1;
const SX = (X1 - X0) / (TW - 1);
const SY = (Y1 - Y0) / (TH - 1);

const NONE = 0;
const SKIN = 1;
const SCLERA = 2;
const TEETH = 3;
const MOUTH = 4;
const TONGUE = 5;
const TEAR = 6;
const IRIS = 7;
const PUPIL = 8;
const GLINT = 9;
const METAL = 10;
const MAT_COUNT = 11;
const LEVELS = 14;

const RAMP = " .:-=+*o#%@";
const GLYPHS = `${RAMP}|O`;
const TEAR_STREAK = RAMP.length;
const TEAR_DROP = RAMP.length + 1;
const BASE_TILT = -0.3;
const IRIS_R = 0.066;
const PUPIL_R = 0.028;

type Ellipse = { x: number; y: number; rx: number; ry: number; rot: number };

const EYES: Ellipse[] = [
  { x: -0.36, y: -0.08, rx: 0.235, ry: 0.155, rot: 0.2 },
  { x: 0.33, y: -0.37, rx: 0.225, ry: 0.15, rot: -0.22 },
];
const MOUTH_SHAPE: Ellipse = { x: 0.13, y: 0.57, rx: 0.37, ry: 0.27, rot: -0.38 };
const ALBEDO = [0, 0.95, 1.35, 1.3, 0.1, 0.5, 0.62, 1, 0.1, 1.5, 1];
const GLOSS = [0, 0.55, 0.6, 0.45, 0, 0.2, 0.9, 0.5, 0.4, 0, 0.7];

function toLocal(e: Ellipse, px: number, py: number): [number, number] {
  const c = Math.cos(e.rot);
  const s = Math.sin(e.rot);
  const dx = px - e.x;
  const dy = py - e.y;
  return [(dx * c + dy * s) / e.rx, (-dx * s + dy * c) / e.ry];
}

function bump(e: Ellipse, px: number, py: number) {
  const [lx, ly] = toLocal(e, px, py);
  return Math.exp(-(lx * lx + ly * ly));
}

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const vx = bx - ax;
  const vy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
  return Math.hypot(px - ax - vx * t, py - ay - vy * t);
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

type Texture = {
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
  ao: Float32Array;
  ink: Float32Array;
  mat: Uint8Array;
  eye: Int8Array;
  tearS: Int8Array;
  tearT: Float32Array;
};

type TearStream = { pts: [number, number][]; w0: number; w1: number; beads: number[]; falls: boolean; speed: number };

const TEARS: TearStream[] = [
  { pts: [[-0.4, 0.05], [-0.43, 0.25], [-0.47, 0.45], [-0.5, 0.6], [-0.47, 0.74]], w0: 0.034, w1: 0.05, beads: [0.34, 0.7, 1], falls: true, speed: 0.34 },
  { pts: [[-0.22, 0.02], [-0.25, 0.18], [-0.3, 0.33], [-0.33, 0.47]], w0: 0.028, w1: 0.04, beads: [0.5, 1], falls: false, speed: 0.42 },
  { pts: [[0.38, -0.21], [0.44, -0.02], [0.52, 0.2], [0.58, 0.4], [0.6, 0.55]], w0: 0.034, w1: 0.05, beads: [0.4, 0.78, 1], falls: true, speed: 0.3 },
  { pts: [[0.18, -0.24], [0.2, -0.08], [0.23, 0.07]], w0: 0.027, w1: 0.036, beads: [1], falls: false, speed: 0.5 },
];

type StreamPath = { pts: [number, number][]; cum: number[]; total: number };

const TEAR_PATHS: StreamPath[] = TEARS.map(({ pts }) => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, total: cum[cum.length - 1] };
});

function nearestOnStream(path: StreamPath, px: number, py: number) {
  let best = Infinity;
  let bestT = 0;
  const { pts, cum, total } = path;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const vx = pts[i][0] - ax;
    const vy = pts[i][1] - ay;
    const u = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
    const d = Math.hypot(px - ax - vx * u, py - ay - vy * u);
    if (d < best) {
      best = d;
      bestT = (cum[i - 1] + u * (cum[i] - cum[i - 1])) / total;
    }
  }
  return { d: best, t: bestT };
}

function tearWidth(stream: TearStream, t: number) {
  let w = stream.w0 + (stream.w1 - stream.w0) * t;
  for (const b of stream.beads) w += 0.024 * Math.exp(-(((t - b) / 0.045) ** 2));
  return w;
}

let cachedTexture: Texture | null = null;

function buildTexture(): Texture {
  if (cachedTexture) return cachedTexture;
  const n = TW * TH;
  const h = new Float32Array(n);
  const disp = new Float32Array(n);
  const mat = new Uint8Array(n);
  const eye = new Int8Array(n).fill(-1);
  const tearS = new Int8Array(n).fill(-1);
  const tearT = new Float32Array(n);
  const inkMap = new Float32Array(n);

  const corner = (s: number) => {
    const c = Math.cos(MOUTH_SHAPE.rot);
    const sn = Math.sin(MOUTH_SHAPE.rot);
    return [MOUTH_SHAPE.x + c * MOUTH_SHAPE.rx * 1.06 * s, MOUTH_SHAPE.y + sn * MOUTH_SHAPE.rx * 1.06 * s];
  };
  const [lcx, lcy] = corner(-1);
  const [rcx, rcy] = corner(1);

  for (let j = 0; j < TH; j++) {
    const y = Y0 + j * SY;
    for (let i = 0; i < TW; i++) {
      const x = X0 + i * SX;
      const idx = j * TW + i;
      const a = 0.74 + 0.07 * y;
      const e = (x / a) ** 2 + y * y;
      if (e >= 1) continue;

      const dome = Math.sqrt(1 - e) * 0.85;
      let f = 0;
      let m = SKIN;
      let ink = 0;
      const mark = (distance: number, width: number, strength: number) => {
        const v = strength * Math.exp(-((distance / width) ** 2));
        if (v > ink) ink = v;
      };

      f += 0.008 * (noise(x * 15, y * 15) - 0.5);

      const band = smoothstep(-0.32, -0.5, y) * smoothstep(-0.97, -0.78, y);
      if (band > 0) {
        const w = Math.sin((y + 0.07 * Math.sin(x * 4.2 + 1) + 0.03 * x) * 46);
        f -= 0.03 * band * Math.max(0, w) ** 8;
        ink = Math.max(ink, 0.6 * band * Math.max(0, w) ** 8);
      }
      const furrow = smoothstep(-0.25, -0.4, y) * smoothstep(-0.75, -0.55, y);
      f -= 0.03 * furrow * (Math.exp(-(((x - 0.01) / 0.02) ** 2)) + Math.exp(-(((x - 0.09) / 0.02) ** 2)));
      if (furrow > 0) {
        mark(x - 0.01, 0.016, 0.6 * furrow);
        mark(x - 0.09, 0.016, 0.6 * furrow);
      }

      for (let k = 0; k < EYES.length; k++) {
        const ey = EYES[k];
        const [lx, ly] = toLocal(ey, x, y);
        const q = lx * lx + ly * ly;
        const r = Math.sqrt(q);
        f -= 0.11 * Math.exp(-q / 3);
        f -= 0.07 * Math.exp(-(((r - 1.05) / 0.06) ** 2));
        f += 0.06 * Math.exp(-(((r - 1.22) / 0.12) ** 2));
        f += 0.04 * bump({ x: ey.x, y: ey.y + ey.ry * 1.95, rx: ey.rx * 1.1, ry: 0.045, rot: ey.rot }, x, y);
        f -= 0.02 * bump({ x: ey.x, y: ey.y + ey.ry * 1.5, rx: ey.rx * 0.95, ry: 0.018, rot: ey.rot }, x, y);
        mark((r - 1.02) * ey.ry, 0.02, 0.95);
        if (ly < 0) mark((r - 1.5) * ey.ry, 0.016, 0.55);
        if (ly > 0.2) mark((r - 1.7) * ey.ry, 0.016, 0.42);
        const browRot = ey.rot + (k === 0 ? -0.38 : 0.38);
        f += 0.075 * bump({ x: ey.x + (k === 0 ? 0.04 : -0.04), y: ey.y - ey.ry - 0.12, rx: 0.25, ry: 0.06, rot: browRot }, x, y);
        if (q < 1) {
          m = SCLERA;
          eye[idx] = k;
          f += 0.15 * Math.sqrt(1 - q);
        }
      }

      f += 0.1 * bump({ x: 0.0, y: 0.0, rx: 0.065, ry: 0.24, rot: 0.12 }, x, y);
      f += 0.09 * bump({ x: 0.03, y: 0.2, rx: 0.11, ry: 0.075, rot: 0 }, x, y);
      f += 0.035 * bump({ x: -0.08, y: 0.24, rx: 0.05, ry: 0.045, rot: 0 }, x, y);
      f += 0.035 * bump({ x: 0.15, y: 0.22, rx: 0.05, ry: 0.045, rot: 0 }, x, y);
      f -= 0.09 * bump({ x: -0.05, y: 0.27, rx: 0.035, ry: 0.022, rot: 0.2 }, x, y);
      f -= 0.09 * bump({ x: 0.11, y: 0.255, rx: 0.035, ry: 0.022, rot: -0.2 }, x, y);
      ink = Math.max(ink, 0.95 * bump({ x: -0.05, y: 0.27, rx: 0.045, ry: 0.03, rot: 0.2 }, x, y));
      ink = Math.max(ink, 0.95 * bump({ x: 0.11, y: 0.255, rx: 0.045, ry: 0.03, rot: -0.2 }, x, y));

      f += 0.07 * bump({ x: -0.47, y: 0.2, rx: 0.2, ry: 0.17, rot: 0 }, x, y);
      f += 0.06 * bump({ x: 0.5, y: -0.02, rx: 0.18, ry: 0.2, rot: 0 }, x, y);
      mark(segDist(x, y, -0.6, 0.06, lcx - 0.08, lcy - 0.04), 0.014, 0.45);
      mark(segDist(x, y, -0.5, 0.3, lcx - 0.02, lcy + 0.12), 0.014, 0.35);
      mark(segDist(x, y, 0.6, -0.2, rcx + 0.06, rcy - 0.12), 0.014, 0.45);
      mark(segDist(x, y, 0.62, 0.05, rcx + 0.02, rcy + 0.05), 0.014, 0.35);

      const dl = segDist(x, y, -0.1, 0.25, lcx, lcy);
      const dr = segDist(x, y, 0.17, 0.22, rcx, rcy);
      for (const d of [dl, dr]) {
        f -= 0.045 * Math.exp(-((d / 0.022) ** 2));
        f += 0.03 * Math.exp(-(((d - 0.05) / 0.035) ** 2));
        mark(d, 0.018, 0.65);
      }

      const [mx, my] = toLocal(MOUTH_SHAPE, x, y);
      const mq = mx * mx + my * my;
      const mr = Math.sqrt(mq);
      f += 0.075 * Math.exp(-(((mr - 1.12) / 0.12) ** 2));
      if (mr > 0.98) mark((mr - 1) * MOUTH_SHAPE.ry, 0.02, 0.8);
      if (mq < 1) {
        m = MOUTH;
        const depth = Math.sqrt(1 - mq);
        f -= 0.28 * depth;
        const ang = Math.atan2(my, mx);
        const upper = my < 0;
        const inner = upper ? 0.6 : 0.66;
        if (mr > inner && Math.abs(Math.sin(ang)) > 0.28) {
          const t = ((ang + Math.PI) / (2 * Math.PI)) * 15;
          const fr = t - Math.floor(t);
          if (fr > 0.12 && fr < 0.88) {
            m = TEETH;
            const tip = (mr - inner) / (1 - inner);
            f += 0.26 * depth + 0.035 * Math.sin(Math.PI * fr) + 0.02 * Math.sqrt(tip) - 0.03;
          }
        }
        if (m === MOUTH && my > 0.12 && mr < 0.76) {
          m = TONGUE;
          f += 0.11 * Math.exp(-((mx / 0.55) ** 2 + ((my - 0.5) / 0.35) ** 2));
        }
      }

      if (m === SKIN) {
        for (let s = 0; s < TEARS.length; s++) {
          const { d, t } = nearestOnStream(TEAR_PATHS[s], x, y);
          const w = tearWidth(TEARS[s], t);
          if (d < w) {
            m = TEAR;
            tearS[idx] = s;
            tearT[idx] = t;
            f += 0.06 * Math.sqrt(1 - (d / w) ** 2);
            ink = 0;
            break;
          }
          mark(d - w, 0.018, 0.95);
        }
      }

      h[idx] = dome * 0.75 + f * 1.5;
      disp[idx] = f;
      mat[idx] = m;
      inkMap[idx] = ink;
    }
  }

  const nx = new Float32Array(n);
  const ny = new Float32Array(n);
  const nz = new Float32Array(n);
  const ao = new Float32Array(n);
  for (let j = 1; j < TH - 1; j++) {
    for (let i = 1; i < TW - 1; i++) {
      const idx = j * TW + i;
      if (!mat[idx]) continue;
      const gx = (h[idx + 1] - h[idx - 1]) / (2 * SX);
      const gy = (h[idx + TW] - h[idx - TW]) / (2 * SY);
      const len = Math.hypot(gx, gy, 1);
      nx[idx] = -gx / len;
      ny[idx] = -gy / len;
      nz[idx] = 1 / len;
      const d = disp[idx];
      ao[idx] = Math.max(0.25, Math.min(1.1, 1 + 2.2 * Math.min(0, d) + 0.5 * Math.max(0, d)));
    }
  }

  cachedTexture = { nx, ny, nz, ao, ink: inkMap, mat, eye, tearS, tearT };
  return cachedTexture;
}

function parseHex(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

function mixHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  const to = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return `#${to(ar + (br - ar) * t)}${to(ag + (bg - ag) * t)}${to(ab + (bb - ab) * t)}`;
}

export type GazeState = {
  eyes: { x: number; y: number }[];
  lead: number;
  gaze: { x: number; y: number };
  fear: number;
  hasPointer: boolean;
};

type Options = {
  reducedMotion: boolean;
  onFrame?: (state: GazeState) => void;
};

export class BehelitRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tex = buildTexture();
  private opts: Options;
  private w = 0;
  private h = 0;
  private cw = 6;
  private ch = 10;
  private cols = 0;
  private rows = 0;
  private fontFamily = "monospace";
  private fontSize = 10;
  private keys = new Uint8Array(0);
  private glyphs = new Uint8Array(0);
  private order = new Uint16Array(0);
  private counts = new Uint32Array(MAT_COUNT * LEVELS + 1);
  private palette: string[] = [];
  private light = false;
  private raf = 0;
  private last = 0;
  private rect = { left: 0, top: 0 };
  private pointer = { x: 0, y: 0, at: -1e9 };
  private target = { x: 0, y: 0 };
  private gaze = { x: 0, y: 0 };
  private head = { x: 0, y: 0 };
  private fear = 0;
  private saccadeAt = 0;
  private swing = 0;
  private faceCx = 0;
  private faceCy = 0;
  private scale = 100;
  private tilt = BASE_TILT;

  constructor(canvas: HTMLCanvasElement, theme: TerminalTheme, opts: Options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true })!;
    this.opts = opts;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
    if (family) this.fontFamily = `${family}, ui-monospace, monospace`;
    this.setTheme(theme);
    this.resize();
  }

  setTheme(theme: TerminalTheme) {
    this.light = theme.mode === "light";
    const base: string[] = [];
    base[NONE] = theme.bg;
    base[SKIN] = theme.face;
    base[SCLERA] = theme.bone;
    base[TEETH] = mixHex(theme.bone, theme.metal, 0.15);
    base[MOUTH] = mixHex(theme.face, "#000000", 0.62);
    base[TONGUE] = mixHex(theme.face, "#3a0606", 0.35);
    base[TEAR] = this.light ? mixHex(theme.iris, "#0b1c33", 0.2) : mixHex(theme.bone, "#a9d4ff", 0.55);
    base[IRIS] = theme.iris;
    base[PUPIL] = this.light ? "#050505" : mixHex(theme.bg, "#000000", 0.3);
    base[GLINT] = "#ffffff";
    base[METAL] = theme.metal;
    this.palette = [];
    for (let m = 0; m < MAT_COUNT; m++) {
      for (let l = 0; l < LEVELS; l++) {
        const t = l / (LEVELS - 1);
        this.palette[m * LEVELS + l] = this.light
          ? mix(base[m], "#120806", 0.1 + 0.55 * t)
          : mix(theme.bg, base[m], 0.2 + 0.8 * t);
      }
    }
    if (!this.raf) this.draw(performance.now());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.rect = { left: rect.left, top: rect.top };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.fontSize = Math.max(7, Math.min(10, Math.round(Math.min(rect.height / 88, rect.width / 60))));
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.cw = this.ctx.measureText("M").width || this.fontSize * 0.6;
    this.ch = this.fontSize * 1.02;
    this.cols = Math.ceil(this.w / this.cw);
    this.rows = Math.ceil(this.h / this.ch);
    const cells = this.cols * this.rows;
    this.keys = new Uint8Array(cells);
    this.glyphs = new Uint8Array(cells);
    this.order = new Uint16Array(cells);
    this.scale = Math.min((this.h * 0.82) / 2.1, this.w * 0.47);
    if (!this.raf) this.draw(performance.now());
  }

  syncRect() {
    const rect = this.canvas.getBoundingClientRect();
    this.rect = { left: rect.left, top: rect.top };
  }

  setPointer(x: number, y: number) {
    this.pointer = { x, y, at: performance.now() };
  }

  clearPointer() {
    this.pointer.at = -1e9;
  }

  start() {
    if (this.raf) return;
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      if (now - this.last < 1000 / 61) return;
      this.last = now;
      this.draw(now);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private faceToScreen(fx: number, fy: number) {
    const c = Math.cos(this.tilt);
    const s = Math.sin(this.tilt);
    return { x: this.faceCx + (fx * c - fy * s) * this.scale, y: this.faceCy + (fx * s + fy * c) * this.scale };
  }

  private update(now: number) {
    const t = now / 1000;
    const anchorX = this.w * 0.5 + Math.sin(BASE_TILT) * 1.06 * this.scale;
    const hasPointer = now - this.pointer.at < 3500;

    const centerClientX = this.rect.left + this.faceCx;
    const centerClientY = this.rect.top + this.faceCy;
    if (hasPointer) {
      const dx = this.pointer.x - centerClientX;
      const dy = this.pointer.y - centerClientY;
      this.target.x = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.45)));
      this.target.y = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.45)));
      const dist = Math.hypot(dx, dy);
      const near = 1 - smoothstep(this.scale * 0.6, this.scale * 1.6, dist);
      this.fear += (near - this.fear) * 0.05;
    } else {
      if (now > this.saccadeAt) {
        this.saccadeAt = now + 900 + Math.random() * 2200;
        this.target.x = (Math.random() - 0.5) * 0.9;
        this.target.y = (Math.random() - 0.5) * 0.6;
      }
      this.fear += (0 - this.fear) * 0.05;
    }

    const eyeLerp = this.opts.reducedMotion ? 1 : 0.16;
    this.gaze.x += (this.target.x - this.gaze.x) * eyeLerp;
    this.gaze.y += (this.target.y - this.gaze.y) * eyeLerp;
    const headLerp = this.opts.reducedMotion ? 1 : 0.035;
    this.head.x += (this.target.x - this.head.x) * headLerp;
    this.head.y += (this.target.y - this.head.y) * headLerp;

    const sway = this.opts.reducedMotion ? 0 : 0.035 * Math.sin(t * 0.85) + 0.012 * Math.sin(t * 2.1);
    this.swing = sway + this.head.x * 0.05;
    this.tilt = BASE_TILT + this.swing * 1.4;
    const chain = this.h * 0.14;
    const topX = anchorX + Math.sin(this.swing) * chain;
    const topY = Math.cos(this.swing) * chain;
    this.faceCx = topX - Math.sin(this.tilt) * 1.06 * this.scale;
    this.faceCy = topY + Math.cos(this.tilt) * 1.06 * this.scale;
    if (this.fear > 0.05 && !this.opts.reducedMotion) {
      this.faceCx += Math.sin(t * 23) * 1.1 * this.fear;
      this.faceCy += Math.sin(t * 29 + 1.3) * 0.9 * this.fear;
    }
    return hasPointer;
  }

  draw(now: number) {
    const hasPointer = this.update(now);
    const { ctx, tex, cols, rows, cw, ch } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    if (!cols || !rows) return;

    const cosT = Math.cos(-this.tilt);
    const sinT = Math.sin(-this.tilt);
    const yaw = this.head.x * 0.22;
    const pitch = this.head.y * 0.14;
    const sinYaw = Math.sin(yaw);
    const sinPitch = Math.sin(pitch);

    const gx = this.gaze.x * cosT - this.gaze.y * sinT;
    const gy = this.gaze.x * sinT + this.gaze.y * cosT;
    const gm = Math.hypot(gx, gy);
    const gn = gm > 1 ? 1 / gm : 1;
    const pupils = EYES.map((e) => ({ x: e.x + gx * gn * e.rx * 0.5, y: e.y + gy * gn * e.ry * 0.42 }));
    const pupilR = PUPIL_R * (1 - 0.35 * this.fear);
    const clock = this.opts.reducedMotion ? 0 : now / 1000;
    const drops = new Float32Array(TEARS.length * 2);
    TEARS.forEach((s, i) => {
      const p = (clock * s.speed + i * 0.37) % 1;
      drops[i * 2] = p;
      drops[i * 2 + 1] = (p + 0.5) % 1;
    });

    let l2x = this.head.x * 0.9;
    let l2y = this.head.y * 0.9;
    let l2z = 0.7;
    const l2n = Math.hypot(l2x, l2y, l2z);
    l2x /= l2n;
    l2y /= l2n;
    l2z /= l2n;
    const l1x = 0.3;
    const l1y = -0.45;
    const l1z = 0.82;
    let hx = l1x;
    let hy = l1y;
    let hz = l1z + 1;
    const hn = Math.hypot(hx, hy, hz);
    hx /= hn;
    hy /= hn;
    hz /= hn;

    const counts = this.counts;
    counts.fill(0);
    const skip = MAT_COUNT * LEVELS;
    const rampLen = RAMP.length;
    const invScale = 1 / this.scale;

    for (let r = 0; r < rows; r++) {
      const py = r * ch + ch / 2 - this.faceCy;
      for (let c = 0; c < cols; c++) {
        const cell = r * cols + c;
        const px = c * cw + cw / 2 - this.faceCx;
        let fx = (px * cosT - py * sinT) * invScale;
        let fy = (px * sinT + py * cosT) * invScale;
        const a = 0.74 + 0.07 * fy;
        const e = (fx / a) ** 2 + fy * fy;
        if (e >= 1 || fy < Y0 || fy > Y1) {
          this.keys[cell] = skip;
          continue;
        }
        const z = Math.sqrt(1 - e);
        fx -= sinYaw * z * 0.5;
        fy -= sinPitch * z * 0.5;
        const ti = Math.round((fx - X0) / SX);
        const tj = Math.round((fy - Y0) / SY);
        if (ti < 1 || tj < 1 || ti >= TW - 1 || tj >= TH - 1) {
          this.keys[cell] = skip;
          continue;
        }
        const idx = tj * TW + ti;
        let m = tex.mat[idx];
        if (!m) {
          this.keys[cell] = skip;
          continue;
        }
        const nx = tex.nx[idx];
        const ny = tex.ny[idx];
        const nz = tex.nz[idx];
        const d1 = Math.max(0, nx * l1x + ny * l1y + nz * l1z);
        const d2 = Math.max(0, nx * l2x + ny * l2y + nz * l2z);
        const spec = Math.max(0, nx * hx + ny * hy + nz * hz) ** 26;
        const ink = 1 - tex.ink[idx];
        let lum: number;
        if (m === SCLERA) lum = (0.62 + 0.38 * d1) * (0.3 + 0.7 * ink) + spec * GLOSS[m];
        else if (m === TEETH) lum = (0.52 + 0.45 * d1) * ink + spec * GLOSS[m];
        else if (m === MOUTH) lum = 0.035;
        else lum = (tex.ao[idx] * (0.16 + 0.66 * d1 + 0.16 * d2) * ALBEDO[m] + spec * GLOSS[m]) * ink;

        let tearPulse = 0;
        if (m === TEAR) {
          const s = tex.tearS[idx] * 2;
          const tt = tex.tearT[idx];
          const a = tt - drops[s];
          const b = tt - drops[s + 1];
          tearPulse = Math.exp(-(a * a) / 0.002) + Math.exp(-(b * b) / 0.002);
          lum = 0.62 + 0.25 * d1 + spec * GLOSS[TEAR] + 0.4 * tearPulse;
        }

        if (m === SCLERA) {
          const p = pupils[tex.eye[idx]];
          const ddx = fx - p.x;
          const ddy = fy - p.y;
          const dist = Math.hypot(ddx, ddy);
          if (Math.hypot(ddx + 0.018, ddy + 0.02) < 0.011) {
            m = GLINT;
            lum = 1;
          } else if (dist < pupilR) {
            m = PUPIL;
            lum = 0.04;
          } else if (dist < IRIS_R) {
            m = IRIS;
            lum = lum * (0.45 + 0.55 * (dist / IRIS_R)) * ALBEDO[IRIS];
          } else if (dist < IRIS_R + 0.008) {
            lum *= 0.55;
          }
        }

        lum = lum < 0 ? 0 : lum > 1 ? 1 : lum;
        const v = this.light && m !== TEAR ? 1 - lum : lum;
        const g = Math.min(rampLen - 1, Math.floor(v * rampLen));
        if (g === 0) {
          this.keys[cell] = skip;
          continue;
        }
        const level = Math.min(LEVELS - 1, Math.floor(v * LEVELS));
        const key = m * LEVELS + level;
        this.keys[cell] = key;
        this.glyphs[cell] = m === TEAR ? (tearPulse > 0.45 ? TEAR_DROP : TEAR_STREAK) : g;
        counts[key]++;
      }
    }

    let sum = 0;
    for (let k = 0; k <= skip; k++) {
      const n = counts[k];
      counts[k] = sum;
      sum += n;
    }
    const cells = cols * rows;
    for (let i = 0; i < cells; i++) {
      const k = this.keys[i];
      if (k === skip) continue;
      this.order[counts[k]++] = i;
    }

    let currentKey = -1;
    for (let o = 0; o < sum; o++) {
      const i = this.order[o];
      const k = this.keys[i];
      if (k !== currentKey) {
        currentKey = k;
        ctx.fillStyle = this.palette[k];
      }
      const r = (i / cols) | 0;
      const c = i - r * cols;
      ctx.fillText(GLYPHS[this.glyphs[i]], c * cw + cw / 2, r * ch + ch / 2);
    }

    this.drawChain(now);
    this.drawFallingTears(drops);

    const eyesScreen = pupils.map((p) => {
      const s = this.faceToScreen(p.x, p.y);
      return { x: this.rect.left + s.x, y: this.rect.top + s.y };
    });
    let lead = 0;
    if (hasPointer) {
      const d0 = Math.hypot(this.pointer.x - eyesScreen[0].x, this.pointer.y - eyesScreen[0].y);
      const d1 = Math.hypot(this.pointer.x - eyesScreen[1].x, this.pointer.y - eyesScreen[1].y);
      lead = d1 < d0 ? 1 : 0;
    }
    this.opts.onFrame?.({ eyes: eyesScreen, lead, gaze: { ...this.gaze }, fear: this.fear, hasPointer });
  }

  private drawFallingTears(drops: Float32Array) {
    if (this.opts.reducedMotion) return;
    const { ctx, ch } = this;
    TEARS.forEach((stream, i) => {
      if (!stream.falls) return;
      const [ex, ey] = stream.pts[stream.pts.length - 1];
      const end = this.faceToScreen(ex, ey);
      for (const p of [drops[i * 2], drops[i * 2 + 1]]) {
        const seconds = p / stream.speed;
        if (seconds > 0.9) continue;
        const fall = 0.5 * 2.4 * this.scale * seconds * seconds + ch * 0.6;
        const fade = 1 - seconds / 0.9;
        const level = Math.max(2, Math.round((LEVELS - 1) * fade));
        ctx.fillStyle = this.palette[TEAR * LEVELS + level];
        ctx.fillText(fall > ch * 2.5 ? "o" : "0", end.x, end.y + fall);
        if (fall > ch * 1.6) {
          ctx.fillStyle = this.palette[TEAR * LEVELS + Math.max(1, level - 4)];
          ctx.fillText("'", end.x, end.y + fall - ch * 0.95);
        }
      }
    });
  }

  private drawChain(now: number) {
    const { ctx, ch } = this;
    const top = this.faceToScreen(0.0, -1.06);
    const anchorX = this.w * 0.5 + Math.sin(BASE_TILT) * 1.06 * this.scale;
    const dx = top.x - anchorX;
    const dy = top.y;
    const len = Math.hypot(dx, dy);
    const steps = Math.floor(len / (ch * 0.9));
    const shimmer = this.opts.reducedMotion ? 0 : now / 600;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const x = anchorX + dx * t;
      const y = dy * t;
      const glow = 0.45 + 0.35 * Math.sin(i * 0.9 - shimmer);
      const level = Math.max(1, Math.min(LEVELS - 1, Math.round(glow * (LEVELS - 1))));
      ctx.fillStyle = this.palette[METAL * LEVELS + level];
      ctx.fillText(i % 2 === 0 ? "0" : "|", x, y);
    }
    const ring = [
      [-0.06, -1.0, "("],
      [0.06, -1.0, ")"],
      [0, -1.06, "o"],
    ] as const;
    for (const [fx, fy, glyph] of ring) {
      const s = this.faceToScreen(fx, fy);
      ctx.fillStyle = this.palette[METAL * LEVELS + LEVELS - 2];
      ctx.fillText(glyph, s.x, s.y);
    }
  }
}
