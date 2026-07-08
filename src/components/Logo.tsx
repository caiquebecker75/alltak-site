import logoUrl from '../brand/alltak-logo.png'

type Props = {
  className?: string
  onDark?: boolean
  /** 'wordmark' = bare ALLTAK®; 'escudo' = wordmark inside the brand blue trapezoid */
  variant?: 'wordmark' | 'escudo'
}

// Official Alltak wordmark — "ALLTAK®" with the skull inside the "A".
// The "escudo" variant places it inside the brand's signature blue trapezoid,
// the lockup the guide defines for use over photos/textures.
export default function Logo({ className = '', onDark = true, variant = 'wordmark' }: Props) {
  const img = (
    <img
      src={logoUrl}
      alt="Alltak"
      className={variant === 'escudo' ? 'w-auto select-none' : `w-auto select-none ${className}`}
      style={onDark || variant === 'escudo' ? { filter: 'brightness(0) invert(1)' } : undefined}
      draggable={false}
    />
  )

  if (variant === 'escudo') {
    return (
      <span className={`clip-escudo inline-flex items-center justify-center bg-alltak-blue px-8 pb-3 pt-2.5 ${className}`}>
        {img}
      </span>
    )
  }
  return img
}
