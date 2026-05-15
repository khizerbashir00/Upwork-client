import html2pdf from 'html2pdf.js'

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap'
const KATEX_CSS = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'

/** Same typography / layout rules as the right panel (for Word HTML + PDF clone). */
const DOC_EXPORT_CSS = `
  body { margin:0; background:#0e1014; color:#ece6d8; }
  .word-export-root { box-sizing:border-box; max-width:720px; margin:0 auto; }
  .doc-page { position:relative; padding:2rem 2.25rem 2.5rem 2.5rem; }
  .doc-page::before { content:''; position:absolute; left:1rem; top:1.25rem; bottom:1.25rem; width:1px;
    background:linear-gradient(180deg, transparent, rgba(78,229,168,0.18), transparent); }
  .doc-content { font-family:'JetBrains Mono','Newsreader',monospace; color:#ece6d8; font-size:14px; line-height:1.95; letter-spacing:0.005em; white-space:pre-wrap; word-wrap:break-word; }
  .doc-content.doc-academic-root { white-space:normal; font-family:'Newsreader','JetBrains Mono',serif; }
  .doc-academic-root .acad-title { font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-weight:700; font-size:1.45rem; line-height:1.25; letter-spacing:-0.02em; color:#fff; margin:0 0 1.1rem; }
  .doc-academic-root .acad-h1 { font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-weight:600; font-size:1.2rem; line-height:1.3; color:rgba(255,255,255,0.92); margin:1.5rem 0 0.6rem; letter-spacing:-0.01em; }
  .doc-academic-root .acad-h2 { font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.16em; color:rgba(255,255,255,0.45); margin:1.5rem 0 0.5rem; }
  .doc-academic-root .acad-p { font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:15px; line-height:1.7; color:#ece6d8; margin:0.5rem 0 1.1rem; text-align:left; }
  .doc-academic-root .acad-p code, .doc-academic-root .acad-li code { font-family:'JetBrains Mono',monospace; font-size:0.88em; padding:0.1em 0.35em; border-radius:4px; background:rgba(78,229,168,0.08); border:1px solid rgba(78,229,168,0.15); color:#c5fbe2; }
  .doc-academic-root .acad-ul, .doc-academic-root .acad-ol { font-family:'Plus Jakarta Sans',system-ui,sans-serif; font-size:15px; line-height:1.65; color:#ece6d8; margin:0.5rem 0 1.15rem; padding-left:1.35rem; }
  .doc-academic-root .acad-li { margin:0.35rem 0; }
  .doc-academic-root .acad-eq { display:block; text-align:center; margin:1.15rem 0 1.35rem; padding:0.85rem 0.75rem; border-radius:0.5rem; background:rgba(0,0,0,0.28); border:1px solid rgba(255,255,255,0.07); }
  .doc-academic-root .acad-eq .katex-display { margin:0; }
  .doc-academic-root .katex, .doc-academic-root .katex * { color:#f0f2f7 !important; }
  .doc-academic-root .katex .mord.mtight { color:inherit !important; }
  .doc-academic-root .acad-p .katex, .doc-academic-root .acad-li .katex { font-size:1.05em; }
  .doc-academic-root .acad-eq-inline { display:inline-block; vertical-align:middle; margin:0 0.15em; }
  .doc-academic-root .acad-blockquote { border-left:3px solid rgba(78,229,168,0.35); padding:0.35rem 0 0.35rem 1rem; margin:0.75rem 0 1rem; color:rgba(255,255,255,0.72); font-style:italic; font-family:'Newsreader',serif; }
  .doc-academic-root .acad-pre { font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.6; white-space:pre-wrap; word-break:break-word; margin:0.75rem 0 1rem; padding:0.85rem 1rem; border-radius:0.65rem; background:rgba(7,8,10,0.55); border:1px solid rgba(255,255,255,0.08); color:rgba(231,233,238,0.88); }
  .doc-academic-root .acad-table-wrap { overflow-x:auto; margin:0.75rem 0 1.1rem; }
  .doc-academic-root .acad-table { width:100%; border-collapse:collapse; font-family:'Newsreader',serif; font-size:14px; color:#ece6d8; }
  .doc-academic-root .acad-table th, .doc-academic-root .acad-table td { border:1px solid rgba(255,255,255,0.1); padding:0.45rem 0.6rem; text-align:left; }
  .doc-academic-root .acad-table th { background:rgba(78,229,168,0.06); font-weight:600; }
  .doc-academic-root .acad-refs { font-family:'Newsreader',serif; font-size:14px; line-height:1.65; color:rgba(255,255,255,0.78); margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08); }
  .doc-academic-root .acad-ref-item { margin:0.4rem 0; padding-left:0.5rem; text-indent:-0.5rem; }
  .doc-academic-root .acad-hr { height:1px; border:0; margin:1.25rem 0; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }
  .sym { display:inline-block; padding:0 3px; margin:0 1px; border-radius:4px; color:#c5fbe2; background:linear-gradient(180deg,rgba(78,229,168,0.1),rgba(78,229,168,0.04)); border-bottom:1px dashed rgba(78,229,168,0.35); font-family:'Newsreader','Cambria Math',serif; font-size:1.05em; }
  .sym.cat-currency { color:#ffd9a8; background:linear-gradient(180deg,rgba(255,193,108,0.12),rgba(255,193,108,0.04)); border-bottom-color:rgba(255,193,108,0.35); }
  .sym.cat-logic { color:#c2b8ff; background:linear-gradient(180deg,rgba(168,144,255,0.12),rgba(168,144,255,0.04)); border-bottom-color:rgba(168,144,255,0.35); }
  .sym.cat-chemistry { color:#b8e1ff; background:linear-gradient(180deg,rgba(120,180,255,0.12),rgba(120,180,255,0.04)); border-bottom-color:rgba(120,180,255,0.35); }
`

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Word-compatible HTML document (opens in Microsoft Word with styling).
 * Uses .doc + MS Word MIME (same pattern as legacy “Save as Word” exports).
 */
