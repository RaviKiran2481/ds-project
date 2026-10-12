import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { saveExperiment } from '../utils/storage'

export default function EditExperimentModal({ exp, onClose, onSaved }) {
  const [form, setForm] = useState({
    number: exp.number,
    title: exp.title,
    description: exp.description,
    module: exp.module,
    difficulty: exp.difficulty,
    tools: exp.tools.join(', '),
    aim: exp.subExperiments[0]?.aim || '',
    code: exp.subExperiments[0]?.code || '',
    output: exp.subExperiments[0]?.output || '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = () => {
    const updatedSubs = exp.subExperiments.map((s, i) =>
      i === 0 ? { ...s, aim: form.aim, code: form.code, output: form.output } : s
    )
    saveExperiment(exp.id, {
      number: form.number,
      title: form.title,
      description: form.description,
      module: form.module,
      difficulty: form.difficulty,
      tools: form.tools.split(',').map((t) => t.trim()).filter(Boolean),
      subExperiments: updatedSubs,
    })
    onSaved()
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">EDIT EXPERIMENT</h2>
            <button onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-white/10"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Input label="Experiment Number" value={form.number} onChange={set('number')} />
            <Input label="Title" value={form.title} onChange={set('title')} />
          </div>
          <Area label="Description" value={form.description} onChange={set('description')} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Module" value={form.module} onChange={set('module')} />
            <Input label="Difficulty" value={form.difficulty} onChange={set('difficulty')} />
          </div>
          <Area label="Aim (Part A)" value={form.aim} onChange={set('aim')} rows={2} />
          <Area label="Code (Part A)" value={form.code} onChange={set('code')} rows={6} mono />
          <Area label="Output (Part A)" value={form.output} onChange={set('output')} rows={4} mono />
          <Input label="Tools (comma separated)" value={form.tools} onChange={set('tools')} />

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-5 py-2 rounded-full bg-white/5 text-sm">Cancel</button>
            <button onClick={save} className="px-5 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold">Save Changes</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="block text-xs text-slate-500">
      {label}
      <input {...props} className="mt-1 w-full glass px-3 py-2 text-sm outline-none" />
    </label>
  )
}

function Area({ label, mono, ...props }) {
  return (
    <label className="block text-xs text-slate-500">
      {label}
      <textarea {...props} className={`mt-1 w-full glass px-3 py-2 text-sm outline-none ${mono ? 'font-mono' : ''}`} />
    </label>
  )
}
