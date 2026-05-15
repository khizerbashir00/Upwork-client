/**
 * Production academic export — single file.
 *
 * Public API (drop-in replacement for the old file):
 *   exportOutputAsPdf(sourceEl)   →  glyph-output.pdf
 *   exportOutputAsWord(sourceEl)  →  glyph-output.docx   (real .docx, not legacy .doc)
 *
 * Both pipelines:
 *   - keep the in-app UI untouched,
 *   - paginate at the DOM block level so equations, tables and code
 *     blocks never split mid-content, headings never orphan and no
 *     single-word pages occur,
 *   - render a clean white academic page (print-grade typography),
 *     ignoring the app's dark preview theme.
 *
 * Requires (one-time install):
 *   npm install jspdf html2canvas docx
 *
 * The legacy html2pdf.js dependency is no longer needed.
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  Header,
  Footer,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  LevelFormat,
  convertInchesToTwip,
  convertMillimetersToTwip,
} from 'docx'

/* ═══════════════════════════════════════════════════════════════════
 *  PAGE GEOMETRY (A4)
 * ═══════════════════════════════════════════════════════════════════ */

const PAGE = {
  widthMm: 210,
  heightMm: 297,
  marginTopMm: 25,
  marginBottomMm: 28,
  marginLeftMm: 22,
  marginRightMm: 22,
}
PAGE.contentWidthMm = PAGE.widthMm - PAGE.marginLeftMm - PAGE.marginRightMm
PAGE.contentHeightMm = PAGE.heightMm - PAGE.marginTopMm - PAGE.marginBottomMm

const PX_PER_MM = 96 / 25.4
const CONTENT_WIDTH_PX = Math.round(PAGE.contentWidthMm * PX_PER_MM)
const CONTENT_HEIGHT_PX = Math.round(PAGE.contentHeightMm * PX_PER_MM)
const RENDER_SCALE = 2

/* ═══════════════════════════════════════════════════════════════════
 *  EXPORT TYPOGRAPHY (white page, print-ready)
 * ═══════════════════════════════════════════════════════════════════ */

const EXPORT_FONT_LINKS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@fontsource/lmroman10@5.0.0/latin-400.css',
  'https://cdn.jsdelivr.net/npm/@fontsource/lmroman10@5.0.0/latin-700.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
]

/**
 * Print-grade CSS, scoped to .glyph-export-doc so it cannot leak into the
 * app UI. `!important` is used everywhere so this beats any dark-theme
 * styles that get inherited into cloned nodes.
 */
