import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ModuleCard({ mod, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass p-6 flex flex-col gap-3"
    >
      <p className="text-[11px] tracking-[0.3em] text-fuchsia-400 font-semibold">MODULE {mod.number}</p>
      <h3 className="text-lg font-bold">{mod.title}</h3>
      <p className="text-sm text-slate-400">{mod.description}</p>
      <div className="flex flex-wrap gap-2 text-[11px]">
        {mod.topics.map((t) => (
          <span key={t} className="px-2 py-1 rounded-full bg-white/5">{t}</span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <Stat n={mod.materials} l="Materials" />
        <Stat n={mod.experiments} l="Experiments" />
        <Stat n={`${mod.progress}%`} l="Progress" />
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-400" style={{ width: `${mod.progress}%` }} />
      </div>
      <Link to={`/modules/${mod.id}`} className="inline-flex items-center gap-1 text-amber-300 font-semibold text-sm mt-1 hover:gap-2 transition-all">
        Open Module <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}

function Stat({ n, l }) {
  return (
    <div className="glass py-2">
      <p className="font-bold">{n}</p>
      <p className="text-slate-500 text-[10px] tracking-widest">{l}</p>
    </div>
  )
}
