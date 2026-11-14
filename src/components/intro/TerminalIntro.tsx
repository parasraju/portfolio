"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { markIntroEntered } from "@/lib/intro";
import { setTheme as setSiteTheme } from "@/lib/theme";
import { BehelitRenderer, type GazeState } from "./behelit";
import { escapeHtml, highlightLine, tokensToHtml, type HighlightState, type Token } from "./highlight";
import { INTRO_FILES } from "./introCode";
import { TERMINAL_THEMES, loadTerminalTheme, saveTerminalTheme, themeById, themeStyle, themeSwatches, type TerminalTheme } from "./themes";

type Row = { file: number; ln: number | null; tokens: Token[]; text: string; header?: boolean };

const CHARS_PER_SECOND = 620;
const PREFILL_ROWS = 24;
const CARET = '<span class="ti-caret"> </span>';
const FILE_LINES = INTRO_FILES.map((f) => f.code.split("\n").length);
const DEFAULT_MESSAGE = "the behelit stirs. paras raju — engineer, builder of tools. enter if you dare.";
const NEAR_MESSAGE = "it sees you.";

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

export function TerminalIntro({ onDone }: { onDone: () => void }) {
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [themeId, setThemeId] = useState(() =>
    loadTerminalTheme(document.documentElement.classList.contains("dark") ? "dark" : "light").id,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const theme = themeById(preview ?? themeId);

  const rootRef = useRef<HTMLDivElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLPreElement>(null);
  const pathRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dashRef = useRef<SVGLineElement>(null);
  const solidRef = useRef<SVGLineElement>(null);
  const boxRef = useRef<SVGRectElement>(null);
  const rendererRef = useRef<BehelitRenderer | null>(null);
  const themeRef = useRef<TerminalTheme>(theme);
  const leavingRef = useRef(false);
  const pickerOpenRef = useRef(false);

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
      return;
    }

    let rowIdx = 0;
    let charIdx = 0;
    let pauseUntil = 0;
    let last = performance.now();
    let scroll = 0;
    let manualUntil = 0;
    let caretRow = -1;
    let caretChars = -1;
    let raf = 0;

    for (; rowIdx < PREFILL_ROWS; rowIdx++) lines[rowIdx].hidden = false;

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

    const restart = () => {
      lines.forEach((el) => (el.hidden = true));
      if (caretRow >= 0) {
        texts[caretRow].innerHTML = full[caretRow];
        lines[caretRow].classList.remove("ti-cur");
      }
      caretRow = -1;
      caretChars = -1;
      rowIdx = 0;
      charIdx = 0;
      scroll = 0;
      pane.scrollTop = 0;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;

      if (rowIdx >= rows.length && now >= pauseUntil) restart();

      let budget = ((dt * CHARS_PER_SECOND) / 1000) * (0.45 + Math.random() * 1.1);
      while (budget > 0 && rowIdx < rows.length && now >= pauseUntil) {
        const row = rows[rowIdx];
        if (charIdx === 0) {
          lines[rowIdx].hidden = false;
          charIdx = row.text.length - row.text.trimStart().length;
        }
        const take = Math.min(budget, row.text.length - charIdx);
        charIdx += take;
        budget -= take;
        if (charIdx >= row.text.length) {
          paintCaret(rowIdx, row.text.length);
          rowIdx++;
          charIdx = 0;
          if (row.header) pauseUntil = now + 420;
          else if (rowIdx >= rows.length) pauseUntil = now + 2600;
          else if (Math.random() < 0.05) pauseUntil = now + 80 + Math.random() * 260;
          if (budget < 1) break;
        }
      }

      if (rowIdx < rows.length && charIdx > 0) {
        paintCaret(rowIdx, Math.floor(charIdx));
        setStatus(rowIdx, Math.floor(charIdx));
      } else if (caretRow >= 0) {
        setStatus(caretRow, caretChars);
      }

      if (caretRow >= 0 && now > manualUntil) {
        const target = Math.max(0, lines[caretRow].offsetTop - pane.clientHeight * 0.62);
        scroll += (target - scroll) * 0.16;
        pane.scrollTop = scroll;
      }
    };

    const onWheel = (event: WheelEvent) => {
      manualUntil = performance.now() + 4000;
      scroll = Math.max(0, Math.min(pane.scrollHeight - pane.clientHeight, pane.scrollTop + event.deltaY));
      pane.scrollTop = scroll;
    };

    setStatus(0, 0);
    pane.addEventListener("wheel", onWheel, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      pane.removeEventListener("wheel", onWheel);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const readout = readoutRef.current;
    const dash = dashRef.current;
    const solid = solidRef.current;
    const box = boxRef.current;
    const msg = msgRef.current;
    if (!canvas || !readout || !dash || !solid || !box || !msg) return;

    const pointer = { x: 0, y: 0, mouse: false, target: "None", speed: 0, t: 0 };
    let message = DEFAULT_MESSAGE;
    let shown = 0;
    let readoutText = "";

    const onFrame = (state: GazeState) => {
      const want = state.fear > 0.55 ? NEAR_MESSAGE : DEFAULT_MESSAGE;
      if (want !== message) {
        message = want;
        shown = 0;
      }
      if (shown <= message.length) {
        msg.textContent = message.slice(0, shown);
        shown += reducedMotion ? message.length + 1 : 1;
      }

      const visible = state.hasPointer && pointer.mouse;
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
      if (readout.offsetParent) {
        const r = readout.getBoundingClientRect();
        const left = state.eyes[0];
        solid.setAttribute("x1", String(r.right + 6));
        solid.setAttribute("y1", String(r.top + 7));
        solid.setAttribute("x2", String(left.x));
        solid.setAttribute("y2", String(left.y));
        solid.style.opacity = "1";
      } else {
        solid.style.opacity = "0";
      }
      pointer.speed *= 0.9;
    };

    const renderer = new BehelitRenderer(canvas, themeRef.current, { reducedMotion, onFrame });
    rendererRef.current = renderer;
    const resize = new ResizeObserver(() => renderer.resize());
    resize.observe(canvas);

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - pointer.t);
      if (pointer.t) pointer.speed = Math.max(pointer.speed, Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) / dt / 100);
      pointer.t = now;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.mouse = event.pointerType === "mouse" || event.pointerType === "pen";
      const hit = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-gaze]") : null;
      pointer.target = hit?.dataset.gaze ? `'${hit.dataset.gaze}'` : "None";
      renderer.setPointer(event.clientX, event.clientY);
    };
    const onLeave = () => renderer.clearPointer();
    const onVisibility = () => (document.hidden ? renderer.stop() : renderer.start());

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    renderer.start();
    return () => {
      renderer.stop();
      rendererRef.current = null;
      resize.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  const enter = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    const root = rootRef.current;
    markIntroEntered();
    if (!root) {
      onDone();
      return;
    }
    const frames: Keyframe[] = reducedMotion
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [
          { transform: "scale(1, 1)", filter: "brightness(1)", opacity: 1 },
          { transform: "scale(1, 0.005)", filter: "brightness(2.4)", opacity: 1, offset: 0.55 },
          { transform: "scale(0, 0.005)", filter: "brightness(3)", opacity: 0 },
        ];
    const animation = root.animate(frames, {
      duration: reducedMotion ? 200 : 760,
      easing: "cubic-bezier(0.7, 0, 0.3, 1)",
      fill: "forwards",
    });
    animation.finished.then(onDone, onDone);
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

  return (
    <div
      id="terminal-intro"
      ref={rootRef}
      className="ti-root"
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
      <div className="ti-main">
        <div ref={paneRef} className="ti-code" aria-hidden="true">
          <div ref={linesRef} className="ti-lines" />
        </div>
        <div className="ti-face" aria-hidden="true">
          <canvas ref={canvasRef} className="ti-canvas" />
          <pre ref={readoutRef} className="ti-readout" />
        </div>

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
        <span ref={pathRef} className="ti-path" />
        <span ref={posRef} className="ti-pos" />
      </div>

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
    </div>
  );
}