const EXPORT_CSS = `
  .glyph-export-doc, .glyph-export-doc * {
    box-sizing: border-box;
  }

  .glyph-export-doc {
    background: #ffffff !important;
    color: #1a1a1a !important;
    font-family: 'LM Roman 10', 'Latin Modern Roman', 'Times New Roman', Times, serif !important;
    font-size: 12pt !important;
    line-height: 1.65 !important;
    letter-spacing: 0.005em !important;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
    margin: 0;
    padding: 0;
    white-space: normal !important;
  }

  /* Kill any in-app dark-theme chrome that may have been inherited. */
  .glyph-export-doc .doc-page,
  .glyph-export-doc.doc-page {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .glyph-export-doc .doc-page::before,
  .glyph-export-doc.doc-page::before {
    display: none !important;
    content: none !important;
  }
  .glyph-export-doc article { display: block; }

  /* ── Title ─────────────────────────────────────────────────── */
  .glyph-export-doc .acad-title {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
    font-weight: 700 !important;
    font-size: 22pt !important;
    line-height: 1.22 !important;
    text-align: center !important;
    color: #000 !important;
    margin: 0 0 22pt !important;
    padding: 0 0 12pt !important;
    border-bottom: 1.25pt solid #1a1a1a !important;
    letter-spacing: -0.015em !important;
  }

  /* ── Headings ──────────────────────────────────────────────── */
  .glyph-export-doc .acad-h1 {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
    font-weight: 700 !important;
    font-size: 14pt !important;
    line-height: 1.3 !important;
    color: #000 !important;
    margin: 20pt 0 9pt !important;
    padding: 0 !important;
    text-transform: none !important;
    letter-spacing: -0.005em !important;
  }
  .glyph-export-doc .acad-h2 {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif !important;
    font-weight: 600 !important;
    font-size: 12pt !important;
    line-height: 1.35 !important;
    color: #222 !important;
    margin: 16pt 0 7pt !important;
    padding: 0 !important;
    text-transform: none !important;
    letter-spacing: 0.01em !important;
  }

  /* ── Body paragraph ────────────────────────────────────────── */
  .glyph-export-doc .acad-p {
    font-family: 'LM Roman 10', 'Latin Modern Roman', 'Times New Roman', Times, serif !important;
    font-size: 12pt !important;
    line-height: 1.7 !important;
    color: #1a1a1a !important;
    margin: 0 0 11pt !important;
    text-align: justify !important;
    text-justify: inter-word;
    hyphens: auto;
    -webkit-hyphens: auto;
  }

  /* ── Equations ─────────────────────────────────────────────── */
  .glyph-export-doc .acad-eq {
    display: block !important;
    text-align: center !important;
    margin: 14pt 0 16pt !important;
    padding: 11pt 14pt !important;
    background: #fafafa !important;
    border: 0.6pt solid #d8d8d8 !important;
    border-radius: 0 !important;
  }
  .glyph-export-doc .acad-eq-unicode {
    font-family: 'Cambria Math', 'STIX Two Math', 'Latin Modern Math',
                 'Times New Roman', serif !important;
    font-size: 13pt !important;
    line-height: 1.75 !important;
    letter-spacing: 0.02em !important;
    color: #000 !important;
  }
  .glyph-export-doc .acad-eq .katex-display { margin: 0 !important; }
  .glyph-export-doc .katex,
  .glyph-export-doc .katex * { color: #000 !important; }
  .glyph-export-doc .acad-p .katex,
  .glyph-export-doc .acad-li .katex { font-size: 1.05em !important; }
  .glyph-export-doc .acad-eq-inline {
    display: inline-block !important;
    vertical-align: middle !important;
    margin: 0 2pt !important;
  }

  /* ── Lists ─────────────────────────────────────────────────── */
  .glyph-export-doc .acad-ul,
  .glyph-export-doc .acad-ol {
    font-family: 'LM Roman 10', 'Times New Roman', Times, serif !important;
    font-size: 12pt !important;
    line-height: 1.65 !important;
    color: #1a1a1a !important;
    margin: 6pt 0 13pt !important;
    padding-left: 24pt !important;
  }
  .glyph-export-doc .acad-li {
    margin: 4pt 0 !important;
    text-align: justify !important;
  }

  /* ── Tables ────────────────────────────────────────────────── */
  .glyph-export-doc .acad-table-wrap {
    margin: 12pt 0 15pt !important;
    overflow: visible !important;
  }
  .glyph-export-doc .acad-table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-family: 'LM Roman 10', 'Times New Roman', Times, serif !important;
    font-size: 11pt !important;
    color: #1a1a1a !important;
  }
  .glyph-export-doc .acad-table th,
  .glyph-export-doc .acad-table td {
    border: 0.6pt solid #333 !important;
    padding: 6pt 8pt !important;
    text-align: left !important;
    vertical-align: top !important;
    background: #ffffff !important;
  }
  .glyph-export-doc .acad-table th {
    background: #f0f0f0 !important;
    font-weight: 700 !important;
    font-family: 'Inter', 'Segoe UI', sans-serif !important;
    font-size: 10.5pt !important;
  }
  .glyph-export-doc .acad-table tr:nth-child(even) td { background: #fafafa !important; }

  /* ── References ────────────────────────────────────────────── */
  .glyph-export-doc .acad-refs {
    font-family: 'LM Roman 10', 'Times New Roman', Times, serif !important;
    font-size: 11pt !important;
    line-height: 1.55 !important;
    color: #1a1a1a !important;
    margin-top: 22pt !important;
    padding-top: 11pt !important;
    border-top: 0.8pt solid #999 !important;
  }
  .glyph-export-doc .acad-ref-item {
    margin: 0 0 7pt !important;
    padding-left: 22pt !important;
    text-indent: -22pt !important;
    text-align: left !important;
  }

  /* ── Blockquote, code, hr ──────────────────────────────────── */
  .glyph-export-doc .acad-blockquote {
    border-left: 2.5pt solid #666 !important;
    padding: 3pt 0 3pt 13pt !important;
    margin: 12pt 0 13pt 16pt !important;
    color: #333 !important;
    font-style: italic !important;
    background: transparent !important;
  }
  .glyph-export-doc .acad-pre,
  .glyph-export-doc code {
    font-family: 'Consolas', 'Courier New', monospace !important;
    font-size: 10pt !important;
    line-height: 1.5 !important;
    background: #f5f5f5 !important;
    border: 0.4pt solid #ccc !important;
    color: #1a1a1a !important;
    border-radius: 0 !important;
  }
  .glyph-export-doc .acad-pre {
    margin: 11pt 0 13pt !important;
    padding: 10pt 12pt !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }
  .glyph-export-doc .acad-p code,
  .glyph-export-doc .acad-li code {
    padding: 0.5pt 4pt !important;
    background: #f5f5f5 !important;
    color: #1a1a1a !important;
    border: 0.4pt solid #ccc !important;
  }
  .glyph-export-doc .acad-hr {
    height: 0 !important;
    border: 0 !important;
    border-top: 0.6pt solid #bbb !important;
    margin: 18pt 0 !important;
    background: none !important;
  }

  /* ── In-app symbol chrome — strip colour/glow ──────────────── */
  .glyph-export-doc .sym,
  .glyph-export-doc .sym.cat-currency,
  .glyph-export-doc .sym.cat-logic,
  .glyph-export-doc .sym.cat-chemistry {
    display: inline !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    border-bottom: none !important;
    border-radius: 0 !important;
    background: none !important;
    color: inherit !important;
    font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif !important;
    font-size: inherit !important;
    text-shadow: none !important;
    animation: none !important;
  }
  .glyph-export-doc .sym::before,
  .glyph-export-doc .sym::after { display: none !important; content: none !important; }

  .glyph-export-doc strong { font-weight: 700 !important; color: #000 !important; }
  .glyph-export-doc em     { font-style: italic !important; }
`

