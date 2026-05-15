/**
 * Advanced LaTeX normalization for KaTeX (LaTeX / MathJax-compatible syntax).
 * Converts ASCII math, economics notation, and Unicode symbols to renderable TeX.
 */

import { repairMalformedLatex } from './latexRepair'

const GREEK_LATEX = {
  alpha: '\\alpha',
  beta: '\\beta',
  gamma: '\\gamma',
  delta: '\\delta',
  epsilon: '\\varepsilon',
  zeta: '\\zeta',
  eta: '\\eta',
  theta: '\\theta',
  iota: '\\iota',
  kappa: '\\kappa',
  lambda: '\\lambda',
  mu: '\\mu',
  nu: '\\nu',
  xi: '\\xi',
  pi: '\\pi',
  rho: '\\rho',
  sigma: '\\sigma',
  tau: '\\tau',
  phi: '\\varphi',
  chi: '\\chi',
  psi: '\\psi',
  omega: '\\omega',
  varepsilon: '\\varepsilon',
  vartheta: '\\vartheta',
  varphi: '\\varphi',
  eps: '\\varepsilon',
  Gamma: '\\Gamma',
  Delta: '\\Delta',
  Theta: '\\Theta',
  Lambda: '\\Lambda',
  Sigma: '\\Sigma',
  Omega: '\\Omega',
}

const UNICODE_TO_LATEX = {
  '\u0391': '\\mathrm{A}',
  '\u0392': '\\mathrm{B}',
  '\u0393': '\\Gamma',
  '\u0394': '\\Delta',
  '\u0395': '\\mathrm{E}',
  '\u0396': '\\mathrm{Z}',
  '\u0397': '\\mathrm{H}',
  '\u0398': '\\Theta',
  '\u0399': '\\mathrm{I}',
  '\u039A': '\\mathrm{K}',
  '\u039B': '\\Lambda',
  '\u039C': '\\mathrm{M}',
  '\u039D': '\\mathrm{N}',
  '\u039E': '\\Xi',
  '\u039F': '\\mathrm{O}',
  '\u03A0': '\\Pi',
  '\u03A1': '\\mathrm{P}',
  '\u03A3': '\\Sigma',
  '\u03A4': '\\mathrm{T}',
  '\u03A5': '\\Upsilon',
  '\u03A6': '\\Phi',
  '\u03A7': '\\mathrm{X}',
  '\u03A8': '\\Psi',
  '\u03A9': '\\Omega',
  '\u03B1': '\\alpha',
  '\u03B2': '\\beta',
  '\u03B3': '\\gamma',
  '\u03B4': '\\delta',
  '\u03B5': '\\varepsilon',
  '\u03B6': '\\zeta',
  '\u03B7': '\\eta',
  '\u03B8': '\\theta',
  '\u03B9': '\\iota',
  '\u03BA': '\\kappa',
  '\u03BB': '\\lambda',
  '\u03BC': '\\mu',
  '\u03BD': '\\nu',
  '\u03BE': '\\xi',
  '\u03C0': '\\pi',
  '\u03C1': '\\rho',
  '\u03C3': '\\sigma',
  '\u03C4': '\\tau',
  '\u03C5': '\\upsilon',
  '\u03C6': '\\varphi',
  '\u03C7': '\\chi',
  '\u03C8': '\\psi',
  '\u03C9': '\\omega',
  '\u2202': '\\partial',
  '\u2207': '\\nabla',
  '\u221E': '\\infty',
  '\u2211': '\\sum',
  '\u222B': '\\int',
  '\u222C': '\\iint',
  '\u222D': '\\iiint',
  '\u222E': '\\oint',
  '\u2212': '-',
  '\u00B7': '\\cdot',
  '\u00D7': '\\times',
  '\u2264': '\\leq',
  '\u2265': '\\geq',
  '\u2260': '\\neq',
  '\u2248': '\\approx',
  '\u2208': '\\in',
  '\u2209': '\\notin',
  '\u2282': '\\subset',
  '\u2283': '\\supset',
  '\u2227': '\\land',
  '\u2228': '\\lor',
  '\u2200': '\\forall',
  '\u2203': '\\exists',
}

