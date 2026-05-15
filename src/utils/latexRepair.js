/**
 * Malformed LaTeX / ASCII-math repair before KaTeX rendering.
 */

export function repairMalformedLatex(input) {
  let s = String(input)

  s = s.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, inner) => `$$${repairExpr(inner)}$$`)
  s = s.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (_, inner) => `$${repairExpr(inner)}$`)

  return s
}

function repairExpr(expr) {
  let e = expr.trim()
  if (!e) return e

  e = e.replace(/\\frac\s*\{\s*\}\s*\{\s*\}/g, '')
  e = e.replace(/\\frac\s+([^{\s]+)\s+([^{\s]+)/g, '\\frac{$1}{$2}')
  e = e.replace(/\\sqrt\s+([^{\s(]+)/g, '\\sqrt{$1}')
  e = e.replace(/\{\s*\{/g, '{').replace(/\}\s*\}/g, '}')
  e = e.replace(/_\s*\{\s*\}/g, '')
  e = e.replace(/\^\s*\{\s*\}/g, '')
  e = e.replace(/\\left\s*\(\s*/g, '\\left(').replace(/\\right\s*\)\s*/g, '\\right)')
  e = e.replace(/\\begin\s*\{\s*align\s*\*\s*\}/gi, '\\begin{align*}')
  e = e.replace(/\\end\s*\{\s*align\s*\*\s*\}/gi, '\\end{align*}')
  e = e.replace(/([^\\])imes\b/g, '$1\\times')
  e = e.replace(/([^\\])cdot\b/g, '$1\\cdot')
  e = e.replace(/([^\\])infty\b/g, '$1\\infty')
  e = e.replace(/([^\\])alpha\b/g, '$1\\alpha')
  e = e.replace(/([^\\])beta\b/g, '$1\\beta')
  e = e.replace(/([^\\])gamma\b/g, '$1\\gamma')
  e = e.replace(/([^\\])theta\b/g, '$1\\theta')
  e = e.replace(/([^\\])sigma\b/g, '$1\\sigma')
  e = e.replace(/([^\\])lambda\b/g, '$1\\lambda')
  e = e.replace(/([^\\])partial\b/g, '$1\\partial')
  e = e.replace(/([^\\])nabla\b/g, '$1\\nabla')
  e = e.replace(/\\{2,}/g, '\\')
  e = e.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
  e = e.replace(/\s*,\s*/g, ', ')

  const open = (e.match(/\{/g) || []).length
  const close = (e.match(/\}/g) || []).length
  if (open > close) e += '}'.repeat(open - close)
  if (close > open) e = '{'.repeat(close - open) + e

  return e
}

export function repairDocumentMath(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let inFence = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }
    if (/^\s*\\begin\{/.test(line) || /\\\\\s*$/.test(line) || /&=/.test(line)) {
      out.push(repairMalformedLatex(line))
    } else {
      out.push(repairMalformedLatex(line))
    }
  }
  return out.join('\n')
}
