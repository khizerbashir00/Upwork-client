/**
 * Academic Unicode mathematical typography engine.
 * Converts ASCII/LaTeX-like math into Mathematical Alphanumeric Symbols,
 * subscripts, superscripts, and standard math operators.
 */

const MINUS = '\u2212'
const INFINITY = '\u221E'

const ITALIC_CAP = Object.fromEntries(
  [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c, i) => [c, String.fromCodePoint(0x1d434 + i)]),
)
const ITALIC_SMALL = Object.fromEntries(
  [...'abcdefghijklmnopqrstuvwxyz'].map((c, i) => [c, String.fromCodePoint(0x1d44e + i)]),
)

const MATH_GREEK = {
  alpha: '\u{1D6FC}',
  beta: '\u{1D6FD}',
  gamma: '\u{1D6FE}',
  delta: '\u{1D6FF}',
  epsilon: '\u{1D700}',
  zeta: '\u{1D701}',
  eta: '\u{1D702}',
  theta: '\u{1D703}',
  iota: '\u{1D704}',
  kappa: '\u{1D705}',
  lambda: '\u{1D706}',
  mu: '\u{1D707}',
  nu: '\u{1D708}',
  xi: '\u{1D709}',
  omicron: '\u{1D70A}',
  pi: '\u{1D70B}',
  rho: '\u{1D70C}',
  sigma: '\u{1D70E}',
  tau: '\u{1D70F}',
  upsilon: '\u{1D710}',
  phi: '\u{1D711}',
  chi: '\u{1D712}',
  psi: '\u{1D713}',
  omega: '\u{1D714}',
  varepsilon: '\u{1D700}',
  vartheta: '\u{1D703}',
  varphi: '\u{1D711}',
  varpi: '\u{1D70B}',
  varsigma: '\u{1D70C}',
  partial: '\u{1D715}',
  nabla: '\u{1D6FB}',
  infty: INFINITY,
  infinity: INFINITY,
}

const GREEK_NAMES = Object.keys(MATH_GREEK).sort((a, b) => b.length - a.length)

const SUP = {
  '0': '\u2070',
  '1': '\u00B9',
  '2': '\u00B2',
  '3': '\u00B3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
  '+': '\u207A',
  '-': '\u207B',
  '=': '\u207C',
  '(': '\u207D',
  ')': '\u207E',
  n: '\u207F',
  i: '\u2071',
  a: '\u1D43',
  b: '\u1D47',
  c: '\u1D9C',
  d: '\u1D48',
  e: '\u1D49',
  f: '\u1DA0',
  g: '\u1D4D',
  h: '\u02B0',
  j: '\u02B2',
  k: '\u1D4F',
  l: '\u02E1',
  m: '\u1D50',
  o: '\u1D52',
  p: '\u1D56',
  r: '\u02B3',
  s: '\u02E2',
  t: '\u1D57',
  u: '\u1D58',
  v: '\u1D5B',
  w: '\u02B7',
  x: '\u02E3',
  y: '\u02B8',
  z: '\u1DBB',
  A: '\u1D2C',
  B: '\u1D2E',
  D: '\u1D30',
  E: '\u1D31',
  G: '\u1D33',
  H: '\u1D34',
  I: '\u1D35',
  J: '\u1D36',
  K: '\u1D37',
  L: '\u1D38',
  M: '\u1D39',
  N: '\u1D3A',
  O: '\u1D3C',
  P: '\u1D3E',
  R: '\u1D3F',
  T: '\u1D40',
  U: '\u1D41',
  V: '\u1D42',
  W: '\u1D43',
  X: '\u1D43',
  Y: '\u1D43',
  Z: '\u1D43',
  infinity: INFINITY,
  infty: INFINITY,
}

