import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CornerDownLeft, Search, X, FlaskConical, Layers, Wrench, FileText, Beaker } from 'lucide-react';
import { useExperiments } from '../../context/ExperimentsContext.jsx';
import { buildSearchIndex, searchIndex, CATEGORY_STYLES } from '../../utils/search.js';
import { useDebounce } from '../../hooks/index.js';

const ICONS = { Experiment: FlaskConical, 'Sub-Experiment': Beaker, Module: Layers, Tool: Wrench, Material: FileText };

export function useGlobalSearch(query) {
  const { experiments } = useExperiments();
  const index = useMemo(() => buildSearchIndex(experiments), [experiments]);
  const debounced = useDebounce(query, 80);
  return useMemo(() => searchIndex(index, debounced), [index, debounced]);
}

export function ResultList({ results, active, setActive, onSelect, listId }) {
  return (
    <ul id={listId} role="listbox" className="max-h-[60vh] space-y-1 overflow-y-auto p-2">
      {results.map((r, i) => {
        const Icon = ICONS[r.category];
        return (
          <motion.li
            key={r.key}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.2) }}
            onMouseEnter={() => setActive(i)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(r)}
            className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${i === active ? 'border-brand-400/30 bg-brand-500/10' : 'border-transparent hover:bg-white/5'}`}
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${CATEGORY_STYLES[r.category]}`}>
              <Icon size={16} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`mb-0.5 inline-block rounded-md border px-1.5 py-px text-[9px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[r.category]}`}>{r.category}</span>
              <span className="block truncate text-sm font-semibold text-white">{r.title}</span>
              <span className="block truncate text-xs text-slate-400">{r.subtitle}</span>
            </span>
            <ArrowRight size={16} className={`shrink-0 transition ${i === active ? 'translate-x-0 text-brand-300 opacity-100' : '-translate-x-1 opacity-0'}`} aria-hidden="true" />
          </motion.li>
        );
      })}
    </ul>
  );
}

/** Large inline search with animated dropdown results (used on Home). */
export default function SearchBar({ placeholder = 'Search experiments, modules, tools...', autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const results = useGlobalSearch(query);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const listId = useId();

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    const close = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = (r) => {
    setOpen(false);
    setQuery('');
    navigate(r.to);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      select(results[active]);
    } else if (e.key === 'Escape') {
      if (query) setQuery('');
      else setOpen(false);
    }
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative z-30">
      <motion.div
        animate={{ boxShadow: open ? '0 0 0 1px rgba(129,140,248,0.45), 0 20px 50px -12px rgba(99,102,241,0.35)' : '0 8px 32px rgba(0,0,0,0.25)' }}
        className="glass-strong flex items-center gap-3 px-4 py-1.5 sm:px-5"
      >
        <Search size={22} className="shrink-0 text-brand-300" aria-hidden="true" />
        <label htmlFor={`${listId}-input`} className="sr-only">Search the portal</label>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={showPanel && results[active] ? `${listId}-${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="h-12 w-full bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none sm:h-14 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
        />
        <AnimatePresence>
          {query && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="btn-icon h-8 w-8 shrink-0" aria-label="Clear search">
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showPanel && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }} className="glass-strong absolute left-0 right-0 top-full mt-2 overflow-hidden">
            {results.length ? (
              <>
                <p className="border-b border-white/5 px-4 py-2 text-xs text-slate-500" aria-live="polite">{results.length} result{results.length !== 1 && 's'} for “{query}”</p>
                <ResultList results={results} active={active} setActive={setActive} onSelect={select} listId={listId} />
                <p className="flex items-center gap-3 border-t border-white/5 px-4 py-2 text-[11px] text-slate-500">
                  <span>↑ ↓ navigate</span><span className="inline-flex items-center gap-1"><CornerDownLeft size={11} /> open</span><span>Esc clear</span>
                </p>
              </>
            ) : (
              <div className="px-6 py-10 text-center" aria-live="polite">
                <p className="font-semibold text-white">No results for “{query}”</p>
                <p className="mt-1 text-sm text-slate-400">Try another search — e.g. “Pandas”, “regression” or “cleaning”.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
