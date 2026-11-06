// A tiny highlighter for the code that streams along the hero planet's arcs (One Dark colours).

export const CODE_COLORS = {
  keyword: "#c678dd",
  string: "#98c379",
  number: "#d19a66",
  fn: "#61afef",
  tag: "#e06c75",
  attr: "#d19a66",
  op: "#56b6c2",
  ok: "#98c379",
  punct: "#abb2bf",
  identifier: "#e5e9f5",
} as const;

const KEYWORDS = new Set([
  "const", "let", "await", "async", "export", "default", "function", "return", "new", "import", "from",
  "git", "npm", "run", "push", "origin", "POST", "GET", "method",
]);

const TOKEN = /"[^"]*"|'[^']*'|<\/?[A-Za-z]+|\/>|[A-Za-z_$][\w$.]*|\d+(?:\.\d+)?(?:ms)?|\s+|./gu;

export type CodeToken = { text: string; color: string | null };

export function tokenizeCode(code: string): CodeToken[] {
  const parts = code.match(TOKEN) ?? [];
  return parts.map((text, index) => {
    if (/^\s+$/.test(text)) return { text, color: null };
    let next = index + 1;
    while (parts[next] && /^\s+$/.test(parts[next])) next++;
    return { text, color: colorFor(text, parts[next], parts[index + 1]) };
  });
}

// `next` skips whitespace, `adjacent` does not: JSX attributes are written `items={...}`, assignments `x = ...`
function colorFor(token: string, next: string | undefined, adjacent: string | undefined): string {
  if (/^["']/.test(token)) return CODE_COLORS.string;
  if (/^<\/?[A-Za-z]|^\/>$|^>$/.test(token)) return CODE_COLORS.tag;
  if (/^\d/.test(token)) return CODE_COLORS.number;
  if (KEYWORDS.has(token)) return CODE_COLORS.keyword;
  if (/^(OK|✓|true|false)$/.test(token)) return CODE_COLORS.ok;
  if (/^[A-Za-z_$][\w$.]*$/.test(token)) {
    if (next === "(") return CODE_COLORS.fn;
    if (adjacent === "=") return CODE_COLORS.attr;
    return CODE_COLORS.identifier;
  }
  if (/^[→=:|]$/.test(token)) return CODE_COLORS.op;
  return CODE_COLORS.punct;
}