const KATEX_REQUIRED =
  /\\begin\{|\\end\{|\\frac\{|\\dfrac|\\tfrac|\\binom|\\matrix|\\pmatrix|\\bmatrix|\\vmatrix|\\cases|\\aligned|\\gather|\\split|\\left|\\right|\\overset|\\underset|\\stackrel|\\displaystyle|\\text\{|\\mathrm\{|\\mathbf\{|\\mathit\{|\\mathbb\{|\\mathcal\{|\\boldsymbol|\\hat\{|\\vec\{|\\bar\{|\\tilde\{|\\overline|\\underline|\\ce\{|\\xrightarrow|\\xleftarrow/i

const KATEX_PREFERRED =
  /\[\[|\]\]|\\iint|\\iiint|\\oint|curl\s|div\s|grad\s|piecewise|cases|binom\s*\(|choose\s*\(|\bdet\s*\(|\btr\s*\(|\|\|[\w\\]|\\hat|\\vec|partial\s+[a-zA-Z]+\s*\/\s*partial|d\^[0-9]+\s*\/\s*d[a-z]|\\frac\{[^}]+\}\{[^}]+\}|\\sqrt\[[0-9]+\]|maxwell|schrodinger|schroedinger|fourier|laplace|z-transform|pmatrix|bmatrix|vmatrix|align\*?|gather\*?/i

function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Whether expression should be rendered with KaTeX instead of Unicode-only. */
export function shouldUseKatex(expr) {
  const t = String(expr).trim()
  if (!t) return false
  if (KATEX_REQUIRED.test(t)) return true
  if (KATEX_PREFERRED.test(t)) return true
  if (/\\[a-zA-Z]+/.test(t) && !/^\\(?:alpha|beta|gamma|theta|sigma|lambda|pi|infty)\b/.test(t))
    return true
  if (t.includes('\\\\') && /[=+\-*/]/.test(t)) return true
  if (/^\s*[\[{].*[\]}]\s*$/.test(t) && t.includes(',')) return true
  if ((t.match(/\^/g) || []).length >= 3 || (t.match(/_/g) || []).length >= 4) return true
  if (/\bmatrix\s*\(/i.test(t)) return true
  return false
}

function convertMatrixLiterals(s) {
  return s.replace(/\[\s*\[([^\]]+)\]\s*\]/g, (_, body) => {
    const rows = body.split(/\]\s*,\s*\[|\]\s*\[/)
    if (rows.length === 0) rows.push(body)
    const parsed = rows.map((row) =>
      row
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((c) => c.trim()),
    )
    if (parsed.some((r) => r.length === 0)) return `[[${body}]]`
    const tex = parsed.map((r) => r.join(' & ')).join(' \\\\ ')
    return `\\begin{pmatrix}${tex}\\end{pmatrix}`
  })
}

function convertAsciiOperators(s) {
  let out = s
  out = out.replace(/\biiint\s*_\s*\{([^}]*)\}\s*\^?\s*\{?([^}\s]*)?\}?/gi, (_, a, b) =>
    b ? `\\iiint_{${a}}^{${b}}` : `\\iiint_{${a}}`,
  )
  out = out.replace(/\biiint\s*_\s*\(([^)]*)\)\s*\^?\s*\(?([^)\s]*)?\)?/gi, (_, a, b) =>
    b ? `\\iiint_{${a}}^{${b}}` : `\\iiint_{${a}}`,
  )
  out = out.replace(/\biint\s*_\s*\{([^}]*)\}\s*\^?\s*\{?([^}\s]*)?\}?/gi, (_, a, b) =>
    b ? `\\iint_{${a}}^{${b}}` : `\\iint_{${a}}`,
  )
  out = out.replace(/\biint\s*_\s*\(([^)]*)\)\s*\^?\s*\(?([^)\s]*)?\)?/gi, (_, a, b) =>
    b ? `\\iint_{${a}}^{${b}}` : `\\iint_{${a}}`,
  )
  out = out.replace(/\boint\s*_\s*\{([^}]*)\}/gi, (_, a) => `\\oint_{${a}}`)
  out = out.replace(/\boint\s*_\s*\(([^)]*)\)/gi, (_, a) => `\\oint_{${a}}`)
  out = out.replace(/\boint\b/gi, '\\oint')

  const bigOps = ['sum', 'prod', 'int']
  for (const op of bigOps) {
    out = out.replace(
      new RegExp(`\\b${op}\\s*_\\s*\\{([^}]*)\\}\\s*\\^\\s*\\{([^}]*)\\}`, 'gi'),
      (_, sub, sup) => `\\${op}_{${sub}}^{${sup}}`,
    )
    out = out.replace(
      new RegExp(`\\b${op}\\s*_\\s*\\(([^)]*)\\)\\s*\\^\\s*\\(([^)]*)\\)`, 'gi'),
      (_, sub, sup) => `\\${op}_{${sub}}^{${sup}}`,
    )
    out = out.replace(
      new RegExp(`\\b${op}\\s*_\\s*\\(([^)]*)\\)\\s*\\^\\s*([A-Za-z0-9+-]+)`, 'gi'),
      (_, sub, sup) => `\\${op}_{${sub}}^{${sup}}`,
    )
    out = out.replace(
      new RegExp(`\\b${op}\\s*_\\s*([A-Za-z0-9+-]+)\\s*\\^\\s*([A-Za-z0-9+-]+)`, 'gi'),
      (_, sub, sup) => `\\${op}_{${sub}}^{${sup}}`,
    )
    out = out.replace(new RegExp(`\\b${op}\\s*_\\s*\\{([^}]*)\\}`, 'gi'), (_, sub) => `\\${op}_{${sub}}`)
    out = out.replace(new RegExp(`\\b${op}\\s*_\\s*\\(([^)]*)\\)`, 'gi'), (_, sub) => `\\${op}_{${sub}}`)
    out = out.replace(new RegExp(`\\b${op}\\s*_\\s*([A-Za-z0-9+-]+)`, 'gi'), (_, sub) => `\\${op}_{${sub}}`)
  }

  out = out.replace(/\blim\s*_\s*\{([^}]*)\}/gi, (_, x) => `\\lim_{${x}}`)
  out = out.replace(/\blim\s*_\s*\(([^)]*)\)/gi, (_, x) => `\\lim_{${x}}`)
  out = out.replace(/\blim\s*_\s*\{?\s*([a-zA-Z0-9+\-]+)\s*\}?/gi, (_, x) => `\\lim_{${x}}`)
  out = out.replace(/\blim\s*\+\s*/gi, '\\lim_{+}')
  out = out.replace(/\blim\s*-\s*/gi, '\\lim_{-}')

  return out
}

function convertCalculus(s) {
  let out = s
  out = out.replace(
    /\bpartial\s+([A-Za-z][A-Za-z0-9]*)\s*\/\s*partial\s+([A-Za-z])(\^(\d+))?/gi,
    (_, f, v, __, pow) =>
      pow ? `\\frac{\\partial^{${pow}} ${f}}{\\partial ${v}^{${pow}}}` : `\\frac{\\partial ${f}}{\\partial ${v}}`,
  )
  out = out.replace(
    /\bd\^(\d+)\s*\/\s*d([a-zA-Z])\^(\d+)/gi,
    (_, n, v, m) => `\\frac{d^{${n}}}{d${v}^{${m}}}`,
  )
  out = out.replace(/\bd\^(\d+)\s*\/\s*d([a-zA-Z])/gi, (_, n, v) => `\\frac{d^{${n}}}{d${v}^{${n}}}`)
  out = out.replace(/\bd\s*\/\s*d([a-zA-Z])/gi, (_, v) => `\\frac{d}{d${v}}`)
  out = out.replace(/\bnabla\s*\^\s*2/gi, '\\nabla^2')
  out = out.replace(/\bgrad\s+([A-Za-z][A-Za-z0-9]*)/gi, (_, f) => `\\nabla ${f}`)
  out = out.replace(/\bgrad\b/gi, '\\nabla')
  out = out.replace(/\bdiv\s+\\?mathbf\{?([A-Za-z])\}?\b/gi, (_, v) => `\\nabla \\cdot \\mathbf{${v}}`)
  out = out.replace(/\bdiv\s+([A-Za-z][A-Za-z0-9]*)/gi, (_, v) => `\\nabla \\cdot \\mathbf{${v}}`)
  out = out.replace(/\bcurl\s+\\?mathbf\{?([A-Za-z])\}?\b/gi, (_, v) => `\\nabla \\times \\mathbf{${v}}`)
  out = out.replace(/\bcurl\s+([A-Za-z][A-Za-z0-9]*)/gi, (_, v) => `\\nabla \\times \\mathbf{${v}}`)
  return out
}

function convertFunctions(s) {
  let out = s
  out = out.replace(/\bcbrt\s*\(([^)]+)\)/gi, '\\sqrt[3]{$1}')
  out = out.replace(/\bsqrt\s*\[(\d+)\]\s*\{([^}]+)\}/gi, '\\sqrt[$1]{$2}')
  out = out.replace(/\bsqrt\s*\[(\d+)\]\s*\(([^)]+)\)/gi, '\\sqrt[$1]{$2}')
  out = out.replace(/\bsqrt\s*\(([^)]+)\)/gi, '\\sqrt{$1}')
  out = out.replace(/\bsqrt\s*\{([^}]+)\}/gi, '\\sqrt{$1}')
  out = out.replace(/\bbinom\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, '\\binom{$1}{$2}')
  out = out.replace(/\bchoose\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, '\\binom{$1}{$2}')
  out = out.replace(/\bC\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, '\\binom{$1}{$2}')
  out = out.replace(/\bdet\s*\(([^)]+)\)/gi, '\\det\\left($1\\right)')
  out = out.replace(/\btr\s*\(([^)]+)\)/gi, '\\operatorname{tr}\\left($1\\right)')
  out = out.replace(/\btrace\s*\(([^)]+)\)/gi, '\\operatorname{tr}\\left($1\\right)')
  out = out.replace(/\bhat\s*\{([^}]+)\}/gi, '\\hat{$1}')
  out = out.replace(/\bhat\s*\(([^)]+)\)/gi, '\\hat{$1}')
  out = out.replace(/\bhat\s*([A-Za-z])/gi, '\\hat{$1}')
  out = out.replace(/\bvec\s*\{([^}]+)\}/gi, '\\vec{$1}')
  out = out.replace(/\bvec\s*\(([^)]+)\)/gi, '\\vec{$1}')
  out = out.replace(/\bvec\s*([A-Za-z])/gi, '\\vec{$1}')
  out = out.replace(/\|\|([^|]+)\|\|/g, '\\left\\|$1\\right\\|')
  return out
}

