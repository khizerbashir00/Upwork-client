export default function MathToolbar({ onSuperscript, onSubscript, onLatex, disabled }) {
  return (
    <div className="math-toolbar flex flex-wrap items-center gap-1.5 mb-3" role="toolbar" aria-label="Math formatting">
      <span className="font-mono text-[10px] uppercase tracking-wider text-white/35 self-center mr-0.5">
        Math
      </span>
      <button
        type="button"
        className="math-toolbar-btn"
        onClick={onSuperscript}
        disabled={disabled}
        title="Superscript (select text, e.g. 2 → ²)"
        aria-label="Superscript"
      >
        x<sup className="math-toolbar-sup">2</sup>
      </button>
      <button
        type="button"
        className="math-toolbar-btn"
        onClick={onSubscript}
        disabled={disabled}
        title="Subscript (select text, e.g. 2 → ₂)"
        aria-label="Subscript"
      >
        H<sub className="math-toolbar-sub">2</sub>O
      </button>
      <button
        type="button"
        className="math-toolbar-btn math-toolbar-btn--latex"
        onClick={onLatex}
        disabled={disabled}
        title="Insert LaTeX equation"
        aria-label="Insert LaTeX equation"
      >
        <span className="math-toolbar-tex">TeX</span>
        LaTeX
      </button>
    </div>
  )
}
