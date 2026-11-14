export type TokenClass = "k" | "s" | "n" | "f" | "c" | "u" | "p" | "";
export type Token = [TokenClass, string];

const KEYWORDS = {
  ts: new Set(
    "import export from as type interface const let var function return if else for while do of in new class extends implements async await throw try catch finally switch case break continue default typeof instanceof void null undefined true false this readonly public private protected static keyof".split(" "),
  ),
  py: new Set(
    "import from as def class return if elif else for while in not and or is None True False try except finally raise with lambda yield pass break continue global nonlocal async await self assert del".split(" "),
  ),
};

export type HighlightState = { block: null | "*/" | '"""' | "'''" };

const IDENT = /[A-Za-z_$][\w$]*/y;
const NUMBER = /(?:0x[\da-fA-F]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?)/y;

export function highlightLine(line: string, lang: "ts" | "py", state: HighlightState): Token[] {
  const out: Token[] = [];
  const push = (cls: TokenClass, text: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last[0] === cls) last[1] += text;
    else out.push([cls, text]);
  };
  let i = 0;
  let prevWord = "";

  if (state.block) {
    const end = line.indexOf(state.block);
    const cls: TokenClass = state.block === "*/" ? "c" : "s";
    if (end === -1) {
      push(cls, line);
      return out;
    }
    push(cls, line.slice(0, end + state.block.length));
    i = end + state.block.length;
    state.block = null;
  }

  while (i < line.length) {
    const ch = line[i];
    const rest = line.slice(i);

    if ((lang === "ts" && rest.startsWith("//")) || (lang === "py" && ch === "#")) {
      push("c", rest);
      break;
    }
    if (lang === "ts" && rest.startsWith("/*")) {
      const end = line.indexOf("*/", i + 2);
      if (end === -1) {
        push("c", rest);
        state.block = "*/";
        break;
      }
      push("c", line.slice(i, end + 2));
      i = end + 2;
      continue;
    }

    const prefix = lang === "py" ? /^[rbfuRBFU]{0,2}(?="|')/.exec(rest)?.[0] ?? "" : "";
    const q = line[i + prefix.length];
    if (q === '"' || q === "'" || (lang === "ts" && q === "`")) {
      const start = i;
      let j = i + prefix.length;
      if (lang === "py" && line.startsWith(q.repeat(3), j)) {
        const delim = q.repeat(3) as '"""' | "'''";
        const end = line.indexOf(delim, j + 3);
        if (end === -1) {
          push("s", line.slice(start));
          state.block = delim;
          break;
        }
        push("s", line.slice(start, end + 3));
        i = end + 3;
        continue;
      }
      j++;
      while (j < line.length && line[j] !== q) j += line[j] === "\\" ? 2 : 1;
      push("s", line.slice(start, Math.min(j + 1, line.length)));
      i = j + 1;
      continue;
    }

    if (/\d/.test(ch) && !/[\w$]/.test(line[i - 1] ?? "")) {
      NUMBER.lastIndex = i;
      const m = NUMBER.exec(line);
      if (m) {
        push("n", m[0]);
        i += m[0].length;
        continue;
      }
    }

    if (/[A-Za-z_$]/.test(ch) || (ch === "@" && lang === "py")) {
      IDENT.lastIndex = ch === "@" ? i + 1 : i;
      const m = IDENT.exec(line);
      const word = (ch === "@" ? "@" : "") + (m ? m[0] : "");
      const after = line.slice(i + word.length).trimStart();
      let cls: TokenClass = "";
      if (ch === "@") cls = "k";
      else if (KEYWORDS[lang].has(word)) cls = "k";
      else if (prevWord === "def" || prevWord === "function" || prevWord === "class" || prevWord === "interface" || prevWord === "type") cls = "f";
      else if (after.startsWith("(")) cls = "f";
      else if (/^[A-Z][A-Z\d_]{2,}$/.test(word)) cls = "u";
      push(cls, word);
      prevWord = word;
      i += word.length || 1;
      continue;
    }

    if (/\s/.test(ch)) {
      push("", ch);
      i++;
      continue;
    }

    push("p", ch);
    if (ch !== "." && ch !== "?") prevWord = "";
    i++;
  }
  return out;
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

export function escapeHtml(text: string) {
  return text.replace(/[&<>]/g, (c) => ESCAPES[c]);
}

export function tokensToHtml(tokens: Token[], limit = Infinity): string {
  let html = "";
  let left = limit;
  for (const [cls, text] of tokens) {
    if (left <= 0) break;
    const part = text.length > left ? text.slice(0, left) : text;
    left -= part.length;
    html += cls ? `<span class="tk-${cls}">${escapeHtml(part)}</span>` : escapeHtml(part);
  }
  return html;
}
