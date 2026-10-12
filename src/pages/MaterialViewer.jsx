import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ZoomIn, ZoomOut, Download, ExternalLink, Maximize } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'
import FlipBook from '../components/FlipBook'
import materials from '../data/materials'

export default function MaterialViewer() {
  const { materialId } = useParams()
  const mat = materials.find((m) => m.id === materialId)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  if (!mat)
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-4xl font-extrabold">Unable to load material. Try again.</p>
        <Link to="/modules" className="text-amber-300">Back to Modules</Link>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Modules', to: '/modules' }, { label: mat.title }]} />
      <h1 className="text-2xl font-extrabold">{mat.title}</h1>

      <div className="glass p-4 flex flex-wrap items-center gap-2 text-sm">
        <Ctrl onClick={() => setPage(Math.max(1, page - 1))} label="Prev" />
        <span className="px-3">Page {page} / {mat.pages}</span>
        <Ctrl onClick={() => setPage(Math.min(mat.pages, page + 1))} label="Next" />
        <span className="w-px h-5 bg-white/10 mx-2" />
        <button onClick={() => setZoom(Math.max(50, zoom - 25))} aria-label="Zoom out" className="p-2 rounded-full hover:bg-white/10"><ZoomOut className="w-4 h-4" /></button>
        <span>{zoom}%</span>
        <button onClick={() => setZoom(Math.min(200, zoom + 25))} aria-label="Zoom in" className="p-2 rounded-full hover:bg-white/10"><ZoomIn className="w-4 h-4" /></button>
        <span className="w-px h-5 bg-white/10 mx-2" />
        <button className="p-2 rounded-full hover:bg-white/10" aria-label="Download" title="Connect a real PDF to enable"><Download className="w-4 h-4" /></button>
        <button className="p-2 rounded-full hover:bg-white/10" aria-label="Open in new tab" title="Connect a real PDF to enable"><ExternalLink className="w-4 h-4" /></button>
        <button onClick={() => document.documentElement.requestFullscreen?.()} className="p-2 rounded-full hover:bg-white/10" aria-label="Fullscreen"><Maximize className="w-4 h-4" /></button>
      </div>

      <div className="glass p-10 overflow-auto">
        {mat.view === 'book' ? (
          <FlipBook flip={mat.flip} />
        ) : mat.file ? (
          <iframe src={mat.file} title={mat.title} className="w-full h-[70vh] rounded-xl" />
        ) : (
          <div
            className="mx-auto bg-[#150a0d]/80 border border-white/10 rounded-xl p-12 text-center space-y-3 transition-transform origin-top"
            style={{ transform: `scale(${zoom / 100})`, maxWidth: 640 }}
          >
            <p className="text-xs tracking-[0.3em] text-slate-500">DIGITAL LIBRARY</p>
            <h2 className="text-xl font-bold">{mat.title.replace('.pdf', '')}</h2>
            <p className="text-slate-500 text-sm">Page {page} of {mat.pages}</p>
            <p className="text-slate-600 text-xs pt-4">
              PDF preview placeholder. Add a real file URL in materials.js to enable the embedded viewer.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Ctrl({ onClick, label }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10">
      {label}
    </button>
  )
}
