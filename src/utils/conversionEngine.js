import katex from 'katex'
import renderMathInElement from 'katex/contrib/auto-render'
import {
  equationToUnicode,
  isLikelyDisplayEquation,
  normalizeLatexForKatex,
  preprocessMathText,
  prepareEquationRender,
  wrapInlineMathDelimiters,
} from './mathEngine'

export { normalizeLatexForKatex, preprocessMathText, prepareEquationRender } from './mathEngine'

export const CATEGORIES = {
  operators: {
    label: 'Operators',
    glyph: '≠',
    defaultOn: true,
    color: 'mint',
    multiChar: [
      ['<=>', '⇔'],
      ['===', '='],
      ['!==', '≠'],
      ['<->', '↔'],
      ['<=', '≤'],
      ['>=', '≥'],
      ['==', '='],
      ['!=', '≠'],
      ['&&', '∧'],
      ['||', '∨'],
      ['=>', '⇒'],
      ['->', '→'],
      ['<-', '←'],
      ['+-', '±'],
      ['~=', '≈'],
      ['~~', '≈'],
    ],
    hasContextOps: true,
  },
  greek: {
    label: 'Greek',
    glyph: 'α',
    defaultOn: true,
    color: 'mint',
    keywords: [
      ['Alpha', 'Α'],
      ['Beta', 'Β'],
      ['Gamma', 'Γ'],
      ['Delta', 'Δ'],
      ['Epsilon', 'Ε'],
      ['Zeta', 'Ζ'],
      ['Eta', 'Η'],
      ['Theta', 'Θ'],
      ['Iota', 'Ι'],
      ['Kappa', 'Κ'],
      ['Lambda', 'Λ'],
      ['Mu', 'Μ'],
      ['Nu', 'Ν'],
      ['Xi', 'Ξ'],
      ['Omicron', 'Ο'],
      ['Pi', 'Π'],
      ['Rho', 'Ρ'],
      ['Sigma', 'Σ'],
      ['Tau', 'Τ'],
      ['Upsilon', 'Υ'],
      ['Phi', 'Φ'],
      ['Chi', 'Χ'],
      ['Psi', 'Ψ'],
      ['Omega', 'Ω'],
      ['alpha', 'α'],
      ['beta', 'β'],
      ['gamma', 'γ'],
      ['delta', 'δ'],
      ['epsilon', 'ε'],
      ['zeta', 'ζ'],
      ['eta', 'η'],
      ['theta', 'θ'],
      ['iota', 'ι'],
      ['kappa', 'κ'],
      ['lambda', 'λ'],
      ['mu', 'μ'],
      ['nu', 'ν'],
      ['xi', 'ξ'],
      ['omicron', 'ο'],
      ['pi', 'π'],
      ['rho', 'ρ'],
      ['sigma', 'σ'],
      ['tau', 'τ'],
      ['upsilon', 'υ'],
      ['phi', 'φ'],
      ['chi', 'χ'],
      ['psi', 'ψ'],
      ['omega', 'ω'],
    ],
  },
  math: {
    label: 'Math',
    glyph: '∑',
    defaultOn: true,
    color: 'mint',
    keywords: [
      ['infinity', '∞'],
      ['infty', '∞'],
      ['sqrt', '√'],
      ['cbrt', '∛'],
      ['sum', '∑'],
      ['prod', '∏'],
      ['int', '∫'],
      ['partial', '∂'],
      ['nabla', '∇'],
      ['therefore', '∴'],
      ['because', '∵'],
      ['approx', '≈'],
      ['propto', '∝'],
      ['neq', '≠'],
      ['leq', '≤'],
      ['geq', '≥'],
      ['pm', '±'],
      ['mp', '∓'],
      ['times', '×'],
      ['div', '÷'],
      ['cdot', '·'],
      ['deg', '°'],
      ['inf', '∞'],
    ],
  },
  setTheory: {
    label: 'Set theory',
    glyph: '∈',
    defaultOn: true,
    color: 'mint',
    keywords: [
      ['emptyset', '∅'],
      ['notin', '∉'],
      ['subseteq', '⊆'],
      ['supseteq', '⊇'],
      ['nsubset', '⊄'],
      ['subset', '⊂'],
      ['supset', '⊃'],
      ['union', '∪'],
      ['intersection', '∩'],
      ['intersect', '∩'],
    ],
    contextual: [
      {
        pattern: /\b([A-Za-z]\w?)\s+in\s+([A-Za-z]\w?)\b/g,
        from: ' in ',
        to: '∈',
        wrap: 1,
      },
    ],
  },
  logic: {
    label: 'Logic',
    glyph: '∀',
    defaultOn: true,
    color: 'logic',
    keywords: [
      ['forall', '∀'],
      ['exists', '∃'],
      ['implies', '⇒'],
      ['iff', '⇔'],
      ['land', '∧'],
      ['lor', '∨'],
      ['lnot', '¬'],
      ['neg', '¬'],
    ],
  },
  geometry: {
    label: 'Geometry',
    glyph: '△',
    defaultOn: true,
    color: 'mint',
    keywords: [
      ['parallel', '∥'],
      ['perp', '⊥'],
      ['triangle', '△'],
      ['angle', '∠'],
    ],
  },
  currency: {
    label: 'Currency',
    glyph: '$',
    defaultOn: true,
    color: 'currency',
    keywords: [
      ['USD', '$'],
      ['EUR', '€'],
      ['GBP', '£'],
      ['JPY', '¥'],
      ['CNY', '¥'],
      ['INR', '₹'],
      ['KRW', '₩'],
      ['RUB', '₽'],
      ['BTC', '₿'],
      ['PHP', '₱'],
      ['VND', '₫'],
      ['UAH', '₴'],
      ['THB', '฿'],
      ['BDT', '৳'],
      ['PKR', '₨'],
    ],
  },
  chemistry: {
    label: 'Chemistry',
    glyph: '⚗',
    defaultOn: true,
    color: 'chemistry',
    keywords: [
      ['H2SO4', 'H₂SO₄'],
      ['HNO3', 'HNO₃'],
      ['CaCO3', 'CaCO₃'],
      ['H2CO3', 'H₂CO₃'],
      ['NaHCO3', 'NaHCO₃'],
      ['H2O', 'H₂O'],
      ['CO2', 'CO₂'],
      ['O2', 'O₂'],
      ['N2', 'N₂'],
      ['H2', 'H₂'],
      ['SO2', 'SO₂'],
      ['NO2', 'NO₂'],
      ['CH4', 'CH₄'],
      ['NH3', 'NH₃'],
    ],
  },
  scripts: {
    label: 'Sub/super',
    glyph: 'x²',
    defaultOn: true,
    color: 'mint',
    hasScripts: true,
  },
}

