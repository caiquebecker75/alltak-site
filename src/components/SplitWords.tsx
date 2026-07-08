import { useEffect, useRef, useState } from 'react'

// Headline reveal: each word slides up from a clipped line, staggered,
// when the element enters the viewport.
export default function SplitWords({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 60,
  accent = [] as string[],
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  stagger?: number
  accent?: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      if (el.getBoundingClientRect().top < innerHeight * 0.88) {
        setOn(true)
        return true
      }
      return false
    }
    if (check()) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.2 })
    io.observe(el)
    const onScroll = () => check() && removeEventListener('scroll', onScroll)
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
    }
  }, [])

  const words = text.split(' ')
  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span
              className={`inline-block will-change-transform ${accent.includes(w.toLowerCase().replace(/[^a-zà-ú]/g, '')) ? 'text-alltak-blue' : ''}`}
              style={{
                transform: on ? 'translateY(0)' : 'translateY(115%)',
                transition: `transform .8s cubic-bezier(.2,.7,.1,1) ${i * stagger}ms`,
              }}
            >
              {w}
            </span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </Tag>
    </div>
  )
}
