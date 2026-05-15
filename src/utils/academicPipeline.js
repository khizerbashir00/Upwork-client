/**
 * Production academic document pipeline — preprocess before render/export.
 */

import { cleanupAcademicText } from './textCleanup'
import { repairDocumentMath } from './latexRepair'
import {
  detectCitationStyle,
  formatReferenceLine,
  stripCitationStyleDirective,
  CITATION_STYLES,
} from './citationStyles'
import { preprocessMathText } from './mathEngine'

export { detectCitationStyle, CITATION_STYLES } from './citationStyles'

function applyReferenceFormatting(raw, style) {
  const lines = raw.split('\n')
  let inRefs = false
  let refIndex = 0
  const out = []

  for (const line of lines) {
    const t = line.trim()
    if (/^(references|bibliography|works cited)\s*:?\s*$/i.test(t)) {
      inRefs = true
      refIndex = 0
      out.push(line)
      continue
    }
    if (inRefs) {
      if (!t) {
        inRefs = false
        out.push(line)
        continue
      }
      if (/^(#{1,6})\s/.test(t) || t.startsWith('```')) {
        inRefs = false
        out.push(line)
        continue
      }
      out.push(formatReferenceLine(t, style, refIndex))
      refIndex++
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

/**
 * Full document preprocess: cleanup → citations → LaTeX repair → math typography.
 */
export function preprocessAcademicDocument(raw, options = {}) {
  if (!raw?.trim()) return ''

  let text = stripCitationStyleDirective(raw)
  const citationStyle = options.citationStyle || detectCitationStyle(raw)

  text = cleanupAcademicText(text)
  text = applyReferenceFormatting(text, citationStyle)
  text = repairDocumentMath(text)
  text = preprocessMathText(text, { inlineKatex: options.inlineKatex !== false })

  return text
}
