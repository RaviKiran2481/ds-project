import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Filter, Sparkles, Search, BarChart3, Cpu, Gauge, Flag, Boxes } from 'lucide-react';

const ICON_RULES = [
  [/data(set)?$|raw|source|mnist|titanic|numbers/i, Database],
  [/collect|download|files|api|scrap|sql/i, Download],
  [/clean|missing|duplicate|outlier|quality|filter|type/i, Filter],
  [/pre|process|normal|encod|scal|split|feature|transform|creation/i, Sparkles],
  [/explor|eda|analysis|profil|statistic|question|hypoth|test|select|index/i, Search],
  [/visual|plot|chart|figure|dashboard|layout|theme/i, BarChart3],
  [/model|train|algebra|vector|broad|regulari|classif|architecture|compil|callback|tun/i, Cpu],
  [/evaluat|metric|validat|decision|p-value|cross|interpret/i, Gauge],
  [/output|final|report|insight|conclusion|prediction|deploy|best/i, Flag],
];

const iconFor = (label) => ICON_RULES.find(([re]) => re.test(label))?.[1] ?? Boxes;

const DESCRIPTIONS = {
  Dataset: 'The raw source data the experiment works with.',
};

export default function ArchitectureDiagram({ steps = [] }) {
  const [active, setActive] = useState(null);

  return (
    <div className="glass relative overflow-hidden p-5 sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:22px_22px]" aria-hidden="true" />
      <ol className="relative mx-auto flex max-w-md flex-col items-stretch" aria-label="Experiment architecture pipeline">
        {steps.map((step, i) => {
          const Icon = iconFor(step);
          const isActive = active === i;
          const isLast = i === steps.length - 1;
          return (
            <li key={step + i} className="flex flex-col items-center">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ scale: 1.03 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`Step ${i + 1}: ${step}`}
                className={`relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isActive ? 'border-brand-400/50 bg-brand-500/15 shadow-glow' : i === 0 || isLast ? 'border-teal-400/25 bg-teal-500/[0.08]' : 'border-white/10 bg-white/[0.04]'
                }`}
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${isActive ? 'border-brand-400/40 bg-brand-500/20 text-brand-300' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Step {String(i + 1).padStart(2, '0')}</span>
                  <span className="block text-sm font-bold uppercase tracking-wide text-white">{step}</span>
                </span>
                {DESCRIPTIONS[step] && isActive && <span className="sr-only">{DESCRIPTIONS[step]}</span>}
              </motion.button>
              {!isLast && (
                <div className="relative h-9 w-px overflow-hidden bg-gradient-to-b from-brand-400/50 to-teal-400/40" aria-hidden="true">
                  <motion.span
                    className="absolute left-1/2 h-3 w-[3px] -translate-x-1/2 rounded-full bg-teal-300 shadow-[0_0_8px_#5eead4]"
                    animate={{ y: [-12, 36] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.18 }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