export function exportOutputAsWord(sourceEl) {
  const inner = sourceEl.innerHTML
  if (!inner?.trim()) {
    throw new Error('Nothing to export')
  }
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>Glyph export</title>
  <link rel="stylesheet" href="${FONT_LINK}" />
  <link rel="stylesheet" href="${KATEX_CSS}" />
  <style type="text/css">${DOC_EXPORT_CSS}</style>
</head>
<body>
  <div class="doc-page doc-content doc-academic-root word-export-root">${inner}</div>
</body>
</html>`
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword',
  })
  triggerBlobDownload(blob, 'glyph-output.doc')
}

/** Rasterises the live output panel (including KaTeX SVG) to a multi-page PDF. */
export async function exportOutputAsPdf(sourceEl) {
  if (!sourceEl?.innerHTML?.trim()) {
    throw new Error('Nothing to export')
  }

  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {
    // ignore — export still runs with fallbacks
  }

  // Must use the real in-DOM node. html2pdf clones into a page-width container;
  // an off-screen clone (e.g. left: -12000px) stays outside the capture and yields a blank PDF.
  const opt = {
    margin: [12, 12, 12, 12],
    filename: 'glyph-output.pdf',
    image: { type: 'jpeg', quality: 0.92 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0e1014',
      scrollX: 0,
      scrollY: 0,
      onclone(_doc, clonedContainer) {
        // html2pdf's inner wrapper defaults to white; our panel is transparent over .doc-surface,
        // so without this, light text can disappear on the PDF.
        if (!clonedContainer?.style) return
        clonedContainer.style.backgroundColor = '#0e1014'
        const inner = clonedContainer.firstElementChild
        if (inner?.style) {
          inner.style.backgroundColor = '#0e1014'
          inner.style.color = '#ece6d8'
        }
      },
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
  }

  await html2pdf().set(opt).from(sourceEl).save()
}
