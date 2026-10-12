import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Table2, BarChart3 } from 'lucide-react';
import { CopyButton } from '../CodeBlock/CodeBlock.jsx';

/** Detect pandas-style DataFrame text output and convert it into rows. */
export function parseTable(text = '') {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2 || lines.length > 40) return null;
  const header = lines[0].trim().split(/\s+/);
  if (header.length < 2) return null;
  const rows = lines.slice(1).map((l) => l.trim().split(/\s+/));
  if (!rows.every((r) => r.length === header.length + 1)) return null;
  return { header: ['', ...header], rows };
}

export function Chart({ chart }) {
  const { type, title, labels = [], values = [] } = chart;
  const W = 560, H = 260, P = { t: 20, r: 16, b: 40, l: 48 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;

  const content = useMemo(() => {
    if (type === 'scatter') {
      const xs = values.map((v) => v[0]), ys = values.map((v) => v[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), 0, Math.max(...ys) * 1.1];
      const sx = (x) => P.l + ((x - x0) / (x1 - x0 || 1)) * iw;
      const sy = (y) => P.t + ih - ((y - y0) / (y1 - y0 || 1)) * ih;
      return { ticks: [0, 0.5, 1].map((f) => y0 + f * (y1 - y0)), sy, els: values.map((v, i) => <motion.circle key={i} cx={sx(v[0])} cy={sy(v[1])} r={5} fill="url(#cg)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} />) };
    }
    const max = Math.max(...values) * 1.12 || 1;
    const sy = (y) => P.t + ih - (y / max) * ih;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
    const step = iw / values.length;
    if (type === 'line') {
      const pts = values.map((v, i) => [P.l + step * i + step / 2, sy(v)]);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
      const area = `${d} L${pts[pts.length - 1][0]},${P.t + ih} L${pts[0][0]},${P.t + ih} Z`;
      return {
        ticks, sy, step,
        els: (
          <>
            <path d={area} fill="url(#ag)" />
            <motion.path d={d} fill="none" stroke="url(#cg)" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#0a0e1a" stroke="#a5b4fc" strokeWidth={2}><title>{`${labels[i]}: ${values[i]}`}</title></circle>)}
          </>
        ),
      };
    }
    const bw = Math.min(48, step * 0.62);
    return {
      ticks, sy, step,
      els: values.map((v, i) => {
        const x = P.l + step * i + (step - bw) / 2;
        return (
          <motion.rect key={i} x={x} width={bw} rx={6} fill="url(#cg)" initial={{ y: P.t + ih, height: 0 }} animate={{ y: sy(v), height: P.t + ih - sy(v) }} transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}>
            <title>{`${labels[i]}: ${v}`}</title>
          </motion.rect>
        );
      }),
    };
  }, [type, values, labels]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (n) => (Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(1)}k` : Math.abs(n) < 2 ? n.toFixed(2) : Math.round(n));

  return (
    <figure className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <figcaption className="mb-2 text-sm font-semibold text-slate-200">{title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${type} chart: ${title}`}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#818cf8" stopOpacity="0.35" /><stop offset="1" stopColor="#818cf8" stopOpacity="0" /></linearGradient>
        </defs>
        {content.ticks.map((t, i) => (
          <g key={i}>
            <line x1={P.l} x2={W - P.r} y1={content.sy(t)} y2={content.sy(t)} stroke="rgba(148,163,184,0.15)" strokeDasharray="3 4" />
            <text x={P.l - 8} y={content.sy(t) + 4} textAnchor="end" fontSize="11" fill="#64748b">{fmt(t)}</text>
          </g>
        ))}
        {content.els}
        {type !== 'scatter' && labels.map((l, i) => (
          <text key={l + i} x={P.l + content.step * i + content.step / 2} y={H - 14} textAnchor="middle" fontSize="11" fill="#94a3b8">{l}</text>
        ))}
      </svg>
    </figure>
  );
}

export default function OutputViewer({ output, chart, title = 'Expected Output' }) {
  const table = useMemo(() => parseTable(output), [output]);
  const [view, setView] = useState(table ? 'table' : 'console');
  const tabs = [
    { id: 'console', label: 'Console', icon: Terminal },
    ...(table ? [{ id: 'table', label: 'Table', icon: Table2 }] : []),
    ...(chart ? [{ id: 'chart', label: 'Chart', icon: BarChart3 }] : []),
  ];
  const current = tabs.find((t) => t.id === view) ? view : 'console';

  return (
    <div className="code-surface overflow-hidden rounded-2xl border border-white/10 shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-2">
        <span className="font-mono text-xs text-slate-400">{title}</span>
        <div className="flex items-center gap-2">
          {tabs.length > 1 && (
            <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5" role="tablist" aria-label="Output view">
              {tabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={current === t.id} onClick={() => setView(t.id)} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${current === t.id ? 'bg-brand-500/25 text-white' : 'text-slate-400 hover:text-white'}`}>
                  <t.icon size={13} aria-hidden="true" /> {t.label}
                </button>
              ))}
            </div>
          )}
          <CopyButton text={output} label="Copy" compact />
        </div>
      </div>
      <div className="p-4">
        {current === 'console' && <pre className="overflow-auto whitespace-pre font-mono text-[13px] leading-6 text-emerald-200/90">{output}</pre>}
        {current === 'table' && table && (
          <div className="overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <tr>{table.header.map((h, i) => <th key={i} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} className="border-t border-white/5 text-slate-200 odd:bg-white/[0.02]">
                    {r.map((c, j) => <td key={j} className={`px-3 py-2 font-mono text-[13px] ${j === 0 ? 'text-slate-500' : ''}`}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {current === 'chart' && chart && <Chart chart={chart} />}
      </div>
    </div>
  );
}
