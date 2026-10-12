import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import { getExperiments } from '../utils/storage'

export default function ExperimentOverview() {
  const { experimentId } = useParams()
  const exp = getExperiments().find((e) => e.id === Number(experimentId))

  if (!exp)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl font-extrabold">Experiment not found</p>
        <Link to="/experiments" className="text-amber-300">Back to Experiments</Link>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Experiments', to: '/experiments' }, { label: `Experiment ${exp.number}` }]} />
      <header>
        <p className="text-[11px] tracking-[0.3em] text-amber-400 font-semibold">EXPERIMENT {exp.number}</p>
        <h1 className="text-3xl font-extrabold">{exp.title}</h1>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Summary</h2>
        <p className="text-slate-400">{exp.overview.summary}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          {[
            ['Number', exp.number],
            ['Module', exp.module.split(' ')[0]],
            ['Difficulty', exp.difficulty],
            ['Sub Experiments', exp.subExperiments.length],
            ['Tools', exp.tools.length],
          ].map(([l, v]) => (
            <div key={l} className="glass p-4">
              <p className="font-bold text-sm">{v}</p>
              <p className="text-[10px] tracking-widest text-slate-500">{l.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Architecture</h2>
        <ArchitectureDiagram steps={exp.overview.architecture} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Sub Experiments</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exp.subExperiments.map((s) => (
            <Link key={s.id} to={`/experiments/${exp.id}/${s.id}`} className="glass p-5 hover:border-amber-500/40 transition block">
              <p className="text-3xl font-extrabold text-amber-300">{s.id}</p>
              <p className="font-semibold mt-2">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
