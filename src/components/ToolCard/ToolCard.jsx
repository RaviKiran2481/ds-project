import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { fadeUp } from '../common/PageTransition.jsx';

export function ToolIcon({ tool, size = 48 }) {
  const letters = tool.name.replace(/[^A-Za-z]/g, '').slice(0, 2);
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl border border-white/10 font-display font-extrabold"
      style={{ width: size, height: size, fontSize: size * 0.36, color: tool.color, background: `linear-gradient(135deg, ${tool.color}33, ${tool.color}0d)`, boxShadow: `inset 0 0 0 1px ${tool.color}22` }}
      role="img"
      aria-label={`${tool.name} icon`}
    >
      {letters.charAt(0).toUpperCase() + letters.charAt(1).toLowerCase()}
    </span>
  );
}

export default function ToolCard({ tool }) {
  return (
    <motion.article variants={fadeUp} layout whileHover={{ y: -4 }} className="glass glass-hover group flex flex-col p-5">
      <div className="flex items-center gap-3.5">
        <ToolIcon tool={tool} />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-white">{tool.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tool.category}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{tool.description}</p>
      <div className="mt-5 flex gap-2">
        <Link to={`/tools/${tool.id}`} className="btn-primary flex-1 px-3 py-2 text-xs">
          Documentation <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <a href={tool.website} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-2 text-xs" aria-label={`${tool.name} official website (opens in new tab)`}>
          Website <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}
