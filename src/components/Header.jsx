import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Sun, Moon, Bell, GraduationCap, Github, Linkedin } from 'lucide-react'
import student from '../data/student'

const links = [
  { to: '/', label: 'HOME' },
  { to: '/modules', label: 'MODULES' },
  { to: '/experiments', label: 'EXPERIMENTS' },
  { to: '/tools', label: 'TOOLS' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(document.documentElement.classList.contains('light'))

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light')
    setLight(!light)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1c0f12]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-400 grid place-items-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-extrabold tracking-wide text-sm">DIGITAL LIBRARY</p>
            <p className="text-[10px] tracking-[0.25em] text-amber-400">DATA SCIENCE PORTAL</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition ${
                  isActive ? 'bg-white/10 text-amber-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a href={student.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-white/10">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href={student.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-full hover:bg-white/10">
            <Github className="w-5 h-5" />
          </a>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-white/10">
            {light ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button aria-label="Notifications" className="p-2 rounded-full hover:bg-white/10 hidden sm:block">
            <Bell className="w-5 h-5" />
          </button>
          <img src="/profile.png" alt="Profile" className="w-8 h-8 rounded-full object-cover object-top" aria-label="Profile" />
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Mobile menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-1" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold tracking-wider">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