const SUB = {
  '0': '\u2080',
  '1': '\u2081',
  '2': '\u2082',
  '3': '\u2083',
  '4': '\u2084',
  '5': '\u2085',
  '6': '\u2086',
  '7': '\u2087',
  '8': '\u2088',
  '9': '\u2089',
  '+': '\u208A',
  '-': '\u208B',
  '=': '\u208C',
  '(': '\u208D',
  ')': '\u208E',
  a: '\u2090',
  e: '\u2091',
  o: '\u2092',
  x: '\u2093',
  h: '\u2095',
  k: '\u2096',
  l: '\u2097',
  m: '\u2098',
  n: '\u2099',
  p: '\u209A',
  s: '\u209B',
  t: '\u209C',
  i: '\u1D62',
  j: '\u2C7C',
  r: '\u1D63',
  u: '\u1D64',
  v: '\u1D65',
  b: '\u1D47',
  c: '\u1D9C',
  d: '\u1D48',
  f: '\u1DA0',
  g: '\u1D4D',
  w: '\u02B7',
  y: '\u02B8',
  z: '\u1DBB',
}

const OPERATORS = [
  ['<=>', '\u21D4'],
  ['===', '='],
  ['!==', '\u2260'],
  ['<->', '\u2194'],
  ['<=', '\u2264'],
  ['>=', '\u2265'],
  ['==', '='],
  ['!=', '\u2260'],
  ['&&', '\u2227'],
  ['||', '\u2228'],
  ['=>', '\u21D2'],
  ['->', '\u2192'],
  ['<-', '\u2190'],
  ['+-', '\u00B1'],
  ['~=', '\u2248'],
  ['~~', '\u2248'],
]

const MATH_KEYWORDS = [
  ['infinity', INFINITY],
  ['infty', INFINITY],
  ['sqrt', '\u221A'],
  ['cbrt', '\u221B'],
  ['sum', '\u2211'],
  ['prod', '\u220F'],
  ['iiint', '\u222D'],
  ['iint', '\u222C'],
  ['int', '\u222B'],
  ['oint', '\u222E'],
  ['partial', '\u2202'],
  ['nabla', '\u2207'],
  ['grad', '\u2207'],
  ['therefore', '\u2234'],
  ['because', '\u2235'],
  ['approx', '\u2248'],
  ['propto', '\u221D'],
  ['neq', '\u2260'],
  ['leq', '\u2264'],
  ['geq', '\u2265'],
  ['pm', '\u00B1'],
  ['mp', '\u2213'],
  ['times', '\u00D7'],
  ['div', '\u00F7'],
  ['cdot', '\u00B7'],
  ['deg', '\u00B0'],
  ['inf', INFINITY],
  ['lim', 'lim'],
  ['log', 'log'],
  ['ln', 'ln'],
  ['exp', 'exp'],
  ['sin', 'sin'],
  ['cos', 'cos'],
  ['tan', 'tan'],
  ['min', 'min'],
  ['max', 'max'],
  ['det', 'det'],
  ['arg', 'arg'],
  ['trace', 'tr'],
  ['tr', 'tr'],
  ['Re', 'Re'],
  ['Im', 'Im'],
  ['Pr', '\u2119'],
  ['prob', '\u2119'],
  ['Cov', 'Cov'],
  ['Var', 'Var'],
  ['rank', 'rank'],
  ['dim', 'dim'],
  ['ker', 'ker'],
  ['gcd', 'gcd'],
  ['lcm', 'lcm'],
  ['mod', 'mod'],
  ['sinh', 'sinh'],
  ['cosh', 'cosh'],
  ['tanh', 'tanh'],
  ['arcsin', 'arcsin'],
  ['arccos', 'arccos'],
  ['arctan', 'arctan'],
  ['csc', 'csc'],
  ['sec', 'sec'],
  ['cot', 'cot'],
]

const PROSE_WORDS = new Set(
  'the and for with that this from have been were will would could should about into over after before between under above through during without within across toward towards because however therefore whereas while where when which what their there these those than then also only other such each more most some very much many well just like even still already'.split(
    ' ',
  ),
)

function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toSuperscript(inner) {
  let s = replaceGreekNames(String(inner).trim())
  s = s.replace(/\b(infty|infinity)\b/gi, INFINITY)
  let out = ''
  for (const ch of s) {
    if (SUP[ch]) out += SUP[ch]
    else if (ch === '-' || ch === '\u2212') out += SUP['-']
    else if (ch === ' ') out += ' '
    else out += ch
  }
  return out
}

