import { forwardRef } from 'react'
import CategoryChips from './CategoryChips'

const SAMPLE_KEYS = [
  { key: 'code', label: '⚡ Code' },
  { key: 'math', label: '∑ Math' },
  { key: 'physics', label: 'α Physics' },
  { key: 'economics', label: '$ Economics' },
  { key: 'logic', label: '⇒ Logic' },
  { key: 'chemistry', label: '⚗ Chemistry' },
]

const InputPanel = forwardRef(function InputPanel(
  {
    value,
    onChange,
    onClear,
    onKeyDown,
    charCountText,
    onConvert,
    activeCategories,
    onToggleCategory,
    onAllOn,
    onAllOff,
    onSample,
    onOpenQuestionBank,
  },
  ref,
) {
  return (
    <section className="ai-panel glass rounded-3xl p-5 sm:p-7 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-mint-400/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Input</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/40">{charCountText}</span>
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-rose-300 transition"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="field nice-scroll w-full rounded-2xl p-5 text-[14px] leading-relaxed text-white/90 placeholder:text-white/30 resize-none font-mono"
        style={{ height: 'clamp(380px, 48vh, 520px)' }}
        placeholder={`Type naturally — math is detected automatically:

x^2 + y^2    H_2O    int_0^infty e^(-x) dx
\\frac{a+b}{c}    \\sum_{i=1}^{n} i^2    lim_{x->infty}

Code: if (a >= 10 && b != 5) { total = price * 5 / 2; }
Chemistry: H2O + CO2 -> H2CO3`}
      />

      <div className="mt-3 flex flex-wrap gap-1.5 items-center">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/35 self-center mr-1">Try:</span>
        {SAMPLE_KEYS.map(({ key, label }) => (
          <button key={key} type="button" className="sample-chip" onClick={() => onSample(key)}>
            {label}
          </button>
        ))}
        <span className="w-px h-4 bg-white/10 mx-1" />
        <button type="button" className="sample-chip qb-open-btn" onClick={onOpenQuestionBank}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          📚 Question Bank
        </button>
      </div>

      <CategoryChips
        activeCategories={activeCategories}
        onToggle={onToggleCategory}
        onAllOn={onAllOn}
        onAllOff={onAllOff}
      />

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center px-4 py-3 rounded-xl field font-mono text-[11px] text-white/45">
          <span className="w-1.5 h-1.5 rounded-full bg-mint-400 mr-2 animate-pulse" />
          Auto-detecting symbols & math as you type
        </div>
        <button
          type="button"
          onClick={onConvert}
          className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm min-w-[140px]"
        >
          Convert
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18m-4-7l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
})

export default InputPanel
