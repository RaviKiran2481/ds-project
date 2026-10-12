import { motion } from 'framer-motion';
import { Github, Linkedin, GraduationCap, BadgeCheck, ExternalLink } from 'lucide-react';
import student, { isPlaceholderUrl } from '../../data/student.js';

function Field({ label, value }) {
  const placeholder = /^(YOUR_|FACULTY )/.test(value);
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
      <dd className={`mt-0.5 truncate text-sm font-semibold ${placeholder ? 'font-mono text-slate-500' : 'text-white'}`} title={value}>
        {value}
      </dd>
    </div>
  );
}

function Social({ href, label, icon: Icon }) {
  const placeholder = isPlaceholderUrl(href);
  return (
    <motion.a
      whileHover={placeholder ? undefined : { y: -2 }}
      whileTap={placeholder ? undefined : { scale: 0.97 }}
      href={placeholder ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={placeholder ? `${label} profile not configured` : `Open ${label} profile in a new tab`}
      aria-disabled={placeholder}
      title={placeholder ? 'Add your URL in src/data/student.js' : href}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
        placeholder ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-500' : 'border-white/10 bg-white/5 text-slate-200 hover:border-brand-400/40 hover:bg-brand-500/10 hover:text-white'
      }`}
    >
      <Icon size={16} aria-hidden="true" /> {label}
      {!placeholder && <ExternalLink size={12} className="opacity-60" aria-hidden="true" />}
    </motion.a>
  );
}

export default function StudentCard() {
  const initials = student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="student-profile-title"
      className="glass relative overflow-hidden p-5"
    >
      <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" aria-hidden="true" />
      <p id="student-profile-title" className="eyebrow relative text-center">Student Profile</p>

      <div className="relative mt-4 flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand-400 via-violet-400 to-teal-400 opacity-80 blur-[2px]" aria-hidden="true" />
          {student.avatar ? (
            <img src={student.avatar} alt={`${student.name}'s profile photo`} className="relative h-20 w-20 rounded-full object-cover ring-4 ring-ink-900" />
          ) : (
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-ink-900 font-display text-2xl font-extrabold text-white ring-4 ring-ink-900" aria-hidden="true">{initials}</div>
          )}
          <BadgeCheck size={22} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-ink-900 text-teal-300" aria-label="Verified student" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-white">{student.name}</h2>
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <GraduationCap size={14} aria-hidden="true" /> {student.branch} · {student.section}
        </p>
      </div>

      <dl className="relative mt-5 grid gap-2">
        <Field label="Student ID" value={student.studentId} />
        <Field label="Student Name" value={student.name} />
        <Field label="Roll Number" value={student.rollNumber} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Branch" value={student.branch} />
          <Field label="Section" value={student.section} />
        </div>
      </dl>

      <div className="relative mt-5 rounded-xl border border-teal-400/15 bg-teal-500/[0.06] p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-300">Faculty / Faculty Name</p>
        <p className={`mt-1 text-sm font-semibold ${student.faculty.name === 'FACULTY NAME' ? 'font-mono text-slate-500' : 'text-white'}`}>{student.faculty.name}</p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Designation</p>
        <p className={`mt-0.5 text-sm ${student.faculty.designation === 'FACULTY DESIGNATION' ? 'font-mono text-slate-500' : 'text-slate-300'}`}>{student.faculty.designation}</p>
      </div>

      <div className="relative mt-4 flex gap-2">
        <Social href={student.github} label="GitHub" icon={Github} />
        <Social href={student.linkedin} label="LinkedIn" icon={Linkedin} />
      </div>
    </motion.aside>
  );
}
