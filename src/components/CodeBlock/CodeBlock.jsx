import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { highlight } from '../../utils/highlight.js';
import { useCopy } from '../../hooks/index.js';

export function CopyButton({ text, label = 'Copy Code', compact = false }) {
  const [copied, copy] = useCopy();
  return (
    <button onClick={() => copy(text)} className={`btn-ghost ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'}`} aria-label={copied ? 'Copied to clipboard' : label}>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-teal-300">
            <Check size={14} aria-hidden="true" /> Copied
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5">
            <Copy size={14} aria-hidden="true" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function CodeBlock({ code, language = 'python', title, showLineNumbers = true, maxHeight }) {
  const html = useMemo(() => highlight(code, language), [code, language]);
  const lineCount = code.split('\n').length;
  return (
    <div className="code-surface overflow-hidden rounded-2xl border border-white/10 shadow-glass">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="font-mono text-xs text-slate-400">{title || language}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <div className="flex overflow-auto font-mono text-[13px] leading-6" style={{ maxHeight }}>
        {showLineNumbers && (
          <div className="select-none border-r border-white/5 px-3 py-4 text-right text-slate-600" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
          </div>
        )}
        <pre className="flex-1 px-4 py-4 text-slate-200"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
      </div>
    </div>
  );
}
