import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import unitPages from '../data/unitPages'

const PAGE_SETS = unitPages

export default function FlipBook({ flip = 'Introduction_to_Data_Science' }) {
  const pages = PAGE_SETS[flip] || PAGE_SETS['Introduction_to_Data_Science']
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const total = pages.length

  const go = (d) => {
    const next = page + d
    if (next < 0 || next >= total) return
    setDir(d)
    setPage(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-sm">
        <button onClick={() => go(-1)} disabled={page === 0} className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3">Page {page + 1} / {total}</span>
        <button onClick={() => go(1)} disabled={page === total - 1} className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative mx-auto" style={{ perspective: 1600, maxWidth: 720 }}>
        <motion.div
          key={page}
          initial={{ rotateY: dir > 0 ? -70 : 70, opacity: 0.4, transformOrigin: dir > 0 ? 'left center' : 'right center' }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-[#fdf6e3] text-slate-800 rounded-xl shadow-2xl p-8 min-h-[520px] max-h-[70vh] overflow-y-auto font-serif"
        >
          <div
            className="prose prose-sm max-w-none [&_table]:text-xs [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-1 [&_th]:border [&_th]:border-slate-300 [&_th]:p-1 [&_pre]:whitespace-pre-wrap [&_pre]:bg-slate-100 [&_pre]:p-2 [&_pre]:rounded [&_code]:text-xs"
            dangerouslySetInnerHTML={{ __html: pages[page] }}
          />
          <p className="text-center text-xs text-slate-500 mt-6">— {page + 1} —</p>
        </motion.div>
      </div>
    </div>
  )
}