function convertTransforms(s) {
  let out = s
  out = out.replace(/\bFourier\s*\{?\s*([^}]*)\}?\s*\(([^)]+)\)/gi, '\\mathcal{F}\\{$1\\}\\left($2\\right)')
  out = out.replace(/\bFourier\s*\(([^)]+)\)/gi, '\\mathcal{F}\\left\\{$1\\right\\}')
  out = out.replace(/\bLaplace\s*\{?\s*([^}]*)\}?\s*\(([^)]+)\)/gi, '\\mathcal{L}\\{$1\\}\\left($2\\right)')
  out = out.replace(/\bLaplace\s*\(([^)]+)\)/gi, '\\mathcal{L}\\left\\{$1\\right\\}')
  out = out.replace(/\bZ-transform\s*\(([^)]+)\)/gi, '\\mathcal{Z}\\left\\{$1\\right\\}')
  out = out.replace(/\bfourier\b/gi, '\\mathcal{F}')
  out = out.replace(/\blaplace\b/gi, '\\mathcal{L}')
  return out
}

function convertStatistics(s) {
  let out = s
  out = out.replace(/\bE\s*\[\s*([^\]]+)\s*\]/g, '\\mathbb{E}\\left[$1\\right]')
  out = out.replace(/\bVar\s*\(\s*([^)]+)\s*\)/gi, '\\operatorname{Var}\\left($1\\right)')
  out = out.replace(/\bCov\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, '\\operatorname{Cov}\\left($1,$2\\right)')
  out = out.replace(/\bP\s*\(\s*([^)]+)\s*\)/g, '\\mathbb{P}\\left($1\\right)')
  out = out.replace(/\bPr\s*\(\s*([^)]+)\s*\)/gi, '\\mathbb{P}\\left($1\\right)')
  return out
}

