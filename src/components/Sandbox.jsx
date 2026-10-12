import { useState } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'

// Simulated/demo sandbox. Architecture-ready for a future Python backend.
export default function Sandbox({ initialCode, expectedOutput }) {
  const [code, setCode] = useState(initialCode || '')
  const [output, setOutput] = useState('')
  const [state, setState] = useState('idle') // idle | running | error | done
  const [copied, setCopied] = useState(false)

  const run = () => {
    if (!code.trim()) {
      setState('error')
      setOutput('Error: Code editor is empty. Write some Python code first.')
      return
    }
    setState('running')
    setOutput('Running...')
    setTimeout(() => {
      setState('done')
      setOutput(
        `Output:\n\n${expectedOutput || '(Simulated demo — connect a Python backend to run real code.)'}\n\n[Simulated demo output. No Python backend connected yet.]`
      )
    }, 800)
  }

  const reset = () => {
    setCode(initialCode || '')
    setOutput('')
    setState('idle')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="glass p-4 flex flex-col gap-3">
        <p className="text-xs tracking-[0.3em] text-slate-500 font-semibold">CODE</p>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Code editor"
          className="min-h-[240px] rounded-xl bg-[#150a0d]/80 border border-white/10 p-4 font-mono text-sm outline-none focus:ring-2 ring-amber-500/30"
        />
        <div className="flex gap-2">
          <button onClick={run} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30">
            <Play className="w-4 h-4" /> Run
          </button>
          <button onClick={reset} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy
          </button>
        </div>
      </div>
      <div className="glass p-4 flex flex-col gap-3">
        <p className="text-xs tracking-[0.3em] text-slate-500 font-semibold">OUTPUT</p>
        <pre
          className={`flex-1 min-h-[240px] rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap ${
            state === 'error' ? 'bg-rose-500/5 border-rose-500/30 text-rose-300' : 'bg-[#150a0d]/80 border-white/10 text-emerald-200'
          }`}
        >
          {output || 'Console output will appear here after you press Run.'}
        </pre>
      </div>
    </div>
  )
}
