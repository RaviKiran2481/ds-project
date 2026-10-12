import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import baseExperiments from '../data/experiments.js';
import modules from '../data/modules.js';
import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'mbu-experiment-overrides-v1';
const ExperimentsContext = createContext(null);

const moduleTitle = (id) => modules.find((m) => m.id === id)?.title ?? 'Unassigned';

/**
 * Provides experiments merged with user edits saved in LocalStorage.
 * Overrides are stored per experiment id so base data updates still flow through.
 */
export function ExperimentsProvider({ children }) {
  const [overrides, setOverrides] = useState(() => storage.get(STORAGE_KEY, {}));

  const experiments = useMemo(
    () =>
      baseExperiments.map((exp) => {
        const merged = { ...exp, ...(overrides[exp.id] || {}) };
        return { ...merged, module: moduleTitle(merged.moduleId), edited: Boolean(overrides[exp.id]) };
      }),
    [overrides],
  );

  const persist = (next) => {
    setOverrides(next);
    storage.set(STORAGE_KEY, next);
  };

  const updateExperiment = useCallback(
    (id, data) => {
      const { module: _m, edited: _e, ...clean } = data;
      persist({ ...overrides, [id]: clean });
    },
    [overrides],
  );

  const resetExperiment = useCallback(
    (id) => {
      const next = { ...overrides };
      delete next[id];
      persist(next);
    },
    [overrides],
  );

  const resetAll = useCallback(() => persist({}), []);

  const getExperiment = useCallback((id) => experiments.find((e) => String(e.id) === String(id)), [experiments]);

  const value = useMemo(
    () => ({ experiments, getExperiment, updateExperiment, resetExperiment, resetAll, editedCount: Object.keys(overrides).length }),
    [experiments, getExperiment, updateExperiment, resetExperiment, resetAll, overrides],
  );

  return <ExperimentsContext.Provider value={value}>{children}</ExperimentsContext.Provider>;
}

export const useExperiments = () => {
  const ctx = useContext(ExperimentsContext);
  if (!ctx) throw new Error('useExperiments must be used inside ExperimentsProvider');
  return ctx;
};
