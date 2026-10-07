import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'destructive'

export const badgeVariants = cva(
  'inline-flex h-[22px] shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-2 text-caption [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        info: 'bg-info-subtle text-info-subtle-foreground',
        success: 'bg-success-subtle text-success-subtle-foreground',
        warning: 'bg-warning-subtle text-warning-subtle-foreground',
        destructive: 'bg-destructive-subtle text-destructive-subtle-foreground',
      },
      solid: { true: '', false: '' },
    },
    compoundVariants: [
      { tone: 'neutral', solid: true, class: 'bg-foreground text-background' },
      { tone: 'info', solid: true, class: 'bg-info text-info-foreground' },
      { tone: 'success', solid: true, class: 'bg-success text-success-foreground' },
      { tone: 'warning', solid: true, class: 'bg-warning text-warning-foreground' },
      { tone: 'destructive', solid: true, class: 'bg-destructive text-destructive-foreground' },
    ],
    defaultVariants: { tone: 'neutral', solid: false },
  },
)

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { icon?: ReactNode }

/** A status label. Always text, optionally with an icon: color is never the only signal. */
export function Badge({ tone, solid, icon, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, solid }), className)} {...props}>
      {icon}
      {children}
    </span>
  )
}

/** A small number pill (tabs, nav items, board columns). */
export function Count({ className, children, tone = 'muted', ...props }: ComponentProps<'span'> & { tone?: 'muted' | 'primary' }) {
  return (
    <span
      className={cn(
        'inline-grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-caption tabular-nums',
        tone === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
