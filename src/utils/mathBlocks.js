/**
 * Document segmentation: keeps full equations intact and routes them to KaTeX display blocks.
 */

import { isLikelyDisplayEquation } from './mathEngine'
import { isDisplayLatexLine, normalizeLatexForKatex } from './mathLatexNormalize'
import { isLatexLikeLine } from './mathProtect'

const BEGIN_ENV =
  /\\begin\{(cases|bmatrix|pmatrix|vmatrix|matrix|aligned|align\*?|gather\*?|equation\*?)\}/

function parseDollarMathBlock(lines, startIdx) {
  const t = lines[startIdx].trim()
  if (!t.startsWith('$$')) return null

  if (t.length > 4 && t.endsWith('$$')) {
    return { latex: t.slice(2, -2).trim(), next: startIdx + 1 }
  }

  let body = t.slice(2)
  let i = startIdx + 1
  if (body.endsWith('$$')) {
    return { latex: body.slice(0, -2).trim(), next: startIdx + 1 }
  }

  const parts = body ? [body] : []
  while (i < lines.length) {
    const lt = lines[i]
    const tt = lt.trim()
    if (tt === '$$' || tt.endsWith('$$')) {
      if (tt !== '$$') parts.push(tt.slice(0, -2))
      i++
      break
    }
    parts.push(lt)
    i++
  }
  const latex = parts.join('\n').trim()
  if (!latex) return null
  return { latex, next: i }
}

function parseEnvironmentBlock(lines, startIdx) {
  const t = lines[startIdx].trim()
  const beginM = t.match(/\\begin\{([^}]+)\}/)
  if (!beginM) return null

  const envName = beginM[1].replace(/\*/g, '\\*')
  const chunk = [lines[startIdx]]
  let i = startIdx + 1
  const endRe = new RegExp(`\\\\end\\{${envName}\\}`)

  while (i < lines.length) {
    chunk.push(lines[i])
    if (endRe.test(lines[i])) {
      i++
      break
    }
    i++
    if (i - startIdx > 80) break
  }

  const latex = chunk.join('\n').trim()
  if (!/\\end\{/.test(latex)) return null
  return { latex, next: i }
}

function parseDisplayLine(lines, startIdx) {
  const t = lines[startIdx].trim()
  if (!t) return null

  if (isLatexLikeLine(t) || isDisplayLatexLine(t) || isLikelyDisplayEquation(t)) {
    return { latex: t, next: startIdx + 1 }
  }

  if (BEGIN_ENV.test(t)) {
    return parseEnvironmentBlock(lines, startIdx)
  }

  return null
}

function isMathContinuationLine(t) {
  if (!t) return false
  if (isLatexLikeLine(t) || isLikelyDisplayEquation(t)) return true
  if (BEGIN_ENV.test(t)) return true
  if (/^\\end\{/.test(t)) return true
  return false
}

/**
 * Split preprocessed document into prose paragraphs and display-math blocks.
 * @returns {{ type: 'prose' | 'math', content?: string, latex?: string }[]}
 */
export function segmentDocument(text) {
  if (!text?.trim()) return []

  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const segments = []
  let proseBuf = []
  let i = 0
  let inFence = false

  const flushProse = () => {
    const content = proseBuf.join('\n').trim()
    if (content) segments.push({ type: 'prose', content })
    proseBuf = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()

    if (t.startsWith('```')) {
      flushProse()
      inFence = !inFence
      proseBuf.push(line)
      i++
      continue
    }

    if (inFence) {
      proseBuf.push(line)
      i++
      continue
    }

    if (!t) {
      flushProse()
      i++
      continue
    }

    const dollar = parseDollarMathBlock(lines, i)
    if (dollar) {
      flushProse()
      segments.push({ type: 'math', latex: dollar.latex })
      i = dollar.next
      continue
    }

    const env = parseEnvironmentBlock(lines, i)
    if (env) {
      flushProse()
      segments.push({ type: 'math', latex: env.latex })
      i = env.next
      continue
    }

    const display = parseDisplayLine(lines, i)
    if (display) {
      flushProse()
      segments.push({ type: 'math', latex: display.latex })
      i = display.next
      continue
    }

    if (isMathContinuationLine(t) && proseBuf.length === 0) {
      const mathLines = [line]
      let j = i + 1
      while (j < lines.length) {
        const nt = lines[j].trim()
        if (!nt) break
        if (parseDollarMathBlock(lines, j) || parseEnvironmentBlock(lines, j)) break
        if (!isMathContinuationLine(nt) && !isLikelyDisplayEquation(nt)) break
        mathLines.push(lines[j])
        j++
      }
      if (mathLines.length >= 1 && isLikelyDisplayEquation(mathLines.map((l) => l.trim()).join(' '))) {
        segments.push({ type: 'math', latex: mathLines.join('\n').trim() })
        i = j
        continue
      }
    }

    proseBuf.push(line)
    i++
  }

  flushProse()
  return segments
}

export function prepareDisplayLatex(latex) {
  return normalizeLatexForKatex(String(latex || '').trim())
}
