import experiments from '../data/experiments'

const KEY = 'digital_library_experiment_overrides'

export function getExperiments() {
  try {
    const overrides = JSON.parse(localStorage.getItem(KEY) || '{}')
    return experiments.map((e) => (overrides[e.id] ? { ...e, ...overrides[e.id] } : e))
  } catch {
    return experiments
  }
}

export function saveExperiment(id, data) {
  const overrides = JSON.parse(localStorage.getItem(KEY) || '{}')
  overrides[id] = { ...(overrides[id] || {}), ...data }
  localStorage.setItem(KEY, JSON.stringify(overrides))
}

export function resetExperiments() {
  localStorage.removeItem(KEY)
}
