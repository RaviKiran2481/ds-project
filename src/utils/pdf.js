// Minimal client-side PDF generator (no dependencies) used to produce downloadable
// study materials from structured page content when no real PDF file is attached.

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, (c) => ({ '–': '-', '—': '-', '→': '->', '×': 'x', '’': "'", '‘': "'", '“': '"', '”': '"', '≤': '<=', 'μ': 'u', 'σ': 's', 'ρ': 'rho', '²': '2', '…': '...' }[c] ?? '?'));

function wrap(text, max = 88) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line += ' ' + w;
  });
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export function generatePdf({ title, subtitle, pages }) {
  const streams = pages.map((page, i) => {
    const ops = ['BT', '/F2 10 Tf', '56 806 Td', `(${esc(subtitle)}) Tj`, 'ET'];
    ops.push('BT', '/F2 20 Tf', '56 760 Td', `(${esc(i === 0 ? title : page.heading)}) Tj`, 'ET');
    let y = 724;
    if (i === 0) {
      ops.push('BT', '/F2 14 Tf', `56 ${y} Td`, `(${esc(page.heading)}) Tj`, 'ET');
      y -= 30;
    }
    page.body.forEach((para) => {
      wrap(`- ${para}`).forEach((ln) => {
        ops.push('BT', '/F1 11 Tf', `64 ${y} Td`, `(${esc(ln)}) Tj`, 'ET');
        y -= 17;
      });
      y -= 6;
    });
    ops.push('BT', '/F1 9 Tf', '56 40 Td', `(Mohan Babu University - Data Science Learning Portal    Page ${i + 1} of ${pages.length}) Tj`, 'ET');
    return ops.join('\n');
  });

  const objects = [];
  const add = (s) => objects.push(s) && objects.length;
  const catalog = add('');
  const pagesObj = add('');
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageIds = streams.map((s) => {
    const content = add(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);
    return add(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${content} 0 R >>`);
  });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => (pdf += `${String(o).padStart(10, '0')} 00000 n \n`));
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
