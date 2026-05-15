import { forwardRef } from 'react'
import DiffSummary from './DiffSummary'
import DownloadMenu from './DownloadMenu'
import EmptyOutputState from './EmptyOutputState'

const OutputPanel = forwardRef(function OutputPanel(
  {
    innerRef,
    isEmpty,
    articleHtml,
    convBadgeText,
    diffRows,
    diffRuleCount,
    diffEmptyMessage,
    onCopy,
    onExportPdf,
    onExportWord,
  },
  ref,
) {
  return (
    <section className="ai-panel glass rounded-3xl p-5 sm:p-7 animate-fadeUp" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Converted Output</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-mint-500/10 border border-mint-400/30 text-mint-300 uppercase tracking-wider">
            {convBadgeText}
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCopy} className="btn-ghost inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <DownloadMenu disabled={isEmpty} onExportPdf={onExportPdf} onExportWord={onExportWord} />
        </div>
      </div>

      <div
        ref={ref}
        className="doc-surface nice-scroll overflow-auto"
        style={{ height: 'clamp(380px, 48vh, 520px)' }}
      >
        <div
          ref={innerRef}
          className={`doc-page doc-content${isEmpty ? '' : ' doc-academic-root'}`}
          {...(!isEmpty && articleHtml
            ? { dangerouslySetInnerHTML: { __html: articleHtml } }
            : {})}
        >
          {isEmpty ? <EmptyOutputState /> : null}
        </div>
      </div>

      <DiffSummary diffRows={diffRows} diffRuleCount={diffRuleCount} emptyMessage={diffEmptyMessage} />
    </section>
  )
})

export default OutputPanel
