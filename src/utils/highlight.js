// Lightweight Python / generic syntax highlighter that returns safe HTML.

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif',
  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or',
  'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  // SQL-ish
  'SELECT', 'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'AS', 'DESC', 'ASC', 'WITH', 'OVER', 'RUN', 'COPY',
]);
const BUILTINS = new Set(['print', 'len', 'range', 'sum', 'min', 'max', 'abs', 'round', 'list', 'dict', 'set', 'tuple', 'str', 'int', 'float', 'type', 'open', 'enumerate', 'zip', 'sorted', 'map', 'filter', 'isinstance']);

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TOKEN_RE =
  /(#[^\n]*|--\s[^\n]*)|([fFrRbB]?"""[\s\S]*?"""|[fFrRbB]?'''[\s\S]*?'''|[fFrRbB]?"(?:\\.|[^"\\\n])*"|[fFrRbB]?'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)|([=+\-*/%<>!&|^~@]+)/g;

export function highlight(code = '', language = 'python') {
  if (language === 'text' || language === 'bash') return escapeHtml(code);
  let out = '';
  let last = 0;
  code.replace(TOKEN_RE, (match, com, str, num, fn, word, op, offset) => {
    out += escapeHtml(code.slice(last, offset));
    last = offset + match.length;
    const m = escapeHtml(match);
    if (com) out += `<span class="tok-com">${m}</span>`;
    else if (str) out += `<span class="tok-str">${m}</span>`;
    else if (num) out += `<span class="tok-num">${m}</span>`;
    else if (fn) out += KEYWORDS.has(fn) ? `<span class="tok-kw">${m}</span>` : BUILTINS.has(fn) ? `<span class="tok-bi">${m}</span>` : `<span class="tok-fn">${m}</span>`;
    else if (word) out += KEYWORDS.has(word) ? `<span class="tok-kw">${m}</span>` : m;
    else if (op) out += `<span class="tok-op">${m}</span>`;
    else out += m;
    return match;
  });
  out += escapeHtml(code.slice(last));
  return out;
}
