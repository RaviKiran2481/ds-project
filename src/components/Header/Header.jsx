import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Menu, Moon, Search, Sun, X, FlaskConical, Layers, Wrench, Home, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import student, { university } from '../../data/student.js';
import Logo from './Logo.jsx';

export const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/modules', label: 'Modules', icon: Layers },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
  { to: '/tools', label: 'Tools', icon: Wrench },
];

const NOTIFICATIONS = [
  { id: 1, title: 'New experiment added', body: 'Neural Networks with TensorFlow and Keras is now available.', to: '/experiments/15/overview' },
  { id: 2, title: 'Study material updated', body: 'Machine Learning Notes.pdf has been revised.', to: '/materials/ml-notes' },
  { id: 3, title: 'Module 03 unlocked', body: 'Exploratory Data Analysis is ready to explore.', to: '/modules/m3' },
];

export default function Header({ onOpenSearch }) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const notifRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const close = (e) => !notifRef.current?.contains(e.target) && setNotifOpen(false);
    const esc = (e) => e.key === 'Escape' && setNotifOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [notifOpen]);

  const initials = student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className={`glass-strong flex items-center gap-3 px-3 py-2.5 sm:px-4 ${scrolled ? 'shadow-2xl' : ''}`}>
          {/* Brand */}
          <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-xl pr-2" aria-label={`${university.name} — ${university.portal} home`}>
            <Logo />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[13px] font-extrabold uppercase tracking-[0.14em] text-white sm:text-sm">{university.name}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-300 sm:text-[11px]">{university.portal}</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="relative rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl border border-brand-400/30 bg-brand-500/15" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                    <span className={`relative ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <button onClick={onOpenSearch} className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white md:flex" aria-label="Open search (Ctrl+K)">
              <Search size={16} aria-hidden="true" />
              <span className="hidden xl:inline">Search…</span>
              <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] xl:inline">Ctrl K</kbd>
            </button>
            <button onClick={onOpenSearch} className="btn-icon md:hidden" aria-label="Open search">
              <Search size={18} />
            </button>

            <button onClick={toggleTheme} className="btn-icon" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <div className="relative hidden sm:block" ref={notifRef}>
              <button onClick={() => setNotifOpen((o) => !o)} className="btn-icon relative" aria-label="Notifications" aria-expanded={notifOpen} aria-haspopup="true">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal-400 ring-2 ring-ink-900" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.16 }} className="glass-strong absolute right-0 mt-2 w-80 overflow-hidden p-2" role="menu">
                    <p className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <Sparkles size={14} aria-hidden="true" /> Notifications
                    </p>
                    {NOTIFICATIONS.map((n) => (
                      <Link key={n.id} to={n.to} role="menuitem" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/5">
                        <p className="text-sm font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-slate-400">{n.body}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/" className="ml-1 hidden h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-sm font-bold sm:grid" aria-label={`Profile: ${student.name}`} title={student.name}>
              {student.avatar ? (
                <img src={student.avatar} alt="" className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <span className="keep-white text-white">{initials}</span>
              )}
            </Link>

            <button onClick={() => setMobileOpen((o) => !o)} className="btn-icon lg:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-nav">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav id="mobile-nav" aria-label="Mobile" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="glass-strong mt-2 overflow-hidden lg:hidden">
              <ul className="grid gap-1 p-2">
                {NAV.map((item, i) => (
                  <motion.li key={item.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <NavLink to={item.to} end={item.end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider ${isActive ? 'bg-brand-500/15 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                      <item.icon size={18} aria-hidden="true" /> {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