function toSubscript(inner) {
  let s = replaceGreekNames(String(inner).trim())
  let out = ''
  for (const ch of s) {
    if (SUB[ch]) out += SUB[ch]
    else if (ch === '-' || ch === '\u2212') out += SUB['-']
    else if (ch === '=') out += SUB['=']
    else if (ch === ' ') out += ' '
    else out += ch
  }
  return out
}

function replaceGreekNames(s) {
  let out = s
  for (const name of GREEK_NAMES) {
    const re = new RegExp(`\\b${escRegex(name)}\\b`, 'gi')
    out = out.replace(re, (m) => {
      const g = MATH_GREEK[name]
      return g || m
    })
  }
  return out
}

function replaceOperators(s) {
  let out = s
  const sorted = [...OPERATORS].sort((a, b) => b[0].length - a[0].length)
  for (const [from, to] of sorted) {
    out = out.replace(new RegExp(escRegex(from), 'g'), to)
  }
  out = out.replace(/(\w|\)|\])\s*\*\s*(\w|\(|\[|-)/g, (m, a, b) => `${a} \u00D7 ${b}`)
  out = out.replace(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/g, (m, a, b) => `${a} \u00F7 ${b}`)
  return out
}

function replaceMathKeywords(s) {
  let out = s
  const sorted = [...MATH_KEYWORDS].sort((a, b) => b[0].length - a[0].length)
  for (const [from, to] of sorted) {
    out = out.replace(new RegExp(`\\b${escRegex(from)}\\b`, 'gi'), to)
  }
  return out
}

function replaceSqrt(s) {
  return s.replace(/sqrt\s*\(([^)]+)\)/gi, (_, inner) => {
    return '\u221A' + transformMathSegment(inner.trim(), { equation: true })
  })
}

function replaceBigOperators(s) {
  let out = s
  const ops = [
    ['sum', '\u2211'],
    ['prod', '\u220F'],
    ['iiint', '\u222D'],
    ['iint', '\u222C'],
    ['int', '\u222B'],
    ['oint', '\u222E'],
  ]
  for (const [name, sym] of ops) {
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*\\{([^}]*)\\}\\s*\\^\\s*\\{([^}]*)\\}`, 'gi'),
      (_, sub, sup) => `${sym}${toSubscript(sub)}${toSuperscript(sup)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*\\(([^)]*)\\)\\s*\\^\\s*\\(([^)]*)\\)`, 'gi'),
      (_, sub, sup) => `${sym}${toSubscript(sub)}${toSuperscript(sup)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*\\(([^)]*)\\)\\s*\\^\\s*([A-Za-z0-9+-]+)`, 'gi'),
      (_, sub, sup) => `${sym}${toSubscript(sub)}${toSuperscript(sup)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*([A-Za-z0-9+-]+)\\s*\\^\\s*([A-Za-z0-9+-]+)`, 'gi'),
      (_, sub, sup) => `${sym}${toSubscript(sub)}${toSuperscript(sup)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*\\{([^}]*)\\}`, 'gi'),
      (_, sub) => `${sym}${toSubscript(sub)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*\\(([^)]*)\\)`, 'gi'),
      (_, sub) => `${sym}${toSubscript(sub)}`,
    )
    out = out.replace(
      new RegExp(`\\b${name}\\s*_\\s*([A-Za-z0-9+-]+)`, 'gi'),
      (_, sub) => `${sym}${toSubscript(sub)}`,
    )
  }
  out = out.replace(/\blim\s*_\s*\{([^}]*)\}/gi, (_, sub) => `lim${toSubscript(sub)}`)
  out = out.replace(/\blim\s*_\s*\(([^)]*)\)/gi, (_, sub) => `lim${toSubscript(sub)}`)
  out = out.replace(/\blim\s*_\s*([A-Za-z0-9+-]+)/gi, (_, sub) => `lim${toSubscript(sub)}`)
  return out
}

const SCRIPT_BASE =
  '(?:[A-Za-z0-9)\\]\\u221E]+|[\\u03B1-\\u03C9]+|[\\u{1D434}-\\u{1D467}]+|[\\u{1D6FC}-\\u{1D714}]+)'

function replaceScripts(s) {
  let out = s
  let prev = null
  let guard = 0
  while (out !== prev && guard < 12) {
    prev = out
    guard++
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*\\^\\s*\\(([^()]+)\\)`, 'gu'),
      (m, base, exp) => {
        if (exp.includes('(')) return m
        const inner = replaceGreekNames(exp).replace(/-/g, MINUS)
        const canFullSup =
          inner.length <= 4 &&
          [...inner].every((c) => SUP[c] || c === MINUS || /\d/.test(c))
        if (canFullSup) return base + toSuperscript(exp)
        return `${base}^(${inner})`
      },
    )
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*_\\s*\\(([^()]+)\\)`, 'gu'),
      (m, base, sub) => {
        if (sub.includes('(')) return m
        return base + toSubscript(sub)
      },
    )
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*\\^\\s*\\{([^}]+)\\}`, 'gu'),
      (m, base, exp) => base + toSuperscript(exp),
    )
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*_\\s*\\{([^}]+)\\}`, 'gu'),
      (m, base, sub) => base + toSubscript(sub),
    )
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*\\^\\s*([A-Za-z0-9+\\u2212-]+)`, 'gu'),
      (m, base, exp) => {
        const chars = exp.split('')
        if (!chars.every((c) => SUP[c] || c === '-' || c === '\u2212')) return m
        return base + chars.map((c) => (c === '-' || c === '\u2212' ? SUP['-'] : SUP[c])).join('')
      },
    )
    out = out.replace(
      new RegExp(`(${SCRIPT_BASE})\\s*_\\s*([A-Za-z0-9+\\u2212=]+)`, 'gu'),
      (m, base, sub) => {
        const chars = sub.split('')
        if (!chars.every((c) => SUB[c] || c === '-' || c === '\u2212' || c === '=')) return m
        return base + chars.map((c) => (c === '-' || c === '\u2212' ? SUB['-'] : c === '=' ? SUB['='] : SUB[c])).join('')
      },
    )
  }
  return out
}

