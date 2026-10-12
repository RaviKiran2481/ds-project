import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw, Loader2, AlertTriangle, CheckCircle2, Info, Server, FlaskConical } from 'lucide-react';
import { CopyButton } from '../CodeBlock/CodeBlock.jsx';
import { Chart } from '../OutputViewer/OutputViewer.jsx';
import { runPython, hasBackend } from '../../utils/pythonRunner.js';

export default function Sandbox({ initialCode = '', reference = {} }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const taRef = useRef(null);
  const gutterRef = useRef(null);

  useEffect(() => {
    setCode(initialCode);
    setResult(null);
  }, [initialCode]);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      setResult(await runPython(code, reference));
    } catch (err) {
      setResult({ status: 'error', mode: 'live', stderr: `Execution failed: ${err.message}` });
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setCode(initialCode);
    setResult(null);
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = e.target;
      const next = code.slice(0, s) + '    ' + code.slice(en);
      setCode(next);
      requestAnimationFrame(() => taRef.current && (taRef.current.selectionStart = taRef.current.selectionEnd = s + 4));
    }
  };

  const lines = code.split('\n').length;
  const StatusIcon = result?.status === 'error' ? AlertTriangle : result?.status === 'warning' ? Info : CheckCircle2;
  const statusColor = result?.status === 'error' ? 'text-rose-300' : result?.status === 'warning' ? 'text-amber-300' : 'text-emerald-300';

  return (
    <section aria-labelledby="sandbox-title" className="grid gap-4 xl:grid-cols-2">
      {/* Editor */}
      <div className="code-surface flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-glass">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <span className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FlaskConical size={14} className="text-brand-300" aria-hidden="true" /> Code
          </span>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={run} disabled={running} className="btn-primary px-3 py-1.5 text-xs" aria-label="Run code (Ctrl+Enter)">
              {running ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Play size={14} aria-hidden="true" />} {running ? 'Running…' : 'Run'}
            </motion.button>
            <button onClick={reset} className="btn-ghost px-3 py-1.5 text-xs"><RotateCcw size={14} aria-hidden="true" /> Reset</button>
            <CopyButton text={code} label="Copy" compact />
          </div>
        </div>
        <div className="relative flex min-h-[320px] flex-1 font-mono text-[13px] leading-6">
          <div ref={gutterRef} className="select-none overflow-hidden border-r border-white/5 px-3 py-4 text-right text-slate-600" aria-hidden="true">
            {Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <label htmlFor="sandbox-editor" className="sr-only">Python code editor</label>
          <textarea
            id="sandbox-editor"
            ref={taRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            onScroll={(e) => gutterRef.current && (gutterRef.current.scrollTop = e.target.scrollTop)}
            spellCheck={false}
            className="max-h-[480px] min-h-[320px] flex-1 resize-y whitespace-pre bg-transparent px-4 py-4 text-slate-100 caret-brand-300 focus:outline-none"
          />
        </div>
        <p className="border-t border-white/5 px-4 py-2 text-[11px] text-slate-500">Ctrl + Enter to run · Tab inserts 4 spaces</p>
      </div>

      {/* Output */}
      <div className="code-surface flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-glass">
        <div className="flex items-center justify-between gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">Output</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${hasBackend ? 'border-emerald-400/30 text-emerald-300' : 'border-amber-400/30 text-amber-300'}`}>
            <Server size={11} aria-hidden="true" /> {hasBackend ? 'Live backend' : 'Simulated (no backend)'}
          </span>
        </div>
        <div className="flex-1 overflow-auto p-4" aria-live="polite">
          <AnimatePresence mode="wait">
            {running ? (
              <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 size={28} className="animate-spin text-brand-300" aria-hidden="true" />
                <p className="text-sm">Running…</p>
              </motion.div>
            ) : result ? (
              <motion.div key="res" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className={`flex items-center gap-2 text-xs font-semibold ${statusColor}`}>
                  <StatusIcon size={15} aria-hidden="true" />
                  {result.status === 'error' ? 'Error' : result.status === 'warning' ? 'Not executed' : 'Completed'}
                  {result.elapsed != null && <span className="font-normal text-slate-500">· {Math.round(result.elapsed)} ms {result.mode === 'simulated' && '(simulated)'}</span>}
                </div>
                {result.stdout && <pre className="overflow-auto whitespace-pre font-mono text-[13px] leading-6 text-emerald-200/90">{result.stdout}</pre>}
                {result.stderr && <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-rose-400/20 bg-rose-500/[0.08] p-3 font-mono text-[13px] leading-6 text-rose-200">{result.stderr}</pre>}
                {result.chart && <Chart chart={result.chart} />}
                {result.image && <img src={result.image} alt="Figure produced by the code" className="rounded-xl border border-white/10" />}
                {result.note && <p className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3 text-xs leading-relaxed text-amber-200/90">{result.note}</p>}
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Play size={26} aria-hidden="true" />
                <p className="text-sm">Press <span className="font-semibold text-slate-300">Run</span> to see the output here.</p>
                {!hasBackend && <p className="max-w-xs text-xs">No Python backend is connected — the sandbox shows the reference output for the reference code and performs a basic syntax check on edits.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
