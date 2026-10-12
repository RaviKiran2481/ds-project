import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import Modal from '../Modal/Modal.jsx';
import modules from '../../data/modules.js';
import { useExperiments } from '../../context/ExperimentsContext.jsx';

const toForm = (e) => ({
  number: e.number,
  title: e.title,
  description: e.description,
  moduleId: e.moduleId,
  difficulty: e.difficulty,
  duration: e.duration || '',
  aim: e.aim || '',
  summary: e.overview?.summary || '',
  architecture: (e.overview?.architecture || []).join('\n'),
  tools: e.tools.join(', '),
  technologies: (e.technologies || []).join(', '),
  subExperiments: e.subExperiments.map((s) => ({ ...s, procedure: s.procedure.join('\n') })),
});

const splitList = (s, sep) => s.split(sep).map((x) => x.trim()).filter(Boolean);

function Field({ label, id, children, hint, error }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
      {error && <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-300"><AlertCircle size={12} aria-hidden="true" /> {error}</p>}
    </div>
  );
}

export default function EditExperimentModal({ experiment, onClose, onSaved }) {
  const { updateExperiment, resetExperiment } = useExperiments();
  const [form, setForm] = useState(null);
  const [subIdx, setSubIdx] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (experiment) {
      setForm(toForm(experiment));
      setSubIdx(0);
      setErrors({});
    }
  }, [experiment]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSub = (key) => (e) =>
    setForm((f) => ({ ...f, subExperiments: f.subExperiments.map((s, i) => (i === subIdx ? { ...s, [key]: e.target.value } : s)) }));

  const save = () => {
    const errs = {};
    if (!form.number.trim()) errs.number = 'Experiment number is required';
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    form.subExperiments.forEach((s, i) => !s.title.trim() && (errs[`sub${i}`] = 'Title required'));
    setErrors(errs);
    if (Object.keys(errs).length) return;

    updateExperiment(experiment.id, {
      ...experiment,
      number: form.number.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      moduleId: form.moduleId,
      difficulty: form.difficulty,
      duration: form.duration.trim(),
      aim: form.aim.trim(),
      tools: splitList(form.tools, ','),
      technologies: splitList(form.technologies, ','),
      overview: { ...experiment.overview, summary: form.summary.trim(), architecture: splitList(form.architecture, '\n') },
      subExperiments: form.subExperiments.map((s) => ({ ...s, title: s.title.trim(), procedure: splitList(s.procedure, '\n') })),
    });
    onSaved?.(`Experiment ${form.number} saved`);
    onClose();
  };

  const restore = () => {
    resetExperiment(experiment.id);
    onSaved?.(`Experiment ${experiment.number} restored to default`);
    onClose();
  };

  const sub = form?.subExperiments[subIdx];

  return (
    <Modal
      open={Boolean(experiment && form)}
      onClose={onClose}
      title="Edit Experiment"
      subtitle={experiment ? `Experiment ${experiment.number} · changes are saved to this browser (LocalStorage)` : ''}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          {experiment?.edited ? (
            <button onClick={restore} className="btn-ghost text-xs"><RotateCcw size={14} aria-hidden="true" /> Restore default</button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={save} className="btn-primary"><Save size={16} aria-hidden="true" /> Save Changes</motion.button>
          </div>
        </div>
      }
    >
      {form && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <Field label="Experiment Number" id="f-number" error={errors.number}>
              <input id="f-number" className="input" value={form.number} onChange={set('number')} />
            </Field>
            <Field label="Title" id="f-title" error={errors.title}>
              <input id="f-title" className="input" value={form.title} onChange={set('title')} />
            </Field>
          </div>
          <Field label="Description" id="f-desc" hint={`${form.description.split(/\s+/).filter(Boolean).length} words (≈15 recommended)`} error={errors.description}>
            <textarea id="f-desc" rows={2} className="input" value={form.description} onChange={set('description')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Module" id="f-module">
              <select id="f-module" className="input" value={form.moduleId} onChange={set('moduleId')}>
                {modules.map((m) => <option key={m.id} value={m.id} className="bg-ink-900">Module {m.number} — {m.title}</option>)}
              </select>
            </Field>
            <Field label="Difficulty" id="f-diff">
              <select id="f-diff" className="input" value={form.difficulty} onChange={set('difficulty')}>
                {['Beginner', 'Intermediate', 'Advanced'].map((d) => <option key={d} className="bg-ink-900">{d}</option>)}
              </select>
            </Field>
            <Field label="Duration" id="f-dur">
              <input id="f-dur" className="input" value={form.duration} onChange={set('duration')} placeholder="e.g. 2 hrs" />
            </Field>
          </div>
          <Field label="Aim" id="f-aim">
            <textarea id="f-aim" rows={2} className="input" value={form.aim} onChange={set('aim')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tools" id="f-tools" hint="Comma separated — e.g. Pandas, NumPy">
              <input id="f-tools" className="input" value={form.tools} onChange={set('tools')} />
            </Field>
            <Field label="Technologies (filters)" id="f-tech" hint="Comma separated — e.g. Python, Machine Learning">
              <input id="f-tech" className="input" value={form.technologies} onChange={set('technologies')} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <Field label="Overview Summary" id="f-sum">
              <textarea id="f-sum" rows={5} className="input" value={form.summary} onChange={set('summary')} />
            </Field>
            <Field label="Architecture Steps" id="f-arch" hint="One step per line">
              <textarea id="f-arch" rows={5} className="input font-mono text-xs" value={form.architecture} onChange={set('architecture')} />
            </Field>
          </div>

          {/* Sub-experiments */}
          <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <legend className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">Sub Experiments</legend>
            <div className="mb-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Sub experiments">
              {form.subExperiments.map((s, i) => (
                <button key={s.id} role="tab" aria-selected={i === subIdx} onClick={() => setSubIdx(i)} className={`relative rounded-xl border px-3.5 py-2 text-sm font-bold transition ${i === subIdx ? 'border-brand-400/40 bg-brand-500/15 text-white' : 'border-white/10 text-slate-400 hover:text-white'} ${errors[`sub${i}`] ? 'border-rose-400/50' : ''}`}>
                  {s.id}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={subIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="space-y-4">
                <Field label={`${sub.id} · Title`} id="s-title" error={errors[`sub${subIdx}`]}>
                  <input id="s-title" className="input" value={sub.title} onChange={setSub('title')} />
                </Field>
                <Field label="Aim" id="s-aim">
                  <textarea id="s-aim" rows={2} className="input" value={sub.aim} onChange={setSub('aim')} />
                </Field>
                <Field label="Procedure" id="s-proc" hint="One step per line">
                  <textarea id="s-proc" rows={4} className="input" value={sub.procedure} onChange={setSub('procedure')} />
                </Field>
                <Field label="Code" id="s-code">
                  <textarea id="s-code" rows={9} spellCheck={false} className="input code-surface whitespace-pre font-mono text-[13px] leading-6 text-slate-100" value={sub.code} onChange={setSub('code')} />
                </Field>
                <Field label="Output" id="s-out">
                  <textarea id="s-out" rows={5} spellCheck={false} className="input code-surface whitespace-pre font-mono text-[13px] leading-6 text-emerald-200" value={sub.output} onChange={setSub('output')} />
                </Field>
              </motion.div>
            </AnimatePresence>
          </fieldset>
        </div>
      )}
    </Modal>
  );
}
