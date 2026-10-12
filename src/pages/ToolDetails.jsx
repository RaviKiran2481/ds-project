import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import CodeBlock from '../components/CodeBlock'
import tools from '../data/tools'
import { getExperiments } from '../utils/storage'

export default function ToolDetails() {
  const { toolId } = useParams()
  const tool = tools.find((t) => t.id === toolId)
  const usingExps = getExperiments().filter((e) => e.tools.some((t) => t.toLowerCase() === tool?.name.toLowerCase()))

  if (!tool)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl font-extrabold">Tool not found</p>
        <Link to="/tools" className="text-amber-300">Back to Tools</Link>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tools', to: '/tools' }, { label: tool.name }]} />
      <header>
        <p className="text-[11px] tracking-[0.3em] text-amber-400 font-semibold">{tool.category.toUpperCase()}</p>
        <h1 className="text-3xl font-extrabold">{tool.name.toUpperCase()}</h1>
        <p className="text-slate-400 mt-2">{tool.description}</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">What is {tool.name}?</h2>
        <p className="text-slate-400 leading-relaxed">{tool.whatIs || tool.description}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Overview</h2>
        <p className="text-slate-400">{tool.description}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Features</h2>
        <ul className="list-disc list-inside text-slate-400 space-y-1">
          {tool.features.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Installation</h2>
        <CodeBlock code={tool.install} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Basic Usage</h2>
        <CodeBlock code={tool.usage} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Experiments Using This Tool</h2>
        {usingExps.length === 0 ? (
          <p className="text-slate-500">None listed yet.</p>
        ) : (
          usingExps.map((e) => (
            <Link key={e.id} to={`/experiments/${e.id}/overview`} className="block glass p-4 mb-2 hover:bg-white/10">
              Experiment {e.number} — {e.title}
            </Link>
          ))
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Documentation</h2>
        <div className="flex gap-3">
          <a href={tool.docs} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold">Official Documentation</a>
          <a href={tool.website} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full glass text-sm font-semibold">Official Website</a>
        </div>
      </section>
    </div>
  )
}
