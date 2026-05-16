import { memo, useMemo } from 'react'
import katex from 'katex'
import { normalizeLatexForKatex } from '../utils/mathLatexNormalize'

function KatexPreviewInner({ latex, displayMode, className = '' }) {
  const normalized = useMemo(() => normalizeLatexForKatex(latex), [latex])

  const preview = useMemo(() => {
    if (!normalized) return { html: null, error: null }
    try {
      const html = katex.renderToString(normalized, {
        displayMode,
        throwOnError: true,
        strict: false,
        trust: true,
      })
      return { html, error: null }
    } catch (err) {
      return { html: null, error: String(err?.message || 'Invalid LaTeX') }
    }
  }, [normalized, displayMode])

  if (!normalized) {
    return <span className={`latex-preview-empty ${className}`.trim()}>Preview appears here</span>
  }
  if (preview.error) {
    return <span className={`latex-preview-error ${className}`.trim()}>{preview.error}</span>
  }
  return (
    <span
      className={`${displayMode ? 'katex-display' : ''} ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: preview.html }}
    />
  )
}

const KatexPreview = memo(KatexPreviewInner)
export default KatexPreview
