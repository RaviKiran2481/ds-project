import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { fadeUp } from '../common/PageTransition.jsx';

function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function StatCard({ value, suffix, label, icon: Icon, accent = 'from-brand-500/25 to-transparent', iconColor = 'text-brand-300' }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -3 }} className="glass glass-hover relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-60`} aria-hidden="true" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            <Counter value={value} suffix={suffix} />
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 ${iconColor}`}>
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  );
}
