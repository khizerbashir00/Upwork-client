import { CATEGORIES } from '../utils/conversionEngine'

export default function CategoryChips({ activeCategories, onToggle, onAllOn, onAllOff }) {
  return (
    <div className="mt-5 pt-5 border-t border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Conversion categories</span>
        <div className="flex gap-3 text-[10px] font-mono uppercase tracking-wider">
          <button type="button" onClick={onAllOn} className="text-mint-300 hover:text-mint-400 transition">
            All on
          </button>
          <button type="button" onClick={onAllOff} className="text-white/40 hover:text-white/70 transition">
            All off
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const active = activeCategories.has(key)
          return (
            <button
              key={key}
              type="button"
              className={`chip${active ? ' active' : ''}`}
              onClick={() => onToggle(key)}
            >
              <span className="glyph">{cat.glyph}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
