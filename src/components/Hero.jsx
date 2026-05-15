export default function Hero() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full glass text-xs font-mono uppercase tracking-[0.18em] text-white/60 animate-fadeUp">
        <span className="w-1.5 h-1.5 rounded-full bg-mint-400 shadow-glow-mint" />
        Operators · Greek · Math · Set Theory · Logic · Currency · Chemistry
      </div>

      <h1
        className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight title-gradient animate-fadeUp"
        style={{ animationDelay: '0.05s' }}
      >
        Intelligent <em className="italic text-mint-300">Symbol</em> Engine
      </h1>

      <div className="mt-5 flex items-center justify-center gap-2 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
        <span className="pulse-ring inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-500/15 border border-mint-400/30 text-mint-300 text-xs font-medium tracking-wide">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="6" />
          </svg>
          Live
        </span>
      </div>

      <p
        className="mt-5 text-base sm:text-lg text-white/60 max-w-xl mx-auto animate-fadeUp"
        style={{ animationDelay: '0.15s' }}
      >
        Paste any paragraph, code, or assignment — Glyph auto-detects programming and keyword tokens, and rewrites them
        as <span className="text-mint-300">proper mathematical notation</span>.
      </p>

      <div className="mt-8 hairline max-w-md mx-auto" />
    </section>
  )
}
