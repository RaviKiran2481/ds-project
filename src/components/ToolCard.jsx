import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Code2 } from 'lucide-react'

export default function ToolCard({ tool, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="glass p-5 flex flex-col gap-2 hover:border-amber-500/40 transition"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-amber-400/20 grid place-items-center">
        <Code2 className="w-5 h-5 text-amber-300" />
      </div>
      <h3 className="font-bold">{tool.name}</h3>
      <p className="text-[11px] tracking-widest text-slate-500">{tool.category}</p>
      <p className="text-sm text-slate-400 flex-1">{tool.description}</p>
      <Link to={`/tools/${tool.id}`} className="inline-flex items-center gap-1 text-amber-300 font-semibold text-sm mt-2 hover:gap-2 transition-all">
        Documentation <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  )
}
