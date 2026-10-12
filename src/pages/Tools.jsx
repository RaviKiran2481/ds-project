import { useMemo, useState } from 'react'
import ToolCard from '../components/ToolCard'
import LiveCompiler from '../components/LiveCompiler'
import tools from '../data/tools'

const categories = [...new Set(tools.map((t) => t.category))]

export default function Tools() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      tools.filter(
        (t) =>
          (category === 'All' || t.category === category) &&
          (!query || `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [category, query]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold">Tools</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
        aria-label="Search tools"
        className="glass px-4 py-3 w-full max-w-md outline-none rounded-2xl"
      />
      <div className="flex flex-wrap gap-2">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${category === c ? 'bg-amber-500/20 text-amber-300' : 'glass hover:bg-white/10'}`}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No tools found.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t, i) => <ToolCard key={t.id} tool={t} index={i} />)}
        </div>
      )}

      <LiveCompiler />
    </div>
  )
}