const SUP = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  n: 'ⁿ',
  i: 'ⁱ',
  a: 'ᵃ',
  b: 'ᵇ',
  c: 'ᶜ',
  x: 'ˣ',
  y: 'ʸ',
}
const SUB = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
  a: 'ₐ',
  e: 'ₑ',
  i: 'ᵢ',
  o: 'ₒ',
  n: 'ₙ',
  x: 'ₓ',
}

function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function extractPlain(raw, activeCategories, opt = {}) {
  let text = opt.preprocessed ? raw : preprocessMathText(raw)

  if (activeCategories.has('operators')) {
    const ops = [...CATEGORIES.operators.multiChar].sort(
      (a, b) => b[0].length - a[0].length,
    )
    for (const [from, to] of ops)
      text = text.replace(new RegExp(escRegex(from), 'g'), to)
  }
  if (activeCategories.has('scripts')) {
    text = text.replace(/([A-Za-z)\]])\^([A-Za-z0-9]+)/g, (m, base, exp) => {
      const chars = exp.split('')
      if (!chars.every((c) => SUP[c])) return m
      return base + chars.map((c) => SUP[c]).join('')
    })
    text = text.replace(/([A-Za-z)\]])_([A-Za-z0-9]+)/g, (m, base, sub) => {
      const chars = sub.split('')
      if (!chars.every((c) => SUB[c])) return m
      return base + chars.map((c) => SUB[c]).join('')
    })
  }
  if (activeCategories.has('chemistry')) {
    const chem = [...CATEGORIES.chemistry.keywords].sort(
      (a, b) => b[0].length - a[0].length,
    )
    for (const [from, to] of chem)
      text = text.replace(new RegExp(`\\b${escRegex(from)}\\b`, 'g'), to)
  }
  if (activeCategories.has('setTheory') && CATEGORIES.setTheory.contextual) {
    for (const rule of CATEGORIES.setTheory.contextual) {
      text = text.replace(rule.pattern, (m, a, b) => `${a} ∈ ${b}`)
    }
  }
  const wordCats = ['setTheory', 'logic', 'geometry', 'math', 'greek', 'currency']
  for (const catKey of wordCats) {
    if (!activeCategories.has(catKey)) continue
    const cat = CATEGORIES[catKey]
    if (!cat.keywords) continue
    const sorted = [...cat.keywords].sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of sorted) {
      text = text.replace(new RegExp(`\\b${escRegex(from)}\\b`, 'g'), to)
    }
  }
  if (activeCategories.has('operators')) {
    text = text.replace(/(\w|\)|\])\s*\*\s*(\w|\(|\[|-)/g, (m, a, b) => `${a} × ${b}`)
    text = text.replace(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g, (m, a, b) => `${a} ÷ ${b}`)
  }
  return text
}

