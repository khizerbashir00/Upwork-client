import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import katex from 'katex'
import { normalizeLatexForKatex } from '../utils/mathLatexNormalize'

const EXAMPLES = [
  { label: 'Power', latex: 'x^2' },
  { label: 'Subscript', latex: 'H_2O' },
  { label: 'Fraction', latex: '\\frac{a+b}{c}' },
  { label: 'Square root', latex: '\\sqrt{x}' },
  { label: 'Integral', latex: '\\int_0^1 x^2 \\, dx' },
]

function KatexPreview({ latex, displayMode }) {
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
    return <span className="latex-preview-empty">Preview appears here</span>
  }
  if (preview.error) {
    return <span className="latex-preview-error">{preview.error}</span>
  }
  return (
    <span
      className={displayMode ? 'katex-display' : ''}
      dangerouslySetInnerHTML={{ __html: preview.html }}
    />
  )
}

export default function LatexModal({ open, onClose, onInsert }) {
  const titleId = useId()
  const [latex, setLatex] = useState('x^2')
  const [displayMode, setDisplayMode] = useState(true)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleInsert = useCallback(() => {
    const trimmed = latex.trim()
    if (!trimmed) return
    onInsert(trimmed, { display: displayMode })
    onClose()
  }, [latex, displayMode, onInsert, onClose])

  if (!open) return null

  return (
    <div className="latex-modal-root" role="presentation" onMouseDown={onClose}>
      <div
        className="latex-modal glass rounded-2xl p-5 sm:p-6 animate-fadeUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 id={titleId} className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
              LaTeX equation
            </h2>
            <p className="mt-1 text-sm text-white/55">Rendered live with KaTeX in the preview panel.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="latex-modal-close btn-ghost rounded-lg px-2.5 py-1.5 text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {EXAMPLES.map(({ label, latex: sample }) => (
            <button key={label} type="button" className="sample-chip" onClick={() => setLatex(sample)}>
              {label}
            </button>
          ))}
        </div>

        <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
          LaTeX source
        </label>
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          className="field nice-scroll w-full rounded-xl p-4 text-[13px] leading-relaxed text-white/90 font-mono resize-y min-h-[88px]"
          placeholder="e.g. \frac{a+b}{c}"
          spellCheck={false}
          autoFocus
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Insert as</span>
          <label className="latex-mode-option">
            <input
              type="radio"
              name="latex-display-mode"
              checked={displayMode}
              onChange={() => setDisplayMode(true)}
            />
            Block equation
          </label>
          <label className="latex-mode-option">
            <input
              type="radio"
              name="latex-display-mode"
              checked={!displayMode}
              onChange={() => setDisplayMode(false)}
            />
            Inline
          </label>
        </div>

        <label className="block font-mono text-[10px] uppercase tracking-wider text-white/40 mt-4 mb-1.5">
          Live preview
        </label>
        <div
          className={`latex-preview-panel field rounded-xl p-4 min-h-[72px] flex items-center justify-center${
            displayMode ? ' latex-preview-panel--block' : ''
          }`}
          aria-live="polite"
        >
          <KatexPreview latex={latex} displayMode={displayMode} />
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button type="button" onClick={onClose} className="btn-ghost px-4 py-2.5 rounded-xl text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!latex.trim()}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm disabled:opacity-45 disabled:pointer-events-none"
          >
            Insert equation
          </button>
        </div>
      </div>
    </div>
  )
}
