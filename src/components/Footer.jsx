import { Link } from 'react-router-dom'
import { Github, Linkedin } from 'lucide-react'
import student from '../data/student'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#1c0f12]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="font-extrabold tracking-wide">DIGITAL LIBRARY</p>
          <p className="text-slate-400 mt-1">Data Science Learning Portal</p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/modules">Modules</Link>
          <Link to="/experiments">Experiments</Link>
          <Link to="/tools">Tools</Link>
        </nav>
        <div className="flex gap-3 items-start">
          <a href={student.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 glass"><Github className="w-5 h-5" /></a>
          <a href={student.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 glass"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 pb-6">© 2026 Digital Library</p>
    </footer>
  )
}