/* ═══════════════════════════════════════════════════════════════════
 *  SHARED HELPERS
 * ═══════════════════════════════════════════════════════════════════ */

const STYLE_ID = 'glyph-export-style'
const STAGE_ATTR = 'data-glyph-export-stage'

function injectExportStyle() {
  let el = document.getElementById(STYLE_ID)
  if (el) return { el, created: false }
  el = document.createElement('style')
  el.id = STYLE_ID
  el.type = 'text/css'
  el.textContent = EXPORT_CSS
  document.head.appendChild(el)
  return { el, created: true }
}

function ensureFontLinks() {
  for (const href of EXPORT_FONT_LINKS) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.setAttribute('data-glyph-export-font', 'true')
      document.head.appendChild(link)
    }
  }
}

async function waitForFonts() {
  ensureFontLinks()
  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {
    /* continue with system fallback */
  }
  await new Promise((r) => setTimeout(r, 80))
}

async function waitForImagesIn(root, timeoutMs = 3000) {
  const imgs = Array.from(root.querySelectorAll('img'))
  if (imgs.length === 0) return
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise((res) => {
        const done = () => res()
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
        setTimeout(done, timeoutMs)
      })
    }),
  )
}

function createRenderStage(widthPx) {
  const stage = document.createElement('div')
  stage.setAttribute('aria-hidden', 'true')
  stage.setAttribute(STAGE_ATTR, 'true')
  stage.style.cssText = `
    position: fixed;
    top: 0;
    left: -100000px;
    width: ${widthPx}px;
    background: #ffffff;
    color: #1a1a1a;
    pointer-events: none;
    z-index: -1;
  `
  document.body.appendChild(stage)
  return stage
}

function extractExportContent(sourceEl) {
  if (!sourceEl?.innerHTML?.trim()) return null
  const article = sourceEl.querySelector('article')
  return article ? article.outerHTML : sourceEl.innerHTML
}

