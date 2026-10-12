import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, SearchX } from 'lucide-react';

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
        <li>
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-md px-1 hover:text-white">
            <Home size={14} aria-hidden="true" /> Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-slate-600" aria-hidden="true" />
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="rounded-md px-1 hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="px-1 font-medium text-slate-200">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const DIFF = {
  Beginner: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-400/20',
  Advanced: 'text-rose-300 bg-rose-500/10 border-rose-400/20',
};

export function DifficultyBadge({ level }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${DIFF[level] || 'chip'}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {level}
  </span>;
}

export function ProgressBar({ value, color = 'from-brand-400 to-teal-400', label }) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex justify-between text-xs text-slate-400">
          <span>{label}</span>
          <span className="font-semibold text-slate-200">{value}%</span>
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label || 'Progress'}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, action, id }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 id={id} className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title = 'Nothing found', message = 'Try another search.', icon: Icon = SearchX, action }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function PageHeader({ eyebrow, title, description, children, icon: Icon }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass relative mb-8 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="eyebrow mb-3 inline-flex items-center gap-2">
              {Icon && <Icon size={14} aria-hidden="true" />} {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-slate-400 sm:text-lg">{description}</p>}
        </div>
        {children}
      </div>
    </motion.header>
  );
}
