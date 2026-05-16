/**
 * Central math rendering orchestrator.
 * Routes expressions to Unicode typography or KaTeX (LaTeX-compatible) rendering.
 */

import {
  applyMathTypography,
  equationToUnicode,
  isMathHeavyLine as typographyMathLine,
} from './mathTypography'
import { normalizeLatexForKatex, shouldUseKatex, wrapInlineMathDelimiters } from './mathLatexNormalize'
import { isLatexLikeLine, protectMathZones, restoreMathZones } from './mathProtect'

export { normalizeLatexForKatex, shouldUseKatex, wrapInlineMathDelimiters } from './mathLatexNormalize'
export {
  applyMathTypography,
  equationToUnicode,
  isMathHeavyLine,
} from './mathTypography'

/** Complex math must use KaTeX (matrices, piecewise, nested LaTeX, etc.). */
export function isComplexLatex(expr) {
  return shouldUseKatex(expr)
}

/** Prepare prose text: Unicode pass + inline KaTeX delimiters where needed. */
export function preprocessMathText(raw, options = {}) {
  if (!raw) return ''
  let text = protectMathZones(raw)
  text = applyMathTypography(text, options)
  text = restoreMathZones(text)
  if (options.inlineKatex !== false) {
    text = text
      .split('\n')
      .map((line) => {
        if (!line.trim() || line.trim().startsWith('```')) return line
        if (isLatexLikeLine(line)) return line
        if (typographyMathLine(line) && shouldUseKatex(line)) return line
        return wrapInlineMathDelimiters(line)
      })
      .join('\n')
  }
  return text
}

/** Decide render mode for a display equation. */
export function prepareEquationRender(expr) {
  const t = String(expr).trim()
  if (!t) return { mode: 'empty' }
  const needsKatex =
    shouldUseKatex(t) ||
    /\\[a-zA-Z]/.test(t) ||
    /\\frac|\\begin|\\int|\\sum|\\sqrt|\\lim|\\prod|\\iint|\\iiint|\\oint/.test(t) ||
    /(?:^|[^\\])(?:int|sum|lim|prod|sqrt|frac)_/i.test(t) ||
    /(?:\^|_)\{/.test(t) ||
    /[A-Za-z]\^[{(0-9]/.test(t) ||
    /[A-Za-z]_[{(0-9A-Za-z]/.test(t)
  if (needsKatex) {
    return { mode: 'katex', latex: normalizeLatexForKatex(t) }
  }
  return { mode: 'unicode', text: equationToUnicode(t) }
}

const MATH_LINE_PATTERNS = [
  /^\$\$[\s\S]*\$\$$/,
  /^\\\[[\s\S]*\\\]$/,
  /^\\\([\s\S]*\\\)$/,
  /^\\begin\{/,
  /^(?:sum|prod|int|iint|iiint|oint|lim)\s*[_^({]/i,
  /^(?:d|D)\s*\/\s*d[a-zA-Z]/i,
  /^partial\s+/i,
  /^(?:curl|div|grad)\s+/i,
  /^\[\[/,
  /\\frac\{|\\sqrt|\\binom|\\det|\\begin\{/,
  /^[A-Za-z](?:_[A-Za-z0-9]+|\^[0-9(])/,
  /(?:^|\s)[A-Za-z](?:\([A-Za-z]\))?\s*=/,
  /\bint_|\bsum_|\biint_|\biiint_/i,
  /^\\int\b|^\\iint\b|^\\iiint\b|^\\oint\b/,
  /^[∫∬∭∮][\s\d^_^{}()+\-*/.a-zA-Z∞₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺\\]+$/,
  /\bint[\s_^]*\d+[\s^]*infty\b/i,
  /lim_\{|\\lim_\{/i,
  /\(1\+1\/x\)\^?x/i,
  /\blim\s*_\s*\{?x/i,
  /^f\s*\(\s*x\s*\)\s*=/i,
  /\bd\^?\d*\s*\/\s*d[a-z]/i,
  /\|\|[^|]+\|\|/,
  /\bE\s*\[|\bP\s*\(|\bVar\s*\(/,
]

const PROSE_BLOCKLIST =
  /\b(the|and|for|with|that|this|from|have|been|were|will|would|should|because|however|therefore|where|when|which|what)\b/i

/** Detect standalone display equations in a line. */
export function isLikelyDisplayEquation(t) {
  const s = t.trim()
  if (!s || s.length > 480) return false

  for (const re of MATH_LINE_PATTERNS) {
    if (re.test(s)) {
      if (re.source.includes('A-Za-z') && PROSE_BLOCKLIST.test(s) && s.length > 80) continue
      if (/=/.test(s) || /^(?:sum|int|iint|d\/|partial|\\)/i.test(s)) {
        const prose = (s.match(/\b[a-z]{5,}\b/g) || []).filter(
          (w) =>
            !/^(sqrt|frac|cdot|partial|nabla|sigma|alpha|beta|gamma|theta|omega|delta|lambda|sum|prod|int|iint|iiint|oint|lim|infty|partial|because|therefore|where|given|subject)\b/i.test(
              w,
            ),
        )
        if (prose.length > 7) return false
        if (/[.!?]\s+[A-Z][a-z]{3,}\s/.test(s)) return false
        return true
      }
      return true
    }
  }

  if (typographyMathLine(s) && !PROSE_BLOCKLIST.test(s)) return true
  return false
}

/** Detect multiline aligned equation blocks. */
export function parseAlignedEquationBlock(lines, startIdx) {
  const block = []
  let i = startIdx
  while (i < lines.length) {
    const t = lines[i].trim()
    if (!t) break
    if (!/[=\\&]|\\\\|(?:^|\s)(?:sum|int|frac|partial|nabla)/i.test(t) && block.length > 0) break
    if (block.length === 0 && !isLikelyDisplayEquation(t) && !/\\\\|&=/.test(t)) break
    block.push(t)
    i++
    if (!/\\\\\s*$/.test(t) && block.length > 0 && i < lines.length) {
      const next = lines[i]?.trim()
      if (next && !/[=\\&]|\\\\/.test(next) && !isLikelyDisplayEquation(next)) break
    }
  }
  if (block.length < 2) return null
  const latex = normalizeLatexForKatex(block.join(' \\\\ '))
  return { next: i, latex }
}