function readDocumentTitle(sourceEl) {
  return (
    sourceEl?.querySelector('.acad-title')?.textContent?.trim() ||
    sourceEl?.querySelector('.acad-h1')?.textContent?.trim() ||
    sourceEl?.querySelector('h1')?.textContent?.trim() ||
    'Document'
  )
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/* ═══════════════════════════════════════════════════════════════════
 *  PDF EXPORT  ──────────────────────────────────────────────────────
 *
 *  Strategy: mount the article off-screen at A4 content width, walk
 *  top-level blocks, pack them into pages by measured height, then
 *  rasterise EACH page independently with html2canvas. Page-by-page
 *  rasterisation means the slicer can never cut across a line or
 *  split an equation.
 * ═══════════════════════════════════════════════════════════════════ */

const ATOMIC_CLASS_RE   = /\b(acad-eq|acad-table-wrap|acad-pre|acad-blockquote|acad-hr)\b/
const HEADING_CLASS_RE  = /\b(acad-h1|acad-h2|acad-title)\b/
const MIN_NEXT_CHUNK_PX = 96 // ~3 lines, prevents heading-at-bottom orphan

const isHeading   = (el) => el?.className && HEADING_CLASS_RE.test(el.className)
const isParagraph = (el) => el?.classList?.contains('acad-p')
const isList      = (el) =>
  el?.classList?.contains('acad-ul') || el?.classList?.contains('acad-ol')

function outerHeight(el) {
  const r = el.getBoundingClientRect()
  const s = getComputedStyle(el)
  return r.height + (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0)
}

function topLevelBlocks(wrap) {
  const article = wrap.querySelector('article') || wrap
  return Array.from(article.children).filter(
    (el) => el.nodeType === 1 && el.offsetHeight > 0,
  )
}

/* ── Splitting oversized blocks ─────────────────────────────────── */

function splitList(listEl, maxHeightPx, hostWrap) {
  const items = Array.from(listEl.children)
  if (items.length === 0) return [listEl]
  const chunks = []
  let chunk = listEl.cloneNode(false)
  hostWrap.appendChild(chunk)
  for (const item of items) {
    chunk.appendChild(item.cloneNode(true))
    if (chunk.getBoundingClientRect().height > maxHeightPx && chunk.children.length > 1) {
      chunk.removeChild(chunk.lastChild)
      hostWrap.removeChild(chunk)
      chunks.push(chunk)
      chunk = listEl.cloneNode(false)
      hostWrap.appendChild(chunk)
      chunk.appendChild(item.cloneNode(true))
    }
  }
  hostWrap.removeChild(chunk)
  chunks.push(chunk)
  return chunks
}

function splitParagraph(pEl, maxHeightPx, hostWrap) {
  const frags = []
  for (const node of pEl.childNodes) {
    if (node.nodeType === 3) {
      const parts = node.textContent.split(/(?<=[.!?])\s+/)
      parts.forEach((p, i) => {
        if (p) frags.push({ type: 'text', value: i < parts.length - 1 ? p + ' ' : p })
      })
    } else {
      frags.push({ type: 'node', value: node.cloneNode(true) })
    }
  }
  if (frags.length === 0) return [pEl]

  const chunks = []
  let chunk = pEl.cloneNode(false)
  hostWrap.appendChild(chunk)
  const appendFrag = (f) => {
    if (f.type === 'text') chunk.appendChild(document.createTextNode(f.value))
    else chunk.appendChild(f.value.cloneNode(true))
  }
  for (const f of frags) {
    appendFrag(f)
    if (chunk.getBoundingClientRect().height > maxHeightPx && chunk.childNodes.length > 1) {
      chunk.removeChild(chunk.lastChild)
      hostWrap.removeChild(chunk)
      chunks.push(chunk)
      chunk = pEl.cloneNode(false)
      hostWrap.appendChild(chunk)
      appendFrag(f)
    }
  }
  hostWrap.removeChild(chunk)
  chunks.push(chunk)
  return chunks
}

function splitOversized(el, maxHeightPx, hostWrap) {
  if (isList(el)) return splitList(el, maxHeightPx, hostWrap)
  if (isParagraph(el)) return splitParagraph(el, maxHeightPx, hostWrap)
  return [el]
}

/* ── Pagination ─────────────────────────────────────────────────── */

function paginateBlocks(blocks, hostWrap) {
  const max = CONTENT_HEIGHT_PX
  const pages = []
  let page = []
  let used = 0
  const flush = () => {
    if (page.length > 0) { pages.push(page); page = []; used = 0 }
  }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    const h = outerHeight(b)

    // Heading orphan guard
    if (isHeading(b) && i < blocks.length - 1) {
      const nextH = outerHeight(blocks[i + 1])
      const peek = Math.min(nextH, MIN_NEXT_CHUNK_PX)
      if (page.length > 0 && used + h + peek > max) flush()
    }

    if (h > max) {
      flush()
      const parts = splitOversized(b, max, hostWrap)
      for (const part of parts) {
        const ph = outerHeight(part)
        if (ph > max) {
          pages.push([part])
        } else {
          if (used + ph > max) flush()
          page.push(part)
          used += ph
        }
      }
      continue
    }

    if (used + h > max) flush()
    page.push(b)
    used += h
  }
  flush()
  return pages
}

/* ── Per-page rasterisation ─────────────────────────────────────── */

async function rasterisePage(blocks, stage) {
  const pageEl = document.createElement('div')
  pageEl.className = 'glyph-export-doc doc-academic-root doc-page doc-content'
  pageEl.style.cssText = `
    width: ${CONTENT_WIDTH_PX}px;
    background: #ffffff;
    margin: 0;
    padding: 0;
  `
  for (const b of blocks) pageEl.appendChild(b.cloneNode(true))
  stage.appendChild(pageEl)

  const canvas = await html2canvas(pageEl, {
    scale: RENDER_SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    windowWidth: CONTENT_WIDTH_PX,
    letterRendering: true,
    imageTimeout: 5000,
  })

  stage.removeChild(pageEl)
  return canvas
}

