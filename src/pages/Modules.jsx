import ModuleCard from '../components/ModuleCard'
import modules from '../data/modules'

export default function Modules() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-extrabold">Modules</h1>
      <p className="text-slate-400">Five structured Data Science modules with topics, materials and experiments.</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((m, i) => (
          <ModuleCard key={m.id} mod={m} index={i} />
        ))}
      </div>
    </div>
  )
}
