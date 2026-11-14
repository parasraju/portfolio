"use client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { markIntroEntered } from "@/lib/intro";
import { setTheme as setSiteTheme } from "@/lib/theme";
import { BehelitRenderer, type GazeState } from "./behelit";
import { runBlackHole } from "./blackhole";
import { escapeHtml, highlightLine, tokensToHtml, type HighlightState, type Token } from "./highlight";
import { INTRO_FILES } from "./introCode";
import { TERMINAL_THEMES, loadTerminalTheme, saveTerminalTheme, themeById, themeStyle, themeSwatches, type TerminalTheme } from "./themes";

type Row = { file: number; ln: number | null; tokens: Token[]; text: string; header?: boolean };
type Edit =
  | { kind: "backspace"; row: number; target: number; pos: number }
  | { kind: "select"; from: number; to: number; next: number; at: number }
  | { kind: "hold"; from: number; to: number; until: number }
  | { kind: "delete"; from: number; to: number; until: number };

const CHARS_PER_SECOND = 480;
const CARET = '<span class="ti-caret"> </span>';
const FILE_LINES = INTRO_FILES.map((f) => f.code.split("\n").length);
const DEFAULT_MESSAGE = "the behelit weeps. paras raju — engineer, builder of tools. enter if you dare.";
const NEAR_MESSAGE = "it sees you.";
const SPLASH_TITLE = "Paras Portfolio";
const SPLASH_SUB = "~/paras $ ./boot --summon behelit";
const FACE_CMD = ":!./face --track";
const MOBILE_QUERY = "(max-width: 767px)";
const MOBILE_CODE_MS = 9000;
const MOBILE_FACE_MS = 9000;
const MANUAL_SCROLL_MS = 6000;

function buildRows(): Row[] {
  const rows: Row[] = [];
  INTRO_FILES.forEach((file, fi) => {
    const comment = file.lang === "py" ? "#" : "//";
    const title = `${comment} —— ${file.project}/${file.path} ——`;
    rows.push({ file: fi, ln: null, tokens: [["c", title]], text: title, header: true });
    rows.push({ file: fi, ln: null, tokens: [], text: "" });
    const state: HighlightState = { block: null };
    file.code.split("\n").forEach((line, i) => {
      rows.push({ file: fi, ln: i + 1, tokens: highlightLine(line, file.lang, state), text: line });
    });
    rows.push({ file: fi, ln: null, tokens: [], text: "" });
  });
  return rows;
}

function fuzzy(query: string, name: string) {
  let i = 0;
  for (const ch of name) if (ch === query[i]) i++;
  return i === query.length;
}

