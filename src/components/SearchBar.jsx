import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { searchAll } from '../utils/search'

const TYPE_STYLES = {
  EXPERIMENT: 'text-indigo-300 bg-indigo-500/10',
  'SUB-EXPERIMENT': 'text-fuchsia-300 bg-fuchsia-500/10',
  MODULE: 'text-emerald-300 bg-emerald-500/10',
  TOOL: 'text-amber-300 bg-amber-500/10',
  MATERIAL: 'text-rose-300 bg-rose-500/10',
}

export default function SearchBar({ large = false }) {
  const [q, setQ] = useState('')
  const results = useMemo(() => searchAll(q).slice(0, 8), [q])

  return (
    <div className="relative w-full">
      <div className={`glass flex items-center gap-3 px-4 ${large ? 'py-4' : 'py-3'} focus-within:ring-2 ring-amber-500/40`}>
        <Search className="w-5 h-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search experiments, modules, tools..."
          aria-label="Search"
          className="bg-transparent flex-1 outline-none placeholder:text-slate-500"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Clear search" className="p-1 rounded-full hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {q && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full mt-2 w-full glass p-2 max-h-96 overflow-auto z-30"
          >
            {results.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 text-center">No results found. Try another search.</p>
            ) : (
              results.map((r, i) => (
                <Link
                  key={i}
                  to={r.path}
                  onClick={() => setQ('')}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                >
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.subtitle}</p>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded-full ${TYPE_STYLES[r.type]}`}>{r.type}</span>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
