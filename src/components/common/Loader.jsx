export default function Loader({ label = 'Loading...' }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-slate-400">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-400 border-r-teal-400" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
