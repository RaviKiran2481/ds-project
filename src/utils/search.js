import experiments from '../data/experiments'
import modules from '../data/modules'
import tools from '../data/tools'
import materials from '../data/materials'

// One central searchable dataset across all content types.
export function buildIndex(exps = experiments) {
  const index = []

  exps.forEach((e) => {
    index.push({
      type: 'EXPERIMENT',
      title: e.title,
      subtitle: `Experiment ${e.number}`,
      keywords: `${e.title} ${e.description} ${e.module} ${e.difficulty} ${e.tools.join(' ')}`,
      path: `/experiments/${e.id}/overview`,
    })
    e.subExperiments.forEach((s) => {
      index.push({
        type: 'SUB-EXPERIMENT',
        title: s.title,
        subtitle: `Experiment ${e.number} · Part ${s.id}`,
        keywords: `${s.title} ${s.aim} ${e.title}`,
        path: `/experiments/${e.id}/${s.id}`,
      })
    })
  })

  modules.forEach((m) => {
    index.push({
      type: 'MODULE',
      title: m.title,
      subtitle: `Module ${m.number}`,
      keywords: `${m.title} ${m.description} ${m.topics.join(' ')}`,
      path: `/modules/${m.id}`,
    })
  })

  tools.forEach((t) => {
    index.push({
      type: 'TOOL',
      title: t.name,
      subtitle: t.category,
      keywords: `${t.name} ${t.category} ${t.description}`,
      path: `/tools/${t.id}`,
    })
  })

  materials.forEach((m) => {
    index.push({
      type: 'MATERIAL',
      title: m.title,
      subtitle: `Module ${String(m.module).padStart(2, '0')}`,
      keywords: `${m.title} material pdf`,
      path: `/materials/${m.id}`,
    })
  })

  return index
}

export function searchAll(query, exps) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return buildIndex(exps).filter(
    (i) => i.title.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q)
  )
}
