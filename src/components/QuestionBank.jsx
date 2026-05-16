import katex from 'katex'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import QUESTION_BANK, { QB_CATEGORIES, getQuestionsByCategory, searchQuestions } from '../utils/questionBank'

function KatexBlock({ latex, display = true }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !latex) return
    try {
      katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        trust: true,
      })
    } catch {
      ref.current.textContent = latex
    }
  }, [latex, display])
  return <span ref={ref} />
}

const QuestionRow = memo(function QuestionRow({ q, onInsert, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const text = `$$${q.latex}$$`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
    onCopy?.()
  }, [q.latex, onCopy])

  return (
    <div className="qb-row group">
      <div className="qb-row-preview">
        <KatexBlock latex={q.latex} display={false} />
      </div>
      <div className="qb-row-meta">
        <span className="qb-row-label">{q.label}</span>
        {q.description && <span className="qb-row-desc">{q.description}</span>}
      </div>
      <div className="qb-row-actions">
        <button
          type="button"
          className="qb-btn qb-btn-insert"
          onClick={() => onInsert(q)}
          title="Insert into editor"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Insert
        </button>
        <button
          type="button"
          className={`qb-btn qb-btn-copy${copied ? ' qb-btn-copied' : ''}`}
          onClick={handleCopy}
          title="Copy LaTeX"
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
})

const BATCH_SIZE = 20

export default function QuestionBank({ open, onClose, onInsert }) {
  const [activeCat, setActiveCat] = useState('algebra')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const listRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 120)
    }
  }, [open])

  useEffect(() => {
    setVisibleCount(BATCH_SIZE)
  }, [activeCat, search])

  const items = useMemo(() => {
    if (search.trim()) return searchQuestions(search)
    return getQuestionsByCategory(activeCat)
  }, [activeCat, search])

  const visible = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])
  const hasMore = visibleCount < items.length

  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el || !hasMore) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      setVisibleCount((c) => Math.min(c + BATCH_SIZE, items.length))
    }
  }, [hasMore, items.length])

  const handleInsert = useCallback((q) => {
    onInsert?.(q.latex)
  }, [onInsert])

  const catCounts = useMemo(() => {
    const map = {}
    for (const c of QB_CATEGORIES) map[c.key] = 0
    for (const q of QUESTION_BANK) {
      if (map[q.cat] !== undefined) map[q.cat]++
    }
    return map
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.()
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="qb-root"
      onMouseDown={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label="Question Bank"
    >
      <div className="qb-panel glass" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qb-header">
          <div className="flex items-center gap-2.5">
            <div className="qb-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h2 className="qb-title">Question Bank</h2>
              <p className="qb-subtitle">{QUESTION_BANK.length} equations · 12 categories</p>
            </div>
          </div>
          <button type="button" className="qb-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="qb-search-wrap">
          <svg className="qb-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            className="qb-search"
            type="text"
            placeholder="Search equations — integral, matrix, GDP, Black-Scholes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="qb-search-clear" onClick={() => setSearch('')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="qb-tabs nice-scroll">
          {QB_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`qb-tab${activeCat === cat.key && !search.trim() ? ' qb-tab-active' : ''}`}
              onClick={() => { setActiveCat(cat.key); setSearch('') }}
            >
              <span className="qb-tab-glyph">{cat.glyph}</span>
              <span>{cat.label}</span>
              <span className="qb-tab-count">{catCounts[cat.key]}</span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="qb-results-bar">
          <span className="qb-results-count">
            {search.trim() ? (
              <>{items.length} result{items.length !== 1 ? 's' : ''} for "<span className="text-mint-300">{search}</span>"</>
            ) : (
              <>{items.length} equation{items.length !== 1 ? 's' : ''} in <span className="text-mint-300">{QB_CATEGORIES.find((c) => c.key === activeCat)?.label}</span></>
            )}
          </span>
        </div>

        {/* Equation list */}
        <div className="qb-list nice-scroll" ref={listRef} onScroll={handleScroll}>
          {visible.length === 0 ? (
            <div className="qb-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 mb-2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <p>No equations found</p>
              <p className="text-[11px] mt-1">Try a different search term</p>
            </div>
          ) : (
            visible.map((q) => (
              <QuestionRow key={q.id} q={q} onInsert={handleInsert} />
            ))
          )}
          {hasMore && (
            <div className="qb-load-more">
              <button
                type="button"
                className="qb-btn qb-btn-more"
                onClick={() => setVisibleCount((c) => Math.min(c + BATCH_SIZE, items.length))}
              >
                Load more ({items.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="qb-footer">
          <span className="qb-footer-hint">Click <strong>Insert</strong> to paste into editor · <strong>Copy</strong> for clipboard</span>
          <button type="button" className="btn-ghost px-4 py-2 rounded-lg text-xs font-medium" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
