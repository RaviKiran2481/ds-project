export default function ArchitectureDiagram({ steps = [] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-col items-center gap-2 w-full">
          <div className="glass px-6 py-3 text-xs tracking-[0.25em] font-semibold text-center w-full max-w-sm bg-gradient-to-r from-indigo-500/10 to-amber-400/10 border-amber-500/20">
            {s.toUpperCase()}
          </div>
          {i < steps.length - 1 && <div className="w-px h-6 bg-gradient-to-b from-amber-400/60 to-transparent" aria-hidden />}
        </div>
      ))}
    </div>
  )
}