function addRunningHeaderAndPageNumbers(pdf, title) {
  const total = pdf.internal.getNumberOfPages()
  const w = PAGE.widthMm
  const h = PAGE.heightMm
  const safe = (title || '').replace(/\s+/g, ' ').trim()
  const trimmed = safe.length > 80 ? `${safe.slice(0, 77)}…` : safe

  for (let i = 1; i <= total; i++) {
    pdf.setPage(i)
    if (i > 1 && trimmed) {
      pdf.setFont('times', 'italic')
      pdf.setFontSize(9)
      pdf.setTextColor(80, 80, 80)
      pdf.text(trimmed, w / 2, 13, { align: 'center' })
      pdf.setDrawColor(180, 180, 180)
      pdf.setLineWidth(0.2)
      pdf.line(PAGE.marginLeftMm, 15.5, w - PAGE.marginRightMm, 15.5)
    }
    pdf.setFont('times', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(95, 95, 95)
    pdf.text(`${i}`, w / 2, h - 12, { align: 'center' })
  }
}

/* ── Public: PDF ────────────────────────────────────────────────── */

export async function exportOutputAsPdf(sourceEl, opts = {}) {
  const filename = opts.filename || 'glyph-output.pdf'
  const contentHtml = extractExportContent(sourceEl)
  if (!contentHtml) throw new Error('Nothing to export')

  const docTitle = readDocumentTitle(sourceEl)
  const { el: styleEl, created: styleCreated } = injectExportStyle()
  const stage = createRenderStage(CONTENT_WIDTH_PX)

  try {
    const measureWrap = document.createElement('div')
    measureWrap.className = 'glyph-export-doc doc-academic-root doc-page doc-content'
    measureWrap.style.cssText = `
      width: ${CONTENT_WIDTH_PX}px; background:#ffffff; margin:0; padding:0;
    `
    measureWrap.innerHTML = contentHtml
    stage.appendChild(measureWrap)

    await waitForFonts()
    await waitForImagesIn(measureWrap)

    const blocks = topLevelBlocks(measureWrap)
    if (blocks.length === 0) throw new Error('Nothing to export')

    const pages = paginateBlocks(blocks, measureWrap)

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    })

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage()
      const canvas = await rasterisePage(pages[i], stage)
      const imgWidthMm = PAGE.contentWidthMm
      const naturalHeightMm = (canvas.height * imgWidthMm) / canvas.width
      const heightMm = Math.min(naturalHeightMm, PAGE.contentHeightMm)
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      pdf.addImage(
        imgData, 'JPEG',
        PAGE.marginLeftMm, PAGE.marginTopMm,
        imgWidthMm, heightMm,
        undefined, 'FAST',
      )
    }

    addRunningHeaderAndPageNumbers(pdf, docTitle)
    pdf.save(filename)
  } finally {
    if (stage.parentNode) stage.parentNode.removeChild(stage)
    if (styleCreated && styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  DOCX EXPORT  ─────────────────────────────────────────────────────
 *
 *  Builds a real .docx via the `docx` library. Each acad-* block is
 *  translated to docx primitives. Equations (block + inline) are
 *  rasterised to PNG so they look identical to the in-app preview
 *  inside Microsoft Word, Pages and LibreOffice.
 * ═══════════════════════════════════════════════════════════════════ */

const FONT_SERIF = 'Cambria'
const FONT_SANS  = 'Calibri'
const FONT_MONO  = 'Consolas'

const SIZE = {
  title: 44, h1: 28, h2: 24, body: 24,
  table: 22, code: 20, ref: 22, small: 18,
}

async function rasteriseElementToPng(srcEl, stage) {
  const wrap = document.createElement('div')
  wrap.appendChild(srcEl.cloneNode(true))
  wrap.style.cssText = 'background:#fff;padding:6px 4px;display:inline-block;'
  stage.appendChild(wrap)
  try {
    const canvas = await html2canvas(wrap, {
      scale: 3,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      imageTimeout: 4000,
    })
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) return null
    return {
      data: await blob.arrayBuffer(),
      widthPx: canvas.width / 3,
      heightPx: canvas.height / 3,
    }
  } finally {
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap)
  }
}

function imageRunFromRaster(raster, maxWidthPx) {
  if (!raster) return null
  let w = raster.widthPx
  let h = raster.heightPx
  if (w > maxWidthPx) { h = (h * maxWidthPx) / w; w = maxWidthPx }
  return new ImageRun({
    data: raster.data,
    transformation: { width: Math.round(w), height: Math.round(h) },
  })
}

