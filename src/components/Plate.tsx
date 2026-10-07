import { cn } from '../lib/cn'

/** The vehicle's license plate: the product's recurring identity element. */
export function PlateChip({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-sm border-[1.5px] border-plate-foreground bg-plate px-1.5 py-px font-mono text-[12px] font-medium leading-4 tracking-[0.04em] text-plate-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Money text with the currency symbol de-emphasized and tabular figures. `text` comes pre-formatted from Intl. */
export function Money({ text, className }: { text: string; className?: string }) {
  const m = text.match(/^(\D*?)(-?[\d.,\s]*\d)(\s*\D*)$/)
  if (!m) return <span className={cn('num', className)}>{text}</span>
  const [, prefix, number, suffix] = m
  return (
    <span className={cn('num whitespace-nowrap', className)}>
      {prefix && <span className="text-muted-foreground">{prefix}</span>}
      {number}
      {suffix && <span className="ml-0.5 text-muted-foreground">{suffix.trim()}</span>}
    </span>
  )
}
