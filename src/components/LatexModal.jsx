import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import KatexPreview from './KatexPreview'
import { LATEX_GALLERY } from '../utils/mathTemplates'

const CATEGORIES = [...new Set(LATEX_GALLERY.map((t) => t.category))]

export default function LatexModal({ open, onClose, onInsert, initialLatex = '\\frac{x^2+y^2}{a+b}' }) {
  const titleId = useId()
  const [latex, setLatex] = useState(initialLatex)
  const [displayMode, setDisplayMode] = useState(true)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  const filteredGallery = useMemo(
    () => LATEX_GALLERY.filter((t) => t.category === activeCategory),
    [activeCategory],
  )

  const handleInsert = useCallback(() => {
    const trimmed = latex.trim()
    if (!trimmed) return
    onInsert(trimmed, { display: displayMode })
    onClose()
  }, [latex, displayMode, onInsert, onClose])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleInsert()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, handleInsert])

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
              Equation editor
            </h2>
            <p className="mt-1 text-sm text-white/55">
              LaTeX input with live KaTeX preview · Cmd+Enter to insert
            </p>
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

        <div className="flex flex-wrap gap-1 mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`sample-chip${activeCategory === cat ? ' sample-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3 max-h-24 overflow-y-auto nice-scroll">
          {filteredGallery.map(({ id, label, latex: sample, display }) => (
            <button
              key={id}
              type="button"
              className="sample-chip"
              onClick={() => {
                setLatex(sample)
                setDisplayMode(display)
              }}
            >
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
          className="field nice-scroll w-full rounded-xl p-4 text-[13px] leading-relaxed text-white/90 font-mono resize-y min-h-[100px]"
          placeholder="\\frac{a}{b}, \\int_0^\\infty e^{-x} dx, \\begin{bmatrix}..."
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
            Block (display)
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
          className={`latex-preview-panel field rounded-xl p-4 min-h-[88px] flex items-center justify-center${
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
