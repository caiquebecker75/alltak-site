import logoUrl from '../brand/alltak-logo.png'
import escudoUrl from '../brand/escudo-oficial.png'

type Props = {
  className?: string
  onDark?: boolean
  /** 'wordmark' = bare ALLTAK®; 'escudo' = official blue trapezoid lockup */
  variant?: 'wordmark' | 'escudo'
}

// Official Alltak marks (from the brand's final files):
// - wordmark: ALLTAK® with the skull inside the "A" (white-filtered on dark)
// - escudo: the official blue-trapezoid lockup, straight from AF-ALLTAK-LOGO-CV
export default function Logo({ className = '', onDark = true, variant = 'wordmark' }: Props) {
  if (variant === 'escudo') {
    return <img src={escudoUrl} alt="Alltak" className={`w-auto select-none ${className}`} draggable={false} />
  }
  return (
    <img
      src={logoUrl}
      alt="Alltak"
      className={`w-auto select-none ${className}`}
      style={onDark ? { filter: 'brightness(0) invert(1)' } : undefined}
      draggable={false}
    />
  )
}
