import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Skeleton } from './Feedback'

type StatProps = { label: string; value: ReactNode; hint?: ReactNode; loading?: boolean; tone?: 'default' | 'warning' | 'destructive' }

/** Headline figures in one panel with hairline dividers (not three icon cards). */
export function StatStrip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:divide-x sm:divide-y-0',
        className,
      )}
    >
      {children}
    </dl>
  )
}

export function Stat({ label, value, hint, loading, tone = 'default' }: StatProps) {
  return (
    <div className="px-5 py-4">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="mt-1">
        {loading ? (
          <Skeleton className="mt-2 h-7 w-28" />
        ) : (
          <span
            className={cn(
              'num text-title',
              tone === 'warning' && 'text-warning-subtle-foreground',
              tone === 'destructive' && 'text-destructive-subtle-foreground',
            )}
          >
            {value}
          </span>
        )}
        {hint && !loading && <span className="mt-0.5 block text-caption text-muted-foreground">{hint}</span>}
      </dd>
    </div>
  )
}

type MeterProps = { value: number; max: number; label: string }

/** A usage bar: neutral, warning from 80%, destructive at the limit. */
export function Meter({ value, max, label }: MeterProps) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0
  const tone = ratio >= 1 ? 'bg-destructive' : ratio >= 0.8 ? 'bg-warning' : 'bg-primary'
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className={cn('h-full rounded-full transition-[width] duration-300', tone)} style={{ width: `${ratio * 100}%` }} />
    </div>
  )
}
