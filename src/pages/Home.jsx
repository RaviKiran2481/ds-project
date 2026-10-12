import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import StudentCard from '../components/StudentCard'
import StatCard from '../components/StatCard'
import ExperimentCard from '../components/ExperimentCard'
import tools from '../data/tools'
import modules from '../data/modules'
import { getExperiments } from '../utils/storage'

export default function Home() {
  const experiments = getExperiments()
  const subCount = experiments.reduce((n, e) => n + e.subExperiments.length, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <section className="text-center space-y-5">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs tracking-[0.4em] text-amber-400 font-semibold">
          DIGITAL LIBRARY
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 via-amber-200 to-fuchsia-300 bg-clip-text text-transparent">
          DATA SCIENCE LEARNING PORTAL
        </motion.h1>
        <div className="flex justify-center gap-3">
          <Link to="/experiments" className="px-6 py-3 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-sm hover:bg-amber-500/30 transition">Explore Experiments</Link>
          <Link to="/modules" className="px-6 py-3 rounded-full glass font-semibold text-sm hover:bg-white/10 transition">Explore Modules</Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <StudentCard />
        <section className="space-y-6">
          <SearchBar large />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value={experiments.length} label="TOTAL EXPERIMENTS" delay={0} />
            <StatCard value={modules.length} label="DS MODULES" delay={0.05} />
            <StatCard value={`${subCount}`} label="SUB EXPERIMENTS" delay={0.1} />
            <StatCard value={`${tools.length}+`} label="TOOLS" delay={0.15} />
          </div>
          <h2 className="text-xl font-bold pt-2">Experiments</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {experiments.map((e, i) => (
              <ExperimentCard key={e.id} exp={e} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