function italicizeLetter(ch) {
  if (ITALIC_CAP[ch]) return ITALIC_CAP[ch]
  if (ITALIC_SMALL[ch]) return ITALIC_SMALL[ch]
  return ch
}

const MATH_FUNCS = new Set([
  'sin',
  'cos',
  'tan',
  'log',
  'ln',
  'exp',
  'lim',
  'min',
  'max',
  'det',
  'arg',
  'inf',
  'infty',
  'infinity',
])

function italicizeVariables(s, aggressive) {
  return s.replace(/\b([A-Za-z]+)\b/g, (word) => {
    const lower = word.toLowerCase()
    if (MATH_GREEK[lower]) return MATH_GREEK[lower]
    if (!aggressive) {
      if (PROSE_WORDS.has(lower)) return word
      if (MATH_FUNCS.has(lower)) return word
      if (word.length > 1) return word
      if (/[A-Z]/.test(word) && word !== 'I' && !/(^|[=+\-*/^_\s(\[{,;])/.test(s)) return word
    }
    if (word.length === 1) return italicizeLetter(word)
    if (aggressive && word.length <= 4 && /^[A-Za-z][A-Za-z0-9]*$/.test(word)) {
      return [...word].map((c) => italicizeLetter(c)).join('')
    }
    return word
  })
}

function replaceCalculusNotation(s) {
  let out = s
  out = out.replace(/\bgrad\s+([A-Za-z][A-Za-z0-9]*)/gi, (_, f) => '\u2207' + [...f].map((c) => italicizeLetter(c)).join(''))
  out = out.replace(/\bgrad\b/gi, '\u2207')
  out = out.replace(/\bcurl\s+([A-Za-z])\b/gi, (_, v) => '\u2207 \u00D7 ' + italicizeLetter(v))
  out = out.replace(/\bdiv\s+([A-Za-z])\b/gi, (_, v) => '\u2207 \u00B7 ' + italicizeLetter(v))
  out = out.replace(
    /\bpartial\s+([A-Za-z][A-Za-z0-9]*)\s*\/\s*partial\s+([A-Za-z])(\^(\d+))?/gi,
    (_, f, v, __, pow) => {
      const p = '\u2202'
      const ff = [...f].map((c) => italicizeLetter(c)).join('')
      const vv = italicizeLetter(v)
      if (pow) return `${p}${ff} / ${p}${vv}${toSuperscript(pow)}`
      return `${p}${ff} / ${p}${vv}`
    },
  )
  out = out.replace(
    /\bd\^(\d+)\s*\/\s*d([a-zA-Z])\^(\d+)/gi,
    (_, n, v, m) => {
      const d = italicizeLetter('d')
      return `${d}${toSuperscript(n)}/${d}${italicizeLetter(v)}${toSuperscript(m)}`
    },
  )
  out = out.replace(/\bd\^(\d+)\s*\/\s*d([a-zA-Z])/gi, (_, n, v) => {
    const d = italicizeLetter('d')
    return `${d}${toSuperscript(n)}/${d}${italicizeLetter(v)}${toSuperscript(n)}`
  })
  out = out.replace(/\bd\s*\/\s*d([a-zA-Z])/gi, (_, v) => {
    const d = italicizeLetter('d')
    return `${d}/${d}${italicizeLetter(v)}`
  })
  out = out.replace(/\bd([A-Za-z]{1,4})\b/g, (m, v) => {
    if (/^(dx|dy|dz|dt|du|dv)$/i.test(m)) {
      const d = italicizeLetter('d')
      const vv = [...v].map((c) => italicizeLetter(c)).join('')
      return d + vv
    }
    return m
  })
  return out
}

function replaceDerivatives(s) {
  return replaceCalculusNotation(s)
}

function replaceStatisticsUnicode(s) {
  return s
    .replace(/\bE\s*\[\s*([^\]]+)\s*\]/g, (_, x) => '\u2112[' + x.trim() + ']')
    .replace(/\bVar\s*\(\s*([^)]+)\s*\)/gi, 'Var($1)')
    .replace(/\bCov\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, 'Cov($1, $2)')
    .replace(/\bP\s*\(\s*([^)]+)\s*\)/g, '\u2119($1)')
    .replace(/\bPr\s*\(\s*([^)]+)\s*\)/gi, '\u2119($1)')
}

