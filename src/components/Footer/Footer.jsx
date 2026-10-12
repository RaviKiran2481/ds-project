import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import student, { university, isPlaceholderUrl } from '../../data/student.js';
import { NAV } from '../Header/Header.jsx';
import Logo from '../Header/Logo.jsx';

function SocialLink({ href, label, icon: Icon }) {
  const placeholder = isPlaceholderUrl(href);
  return (
    <a
      href={placeholder ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={placeholder}
      title={placeholder ? `${label} URL not configured yet (edit src/data/student.js)` : label}
      className={`flex items-center gap-2 text-sm ${placeholder ? 'cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-white'}`}
    >
      <Icon size={16} aria-hidden="true" /> {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/5">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass grid gap-10 p-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={46} />
              <div>
                <p className="font-display text-base font-extrabold uppercase tracking-[0.14em] text-white">{university.name}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{university.portal}</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-slate-400">
              An interactive learning environment for Data Science students to explore modules, experiments, tools, documentation and practical code.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-slate-500">
              <p className="flex items-center gap-2"><MapPin size={14} aria-hidden="true" /> Sree Sainath Nagar, Tirupati, Andhra Pradesh</p>
              <p className="flex items-center gap-2"><Mail size={14} aria-hidden="true" /> Department of Data Science</p>
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="label">Navigate</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-sm text-slate-400 hover:text-white">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="label">Connect</p>
            <div className="space-y-2">
              <SocialLink href={student.github} label="GitHub" icon={Github} />
              <SocialLink href={student.linkedin} label="LinkedIn" icon={Linkedin} />
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">© 2026 {university.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
