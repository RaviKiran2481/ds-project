import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, FlaskConical } from 'lucide-react';
import { ProgressBar } from '../common/ui.jsx';
import { fadeUp } from '../common/PageTransition.jsx';

export default function ModuleCard({ module: m, experimentCount, materialCount }) {
  return (
    <motion.article variants={fadeUp} whileHover={{ y: -4 }} className="glass glass-hover group relative flex flex-col overflow-hidden p-6">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.color} opacity-50`} aria-hidden="true" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow">Module {m.number}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{m.title}</h3>
        </div>
        <span className="font-display text-5xl font-extrabold leading-none text-white/[0.07]" aria-hidden="true">{m.number}</span>
      </div>
      <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{m.description}</p>

      <div className="relative mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
        {m.topics.slice(0, 5).map((t) => <span key={t} className="chip">{t}</span>)}
        {m.topics.length > 5 && <span className="chip">+{m.topics.length - 5} more</span>}
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-slate-300">
          <FileText size={15} className="text-amber-300" aria-hidden="true" /> {materialCount} Materials
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-slate-300">
          <FlaskConical size={15} className="text-brand-300" aria-hidden="true" /> {experimentCount} Experiments
        </div>
      </div>

      <div className="relative mt-5">
        <ProgressBar value={m.progress} label="Progress" />
      </div>

      <Link to={`/modules/${m.id}`} className="btn-primary relative mt-6 w-full">
        Open Module <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
