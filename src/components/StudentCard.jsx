import { Github, Linkedin } from 'lucide-react'
import student from '../data/student'

export default function StudentCard() {
  return (
    <aside className="glass p-6 space-y-5">
      <p className="text-xs tracking-[0.3em] text-amber-400 font-semibold">STUDENT PROFILE</p>
      <img src="/profile.png" alt={student.name} className="w-24 h-24 rounded-full object-cover object-top border-2 border-amber-400/40" />
      <div className="space-y-3 text-sm">
        <Field label="Student ID" value={student.studentId} />
        <Field label="Student Name" value={student.name} />
        <Field label="Branch" value={student.branch} />
        <Field label="Section" value={student.section} />
      </div>
      <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
        <p className="text-xs tracking-[0.3em] text-fuchsia-400 font-semibold">FACULTY / FACULTY NAME</p>
        <Field label="Faculty Name" value={student.faculty.name} />
        <Field label="Designation" value={student.faculty.designation} />
      </div>
      <div className="flex gap-3 pt-1">
        <a href={student.github} target="_blank" rel="noreferrer" className="glass px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/10">
          <Github className="w-4 h-4" /> GitHub
        </a>
        <a href={student.linkedin} target="_blank" rel="noreferrer" className="glass px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/10">
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </aside>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