function convertPiecewise(s) {
  return s.replace(
    /\{\s*([^;]+?)\s*,\s*([^;]+?)(?:\s*;\s*([^}]+))?\s*\}/g,
    (m, expr1, cond1, rest) => {
      if (!/[<>=]|if\b|when\b|otherwise/i.test(cond1 + (rest || ''))) return m
      const rows = [`${expr1} & \\text{${cond1.trim()}} `]
      if (rest) {
        const parts = rest.split(/\s*;\s*/)
        for (const p of parts) {
          const cm = /^\s*(.+?)\s*,\s*(.+)\s*$/.exec(p)
          if (cm) rows.push(`${cm[1].trim()} & \\text{${cm[2].trim()}} `)
        }
      }
      return `\\begin{cases}${rows.join(' \\\\ ')}\\end{cases}`
    },
  )
}

function convertSubSup(s) {
  let out = s
  const greekNames = [...new Set(Object.keys(GREEK_LATEX))].sort((a, b) => b.length - a.length)
  for (const name of greekNames) {
    const tok = GREEK_LATEX[name]
    out = out.replace(new RegExp(`(?<!\\\\)\\b${name}\\b`, 'gi'), tok)
  }
  out = out.replace(/(?<!\\)\b(infty|infinity)\b/gi, '\\infty')
  out = out.replace(/(?<!\\)\bpartial\b/gi, '\\partial')
  out = out.replace(/(?<!\\)\bnabla\b/gi, '\\nabla')

  out = out.replace(/([A-Za-z0-9)\]])_([A-Za-z0-9]+)(?!})/g, (_, b, sub) =>
    sub.length === 1 && !sub.includes(',') ? `${b}_${sub}` : `${b}_{${sub}}`,
  )
  out = out.replace(/([A-Za-z0-9)\]])\^([A-Za-z0-9+-]+)(?!})/g, (_, b, exp) => {
    if (exp.startsWith('{')) return `${b}^${exp}`
    const g = GREEK_LATEX[exp.toLowerCase()]
    if (g) return `${b}^{${g}}`
    if (exp.length === 1) return `${b}^${exp}`
    return `${b}^{${exp}}`
  })

  out = out.replace(/\^\{([a-z]{2,12})\}/gi, (m, w) => {
    const g = GREEK_LATEX[w.toLowerCase()]
    return g ? `^{${g}}` : m
  })

  return out
}

