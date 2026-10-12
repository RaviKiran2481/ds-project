import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import CodeBlock from '../components/CodeBlock'
import Sandbox from '../components/Sandbox'
import { getExperiments } from '../utils/storage'

export default function SubExperiment() {
  const { experimentId, subExperimentId } = useParams()
  const exp = getExperiments().find((e) => e.id === Number(experimentId))
  const sub = exp?.subExperiments.find((s) => s.id === subExperimentId)

  if (!exp || !sub)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl font-extrabold">Sub-experiment not found</p>
        <Link to="/experiments" className="text-amber-300">Back to Experiments</Link>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Experiments', to: '/experiments' },
          { label: `Experiment ${exp.number}`, to: `/experiments/${exp.id}/overview` },
          { label: sub.title },
        ]}
      />
      <header>
        <p className="text-[11px] tracking-[0.3em] text-amber-400 font-semibold">PART {sub.id} · {exp.title}</p>
        <h1 className="text-3xl font-extrabold">{sub.title}</h1>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">AIM</h2>
        <p className="text-slate-400">{sub.aim}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">PROCEDURE</h2>
        <ol className="list-decimal list-inside text-slate-400 space-y-1">
          {sub.procedure.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">CODE</h2>
        <CodeBlock code={sub.code} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">OUTPUT</h2>
        <pre className="glass p-5 text-sm whitespace-pre-wrap bg-[#150a0d]/70">{sub.output}</pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Data Science Sandbox</h2>
        <Sandbox initialCode={sub.code} expectedOutput={sub.output} />
      </section>
    </div>
  )
}
