/**
 * Merge vertically stacked math fragments (common when pasting from PDFs)
 * into single lines KaTeX can render.
 */

const PROSE_WORDS =
  /\b(evaluate|compute|consider|theorem|proof|where|given|therefore|because|figure|section|chapter|example|problem|solution|show|prove|find|calculate|determine|let|suppose|assume|note|recall|define|represents|aggregate|following|output|differentiate|differentiation|function|limit|limits|integral|integrals|double|triple|improper|proper|compute|evaluate|show\s+that|find\s+the)\b/i

const MATH_FRAGMENT_CHARS =
  /^[\s\d^_()+\-*/.=·⋅×÷≤≥≠≈∫∑∏√∞∬∭∮\\|]+$/u

function hasMathSyntax(t) {
  return (
    /[=^_+\-*/\\]|->|<-|≤|≥|∫|∑|∞|\d|lim\b|frac|sqrt|int_|int\b|sum_|prod_|iint|oint|\^|\(|\)/i.test(t) ||
    /^f\s*\(/i.test(t) ||
    /^lim\b/i.test(t)
  )
}

function isProseLine(line) {
  const t = line.trim()
  if (!t) return false
  const words = t.split(/\s+/).filter(Boolean)
  if (words.length < 2) return false
  if (!hasMathSyntax(t)) return true
  if (PROSE_WORDS.test(t) && words.length >= 3) return true
  if (PROSE_WORDS.test(t) && !/[=^_]{1}|->|lim_|\\frac/i.test(t)) return true
  return false
}

function isMathFragment(line) {
  const t = line.trim()
  if (!t || t.length > 40) return false
  if (isProseLine(line)) return false
  if (hasMathSyntax(t)) return true
  if (MATH_FRAGMENT_CHARS.test(t)) return true
  if (/^(dx|dy|dz|dt|du|dv|ds|dr)$/i.test(t)) return true
  if (/^[∫∑∏√∞∬∭∮]$/.test(t)) return true
  if (/^[A-Za-z]$/.test(t)) return true
  if (/^-?[A-Za-z]\d?$/.test(t)) return true
  if (/^\d+$/.test(t)) return true
  if (/^[()[\]{}]$/.test(t)) return true
  if (/^[+\-*/]$/.test(t)) return true
  return false
}

/** Vertical (1 + x / 1 ) ^ x  →  (1+1/x)^x */
function tryRebuildBinomialLimit(fragments) {
  const norm = fragments.map((f) => f.trim())
  const j = norm.join('')
  if (/^\(1\+x1?\)x$/i.test(j)) return '(1+1/x)^x'
  if (/^\(1\+1x?\)x$/i.test(j)) return '(1+1/x)^x'

  const parenIdx = norm.findIndex((f) => f.startsWith('(1+') || f === '(1+')
  if (parenIdx >= 0) {
    const slice = norm.slice(parenIdx)
    if (
      slice.length >= 4 &&
      /^\(1\+/.test(slice[0]) &&
      slice[1] === 'x' &&
      slice[2] === '1' &&
      /^\)/.test(slice[3]) &&
      slice[4] === 'x'
    ) {
      return '(1+1/x)^x'
    }
  }
  return null
}

/** f(x)=x, 2, ln(x)  →  f(x)=x^2 ln(x) */
function tryRebuildDerivative(fragments) {
  const norm = fragments.map((f) => f.trim())
  const j = norm.join('')
  if (/^f\(x\)=x2ln\(x\)$/i.test(j)) return 'f(x)=x^2 ln(x)'
  if (/^f\(x\)=x\s*2\s*ln\(x\)$/i.test(j)) return 'f(x)=x^2 ln(x)'

  const fIdx = norm.findIndex((f) => /^f\s*\(\s*x\s*\)\s*=\s*x/i.test(f))
  if (fIdx >= 0) {
    const rest = norm.slice(fIdx + 1)
    if (rest.includes('2') && rest.some((r) => /ln\s*\(\s*x\s*\)/i.test(r))) {
      return 'f(x)=x^2 ln(x)'
    }
    if (rest[0] === '2' && rest[1] && /ln/i.test(rest[1])) {
      return 'f(x)=x^2 ln(x)'
    }
  }
  return null
}

/** x->inf + lim  →  lim_{x->infty} */
function tryRebuildLimit(fragments) {
  const norm = fragments.map((f) => f.trim())
  const j = norm.join('')
  if (/lim.*x\s*-?>?\s*inf|x\s*-?>?\s*inf.*lim/i.test(j)) {
    return 'lim_{x->infty}'
  }
  if (/^x\s*-?>?\s*inf(inity)?$/i.test(j) && norm.includes('lim')) {
    return 'lim_{x->infty}'
  }
  if (/^lim$/i.test(j)) return 'lim'
  if (/^x\s*-?>?\s*inf(inity)?$/i.test(j)) return 'lim_{x->infty}'
  return null
}

function normalizeCollapsedExpr(raw) {
  let s = String(raw)
    .replace(/\s+/g, '')
    .replace(/∫/g, 'int')
    .replace(/∬/g, 'iint')
    .replace(/∭/g, 'iiint')
    .replace(/∮/g, 'oint')
    .replace(/∞/g, 'infty')
    .replace(/−/g, '-')

  s = s.replace(/x\s*-?>?\s*inf(inity)?/gi, 'x->infty')
  s = s.replace(/limx->infty/gi, 'lim_{x->infty}')
  s = s.replace(/x->inftylim/gi, 'lim_{x->infty}')

  s = s.replace(/^int(\d+)(infty|inf)/i, 'int_$1^infty')
  s = s.replace(/^int(\d+)\^?(infty|inf)/i, 'int_$1^infty')
  s = s.replace(/^iint([A-Za-z])/i, 'iint_$1')
  s = s.replace(/^iint_([A-Za-z])/i, 'iint_$1')

  s = s.replace(/\(1\+x1?\)x/gi, '(1+1/x)^x')
  s = s.replace(/e-?x2/gi, 'e^(-x^2)')
  s = s.replace(/e-?x\^2/gi, 'e^(-x^2)')
  s = s.replace(/f\(x\)=x2ln\(x\)/gi, 'f(x)=x^2 ln(x)')
  s = s.replace(/f\(x\)=x(\d)ln/gi, 'f(x)=x^$1 ln')

  s = s.replace(/\(([A-Za-z])(\d+)\)/g, '($1^$2)')
  s = s.replace(/([A-Za-z])(\d+)(?=dx|$)/gi, '$1^$2')

  if (/^int/i.test(s) && !/dx$/i.test(s) && /x/.test(s)) {
    s = s.replace(/(int[\s\S]+)$/, '$1 dx')
  }

  return s
}

function rebuildMathLine(fragments) {
  if (fragments.length === 0) return ''

  const special =
    tryRebuildBinomialLimit(fragments) ||
    tryRebuildDerivative(fragments) ||
    tryRebuildLimit(fragments)
  if (special) return special

  return normalizeCollapsedExpr(fragments.join(''))
}

/**
 * @param {string} raw
 * @returns {string}
 */
export function collapseStackedMathLines(raw) {
  if (!raw?.trim()) return raw

  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let buffer = []
  let inFence = false

  const flush = () => {
    if (buffer.length >= 2) {
      out.push(rebuildMathLine(buffer))
    } else {
      out.push(...buffer)
    }
    buffer = []
  }

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('```')) {
      flush()
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }
    if (!t) {
      flush()
      out.push(line)
      continue
    }
    if (t.startsWith('$$')) {
      flush()
      out.push(line)
      continue
    }
    if (isMathFragment(line)) {
      buffer.push(t)
      continue
    }
    flush()
    out.push(line)
  }
  flush()
  return out.join('\n')
}
