import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import modules from '../data/modules'
import materials from '../data/materials'
import { getExperiments } from '../utils/storage'

export default function ModuleDetails() {
  const { moduleId } = useParams()
  const mod = modules.find((m) => m.id === Number(moduleId))
  const exps = getExperiments().filter((e) => e.module === mod?.title)
  const mats = materials.filter((m) => m.module === Number(moduleId))

  if (!mod)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl font-extrabold">Module not found</p>
        <Link to="/modules" className="text-amber-300">Back to Modules</Link>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Modules', to: '/modules' }, { label: `Module ${mod.number}` }]} />
      <header>
        <p className="text-[11px] tracking-[0.3em] text-fuchsia-400 font-semibold">MODULE {mod.number}</p>
        <h1 className="text-3xl font-extrabold">{mod.title}</h1>
        <p className="text-slate-400 mt-2">{mod.description}</p>
      </header>

      <Section title="Learning Objectives">
        <p className="text-slate-400">Understand the core concepts, apply them in experiments, and build practical Data Science skills.</p>
      </Section>

      <Section title="Topics">
        <div className="flex flex-wrap gap-2">
          {mod.topics.map((t) => <span key={t} className="glass px-3 py-1.5 text-sm">{t}</span>)}
        </div>
      </Section>

      <Section title="Experiments">
        {exps.length === 0 ? (
          <p className="text-slate-500">No experiments yet.</p>
        ) : (
          exps.map((e) => (
            <Link key={e.id} to={`/experiments/${e.id}/overview`} className="block glass p-4 mb-2 hover:bg-white/10">
              Experiment {e.number} — {e.title}
            </Link>
          ))
        )}
      </Section>

      <Section title="Study Materials">
        {mats.length === 0 ? (
          <p className="text-slate-500">No materials yet.</p>
        ) : (
          mats.map((m) => (
            <Link key={m.id} to={`/materials/${m.id}`} className="block glass p-4 mb-2 hover:bg-white/10">
              {m.title}
            </Link>
          ))
        )}
      </Section>

      <Section title="Tools">
        <p className="text-slate-400">See the Tools page for detailed documentation of each tool used in this module.</p>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}
