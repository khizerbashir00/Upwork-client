export default function DiffSummary({ diffRows, diffRuleCount, emptyMessage }) {
  return (
    <div className="mt-5 pt-5 border-t border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Conversion summary</span>
        <span className="font-mono text-[10px] text-white/35">
          <span>{diffRuleCount}</span> rules applied
        </span>
      </div>
      <div className="nice-scroll max-h-32 overflow-auto pr-2 space-y-1">
        {diffRows.length === 0 ? (
          <p className="text-[11px] text-white/30 font-mono italic">{emptyMessage}</p>
        ) : (
          diffRows.map((s) => (
            <div key={`${s.from}→${s.to}`} className="diff-row">
              <span className="diff-from">{s.from}</span>
              <span className="diff-arrow">→</span>
              <span className="diff-to">{s.to}</span>
              <span className="diff-count">×{s.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
