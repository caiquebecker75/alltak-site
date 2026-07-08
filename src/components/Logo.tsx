import logoUrl from '../brand/alltak-logo.png'

type Props = { className?: string; onDark?: boolean }

// Official Alltak wordmark — "ALLTAK®" with the skull inside the "A".
// On dark surfaces it renders as a clean white monochrome (the treatment used
// on the brand's own dark banners); on light it keeps the brand blue.
export default function Logo({ className = '', onDark = true }: Props) {
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
