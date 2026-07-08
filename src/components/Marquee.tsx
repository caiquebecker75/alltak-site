// Infinite scrolling brand strip — a trapezoid separator with attitude.
export default function Marquee({
  items,
  reverse = false,
  className = '',
}: {
  items: string[]
  reverse?: boolean
  className?: string
}) {
  const row = [...items, ...items]
  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div
        className={`flex w-max whitespace-nowrap ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-display text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
              {t}
            </span>
            <span className="text-alltak-blue" aria-hidden>
              {/* trapezoid bullet */}
              <span className="inline-block h-3 w-5 bg-alltak-blue clip-escudo align-middle" />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
