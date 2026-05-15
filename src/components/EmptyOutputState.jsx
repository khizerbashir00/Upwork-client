export default function EmptyOutputState() {
  return (
    <div className="h-full grid place-items-center text-center min-h-[300px]">
      <div>
        <div className="mx-auto w-14 h-14 rounded-2xl empty-icon grid place-items-center mb-4">
          <span className="font-display italic text-mint-300 text-3xl leading-none">∑</span>
        </div>
        <p className="text-sm text-white/55" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Output appears here as you type
        </p>
        <p className="text-xs text-white/30 mt-1 font-mono">paste · auto-convert · copy</p>
      </div>
    </div>
  )
}