export function convert(raw, activeCategories, opt = {}) {
  const lineBreaks = opt.lineBreaks !== false
  let text = opt.preprocessed ? raw : preprocessMathText(raw)
  const placeholders = new Map()
  const diffStats = new Map()
  let phId = 0

  const PH_OPEN = '\x01'
  const PH_CLOSE = '\x02'

  function makePh(from, to, cat) {
    const key = `${PH_OPEN}PH${phId++}${PH_CLOSE}`
    placeholders.set(key, { from, to, cat })
    const stat = diffStats.get(`${from}→${to}`)
    if (stat) stat.count++
    else diffStats.set(`${from}→${to}`, { from, to, cat, count: 1 })
    return key
  }

  if (activeCategories.has('operators')) {
    const ops = [...CATEGORIES.operators.multiChar].sort(
      (a, b) => b[0].length - a[0].length,
    )
    for (const [from, to] of ops) {
      text = text.replace(new RegExp(escRegex(from), 'g'), () =>
        makePh(from, to, 'operators'),
      )
    }
  }

  if (activeCategories.has('scripts')) {
    text = text.replace(/([A-Za-z)\]])\^([A-Za-z0-9]+)/g, (m, base, exp) => {
      const chars = exp.split('')
      if (!chars.every((c) => SUP[c])) return m
      const sup = chars.map((c) => SUP[c]).join('')
      return base + makePh('^' + exp, sup, 'scripts')
    })
    text = text.replace(/([A-Za-z)\]])_([A-Za-z0-9]+)/g, (m, base, sub) => {
      const chars = sub.split('')
      if (!chars.every((c) => SUB[c])) return m
      const subOut = chars.map((c) => SUB[c]).join('')
      return base + makePh('_' + sub, subOut, 'scripts')
    })
  }

  if (activeCategories.has('chemistry')) {
    const chem = [...CATEGORIES.chemistry.keywords].sort(
      (a, b) => b[0].length - a[0].length,
    )
    for (const [from, to] of chem) {
      text = text.replace(new RegExp(`\\b${escRegex(from)}\\b`, 'g'), () =>
        makePh(from, to, 'chemistry'),
      )
    }
  }

  if (activeCategories.has('setTheory') && CATEGORIES.setTheory.contextual) {
    for (const rule of CATEGORIES.setTheory.contextual) {
      text = text.replace(rule.pattern, (m, a, b) => {
        return `${a} ${makePh('in', '∈', 'setTheory')} ${b}`
      })
    }
  }

  const wordCats = ['setTheory', 'logic', 'geometry', 'math', 'greek', 'currency']
  for (const catKey of wordCats) {
    if (!activeCategories.has(catKey)) continue
    const cat = CATEGORIES[catKey]
    if (!cat.keywords) continue
    const sorted = [...cat.keywords].sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of sorted) {
      const flags = catKey === 'greek' ? 'g' : 'g'
      text = text.replace(new RegExp(`\\b${escRegex(from)}\\b`, flags), () =>
        makePh(from, to, catKey),
      )
    }
  }

  if (activeCategories.has('operators')) {
    text = text.replace(/(\w|\)|\])\s*\*\s*(\w|\(|\[|-)/g, (m, a, b) => {
      return `${a} ${makePh('*', '×', 'operators')} ${b}`
    })
    text = text.replace(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g, (m, a, b) => {
      return `${a} ${makePh('/', '÷', 'operators')} ${b}`
    })
  }

  text = escHtml(text)

  const phRe = new RegExp(`${PH_OPEN}PH(\\d+)${PH_CLOSE}`, 'g')
  text = text.replace(phRe, (m) => {
    const data = placeholders.get(m)
    if (!data) return m
    const cls = `sym cat-${data.cat}`
    return `<span class="${cls}" data-from="${escHtml(data.from)}" data-to="${escHtml(data.to)}">${data.to}</span>`
  })

  if (lineBreaks) text = text.replace(/\n/g, '<br>')

  return {
    html: text,
    plain: extractPlain(raw, activeCategories),
    stats: diffStats,
    total: placeholders.size,
  }
}

