export default function Navbar() {
  return (
    <header className="nav-sticky">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-mint-400 to-emerald-600 shadow-glow-mint">
            <span className="font-display italic text-[#04130c] text-lg leading-none">G</span>
          </span>
          <div className="leading-tight">
            <div className="font-display text-2xl tracking-tight text-white">Glyph</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40 -mt-1">by Bibcit</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <a href="#" className="hover:text-white transition">
            Playground
          </a>
          <a href="#" className="hover:text-white transition">
            Docs
          </a>
          <a href="#" className="hover:text-white transition">
            Reference
          </a>
          <a href="#" className="hover:text-white transition">
            API
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#" className="hidden sm:inline-flex text-sm text-white/70 hover:text-white transition">
            Sign in
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full glass hover:border-mint-400/40 transition"
          >
            Get started
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}