function plainRun(text, opts = {}) {
  return new TextRun({
    text,
    font: opts.font || FONT_SERIF,
    size: opts.size || SIZE.body,
    bold: !!opts.bold,
    italics: !!opts.italic,
    color: opts.color || '1A1A1A',
    shading: opts.shading,
  })
}

function isInlineMathEl(el) {
  if (!el || el.nodeType !== 1) return false
  const cls = el.className || ''
  return (
    cls.includes('acad-eq-inline') ||
    cls.includes('katex') ||
    el.tagName?.toLowerCase() === 'math' ||
    cls.split(/\s+/).includes('sym')
  )
}

async function buildInlineRuns(parentEl, stage, ctxOpts = {}) {
  const runs = []
  for (const node of parentEl.childNodes) {
    if (node.nodeType === 3) {
      const t = node.textContent
      if (t) runs.push(plainRun(t, ctxOpts))
      continue
    }
    if (node.nodeType !== 1) continue

    const el = node
    const tag = el.tagName.toLowerCase()

    if (isInlineMathEl(el)) {
      const raster = await rasteriseElementToPng(el, stage)
      const run = imageRunFromRaster(raster, 200)
      if (run) runs.push(run)
      else if (el.textContent) runs.push(plainRun(el.textContent, ctxOpts))
      continue
    }

    if (tag === 'br') {
      runs.push(new TextRun({ break: 1 }))
      continue
    }

    const childOpts = { ...ctxOpts }
    if (tag === 'strong' || tag === 'b') childOpts.bold = true
    if (tag === 'em' || tag === 'i') childOpts.italic = true
    if (tag === 'code') {
      childOpts.font = FONT_MONO
      childOpts.size = SIZE.code
      childOpts.shading = { type: ShadingType.CLEAR, color: 'auto', fill: 'F5F5F5' }
    }

    if (Array.from(el.childNodes).some(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent),
    )) {
      runs.push(...(await buildInlineRuns(el, stage, childOpts)))
    } else if (el.textContent) {
      runs.push(plainRun(el.textContent, childOpts))
    }
  }
  return runs
}

/* ── Block builders ─────────────────────────────────────────────── */

function makeTitleParagraph(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360, line: 300 },
    border: { bottom: { color: '1A1A1A', space: 6, style: BorderStyle.SINGLE, size: 12 } },
    children: [new TextRun({
      text, font: FONT_SANS, size: SIZE.title, bold: true, color: '000000',
    })],
  })
}

async function makeHeading(el, level, stage) {
  const runs = await buildInlineRuns(el, stage, {
    font: FONT_SANS,
    size: level === 1 ? SIZE.h1 : SIZE.h2,
    bold: true,
    color: level === 1 ? '000000' : '222222',
  })
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: {
      before: level === 1 ? 360 : 280,
      after:  level === 1 ? 160 : 120,
      line: 300,
    },
    keepNext: true,
    keepLines: true,
    children: runs.length ? runs : [plainRun(el.textContent || '', {
      font: FONT_SANS, size: level === 1 ? SIZE.h1 : SIZE.h2, bold: true,
    })],
  })
}

async function makeBodyParagraph(el, stage) {
  const runs = await buildInlineRuns(el, stage)
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 180, line: 340 },
    children: runs.length ? runs : [plainRun(el.textContent || '')],
  })
}

async function makeBlockquote(el, stage) {
  const runs = await buildInlineRuns(el, stage, { italic: true, color: '333333' })
  return new Paragraph({
    indent: { left: convertInchesToTwip(0.4) },
    border: { left: { color: '666666', space: 8, style: BorderStyle.SINGLE, size: 18 } },
    spacing: { before: 200, after: 220, line: 320 },
    children: runs,
  })
}

function makePreParagraph(el) {
  return new Paragraph({
    spacing: { before: 180, after: 200, line: 280 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F5F5F5' },
    border: {
      top:    { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 4 },
      bottom: { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 4 },
      left:   { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 4 },
      right:  { color: 'CCCCCC', space: 4, style: BorderStyle.SINGLE, size: 4 },
    },
    children: [new TextRun({
      text: el.textContent || '', font: FONT_MONO, size: SIZE.code, color: '1A1A1A',
    })],
  })
}

function makeHrParagraph() {
  return new Paragraph({
    spacing: { before: 220, after: 220 },
    border: { bottom: { color: 'BBBBBB', space: 1, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: '' })],
  })
}

