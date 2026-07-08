type Props = { className?: string; onDark?: boolean }

// Alltak wordmark rebuilt in the brand typeface (Big Shoulders Display)
// with the signature red accent square.
export default function Logo({ className = '', onDark = true }: Props) {
  return (
    <span
      className={`inline-flex items-center font-display font-black uppercase leading-none tracking-tight ${className}`}
    >
      <span className={onDark ? 'text-white' : 'text-alltak-black'}>ALLTAK</span>
      <span className="ml-1 h-2 w-2 translate-y-[0.35em] bg-alltak-red" aria-hidden />
    </span>
  )
}
