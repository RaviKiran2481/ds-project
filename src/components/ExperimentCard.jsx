import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ExperimentCard({ exp, index = 0, showEdit, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-6 flex flex-col gap-3 hover:border-amber-500/40 transition"
    >
      <p className="text-[11px] tracking-[0.3em] text-amber-400 font-semibold">EXPERIMENT {exp.number}</p>
      <h3 className="text-lg font-bold">{exp.title}</h3>
      <p className="text-sm text-slate-400 flex-1">{exp.description}</p>
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="px-2 py-1 rounded-full bg-white/5">{exp.module}</span>
        <span className="px-2 py-1 rounded-full bg-white/5">{exp.difficulty}</span>
        {exp.tools.map((t) => (
          <span key={t} className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <Link to={`/experiments/${exp.id}/overview`} className="inline-flex items-center gap-1 text-amber-300 font-semibold text-sm hover:gap-2 transition-all">
          Overview <ArrowRight className="w-4 h-4" />
        </Link>
        {showEdit && (
          <button onClick={() => onEdit(exp)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10">
            Edit Experiment
          </button>
        )}
      </div>
    </motion.div>
  )
}
