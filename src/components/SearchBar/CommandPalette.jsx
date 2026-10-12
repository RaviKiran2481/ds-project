import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ResultList, useGlobalSearch } from './SearchBar.jsx';

const SUGGESTIONS = ['Pandas', 'Data Cleaning', 'Regression', 'Matplotlib', 'Hypothesis', 'TensorFlow'];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const results = useGlobalSearch(query);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  useEffect(() => setActive(0), [query]);

  const select = (r) => {
    onClose();
    navigate(r.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) select(results[active]);
    else if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink-950/70 p-4 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Search">
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ duration: 0.18 }} onMouseDown={(e) => e.stopPropagation()} className="glass-strong w-full max-w-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/5 px-4">
              <Search size={20} className="text-brand-300" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search experiments, modules, tools..."
                aria-label="Search the portal"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={listId}
                className="h-14 w-full bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button onClick={onClose} className="btn-icon h-8 w-8" aria-label="Close search"><X size={16} /></button>
            </div>
            {query.trim() ? (
              results.length ? (
                <ResultList results={results} active={active} setActive={setActive} onSelect={select} listId={listId} />
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="font-semibold text-white">No results found.</p>
                  <p className="mt-1 text-sm text-slate-400">Try another search.</p>
                </div>
              )
            ) : (
              <div className="p-4">
                <p className="label">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => setQuery(s)} className="chip px-3 py-1 text-xs transition hover:border-brand-400/40 hover:text-white">{s}</button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
