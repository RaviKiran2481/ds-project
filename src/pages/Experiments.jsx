import { useMemo, useState } from 'react'
import ExperimentCard from '../components/ExperimentCard'
import EditExperimentModal from '../components/EditExperimentModal'
import { getExperiments } from '../utils/storage'

const FILTERS = ['All', 'Python', 'NumPy', 'Pandas', 'Matplotlib', 'Statistics', 'Machine Learning', 'Deep Learning']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Experiments() {
  const [query, setQuery] = useState('')
  const [tech, setTech] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [sort, setSort] = useState('number')
  const [editing, setEditing] = useState(null)
  const [version, setVersion] = useState(0)

  const experiments = useMemo(() => getExperiments(), [version])

  const filtered = useMemo(() => {
    let list = experiments.filter((e) => {
      const matchesQ = !query || `${e.title} ${e.description} ${e.module}`.toLowerCase().includes(query.toLowerCase())
      const matchesTech = tech === 'All' || e.tools.some((t) => t.toLowerCase().includes(tech.toLowerCase())) || e.title.toLowerCase().includes(tech.toLowerCase())
      const matchesDiff = difficulty === 'All' || e.difficulty === difficulty
      return matchesQ && matchesTech && matchesDiff
    })
    if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'difficulty') list = [...list].sort((a, b) => a.difficulty.localeCompare(b.difficulty))
    else list = [...list].sort((a, b) => Number(a.number) - Number(b.number))
    return list
  }, [experiments, query, tech, difficulty, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold">Experiments</h1>

      <div className="flex flex-col lg:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: Pandas"
          aria-label="Search experiments"
          className="glass px-4 py-3 flex-1 outline-none rounded-2xl"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="glass px-4 py-3 rounded-2xl bg-[#150a0d]" aria-label="Sort">
          <option value="number">Sort: Number</option>
          <option value="title">Sort: Title</option>
          <option value="difficulty">Sort: Difficulty</option>
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="glass px-4 py-3 rounded-2xl bg-[#150a0d]" aria-label="Difficulty filter">
          {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTech(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${tech === f ? 'bg-amber-500/20 text-amber-300' : 'glass hover:bg-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No experiments found. Try another search.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((e, i) => (
            <ExperimentCard key={e.id} exp={e} index={i} showEdit onEdit={setEditing} />
          ))}
        </div>
      )}

      {editing && (
        <EditExperimentModal exp={editing} onClose={() => setEditing(null)} onSaved={() => setVersion((v) => v + 1)} />
      )}
    </div>
  )
}