function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function renderUnicodeEquation(expr, activeCategories) {
  const uni = equationToUnicode(expr)
  const { html } = convert(uni, activeCategories, { lineBreaks: false, preprocessed: true })
  return `<div class="acad-eq acad-eq-unicode" data-unicode-math="1">${html}</div>`
}

function renderEquationBlock(expr, activeCategories) {
  const t = String(expr).trim()
  if (!t) return ''
  const prepared = prepareEquationRender(t)
  if (prepared.mode === 'katex') {
    return `<div class="acad-eq" data-katex-display="1" data-katex="${escAttr(prepared.latex)}"></div>`
  }
  if (prepared.mode === 'unicode') {
    return renderUnicodeEquation(prepared.text, activeCategories)
  }
  return ''
}

function findEquationSpanEnd(str) {
  const m =
    /\s+(?:utility|production|function|consider|macroeconomic|where|given|subject|implies|therefore|and|for|we|the|this|that|next|finally|represented|aggregate|following|output|definitions?)\b/i.exec(
      str.slice(1),
    )
  return m ? m.index + 1 : str.length
}

function splitLeadingTitle(body) {
  const lines = body.split('\n')
  const first = lines[0].trim()
  if (!first || first.length > 140 || first.length < 14) return null
  if (/[:=]/.test(first)) return null
  if (/^#|\/\/|^[-*]\s|^\d+\./.test(first)) return null
  if (
    /^(consider|the|this|we|let|when|where|suppose|assume|given|figure|table|section|in|for|here|there)\b/i.test(
      first,
    )
  )
    return null
  if (first.endsWith('.')) return null
  const words = first.split(/\s+/).filter(Boolean)
  if (words.length < 4) return null
  const startsCap = words.filter((w) => /^[A-Z]/.test(w))
  if (startsCap.length < 3) return null
  const rest = lines.slice(1).join('\n').trim()
  return { title: first, rest }
}

function splitMixedLine(line) {
  const parts = []
  const re = /\b([A-Z])(\([A-Za-z]\))?\s*=\s*/g
  let last = 0
  let m
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) {
      const prose = line.slice(last, m.index).trim()
      if (prose) parts.push({ kind: 'text', text: prose })
    }
    const eqStart = m.index
    const tail = line.slice(eqStart)
    const len = findEquationSpanEnd(tail)
    const eqStr = line.slice(eqStart, eqStart + len).trim()
    parts.push({ kind: 'math', text: eqStr })
    last = eqStart + len
    re.lastIndex = last
  }
  if (last < line.length) {
    const tail = line.slice(last).trim()
    if (tail) parts.push({ kind: 'text', text: tail })
  }
  if (parts.length === 0) parts.push({ kind: 'text', text: line })
  return parts
}