function subscribeMobile(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export function TerminalIntro({ onDone }: { onDone: () => void }) {
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const mobile = useMobile();
  const [booting, setBooting] = useState(true);
  const [themeId, setThemeId] = useState(() =>
    loadTerminalTheme(document.documentElement.classList.contains("dark") ? "dark" : "light").id,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const theme = themeById(preview ?? themeId);

  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLPreElement>(null);
  const pathRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  const cmdlineRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dashRef = useRef<SVGLineElement>(null);
  const solidRef = useRef<SVGLineElement>(null);
  const boxRef = useRef<SVGRectElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const splashTitleRef = useRef<HTMLSpanElement>(null);
  const splashSubRef = useRef<HTMLSpanElement>(null);
  const rendererRef = useRef<BehelitRenderer | null>(null);
  const themeRef = useRef<TerminalTheme>(theme);
  const leavingRef = useRef(false);
  const pickerOpenRef = useRef(false);
  const liveRef = useRef(false);
  const skipSplashRef = useRef<() => void>(() => {});
  const userScrollRef = useRef<() => void>(() => {});

  useEffect(() => {
    themeRef.current = theme;
    rendererRef.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    pickerOpenRef.current = pickerOpen;
  }, [pickerOpen]);

  useEffect(() => {
    enterRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const splash = splashRef.current;
    const title = splashTitleRef.current;
    const sub = splashSubRef.current;
    if (!splash || !title || !sub) return;
    const timers: number[] = [];
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      liveRef.current = true;
      setBooting(false);
    };
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    skipSplashRef.current = finish;

    if (reducedMotion) {
      title.textContent = SPLASH_TITLE;
      sub.textContent = SPLASH_SUB;
      at(1100, finish);
    } else {
      let t = 200;
      for (let i = 1; i <= SPLASH_TITLE.length; i++) {
        t += 45 + Math.random() * 45;
        at(t, () => (title.textContent = SPLASH_TITLE.slice(0, i)));
      }
      t += 250;
      at(t, () => splash.classList.add("is-sub"));
      for (let i = 1; i <= SPLASH_SUB.length; i++) {
        t += 12 + Math.random() * 10;
        at(t, () => (sub.textContent = SPLASH_SUB.slice(0, i)));
      }
      t += 550;
      at(t, () => splash.classList.add("is-out"));
      t += 600;
      at(t, finish);
    }
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  useEffect(() => {
    const pane = paneRef.current;
    const host = linesRef.current;
    const pathEl = pathRef.current;
    const posEl = posRef.current;
    if (!pane || !host || !pathEl || !posEl) return;

    const rows = buildRows();
    host.innerHTML = rows
      .map(
        (r) =>
          `<div class="ti-l" hidden><span class="ti-ln">${r.ln ?? ""}</span><span class="ti-tx">${
            r.header ? `<span class="tk-c ti-hd">${escapeHtml(r.text)}</span>` : tokensToHtml(r.tokens)
          }</span></div>`,
      )
      .join("");
    const lines = Array.from(host.children) as HTMLElement[];
    const texts = lines.map((el) => el.lastElementChild as HTMLElement);
    const full = texts.map((el) => el.innerHTML);

    let statusKey = "";
    const setStatus = (rowIdx: number, col: number) => {
      const row = rows[Math.min(rowIdx, rows.length - 1)];
      const file = INTRO_FILES[row.file];
      let ln = row.ln;
      for (let i = rowIdx; ln === null && i >= 0; i--) if (rows[i].file === row.file) ln = rows[i].ln;
      const line = ln ?? 1;
      const key = `${row.file}:${line}:${col}`;
      if (key === statusKey) return;
      statusKey = key;
      pathEl.textContent = `~/projects/${file.project}/${file.path}`;
      posEl.textContent = `${line}:${col + 1}  ${Math.min(100, Math.round((line / FILE_LINES[row.file]) * 100))}%`;
    };

    if (reducedMotion) {
      lines.forEach((el) => (el.hidden = false));
      setStatus(2, 0);
      const onUser = () => userScrollRef.current();
      pane.addEventListener("wheel", onUser, { passive: true });
      pane.addEventListener("touchmove", onUser, { passive: true });
      return () => {
        pane.removeEventListener("wheel", onUser);
        pane.removeEventListener("touchmove", onUser);
      };
    }

    let rowIdx = 0;
    let charIdx = 0;
    let pauseUntil = 0;
    let last = performance.now();
    let scroll = 0;
    let manualUntil = 0;
    let revealed = false;
    let caretRow = -1;
    let caretChars = -1;
    let raf = 0;
    let lineSpeed = 1;
    let edit: Edit | null = null;
    let editCooldown = 14;
    const modeEl = modeRef.current;

    const paintCaret = (i: number, n: number) => {
      if (i === caretRow && n === caretChars) return;
      if (caretRow >= 0 && caretRow !== i) {
        texts[caretRow].innerHTML = full[caretRow];
        lines[caretRow].classList.remove("ti-cur");
      }
      caretRow = i;
      caretChars = n;
      lines[i].classList.add("ti-cur");
      texts[i].innerHTML = (rows[i].header ? `<span class="tk-c ti-hd">${escapeHtml(rows[i].text.slice(0, n))}</span>` : tokensToHtml(rows[i].tokens, n)) + CARET;
    };

    const showRow = (i: number) => {
      lines[i].hidden = false;
      lines[i].classList.remove("ti-ghost");
    };

    const restart = () => {
      lines.forEach((el) => {
        el.hidden = true;
        el.classList.remove("ti-ghost", "ti-sel", "ti-del");
      });
      if (caretRow >= 0) {
        texts[caretRow].innerHTML = full[caretRow];
        lines[caretRow].classList.remove("ti-cur");
      }
      caretRow = -1;
      caretChars = -1;
      rowIdx = 0;
      charIdx = 0;
      scroll = 0;
      revealed = false;
      edit = null;
      editCooldown = 14;
      pane.scrollTop = 0;
    };

    const setMode = (mode: string) => {
      if (modeEl && modeEl.textContent !== mode) modeEl.textContent = mode;
    };

    const clearCaret = () => {
      if (caretRow < 0) return;
      texts[caretRow].innerHTML = full[caretRow];
      lines[caretRow].classList.remove("ti-cur");
      caretRow = -1;
      caretChars = -1;
    };

    const isCode = (i: number) => i >= 0 && !rows[i].header && rows[i].ln !== null;

    const maybeEdit = (done: number, now: number) => {
      if (done < editCooldown) return false;
      const row = rows[done];
      const indent = row.text.length - row.text.trimStart().length;
      const body = row.text.length - indent;
      const roll = Math.random();
      if (roll < 0.045 && body > 10) {
        const cut = Math.min(body - 2, 5 + Math.floor(Math.random() * 14));
        edit = { kind: "backspace", row: done, target: row.text.length - cut, pos: row.text.length };
        pauseUntil = now + 380;
        editCooldown = done + 16;
        setMode("NORMAL");
        return true;
      }
      if (roll < 0.085) {
        const size = 2 + Math.floor(Math.random() * 3);
        const from = done - size + 1;
        for (let i = from; i <= done; i++) if (!isCode(i) || rows[i].file !== row.file) return false;
        edit = { kind: "select", from, to: done + 1, next: from, at: now + 300 };
        pauseUntil = now + 300;
        editCooldown = done + 18;
        setMode("NORMAL");
        return true;
      }
      return false;
    };

    const runEdit = (now: number, dt: number) => {
      const e = edit;
      if (!e) return;
      if (e.kind === "backspace") {
        setMode("INSERT");
        e.pos -= (dt * 34) / 1000;
        const n = Math.max(e.target, Math.ceil(e.pos));
        paintCaret(e.row, n);
        setStatus(e.row, n);
        if (e.pos <= e.target) {
          rowIdx = e.row;
          charIdx = e.target;
          edit = null;
          pauseUntil = now + 260;
        }
        return;
      }
      if (e.kind === "select") {
        setMode("V-LINE");
        clearCaret();
        if (now >= e.at) {
          lines[e.next].classList.add("ti-sel");
          e.next++;
          e.at = now + 130;
          if (e.next >= e.to) edit = { kind: "hold", from: e.from, to: e.to, until: now + 520 };
        }
        return;
      }
      if (e.kind === "hold") {
        if (now < e.until) return;
        setMode("NORMAL");
        for (let i = e.from; i < e.to; i++) {
          lines[i].classList.remove("ti-sel");
          lines[i].classList.add("ti-del");
        }
        edit = { kind: "delete", from: e.from, to: e.to, until: now + 320 };
        return;
      }
      if (now < e.until) return;
      for (let i = e.from; i < e.to; i++) {
        lines[i].classList.remove("ti-del");
        if (revealed) lines[i].classList.add("ti-ghost");
        else lines[i].hidden = true;
      }
      rowIdx = e.from;
      charIdx = 0;
      edit = null;
      paintCaret(Math.max(0, e.from - 1), rows[Math.max(0, e.from - 1)].text.length);
      pauseUntil = now + 420;
    };

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      const from = charIdx > 0 ? rowIdx + 1 : rowIdx;
      for (let i = from; i < lines.length; i++) {
        lines[i].hidden = false;
        lines[i].classList.add("ti-ghost");
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;
      if (!liveRef.current) return;

      if (rowIdx >= rows.length && !edit && now >= pauseUntil && now > manualUntil) restart();

      if (edit && now >= pauseUntil) runEdit(now, dt);

      let budget = edit ? 0 : ((dt * CHARS_PER_SECOND) / 1000) * lineSpeed;
      while (budget > 0 && rowIdx < rows.length && now >= pauseUntil) {
        const row = rows[rowIdx];
        if (charIdx === 0) {
          showRow(rowIdx);
          charIdx = row.text.length - row.text.trimStart().length;
          lineSpeed = 0.85 + Math.random() * 0.3;
        }
        setMode("INSERT");
        const take = Math.min(budget, row.text.length - charIdx);
        charIdx += take;
        budget -= take;
        if (charIdx >= row.text.length) {
          paintCaret(rowIdx, row.text.length);
          const done = rowIdx;
          rowIdx++;
          charIdx = 0;
          if (row.header) pauseUntil = now + 420;
          else if (rowIdx >= rows.length) {
            pauseUntil = now + 2600;
            setMode("NORMAL");
          } else if (maybeEdit(done, now)) break;
          else if (Math.random() < 0.03) pauseUntil = now + 160 + Math.random() * 220;
          if (budget < 1) break;
        }
      }

      if (!edit && rowIdx < rows.length && charIdx > 0) {
        paintCaret(rowIdx, Math.floor(charIdx));
        setStatus(rowIdx, Math.floor(charIdx));
      } else if (caretRow >= 0) {
        setStatus(caretRow, caretChars);
      }

      if (now <= manualUntil) {
        scroll = pane.scrollTop;
      } else if (caretRow >= 0) {
        const target = Math.max(0, lines[caretRow].offsetTop - pane.clientHeight * 0.6);
        scroll += (target - scroll) * (1 - Math.exp(-dt / 160));
        pane.scrollTop = scroll;
      }
    };

    const onUser = () => {
      manualUntil = performance.now() + MANUAL_SCROLL_MS;
      reveal();
      userScrollRef.current();
    };
    const onPanePointer = (event: PointerEvent) => {
      if (event.offsetX > pane.clientWidth) onUser();
    };

    setStatus(0, 0);
    pane.addEventListener("wheel", onUser, { passive: true });
    pane.addEventListener("touchmove", onUser, { passive: true });
    pane.addEventListener("pointerdown", onPanePointer);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      pane.removeEventListener("wheel", onUser);
      pane.removeEventListener("touchmove", onUser);
      pane.removeEventListener("pointerdown", onPanePointer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const root = rootRef.current;
    const main = mainRef.current;
    const face = faceRef.current;
    const canvas = canvasRef.current;
    const readout = readoutRef.current;
    const dash = dashRef.current;
    const solid = solidRef.current;
    const box = boxRef.current;
    const msg = msgRef.current;
    if (!root || !main || !face || !canvas || !readout || !dash || !solid || !box || !msg) return;

    const pointer = { x: 0, y: 0, mouse: false, target: "None", speed: 0, t: 0 };
    let message = DEFAULT_MESSAGE;
    let shown = 0;
    let readoutText = "";
    let away = false;
    let faceShown = !mobile;

    const onFrame = (state: GazeState) => {
      const want = state.fear > 0.55 ? NEAR_MESSAGE : DEFAULT_MESSAGE;
      if (want !== message) {
        message = want;
        shown = 0;
      }
      if (faceShown && shown <= message.length) {
        msg.textContent = message.slice(0, shown);
        shown += reducedMotion ? message.length + 1 : 1;
      }

      const visible = faceShown && !away && state.hasPointer && pointer.mouse;
      const eye = state.eyes[state.lead];
      if (visible) {
        box.setAttribute("x", String(pointer.x - 14));
        box.setAttribute("y", String(pointer.y - 9));
        dash.setAttribute("x1", String(eye.x));
        dash.setAttribute("y1", String(eye.y));
        dash.setAttribute("x2", String(pointer.x - (pointer.x > eye.x ? 14 : -14)));
        dash.setAttribute("y2", String(pointer.y + (pointer.y > eye.y ? -9 : 9)));
      }
      box.style.opacity = visible ? "1" : "0";
      dash.style.opacity = visible ? "1" : "0";

      const gx = state.gaze.x;
      const gy = state.gaze.y;
      const dir = Math.abs(gx) > Math.abs(gy) ? (gx > 0 ? "r" : "l") : gy > 0 ? "d" : "u";
      const nx = state.hasPointer ? pointer.x / window.innerWidth : 0.5 + gx / 2;
      const ny = state.hasPointer ? pointer.y / window.innerHeight : 0.5 + gy / 2;
      const text = `['pupil:${dir}'] ${nx.toFixed(7)}\n${ny.toFixed(7)}\n${pointer.speed.toFixed(10)}\n${state.hasPointer ? pointer.target : "None"}`;
      if (text !== readoutText) {
        readoutText = text;
        readout.textContent = text;
      }
      if (faceShown && !away && readout.offsetParent) {
        const r = readout.getBoundingClientRect();
        const onRight = r.left > (state.eyes[0].x + state.eyes[1].x) / 2;
        const target = onRight ? (state.eyes[0].x > state.eyes[1].x ? state.eyes[0] : state.eyes[1]) : state.eyes[0].x < state.eyes[1].x ? state.eyes[0] : state.eyes[1];
        solid.setAttribute("x1", String(onRight ? r.left - 6 : r.right + 6));
        solid.setAttribute("y1", String(r.top + 7));
        solid.setAttribute("x2", String(target.x));
        solid.setAttribute("y2", String(target.y));
        solid.style.opacity = "1";
      } else {
        solid.style.opacity = "0";
      }
      pointer.speed *= 0.9;
    };

    const renderer = new BehelitRenderer(canvas, themeRef.current, { reducedMotion, onFrame });
    rendererRef.current = renderer;
    const resize = new ResizeObserver(() => {
      renderer.resize();
      renderer.syncRect();
    });
    resize.observe(canvas);

    const track = (x: number, y: number, target: string, mouse: boolean) => {
      const now = performance.now();
      const dt = Math.max(1, now - pointer.t);
      if (pointer.t) pointer.speed = Math.max(pointer.speed, Math.hypot(x - pointer.x, y - pointer.y) / dt / 100);
      pointer.t = now;
      pointer.x = x;
      pointer.y = y;
      pointer.mouse = mouse;
      pointer.target = target;
      renderer.setPointer(x, y);
    };

    const cleanups: (() => void)[] = [];

    if (!mobile) {
      let lastPlace: [number, number] | null = null;
      const place = (px?: number, py?: number) => {
        const mr = main.getBoundingClientRect();
        const w = face.offsetWidth;
        const h = face.offsetHeight;
        let left: number;
        let top: number;
        if (px === undefined || py === undefined) {
          left = mr.width - w - Math.max(mr.width * 0.1, 170);
          top = mr.height - h * 0.97;
        } else {
          const cx = px - mr.left;
          const cy = py - mr.top;
          const toLeft = cx > mr.width / 2;
          const gap = w * 0.2 + 40;
          left = toLeft ? cx - gap - w : cx + gap;
          top = cy - h * 0.55;
        }
        left = Math.max(8, Math.min(mr.width - w - 8, left));
        top = Math.max(-h * 0.06, Math.min(mr.height - h * 0.97, top));
        face.style.left = `${left}px`;
        face.style.top = `${top}px`;
        const rightRoom = mr.width - (left + w * 0.86);
        if (rightRoom > 180) {
          readout.style.left = `${left + w * 0.86}px`;
          readout.style.right = "auto";
          readout.style.textAlign = "left";
        } else {
          readout.style.left = "auto";
          readout.style.right = `${mr.width - (left + w * 0.14)}px`;
          readout.style.textAlign = "right";
        }
        readout.style.top = `${top + h * 0.5}px`;
        renderer.syncRect();
      };

      const hide = () => {
        if (away) return;
        away = true;
        face.classList.add("is-away");
        readout.classList.add("is-away");
      };

      const onMove = (event: PointerEvent) => {
        const mouse = event.pointerType === "mouse" || event.pointerType === "pen";
        if (away && mouse) {
          away = false;
          lastPlace = [event.clientX, event.clientY];
          place(event.clientX, event.clientY);
          face.classList.remove("is-away");
          readout.classList.remove("is-away");
        }
        const hit = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-gaze]") : null;
        track(event.clientX, event.clientY, hit?.dataset.gaze ? `'${hit.dataset.gaze}'` : "None", mouse);
      };
      const onLeave = () => renderer.clearPointer();
      const onResize = () => (lastPlace ? place(...lastPlace) : place());

      userScrollRef.current = hide;
      place();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      window.addEventListener("resize", onResize);
      document.documentElement.addEventListener("mouseleave", onLeave);
      renderer.start();
      cleanups.push(() => {
        userScrollRef.current = () => {};
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onMove);
        window.removeEventListener("resize", onResize);
        document.documentElement.removeEventListener("mouseleave", onLeave);
      });
    } else {
      const cmdline = cmdlineRef.current;
      let phase: "code" | "cmd" | "face" = "code";
      let phaseAt = performance.now();
      let running = false;
      let raf = 0;

      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!liveRef.current) {
          phaseAt = now;
          return;
        }
        const elapsed = now - phaseAt;
        if (phase === "code") {
          if (running && elapsed > 700) {
            renderer.stop();
            running = false;
          }
          if (elapsed > MOBILE_CODE_MS) {
            phase = "cmd";
            phaseAt = now;
          }
        } else if (phase === "cmd") {
          const step = reducedMotion ? 0 : 55;
          const n = step ? Math.min(FACE_CMD.length, Math.floor(elapsed / step)) : FACE_CMD.length;
          if (cmdline) cmdline.textContent = FACE_CMD.slice(0, n);
          if (elapsed > FACE_CMD.length * step + 450) {
            phase = "face";
            phaseAt = now;
            faceShown = true;
            message = DEFAULT_MESSAGE;
            shown = 0;
            root.classList.add("is-face");
            renderer.resize();
            renderer.syncRect();
            if (!running) {
              renderer.start();
              running = true;
            }
          }
        } else {
          const t = elapsed / 1000;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const x = vw * (0.5 + 0.34 * Math.sin(t * 0.95) + 0.08 * Math.sin(t * 2.6 + 0.5));
          const y = vh * (0.36 + 0.26 * Math.sin(t * 0.67 + 1.1) + 0.05 * Math.sin(t * 3.1));
          track(x, y, "'auto'", true);
          if (elapsed > MOBILE_FACE_MS) {
            phase = "code";
            phaseAt = now;
            faceShown = false;
            root.classList.remove("is-face");
            msg.textContent = "";
            if (cmdline) cmdline.textContent = "";
          }
        }
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        root.classList.remove("is-face");
      });
    }

    const onVisibility = () => {
      if (document.hidden) renderer.stop();
      else if (!mobile || root.classList.contains("is-face")) renderer.start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cleanups.forEach((fn) => fn());
      renderer.stop();
      rendererRef.current = null;
      resize.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, mobile]);

  const enter = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    const root = rootRef.current;
    if (!root) {
      markIntroEntered();
      onDone();
      return;
    }
    root.classList.add("is-leaving");
    if (reducedMotion) {
      markIntroEntered();
      const animation = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" });
      animation.finished.then(onDone, onDone);
      return;
    }
    runBlackHole(root, themeRef.current, markIntroEntered).then(onDone, onDone);
  }, [onDone, reducedMotion]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? TERMINAL_THEMES.filter((t) => fuzzy(q, t.id)) : TERMINAL_THEMES;
  }, [query]);

  const openPicker = useCallback(() => {
    const index = TERMINAL_THEMES.findIndex((t) => t.id === themeId);
    setQuery("");
    setCursor(Math.max(0, index));
    setPreview(themeId);
    setPickerOpen(true);
  }, [themeId]);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setPreview(null);
    requestAnimationFrame(() => enterRef.current?.focus({ preventScroll: true }));
  }, []);

  const applyTheme = useCallback(
    (next: TerminalTheme) => {
      setThemeId(next.id);
      saveTerminalTheme(next);
      setSiteTheme(next.mode);
      closePicker();
    },
    [closePicker],
  );

  const moveCursor = (index: number, list = filtered) => {
    if (!list.length) return;
    const next = (index + list.length) % list.length;
    setCursor(next);
    setPreview(list[next].id);
  };

  useEffect(() => {
    if (!pickerOpen) return;
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor, pickerOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (leavingRef.current || pickerOpenRef.current || event.defaultPrevented) return;
      if (!liveRef.current) {
        if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
          event.preventDefault();
          skipSplashRef.current();
        }
        return;
      }
      if (event.key === ":" || (event.key === ";" && event.shiftKey)) {
        event.preventDefault();
        openPicker();
      } else if (event.key === "Enter" && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter, openPicker]);

  const onPickerKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const ctrl = event.ctrlKey || event.metaKey;
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey) || (ctrl && event.key === "n")) {
      event.preventDefault();
      moveCursor(cursor + 1);
    } else if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey) || (ctrl && event.key === "p")) {
      event.preventDefault();
      moveCursor(cursor - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (filtered[cursor]) applyTheme(filtered[cursor]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePicker();
    }
  };

  const onQuery = (value: string) => {
    const q = value.replace(/^:/, "");
    setQuery(q);
    const list = q.trim() ? TERMINAL_THEMES.filter((t) => fuzzy(q.trim().toLowerCase(), t.id)) : TERMINAL_THEMES;
    setCursor(0);
    if (list[0]) setPreview(list[0].id);
  };

  const style = { ...themeStyle(theme), colorScheme: theme.mode } as CSSProperties;
  const rootClass = ["ti-root", mobile ? "is-mobile" : "is-desktop", booting ? "is-booting" : ""].filter(Boolean).join(" ");
  const faceCanvas = <canvas ref={canvasRef} className="ti-canvas" />;

  return (
    <div
      id="terminal-intro"
      ref={rootRef}
      className={rootClass}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label="Paras Raju — terminal"
      onPointerDown={(event) => {
        if (!pickerOpen) return;
        const target = event.target as Node;
        if (pickerRef.current?.contains(target) || themeBtnRef.current?.contains(target)) return;
        closePicker();
      }}
    >
      <div ref={mainRef} className="ti-main">
        <div ref={paneRef} className="ti-code" aria-hidden="true">
          <div ref={linesRef} className="ti-lines" />
        </div>
        {!mobile && (
          <>
            <div ref={faceRef} className="ti-face" aria-hidden="true">
              {faceCanvas}
            </div>
            <pre ref={readoutRef} className="ti-readout" aria-hidden="true" />
          </>
        )}

        {pickerOpen && (
          <div ref={pickerRef} className="ti-picker" role="dialog" aria-label="Color scheme">
            <span className="ti-picker-title">colorscheme</span>
            <label className="ti-picker-input">
              <span aria-hidden="true">:</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                onKeyDown={onPickerKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Filter color schemes"
                aria-controls="ti-theme-list"
                aria-activedescendant={filtered[cursor] ? `ti-theme-${filtered[cursor].id}` : undefined}
              />
            </label>
            <ul ref={listRef} id="ti-theme-list" role="listbox" className="ti-picker-list">
              {filtered.map((t, i) => (
                <li
                  key={t.id}
                  id={`ti-theme-${t.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  className={i === cursor ? "is-active" : undefined}
                  onMouseEnter={() => moveCursor(i)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyTheme(t)}
                >
                  <span className="ti-mark" aria-hidden="true">{i === cursor ? "›" : ""}</span>
                  <span className="ti-name">{t.id}</span>
                  <span className="ti-sw" aria-hidden="true">
                    {themeSwatches(t).map((color, k) => (
                      <i key={k} style={{ background: color }} />
                    ))}
                  </span>
                </li>
              ))}
              {!filtered.length && <li className="ti-empty">no matches</li>}
            </ul>
            <span className="ti-picker-count">
              {filtered.length ? cursor + 1 : 0}/{filtered.length}
            </span>
          </div>
        )}
      </div>

      <div className="ti-status">
        <span ref={modeRef} className="ti-mode">NORMAL</span>
        <span ref={pathRef} className="ti-path" />
        <span ref={posRef} className="ti-pos" />
      </div>

      {mobile && (
        <>
          <div ref={cmdlineRef} className="ti-cmdline" aria-hidden="true" />
          <div ref={faceRef} className="ti-stage" aria-hidden="true">
            {faceCanvas}
            <pre ref={readoutRef} className="ti-readout" />
          </div>
        </>
      )}

      <div className="ti-cmd">
        <span ref={msgRef} className="ti-msg" aria-live="polite" />
        <div className="ti-actions">
          <button
            ref={themeBtnRef}
            type="button"
            data-gaze="theme"
            className="ti-themebtn"
            onClick={() => (pickerOpen ? closePicker() : openPicker())}
            aria-haspopup="dialog"
            aria-expanded={pickerOpen}
          >
            <span className="ti-prompt" aria-hidden="true">›_</span> :theme
          </button>
          <button ref={enterRef} type="button" data-gaze="enter" className="ti-enter" onClick={enter}>
            enter <span aria-hidden="true">↵</span>
          </button>
        </div>
      </div>

      <svg className="ti-overlay" aria-hidden="true">
        <line ref={solidRef} className="ti-solid" />
        <line ref={dashRef} className="ti-dash" />
        <rect ref={boxRef} className="ti-box" width="28" height="18" />
      </svg>

      {booting && (
        <div ref={splashRef} className="ti-splash" onPointerDown={() => skipSplashRef.current()}>
          <div className="ti-splash-inner">
            <span className="ti-splash-title">
              <span ref={splashTitleRef} />
              <span className="ti-splash-caret" aria-hidden="true" />
            </span>
            <span ref={splashSubRef} className="ti-splash-sub" />
          </div>
        </div>
      )}
    </div>
  );
}
