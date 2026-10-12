import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Pencil, Clock } from 'lucide-react';
import { DifficultyBadge } from '../common/ui.jsx';
import { fadeUp } from '../common/PageTransition.jsx';

function ExperimentCard({ experiment, onEdit }) {
  const e = experiment;
  return (
    <motion.article variants={fadeUp} layout whileHover={{ y: -4 }} className="glass glass-hover group relative flex flex-col overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="eyebrow">Experiment {e.number}</p>
        <div className="flex items-center gap-2">
          {e.edited && <span className="chip border-teal-400/30 text-teal-300">Edited</span>}
          <DifficultyBadge level={e.difficulty} />
        </div>
      </div>

      <h3 className="relative mt-3 text-lg font-bold leading-snug text-white">
        <Link to={`/experiments/${e.id}/overview`} className="after:absolute after:inset-0 focus:outline-none">
          {e.title}
        </Link>
      </h3>
      <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">{e.description}</p>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5"><Layers size={13} aria-hidden="true" /> {e.module}</span>
        {e.duration && <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden="true" /> {e.duration}</span>}
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1.5" aria-label="Tools used">
        {e.tools.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
        {e.tools.length > 4 && <span className="chip">+{e.tools.length - 4}</span>}
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-2 pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition group-hover:gap-2.5">
          Overview <ArrowRight size={16} aria-hidden="true" />
        </span>
        {onEdit && (
          <button onClick={() => onEdit(e)} className="btn-ghost relative z-10 px-3 py-1.5 text-xs" aria-label={`Edit experiment ${e.number}: ${e.title}`}>
            <Pencil size={13} aria-hidden="true" /> Edit Experiment
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default memo(ExperimentCard);
