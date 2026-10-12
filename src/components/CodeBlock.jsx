import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const KEYWORDS = /\b(import|from|print|def|return|for|in|if|else|elif|while|with|as|class|True|False|None|and|or|not|lambda|try|except|finally|raise|is|pass|break|continue|global|yield|await|async)\b/g

function highlight(code) {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped
    .replace(/(#.*)$/gm, '<span class="text-slate-500">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="text-emerald-300">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-300">$1</span>')
    .replace(KEYWORDS, '<span class="text-fuchsia-300">$1</span>')
}

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* clipboard may be unavailable */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative rounded-xl bg-[#150a0d]/80 border border-white/10 overflow-hidden">
      <button onClick={copy} className="absolute top-3 right-3 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20">
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy Code'}
      </button>
      <pre className="p-5 text-sm overflow-x-auto text-slate-200">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  )
}
