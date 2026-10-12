import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex flex-wrap gap-1">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {it.to ? <Link to={it.to} className="hover:text-amber-300">{it.label}</Link> : <span className="text-slate-300">{it.label}</span>}
          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  )
}