function replaceComplexNumbers(s) {
  return s
    .replace(/\bRe\s*\(\s*([^)]+)\s*\)/gi, 'Re($1)')
    .replace(/\bIm\s*\(\s*([^)]+)\s*\)/gi, 'Im($1)')
    .replace(/\bi\b(?=\s*[=+\-*/])/g, '\u2148')
}

function replaceScientificNotation(s) {
  return s.replace(/\b(\d+(?:\.\d+)?)\s*[eE]\s*([+-]?\d+)\b/g, (_, mant, exp) => {
    const sup = toSuperscript(exp.replace(/^\+/, ''))
    return mant + '\u00D710' + sup
  })
}

function normalizeSpacing(s) {
  return s
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*([=+\u2212\u00D7\u00F7\u2264\u2265\u2260])\s*/g, ' $1 ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s+|\s+$/gm, '')
}

function italicizeSubSuperBases(s) {
  return s
    .replace(/([A-Za-z])([\u2080-\u209C\u1D62-\u1D65\u2C7C]+)/g, (_, c, sub) => italicizeLetter(c) + sub)
    .replace(/([A-Za-z])([\u2070-\u207F\u00B2\u00B3\u2074-\u2079\u02B0-\u02E3\u1D2C-\u1D43\u1D57-\u1D5B\u1D9C\u1DA0\u1DBB]+)/g, (_, c, sup) =>
      italicizeLetter(c) + sup,
    )
}

