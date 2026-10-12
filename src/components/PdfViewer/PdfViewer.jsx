import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, ExternalLink, Maximize2, Minimize2, FileText, RotateCcw } from 'lucide-react';
import { generatePdf } from '../../utils/pdf.js';
import { university } from '../../data/student.js';

const ZOOMS = [0.6, 0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];

/**
 * PDF viewer. If `material.file` is set, the real PDF is embedded (native renderer with #page / #zoom).
 * Otherwise the structured page content is rendered as document pages and a real PDF is generated
 * client-side for Download / Open in new tab.
 */
export default function PdfViewer({ material, moduleTitle }) {
  const [page, setPage] = useState(1);
  const [zoomIdx, setZoomIdx] = useState(3);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);
  const zoom = ZOOMS[zoomIdx];
  const total = material.pages.length;

  const blobUrl = useMemo(() => {
    if (material.file) return material.file;
    const blob = generatePdf({ title: material.title, subtitle: `${university.name} - ${moduleTitle}`, pages: material.pages });
    return URL.createObjectURL(blob);
  }, [material, moduleTitle]);

  useEffect(() => () => !material.file && URL.revokeObjectURL(blobUrl), [blobUrl, material.file]);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') setPage((p) => Math.min(p + 1, total));
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setPage((p) => Math.max(p - 1, 1));
      if (e.key === '+' || e.key === '=') setZoomIdx((z) => Math.min(z + 1, ZOOMS.length - 1));
      if (e.key === '-') setZoomIdx((z) => Math.max(z - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* fullscreen not permitted */
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = material.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const current = material.pages[page - 1];

  return (
    <div ref={containerRef} className={`glass-strong flex flex-col overflow-hidden ${fullscreen ? 'h-screen rounded-none bg-ink-950' : ''}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-rose-400/20 bg-rose-500/10 text-rose-300">
            <FileText size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{material.fileName}</p>
            <p className="text-[11px] text-slate-500">{total} pages · {material.file ? 'PDF file' : 'Generated document'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={16} /></button>
            <label className="flex items-center gap-1 px-1 text-xs text-slate-400">
              <span className="sr-only">Page number</span>
              <input type="number" min={1} max={total} value={page} onChange={(e) => setPage(Math.min(Math.max(Number(e.target.value) || 1, 1), total))} className="w-10 rounded-md border border-white/10 bg-transparent py-1 text-center text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-400" />
              / {total}
            </label>
            <button onClick={() => setPage((p) => Math.min(p + 1, total))} disabled={page === total} className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-40" aria-label="Next page"><ChevronRight size={16} /></button>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <button onClick={() => setZoomIdx((z) => Math.max(z - 1, 0))} disabled={zoomIdx === 0} className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-40" aria-label="Zoom out"><ZoomOut size={16} /></button>
            <button onClick={() => setZoomIdx(3)} className="min-w-[3.25rem] rounded-lg px-1 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10" aria-label="Reset zoom">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoomIdx((z) => Math.min(z + 1, ZOOMS.length - 1))} disabled={zoomIdx === ZOOMS.length - 1} className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-40" aria-label="Zoom in"><ZoomIn size={16} /></button>
          </div>

          <button onClick={download} className="btn-icon h-9 w-9" aria-label="Download PDF" title="Download"><Download size={16} /></button>
          <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="btn-icon h-9 w-9" aria-label="Open PDF in new tab" title="Open in new tab"><ExternalLink size={16} /></a>
          <button onClick={toggleFullscreen} className="btn-icon h-9 w-9" aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} title="Full screen">{fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Thumbnails */}
        <nav aria-label="Pages" className="hidden w-44 shrink-0 space-y-2 overflow-y-auto border-r border-white/5 p-3 md:block" style={{ maxHeight: fullscreen ? 'none' : '78vh' }}>
          {material.pages.map((p, i) => (
            <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? 'page' : undefined} className={`w-full rounded-lg border p-2 text-left transition ${page === i + 1 ? 'border-brand-400/50 bg-brand-500/10' : 'border-white/5 hover:bg-white/5'}`}>
              <div className="mb-1.5 aspect-[1/1.3] rounded bg-white/90 p-1.5">
                <div className="h-1 w-3/4 rounded bg-slate-400" />
                {Array.from({ length: 6 }).map((_, k) => <div key={k} className="mt-1 h-0.5 rounded bg-slate-300" style={{ width: `${60 + ((k * 13) % 35)}%` }} />)}
              </div>
              <p className="truncate text-[11px] text-slate-400">{i + 1}. {p.heading}</p>
            </button>
          ))}
        </nav>

        {/* Page area */}
        <div className="flex-1 overflow-auto bg-black/20 p-4 sm:p-8" style={{ maxHeight: fullscreen ? 'none' : '78vh' }}>
          {material.file ? (
            <iframe key={`${page}-${zoom}`} title={material.title} src={`${material.file}#page=${page}&zoom=${Math.round(zoom * 100)}`} className="h-[75vh] w-full rounded-lg bg-white" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.article
                key={page}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="mx-auto origin-top rounded-md bg-white text-slate-800 shadow-2xl"
                style={{ width: `${Math.round(640 * zoom)}px`, maxWidth: zoom <= 1 ? '100%' : 'none', minHeight: `${Math.round(820 * zoom)}px`, padding: `${48 * zoom}px ${52 * zoom}px`, fontSize: `${15 * zoom}px` }}
                aria-label={`Page ${page} of ${total}`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-[0.7em] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span>{university.name}</span>
                  <span>{moduleTitle}</span>
                </div>
                {page === 1 && (
                  <div className="mt-[1.6em]">
                    <p className="text-[0.75em] font-bold uppercase tracking-[0.2em] text-indigo-600">Study Material</p>
                    <h2 className="mt-1 text-[2em] font-extrabold leading-tight text-slate-900">{material.title}</h2>
                    <p className="mt-1 text-[0.8em] text-slate-500">{material.author} · Updated {material.updated}</p>
                  </div>
                )}
                <h3 className="mt-[1.6em] text-[1.35em] font-bold text-slate-900">{current.heading}</h3>
                <ul className="mt-[0.8em] space-y-[0.6em] leading-relaxed">
                  {current.body.map((line, i) => (
                    <li key={i} className="flex gap-[0.6em]"><span className="mt-[0.55em] h-[0.35em] w-[0.35em] shrink-0 rounded-full bg-indigo-500" />{line}</li>
                  ))}
                </ul>
                <p className="mt-[3em] text-center text-[0.7em] text-slate-400">Page {page} of {total}</p>
              </motion.article>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export function PdfError({ onRetry }) {
  return (
    <div className="glass flex flex-col items-center gap-3 p-10 text-center">
      <p className="font-semibold text-white">Unable to load material.</p>
      <p className="text-sm text-slate-400">Try again.</p>
      <button onClick={onRetry} className="btn-ghost"><RotateCcw size={14} /> Retry</button>
    </div>
  );
}