async function makeEquationBlock(el, stage) {
  const raster = await rasteriseElementToPng(el, stage)
  const run = imageRunFromRaster(raster, 580)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 220, after: 260, line: 280 },
    keepLines: true,
    children: run
      ? [run]
      : [plainRun(el.textContent || '', { font: 'Cambria Math', size: 26 })],
  })
}

async function makeListItems(listEl, stage) {
  const ordered = listEl.classList.contains('acad-ol')
  const items = Array.from(listEl.children).filter(
    (c) => c.tagName?.toLowerCase() === 'li',
  )
  const out = []
  for (const item of items) {
    const runs = await buildInlineRuns(item, stage)
    out.push(new Paragraph({
      numbering: { reference: ordered ? 'glyph-ordered' : 'glyph-bullets', level: 0 },
      spacing: { before: 0, after: 100, line: 320 },
      alignment: AlignmentType.JUSTIFIED,
      children: runs.length ? runs : [plainRun(item.textContent || '')],
    }))
  }
  return out
}

async function makeTable(wrapEl, stage) {
  const tableEl = wrapEl.querySelector('table')
  if (!tableEl) return null
  const rowsHtml = Array.from(tableEl.querySelectorAll('tr'))
  if (rowsHtml.length === 0) return null

  const rows = []
  for (let r = 0; r < rowsHtml.length; r++) {
    const tr = rowsHtml[r]
    const cellsHtml = Array.from(tr.querySelectorAll('th,td'))
    const isHead = cellsHtml.some((c) => c.tagName.toLowerCase() === 'th')
    const cells = []
    for (const c of cellsHtml) {
      const runs = await buildInlineRuns(c, stage, {
        font: isHead ? FONT_SANS : FONT_SERIF,
        size: isHead ? 21 : SIZE.table,
        bold: isHead,
      })
      cells.push(new TableCell({
        children: [new Paragraph({
          spacing: { before: 60, after: 60, line: 280 },
          children: runs.length ? runs : [plainRun(c.textContent || '')],
        })],
        shading: isHead
          ? { type: ShadingType.CLEAR, color: 'auto', fill: 'F0F0F0' }
          : r % 2 === 1
            ? { type: ShadingType.CLEAR, color: 'auto', fill: 'FAFAFA' }
            : undefined,
      }))
    }
    rows.push(new TableRow({ children: cells, tableHeader: isHead }))
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: {
      top:              { color: '333333', size: 4, style: BorderStyle.SINGLE },
      bottom:           { color: '333333', size: 4, style: BorderStyle.SINGLE },
      left:             { color: '333333', size: 4, style: BorderStyle.SINGLE },
      right:            { color: '333333', size: 4, style: BorderStyle.SINGLE },
      insideHorizontal: { color: '333333', size: 4, style: BorderStyle.SINGLE },
      insideVertical:   { color: '333333', size: 4, style: BorderStyle.SINGLE },
    },
  })
}

async function makeReferenceList(refsEl, stage) {
  const items = Array.from(refsEl.querySelectorAll('.acad-ref-item, li, p'))
  const out = [new Paragraph({
    spacing: { before: 360, after: 120 },
    border: { top: { color: '999999', space: 6, style: BorderStyle.SINGLE, size: 8 } },
    keepNext: true,
    children: [new TextRun({
      text: 'References', font: FONT_SANS, size: SIZE.h1, bold: true, color: '000000',
    })],
  })]
  for (const item of items) {
    const runs = await buildInlineRuns(item, stage, { size: SIZE.ref })
    out.push(new Paragraph({
      spacing: { before: 0, after: 120, line: 300 },
      indent: {
        left: convertInchesToTwip(0.3),
        hanging: convertInchesToTwip(0.3),
      },
      children: runs.length ? runs : [plainRun(item.textContent || '')],
    }))
  }
  return out
}

async function elementToDocxBlocks(el, stage) {
  const cls = el.className || ''
  if (cls.includes('acad-title')) return [makeTitleParagraph(el.textContent?.trim() || '')]
  if (cls.includes('acad-h1'))    return [await makeHeading(el, 1, stage)]
  if (cls.includes('acad-h2'))    return [await makeHeading(el, 2, stage)]
  if (cls.includes('acad-eq'))    return [await makeEquationBlock(el, stage)]
  if (cls.includes('acad-table-wrap')) {
    const t = await makeTable(el, stage)
    return t ? [t] : []
  }
  if (cls.includes('acad-pre'))        return [makePreParagraph(el)]
  if (cls.includes('acad-blockquote')) return [await makeBlockquote(el, stage)]
  if (cls.includes('acad-hr'))         return [makeHrParagraph()]
  if (cls.includes('acad-ul') || cls.includes('acad-ol'))
    return await makeListItems(el, stage)
  if (cls.includes('acad-refs')) return await makeReferenceList(el, stage)
  if (cls.includes('acad-p') || el.tagName?.toLowerCase() === 'p')
    return [await makeBodyParagraph(el, stage)]
  if (el.textContent?.trim()) return [await makeBodyParagraph(el, stage)]
  return []
}

