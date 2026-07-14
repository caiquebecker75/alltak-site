// Format 01 — a horizontal band of alternating trapezoids (keystone + inverted)
// that tessellate into a zigzag. The signature Alltak separator between sections.
export default function TrapDivider({
  color = '#0080ff',
  count = 14,
  className = '',
}: {
  color?: string
  count?: number
  className?: string
}) {
  return (
    <div className={`flex h-6 w-full overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-full flex-1 ${i % 2 === 0 ? 'clip-tz' : 'clip-tz-alt'}`}
          style={{ background: color, opacity: i % 2 === 0 ? 1 : 0.55 }}
        />
      ))}
    </div>
  )
}
