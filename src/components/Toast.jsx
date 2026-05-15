export default function Toast({ message, visible, accent = '#4ee5a8' }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl glass text-sm text-white/90 transition-all duration-300 flex items-center gap-2 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      style={{ boxShadow: visible ? `0 0 40px -10px ${accent}66` : undefined }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4ee5a8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{message}</span>
    </div>
  )
}