/* ── Document scaffolding ───────────────────────────────────────── */

function buildNumberingConfig() {
  return {
    config: [
      {
        reference: 'glyph-bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: {
            left: convertInchesToTwip(0.35),
            hanging: convertInchesToTwip(0.2),
          } } },
        }],
      },
      {
        reference: 'glyph-ordered',
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: {
            left: convertInchesToTwip(0.4),
            hanging: convertInchesToTwip(0.25),
          } } },
        }],
      },
    ],
  }
}

function buildPageSetup() {
  return {
    page: {
      size: {
        width:  convertMillimetersToTwip(PAGE.widthMm),
        height: convertMillimetersToTwip(PAGE.heightMm),
      },
      margin: {
        top:    convertMillimetersToTwip(PAGE.marginTopMm),
        bottom: convertMillimetersToTwip(PAGE.marginBottomMm),
        left:   convertMillimetersToTwip(PAGE.marginLeftMm),
        right:  convertMillimetersToTwip(PAGE.marginRightMm),
        header: convertMillimetersToTwip(12),
        footer: convertMillimetersToTwip(14),
      },
    },
  }
}

function buildFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        font: FONT_SERIF, size: SIZE.small, color: '666666',
        children: [PageNumber.CURRENT],
      })],
    })],
  })
}

function buildHeader(title) {
  if (!title) return undefined
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { color: 'BBBBBB', space: 4, style: BorderStyle.SINGLE, size: 4 } },
      children: [new TextRun({
        text: title.length > 90 ? `${title.slice(0, 87)}…` : title,
        font: FONT_SERIF, size: SIZE.small, italics: true, color: '666666',
      })],
    })],
  })
}

function buildStyles() {
  return {
    default: {
      document: {
        run: { font: FONT_SERIF, size: SIZE.body, color: '1A1A1A' },
        paragraph: { spacing: { line: 320, before: 0, after: 180 } },
      },
      heading1: {
        run: { font: FONT_SANS, size: SIZE.h1, bold: true, color: '000000' },
        paragraph: { spacing: { before: 360, after: 160 }, keepNext: true, keepLines: true },
      },
      heading2: {
        run: { font: FONT_SANS, size: SIZE.h2, bold: true, color: '222222' },
        paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, keepLines: true },
      },
    },
  }
}

/* ── Public: DOCX (Word) ────────────────────────────────────────── */

export async function exportOutputAsWord(sourceEl, opts = {}) {
  const filename = opts.filename || 'glyph-output.docx'
  const contentHtml = extractExportContent(sourceEl)
  if (!contentHtml) throw new Error('Nothing to export')

  const docTitle = readDocumentTitle(sourceEl)
  const { el: styleEl, created: styleCreated } = injectExportStyle()
  const stage = createRenderStage(640)
  stage.className = 'glyph-export-doc doc-academic-root'

  await waitForFonts()

  const parsed = document.createElement('div')
  parsed.className = 'glyph-export-doc doc-academic-root'
  parsed.innerHTML = contentHtml
  stage.appendChild(parsed)
  await waitForImagesIn(parsed)

  try {
    const article = parsed.querySelector('article') || parsed
    const topBlocks = Array.from(article.children).filter((n) => n.nodeType === 1)

    const children = []
    for (const el of topBlocks) {
      const blocks = await elementToDocxBlocks(el, stage)
      children.push(...blocks)
    }

    const doc = new Document({
      creator: 'Glyph',
      title: docTitle,
      description: 'Academic export from Glyph',
      styles: buildStyles(),
      numbering: buildNumberingConfig(),
      sections: [{
        properties: buildPageSetup(),
        headers: { default: buildHeader(docTitle) },
        footers: { default: buildFooter() },
        children,
      }],
    })

    const blob = await Packer.toBlob(doc)
    triggerBlobDownload(blob, filename)
  } finally {
    if (stage.parentNode) stage.parentNode.removeChild(stage)
    if (styleCreated && styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl)
  }
}

/* Convenience alias if anywhere calls the .docx name explicitly. */
export const exportOutputAsDocx = exportOutputAsWord