import { useEffect, useRef, useState } from 'react'

export default function DownloadMenu({ disabled, onExportPdf, onExportWord }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="btn-ghost inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:pointer-events-none"
      >
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-[60] min-w-[220px] rounded-xl glass border border-white/10 py-1 shadow-xl"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-3 py-2.5 text-xs font-medium text-white/85 hover:bg-white/5 transition flex items-center gap-2"
            onClick={() => {
              onExportPdf()
              setOpen(false)
            }}
          >
            <span className="font-mono text-[10px] text-mint-300/90 uppercase tracking-wider">PDF</span>
            Download as PDF
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-3 py-2.5 text-xs font-medium text-white/85 hover:bg-white/5 transition flex items-center gap-2 border-t border-white/5"
            onClick={() => {
              onExportWord()
              setOpen(false)
            }}
          >
            <span className="font-mono text-[10px] text-mint-300/90 uppercase tracking-wider">Word</span>
            Download for Word (.doc)
          </button>
        </div>
      ) : null}
    </div>
  )
}
