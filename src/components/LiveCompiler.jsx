import { useState } from 'react'
import { Play, RotateCcw, Copy, Check, Terminal } from 'lucide-react'

const LANGUAGES = [
  { label: 'Python', compiler: 'cpython-3.12.7', starter: 'print("Hello, Data Science!")\n\nfor i in range(3):\n    print(i * i)\n' },
  { label: 'JavaScript', compiler: 'nodejs-20.17.0', starter: 'console.log("Hello, Data Science!");\n\nfor (let i = 0; i < 3; i++) console.log(i * i);\n' },
  { label: 'C++', compiler: 'gcc-13.2.0', starter: '#include <iostream>\nint main() {\n    std::cout << "Hello, Data Science!\\n";\n    return 0;\n}\n' },
  { label: 'Java', compiler: 'openjdk-jdk-22+36', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Data Science!");\n    }\n}\n' },
  { label: 'Go', compiler: 'go-1.23.2', starter: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, Data Science!")\n}\n' },
]

export default function LiveCompiler() {
  const [lang, setLang] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].starter)
  const [output, setOutput] = useState('')
  const [state, setState] = useState('idle')
  const [copied, setCopied] = useState(false)

  const run = async () => {
    if (!code.trim()) {
      setState('error')
      setOutput('Error: Code editor is empty.')
      return
    }
    setState('running')
    setOutput('Compiling & running...')
    try {
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler: lang.compiler, code }),
      })
      const j = await res.json()
      const out =
        (j.program_output || '') +
        (j.program_error ? '\n' + j.program_error : '') +
        (j.compiler_error ? '\n' + j.compiler_error : '')
      setState(j.status === '0' ? 'done' : 'error')
      setOutput(out.trim() || '(no output)')
    } catch (e) {
      setState('error')
      setOutput('Error: Could not reach the compiler service. Check your internet connection.')
    }
  }

  const switchLang = (l) => {
    setLang(l)
    setCode(l.starter)
    setOutput('')
    setState('idle')
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(code) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2"><Terminal className="w-5 h-5 text-amber-400" /> Live Compiler</h2>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((l) => (
          <button key={l.label} onClick={() => switchLang(l)} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${lang.label === l.label ? 'bg-amber-500/20 text-amber-300' : 'glass hover:bg-white/10'}`}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass p-4 flex flex-col gap-3">
          <p className="text-xs tracking-[0.3em] text-slate-500 font-semibold">CODE</p>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            aria-label="Code editor"
            className="min-h-[260px] rounded-xl bg-[#0b1f16]/60 border border-white/10 p-4 font-mono text-sm outline-none focus:ring-2 ring-amber-500/30"
          />
          <div className="flex gap-2">
            <button onClick={run} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30">
              <Play className="w-4 h-4" /> Run
            </button>
            <button onClick={() => { setCode(lang.starter); setOutput(''); setState('idle') }} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-sm hover:bg-white/10">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy
            </button>
          </div>
        </div>
        <div className="glass p-4 flex flex-col gap-3">
          <p className="text-xs tracking-[0.3em] text-slate-500 font-semibold">OUTPUT</p>
          <pre className={`flex-1 min-h-[260px] rounded-xl border p-4 font-mono text-sm whitespace-pre-wrap ${state === 'error' ? 'bg-rose-500/5 border-rose-500/30 text-rose-300' : 'bg-[#0b1f16]/60 border-white/10 text-emerald-200'}`}>
            {output || 'Real compiler output will appear here after you press Run.'}
          </pre>
        </div>
      </div>
    </section>
  )
}