function transformMathSegment(segment, options = {}) {
  const aggressive = options.equation === true
  let s = segment
  s = replaceOperators(s)
  s = replaceMathKeywords(s)
  s = replaceGreekNames(s)
  s = replaceSqrt(s)
  s = replaceBigOperators(s)
  s = replaceScripts(s)
  s = italicizeVariables(s, aggressive)
  s = italicizeSubSuperBases(s)
  s = replaceDerivatives(s)
  s = replaceStatisticsUnicode(s)
  s = replaceComplexNumbers(s)
  s = replaceScientificNotation(s)
  s = s.replace(/(\d+)\s*\^\s*([A-Za-z]+)\b/g, (m, n, w) => {
    const g = MATH_GREEK[w.toLowerCase()]
    return g ? n + '^' + g : m
  })
  s = s.replace(/([A-Za-z\u{1D434}-\u{1D467}\u{1D6FC}-\u{1D714}]+)\s*\^\s*([\u{1D6FC}-\u{1D714}])/gu, '$1^$2')
  s = s.replace(/([\u222B\u2211\u220F\u222E])([\u2080-\u2099\u208A-\u208E]+)\^([\u221E\u2070-\u2079⁰-⁹]+)/g, '$1$2$3')
  s = s.replace(/-/g, MINUS)
  if (aggressive) {
    s = s.replace(
      /([\u{1D434}-\u{1D467}])((?:[\u2080-\u209C\u1D62-\u1D65\u2C7C]+)?)\s+(?=[\u{1D434}-\u{1D467}])/gu,
      '$1$2',
    )
  }
  return s
}

export function isMathHeavyLine(line) {
  const t = line.trim()
  if (!t) return false
  if (/^\$\$[\s\S]*\$\$$/.test(t)) return true
  if (/^\\\(|^\\\[/.test(t)) return true
  if (/\\begin\{/.test(t)) return true
  if (/\^|_/.test(t) && /[A-Za-z]/.test(t)) return true
  if (/\b(sum|int|iint|iiint|oint|prod|lim|sqrt|partial|nabla|grad|curl|div|det|binom)\b/i.test(t))
    return true
  if (/\b(alpha|beta|gamma|theta|lambda|sigma|omega|delta|phi)\b/i.test(t)) return true
  if (/\bd\s*\/\s*d[a-z]/i.test(t)) return true
  if (/\bpartial\s+[a-z]/i.test(t)) return true
  if (/\[\[/.test(t)) return true
  if (/\|\|[^|]+\|\|/.test(t)) return true
  if (/\bE\s*\[|\bP\s*\(|\bVar\s*\(/i.test(t)) return true
  if (/[A-Za-z]\s*=\s*[^=]/.test(t) && t.length < 200) return true
  if (/[A-Za-z]_[A-Za-z0-9]/.test(t)) return true
  if (/[A-Za-z]\^[0-9(]/.test(t)) return true
  return false
}

export function isComplexLatex(s) {
  const t = String(s).trim()
  if (/\\begin\{/.test(t)) return true
  if (/\\frac\{/.test(t) && !/^\d+\s*\/\s*\d+$/.test(t)) return true
  if (/\\left|\\right|\\overset|\\underset|\\stackrel/.test(t)) return true
  if (/\\matrix|\\pmatrix|\\bmatrix|\\aligned/.test(t)) return true
  return false
}

/**
 * Apply full academic Unicode math typography to raw text.
 */
export function applyMathTypography(raw, options = {}) {
  if (!raw) return ''
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out = lines.map((line) => {
    if (!line.trim()) return line
    if (line.trim().startsWith('```')) return line
    const mathLine = options.equation === true || isMathHeavyLine(line)
    if (!mathLine) {
      if (
        !/\b[A-Za-z]_[A-Za-z0-9]|\b[A-Za-z]\^[0-9(]|[A-Za-z]\s*=\s*[^=]|\b(alpha|beta|gamma|theta)\b/i.test(
          line,
        )
      ) {
        return line
      }
      return transformMathSegment(line, { equation: false })
    }
    return transformMathSegment(line, { equation: true })
  })
  let joined = out.join('\n')
  if (options.normalizeSpacing !== false) {
    joined = joined
      .split('\n')
      .map((ln) => (isMathHeavyLine(ln) ? normalizeSpacing(ln) : ln))
      .join('\n')
  }
  return joined
}

export function equationToUnicode(expr) {
  return applyMathTypography(String(expr).trim(), { equation: true })
}