function convertOperators(s) {
  return s
    .replace(/<=>/g, '\\Leftrightarrow')
    .replace(/->/g, '\\rightarrow')
    .replace(/<-/g, '\\leftarrow')
    .replace(/=>/g, '\\Rightarrow')
    .replace(/<=/g, '\\leq')
    .replace(/>=/g, '\\geq')
    .replace(/!=/g, '\\neq')
    .replace(/~=|~~/g, '\\approx')
    .replace(/(?<!\\)\*(?!\*)/g, ' \\cdot ')
}

function convertFractions(s) {
  let out = s
  out = out.replace(/\b(\d+)\s*\/\s*(\d+)\b/g, '\\frac{$1}{$2}')
  out = out.replace(/\b([A-Za-z])\s*\/\s*([A-Za-z])\b/g, '\\frac{$1}{$2}')
  out = out.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, '\\frac{$1}{$2}')
  return out
}

function convertAlignLines(s) {
  if (!/=&|\\\\/.test(s) && (s.match(/=/g) || []).length < 2) return s
  const lines = s.split(/\s*\\\\\s*|\n/).filter((l) => l.trim())
  if (lines.length < 2) return s
  if (!lines.every((l) => /=|&/.test(l))) return s
  const body = lines.map((l) => l.trim().replace(/&=/g, '&=')).join(' \\\\ ')
  return `\\begin{aligned}${body}\\end{aligned}`
}

