# MBU — Data Science Learning Portal

React + Vite + Tailwind + Framer Motion + Three.js (React Three Fiber / Drei).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Personalise

- **Student / faculty / social links:** `src/data/student.js`
- **Experiments (15 × 6 sub-experiments):** `src/data/experiments.js`
- **Modules / materials / tools:** `src/data/modules.js`, `materials.js`, `tools.js`
- **Real PDFs:** put files in `public/pdfs/` and set `file: '/pdfs/name.pdf'` on a material.
- **Python backend for the sandbox:** create `.env` with `VITE_PYTHON_API_URL=https://your-api/run`.
  The API receives `{ code }` and should return `{ stdout, stderr, chart?, image? }`.
  Without it, the sandbox runs in clearly-labelled *simulated* mode.

Experiment edits are saved in the browser's LocalStorage. You can undo them with **Reset edits** on the Experiments page.