export function buildAcademicArticle(raw, activeCategories) {
  const conv = (t, o = {}) => convert(t, activeCategories, o)

  function renderProseHtml(r) {
    const chunks = r.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g)
    let out = ''
    for (const ch of chunks) {
      if (!ch) continue
      if (ch[0] === '`') {
        out += `<code>${escHtml(ch.slice(1, -1))}</code>`
      } else if (ch.startsWith('**') && ch.endsWith('**')) {
        const inner = ch.slice(2, -2)
        out += `<strong>${conv(inner, { lineBreaks: false }).html}</strong>`
      } else {
        out += conv(wrapInlineMathDelimiters(ch), { lineBreaks: false }).html
      }
    }
    return out
  }

  function renderParagraphBody(r) {
    const lines = r.split(/\n/)
    const htmlParts = []
    for (const ln of lines) {
      const line = ln.trimEnd()
      const t = line.trim()
      if (!t) continue
      if (isLikelyDisplayEquation(t)) {
        htmlParts.push(renderEquationBlock(t, activeCategories))
        continue
      }
      const mix = splitMixedLine(t)
      if (mix.length === 1 && mix[0].kind === 'text') {
        htmlParts.push(`<p class="acad-p">${renderProseHtml(t)}</p>`)
        continue
      }
      for (const p of mix) {
        if (p.kind === 'text') {
          const tx = p.text.trim()
          if (tx) htmlParts.push(`<p class="acad-p">${renderProseHtml(tx)}</p>`)
        } else {
          htmlParts.push(renderEquationBlock(p.text, activeCategories))
        }
      }
    }
    return htmlParts.join('')
  }

  function tryParseTable(lines, startIdx) {
    const row0 = lines[startIdx].trim()
    if (!row0.includes('|')) return null
    const row1 = lines[startIdx + 1] ? lines[startIdx + 1].trim() : ''
    if (!/^\|?[\s:|-]+\|/.test(row1)) return null
    const rows = []
    let i = startIdx
    while (i < lines.length) {
      const r = lines[i].trim()
      if (!r.includes('|')) break
      if (/^[\s|:-]+$/.test(r.replace(/\|/g, ''))) {
        i++
        continue
      }
      rows.push(
        r
          .split('|')
          .map((c) => c.trim())
          .filter((c, idx, arr) => !(c === '' && (idx === 0 || idx === arr.length - 1))),
      )
      i++
    }
    if (rows.length < 2) return null
    const head = rows[0]
    const body = rows.slice(1)
    const th =
      '<tr>' +
      head.map((c) => `<th>${conv(c, { lineBreaks: false }).html}</th>`).join('') +
      '</tr>'
    const tb = body
      .map(
        (r) =>
          '<tr>' +
          r.map((c) => `<td>${conv(c, { lineBreaks: false }).html}</td>`).join('') +
          '</tr>',
      )
      .join('')
    return {
      next: i,
      html: `<div class="acad-table-wrap"><table class="acad-table"><thead>${th}</thead><tbody>${tb}</tbody></table></div>`,
    }
  }

  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const parts = []
  let i = 0
  let blockIndex = 0
  const firstTitleCandidate = () => {
    const t = raw.trim()
    const firstLine = t.split('\n')[0] || ''
    return (
      firstLine.length > 0 &&
      firstLine.length < 120 &&
      !firstLine.includes('=') &&
      !firstLine.startsWith('#') &&
      !firstLine.startsWith('//')
    )
  }

  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()
    if (!t) {
      i++
      continue
    }

    if (t === '---' || t === '***' || t === '___') {
      parts.push('<hr class="acad-hr" />')
      i++
      continue
    }

    if (t.startsWith('```')) {
      const lang = t.slice(3).trim().toLowerCase()
      i++
      const body = []
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        body.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      const code = body.join('\n')
      const inner =
        lang === 'math' || lang === 'latex' || lang === 'katex'
          ? renderEquationBlock(code.trim(), activeCategories)
          : `<pre class="acad-pre">${conv(code, { lineBreaks: true }).html}</pre>`
      parts.push(inner)
      blockIndex++
      continue
    }

    const mdh = /^(#{1,6})\s+(.+)$/.exec(t)
    if (mdh) {
      const lv = mdh[1].length
      const tx = mdh[2].trim()
      if (lv === 1) parts.push(`<h1 class="acad-h1">${conv(tx, { lineBreaks: false }).html}</h1>`)
      else if (lv === 2)
        parts.push(`<h2 class="acad-h2">${conv(tx, { lineBreaks: false }).html}</h2>`)
      else parts.push(`<h2 class="acad-h2">${conv(tx, { lineBreaks: false }).html}</h2>`)
      i++
      blockIndex++
      continue
    }

    if (/^(references|bibliography|works cited)\s*:?\s*$/i.test(t)) {
      parts.push(
        `<h2 class="acad-h1">${conv(t.replace(/:$/, ''), { lineBreaks: false }).html}</h2><div class="acad-refs">`,
      )
      i++
      while (i < lines.length) {
        const lt = lines[i].trim()
        if (!lt) break
        if (/^(references|bibliography)\s*:?\s*$/i.test(lt)) {
          i++
          continue
        }
        parts.push(`<div class="acad-ref-item">${conv(lt, { lineBreaks: false }).html}</div>`)
        i++
      }
      parts.push('</div>')
      blockIndex++
      continue
    }

    if (/^>\s?/.test(t)) {
      const q = []
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        q.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      parts.push(
        `<blockquote class="acad-blockquote">${conv(q.join('\n'), { lineBreaks: true }).html}</blockquote>`,
      )
      blockIndex++
      continue
    }

    if (/^[-*•·]\s+/.test(t)) {
      const items = []
      while (i < lines.length && /^[-*•·]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•·]\s+/, ''))
        i++
      }
      const lis = items
        .map((it) => `<li class="acad-li">${renderParagraphBody(it)}</li>`)
        .join('')
      parts.push(`<ul class="acad-ul">${lis}</ul>`)
      blockIndex++
      continue
    }

    if (/^\d+\.\s+/.test(t)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      const lis = items
        .map((it) => `<li class="acad-li">${renderParagraphBody(it)}</li>`)
        .join('')
      parts.push(`<ol class="acad-ol">${lis}</ol>`)
      blockIndex++
      continue
    }

    const tbl = tryParseTable(lines, i)
    if (tbl) {
      parts.push(tbl.html)
      i = tbl.next
      blockIndex++
      continue
    }

    const para = []
    while (i < lines.length) {
      const lt = lines[i]
      const tt = lt.trim()
      if (!tt) break
      if (
        tt.startsWith('```') ||
        /^(#{1,6})\s/.test(tt) ||
        /^[-*•·]\s+/.test(tt) ||
        /^\d+\.\s+/.test(tt) ||
        /^(references|bibliography)\s*:?\s*$/i.test(tt) ||
        tt === '---' ||
        /^>\s?/.test(tt)
      )
        break
      if (tryParseTable(lines, i)) break
      para.push(lt)
      i++
    }
    const body = para.join('\n').trim()
    if (!body) continue

    if (blockIndex === 0) {
      const lead = splitLeadingTitle(body)
      if (lead) {
        parts.push(`<h1 class="acad-title">${conv(lead.title, { lineBreaks: false }).html}</h1>`)
        if (lead.rest) parts.push(renderParagraphBody(lead.rest))
      } else if (firstTitleCandidate() && para.length === 1 && !body.includes('=')) {
        parts.push(`<h1 class="acad-title">${conv(body, { lineBreaks: false }).html}</h1>`)
      } else {
        parts.push(renderParagraphBody(body))
      }
    } else {
      parts.push(renderParagraphBody(body))
    }
    blockIndex++
  }

  return `<article>${parts.join('')}</article>`
}

