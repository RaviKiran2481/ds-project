import { motion } from 'framer-motion'

export default function StatCard({ value, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-5"
    >
      <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">{value}</p>
      <p className="text-[11px] tracking-widest text-slate-500 mt-1">{label}</p>
    </motion.div>
  )
}
