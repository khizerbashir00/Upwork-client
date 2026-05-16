/**
 * Protect LaTeX delimiters from symbol-replacement passes (convert / typography).
 */

const STORE = []

function stash(match) {
  STORE.push(match)
  return `\uE000${STORE.length - 1}\uE001`
}

/** Replace $$, \\[\\], \\(\\), and LaTeX environments with opaque placeholders. */
export function protectMathZones(text) {
  STORE.length = 0
  if (!text) return text
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, stash)
    .replace(/\\\[[\s\S]*?\\\]/g, stash)
    .replace(/\\\([\s\S]*?\\\)/g, stash)
    .replace(/\\begin\{([^}]+)\}[\s\S]*?\\end\{\1\}/g, stash)
}

export function restoreMathZones(text) {
  if (!text) return text
  return text.replace(/\uE000(\d+)\uE001/g, (_, i) => STORE[Number(i)] ?? '')
}

export function isLatexLikeLine(line) {
  const t = line.trim()
  if (!t) return false
  if (t.startsWith('$$') || t.startsWith('\\(') || t.startsWith('\\[')) return true
  if (
    /^\\(frac|dfrac|tfrac|begin|end|int|iint|iiint|sum|prod|sqrt|lim|left|right|binom|mathrm|mathbf|mathbb|cdot|times|infty|to|alpha|beta|gamma|theta|sigma|lambda)/.test(
      t,
    )
  )
    return true
  if (/\\(frac|int|sum|sqrt|lim|begin|end)\b/.test(t)) return true
  if (/^(int|sum|lim|iint|iiint|prod)_/i.test(t)) return true
  if (/^lim_\{/i.test(t)) return true
  if (/\\begin\{/.test(t)) return true
  return false
}