export function buildAcademicPlain(raw, activeCategories) {
  const tmp = document.createElement('div')
  tmp.innerHTML = buildAcademicArticle(raw, activeCategories)
  const out = []
  const walk = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) {
        const t = n.textContent.trim()
        if (t) out.push(t)
      } else if (n.nodeType === 1) {
        const tag = n.tagName
        if (tag === 'DIV' && n.classList.contains('acad-eq')) {
          const plain =
            n.hasAttribute('data-unicode-math') || n.classList.contains('acad-eq-unicode')
              ? n.textContent
              : n.getAttribute('data-katex') || n.textContent
          out.push('\n' + plain.trim() + '\n')
        } else if (tag === 'PRE') {
          out.push('\n' + n.textContent + '\n')
        } else if (/^H[1-6]$/.test(tag) || tag === 'LI') {
          out.push('\n' + n.textContent.trim() + '\n')
        } else walk(n)
      }
    }
  }
  walk(tmp)
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function applyKatexToOutput(root) {
  root.querySelectorAll('[data-katex]:not([data-unicode-math])').forEach((el) => {
    let tex = el.getAttribute('data-katex')
    if (!tex) return
    tex = normalizeLatexForKatex(tex)
    el.setAttribute('data-katex', tex)
    const disp = el.hasAttribute('data-katex-display')
    try {
      katex.render(tex, el, {
        displayMode: disp,
        throwOnError: false,
        strict: false,
        trust: true,
      })
    } catch {
      el.textContent = tex
    }
  })
  try {
    renderMathInElement(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\begin{equation}', right: '\\end{equation}', display: true },
        { left: '\\begin{align}', right: '\\end{align}', display: true },
        { left: '\\begin{align*}', right: '\\end{align*}', display: true },
        { left: '\\begin{aligned}', right: '\\end{aligned}', display: true },
      ],
      ignoredTags: ['script', 'style', 'textarea', 'pre', 'code'],
      ignoredClasses: ['katex', 'katex-display', 'acad-eq-unicode'],
      strict: false,
      trust: true,
      throwOnError: false,
      preProcess: (math) => normalizeLatexForKatex(math),
    })
  } catch {
    /* ignore auto-render failures */
  }
}
