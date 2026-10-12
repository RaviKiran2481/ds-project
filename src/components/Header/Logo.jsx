// University logo. Set `logo` in src/data/student.js to a path in public/
// (e.g. '/images/mbu-logo.png'). The SVG mark is used when no logo is set or
// when the configured file fails to load, so the header never shows a broken image.
import { useState } from 'react';
import { university } from '../../data/student.js';

export default function Logo({ size = 42 }) {
  const [failed, setFailed] = useState(false);
  const frame = 'relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-950 shadow-lg';

  if (university.logo && !failed) {
    return (
      <div className={frame} style={{ width: size, height: size }}>
        <img src={university.logo} alt={`${university.name} logo`} onError={() => setFailed(true)} className="h-full w-full bg-white object-contain p-1" />
      </div>
    );
  }

  return (
    <div className={frame} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size * 0.62} height={size * 0.62} role="img" aria-label="MBU logo">
        <defs>
          <linearGradient id="mbu-logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a5b4fc" />
            <stop offset="1" stopColor="#5eead4" />
          </linearGradient>
        </defs>
        <path d="M10 50V16l22 17 22-17v34" stroke="url(#mbu-logo-g)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="33" r="3.5" fill="#5eead4" />
      </svg>
    </div>
  );
}