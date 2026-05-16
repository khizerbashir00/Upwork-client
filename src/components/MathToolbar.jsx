import { memo } from 'react'
import { MATH_TOOLBAR_ACTIONS } from '../utils/mathTemplates'

function MathToolbar({ onAction, disabled }) {
  return (
    <div className="math-toolbar-wrap mb-3">
      <div className="math-toolbar nice-scroll" role="toolbar" aria-label="Math formatting">
        <span className="math-toolbar-label">Math</span>
        {MATH_TOOLBAR_ACTIONS.map((action) => {
          if (action.type === 'script') {
            return (
              <button
                key={action.id}
                type="button"
                className="math-toolbar-btn"
                onClick={() => onAction(action)}
                disabled={disabled}
                title={action.title}
                aria-label={action.title}
              >
                {action.mode === 'sup' ? (
                  <>
                    x<sup className="math-toolbar-sup">2</sup>
                  </>
                ) : (
                  <>
                    H<sub className="math-toolbar-sub">2</sub>O
                  </>
                )}
              </button>
            )
          }
          if (action.type === 'modal') {
            return (
              <button
                key={action.id}
                type="button"
                className="math-toolbar-btn math-toolbar-btn--latex"
                onClick={() => onAction(action)}
                disabled={disabled}
                title={action.title}
                aria-label={action.title}
              >
                <span className="math-toolbar-tex">TeX</span>
                {action.label}
              </button>
            )
          }
          return (
            <button
              key={action.id}
              type="button"
              className="math-toolbar-btn math-toolbar-btn--icon"
              onClick={() => onAction(action)}
              disabled={disabled}
              title={action.title}
              aria-label={action.title}
            >
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(MathToolbar)
