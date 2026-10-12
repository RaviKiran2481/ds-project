// Sandbox execution service.
//
// This frontend has NO Python runtime. If VITE_PYTHON_API_URL is set (e.g. in a .env file),
// code is POSTed to that backend: { code } → { stdout, stderr, table?, chart?, image? }.
// Otherwise a clearly-labelled SIMULATED run is produced: the reference output is shown when the
// code matches the reference solution, and a basic static check is performed on edited code.

const API_URL = import.meta.env.VITE_PYTHON_API_URL;

export const hasBackend = Boolean(API_URL);

function staticCheck(code) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [];
  let inStr = null;
  const lines = code.split('\n');
  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === '\\') i++;
        else if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '#') break;
      if (ch === '"' || ch === "'") inStr = ch;
      else if (pairs[ch]) stack.push({ ch, ln });
      else if (Object.values(pairs).includes(ch)) {
        const top = stack.pop();
        if (!top || pairs[top.ch] !== ch) return { line: ln + 1, message: `SyntaxError: unmatched '${ch}'` };
      }
    }
    if (inStr) return { line: ln + 1, message: 'SyntaxError: unterminated string literal' };
    if (/^\s*(def|class|if|elif|else|for|while|try|except|finally|with)\b[^:]*$/.test(line) && !/[([{,\\]\s*$/.test(line) && !stack.length)
      return { line: ln + 1, message: "SyntaxError: expected ':'" };
  }
  if (stack.length) return { line: stack[stack.length - 1].ln + 1, message: `SyntaxError: '${stack[stack.length - 1].ch}' was never closed` };
  return null;
}

/** Evaluate simple literal print() calls so trivial edits give sensible demo feedback. */
function simulatePrints(code) {
  const out = [];
  const re = /^\s*print\(\s*(?:f?"([^"]*)"|f?'([^']*)'|(-?\d+(?:\.\d+)?))\s*\)\s*$/gm;
  let m;
  while ((m = re.exec(code))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

const normalise = (s) => s.replace(/\s+/g, ' ').trim();
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runPython(code, reference = {}) {
  const started = performance.now();

  if (API_URL) {
    const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    if (!res.ok) throw new Error(`Backend responded with HTTP ${res.status}`);
    const data = await res.json();
    return { mode: 'live', status: data.stderr ? 'error' : 'success', ...data, elapsed: performance.now() - started };
  }

  await delay(550 + Math.random() * 350);
  const elapsed = performance.now() - started;

  if (!code.trim()) return { mode: 'simulated', status: 'error', stderr: 'Nothing to run — the editor is empty.', elapsed };

  const err = staticCheck(code);
  if (err) return { mode: 'simulated', status: 'error', stderr: `  File "<sandbox>", line ${err.line}\n${err.message}`, elapsed };

  if (reference.code && normalise(code) === normalise(reference.code)) {
    return { mode: 'simulated', status: 'success', stdout: reference.output, chart: reference.chart, elapsed };
  }

  const prints = simulatePrints(code);
  if (prints.length) {
    return { mode: 'simulated', status: 'success', stdout: prints.join('\n'), elapsed, note: 'Only literal print() statements were simulated.' };
  }

  return {
    mode: 'simulated',
    status: 'warning',
    stdout: '',
    elapsed,
    note:
      'Your code passed a basic syntax check, but it differs from the reference solution. Real execution requires a Python backend — set VITE_PYTHON_API_URL to connect one. Reset the editor to view the reference output.',
  };
}
