/**
 * Textarea selection helpers for the math editor toolbar.
 */

import { toSubscript, toSuperscript } from './mathTypography'
import { normalizeLatexForKatex } from './mathLatexNormalize'

export function applyUnicodeScript(value, start, end, mode) {
  if (start === end) return null
  const selected = value.slice(start, end)
  const replacement = mode === 'sup' ? toSuperscript(selected) : toSubscript(selected)
  const newValue = value.slice(0, start) + replacement + value.slice(end)
  return {
    newValue,
    cursorStart: start,
    cursorEnd: start + replacement.length,
  }
}

export function insertLatexEquation(value, start, end, latex, { display = true } = {}) {
  const trimmed = normalizeLatexForKatex(String(latex || '').trim())
  if (!trimmed) return null

  const before = value.slice(0, start)
  const after = value.slice(end)
  const core = display ? `$$\n${trimmed}\n$$` : `\\(${trimmed}\\)`
  const needsNlBefore = before.length > 0 && !before.endsWith('\n')
  const needsNlAfter = after.length > 0 && !after.startsWith('\n')
  const insert = (needsNlBefore ? '\n' : '') + core + (needsNlAfter ? '\n' : '')

  const newValue = before + insert + after
  const insertStart = before.length + (needsNlBefore ? 1 : 0)
  return {
    newValue,
    cursorStart: insertStart,
    cursorEnd: insertStart + insert.length - (needsNlAfter ? 1 : 0) - (needsNlBefore ? 1 : 0),
    insertStart,
    rawLatex: trimmed,
    display,
  }
}

/**
 * Insert a LaTeX snippet; places cursor inside first `{}` when cursorOffset provided.
 */
export function insertMathSnippet(value, start, end, snippet) {
  const { latex, display = false, cursorOffset } = snippet
  const trimmed = String(latex || '')
  if (!trimmed) return null

  const before = value.slice(0, start)
  const after = value.slice(end)

  if (display) {
    const result = insertLatexEquation(value, start, end, trimmed, { display: true })
    if (!result) return null
    let cursor = result.insertStart + 3
    if (cursorOffset != null) cursor = result.insertStart + cursorOffset
    return { ...result, cursorStart: cursor, cursorEnd: cursor }
  }

  const insert = `\\(${trimmed}\\)`
  const newValue = before + insert + after
  let cursor = before.length + 2
  if (cursorOffset != null) {
    cursor = before.length + cursorOffset
  } else {
    const brace = trimmed.indexOf('{}')
    if (brace >= 0) cursor = before.length + 2 + brace + 1
  }
  return {
    newValue,
    cursorStart: cursor,
    cursorEnd: cursor,
  }
}

export function focusTextareaWithSelection(textarea, start, end) {
  if (!textarea) return
  textarea.focus()
  textarea.setSelectionRange(start, end)
}