/**
 * Full LaTeX normalization pipeline for KaTeX rendering.
 */
export function normalizeLatexForKatex(input) {
  let s = repairMalformedLatex(String(input).trim())
  if (!s) return s

  const dm = s.match(/^\$\$([\s\S]*)\$\$$/)
  if (dm) s = dm[1].trim()
  else if (/^\$([^$]+)\$$/.test(s)) s = RegExp.$1.trim()
  else if (/^\\\(([\s\S]*)\\\)$/.test(s)) s = RegExp.$1.trim()
  else if (/^\\\[([\s\S]*)\\\]$/.test(s)) s = RegExp.$1.trim()

  for (const [uch, tex] of Object.entries(UNICODE_TO_LATEX)) {
    const esc = uch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    s = s.replace(new RegExp(esc, 'g'), tex)
  }

  s = convertMatrixLiterals(s)
  s = convertAsciiOperators(s)
  s = convertCalculus(s)
  s = convertFunctions(s)
  s = convertTransforms(s)
  s = convertStatistics(s)
  s = convertPiecewise(s)
  s = convertOperators(s)
  s = convertSubSup(s)
  s = convertFractions(s)
  s = convertAlignLines(s)

  s = s.replace(/K\^a\b/gi, 'K^{\\alpha}')
  s = s.replace(/L\^1\s*-\s*a\b/gi, 'L^{1-\\alpha}')
  s = s.replace(/L\^1-a\b/gi, 'L^{1-\\alpha}')

  s = s.replace(/\s+/g, ' ').trim()
  return s
}

/** Wrap detected inline math in \\(...\\) for KaTeX auto-render. */
export function wrapInlineMathDelimiters(text) {
  if (!text || /\$|\\\(|\\\[/.test(text)) return text
  let s = text

  s = s.replace(
    /\b(d(?:\^[0-9]+)?\s*\/\s*d[a-zA-Z]+)\s*(\([^)]+\))/gi,
    (_, deriv, parens) => `\\(${deriv}${parens}\\)`,
  )
  s = s.replace(
    /\b(partial\s+[A-Za-z][A-Za-z0-9]*\s*\/\s*partial\s+[a-zA-Z](?:\^[0-9]+)?)\b/gi,
    (m) => `\\(${m}\\)`,
  )
  s = s.replace(
    /\b((?:iiint|iint|oint|int|sum|prod)\s*(?:_\{[^}]+\}|_\([^)]+\)|_[A-Za-z0-9]+)?(?:\^\{[^}]+\}|\^[A-Za-z0-9]+)?\s*(?:\\frac\{[^}]+\}\{[^}]+\}|[A-Za-z0-9^_().+\-*/ ]{2,50}))/gi,
    (m) => {
      const t = m.trim()
      if (t.length > 90 || /\b(the|and|for|with|that|this|from|have)\b/i.test(t)) return m
      return `\\(${t}\\)`
    },
  )

  return s
}
