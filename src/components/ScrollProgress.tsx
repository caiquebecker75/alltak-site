import { useEffect, useState } from 'react'
import { onScrollChange } from '../lib/onScrollChange'

// Thin brand-blue progress bar fixed to the very top of the viewport.
export default function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    return onScrollChange(() => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0)
    })
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-alltak-blueDark via-alltak-blue to-alltak-blueLight transition-[width] duration-150"
        style={{ width: `${p}%` }}
      />
    </div>
  )
}
