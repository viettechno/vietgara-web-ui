import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

type TableProps = ComponentProps<'table'> & {
  compact?: boolean
  /** Stack rows into cards below md (every cell then needs a `label`). */ stack?: boolean
  caption?: string
}

/** Ledger-style table: hairline row rules, sticky-ready header, numbers right-aligned. */
export function Table({ className, compact, stack = true, caption, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        data-stack={stack ? '' : undefined}
        data-compact={compact ? '' : undefined}
        className={cn('w-full text-left text-body', className)}
        {...props}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  )
}

export const TableHead = ({ className, ...props }: ComponentProps<'thead'>) => (
  <thead className={cn('bg-surface-sunken', className)} {...props} />
)
export const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
  <tbody className={cn('divide-y divide-border', className)} {...props} />
)

type RowProps = ComponentProps<'tr'> & {
  /** A 3px status rail at the row's start. */ rail?: 'warning' | 'destructive' | 'success' | 'info'
}
const rails = {
  warning: 'max-md:shadow-[inset_3px_0_0_0_var(--warning)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--warning)]',
  destructive: 'max-md:shadow-[inset_3px_0_0_0_var(--destructive)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--destructive)]',
  success: 'max-md:shadow-[inset_3px_0_0_0_var(--success)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--success)]',
  info: 'max-md:shadow-[inset_3px_0_0_0_var(--info)] md:[&>td:first-child]:shadow-[inset_3px_0_0_0_var(--info)]',
}

export function TableRow({ className, rail, ...props }: RowProps) {
  return (
    <tr className={cn('transition-colors hover:bg-accent/60 aria-selected:bg-primary-subtle', rail && rails[rail], className)} {...props} />
  )
}

export function TableHeaderCell({ className, numeric, ...props }: ComponentProps<'th'> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-border bg-surface-sunken px-4 py-2.5 text-caption font-medium text-muted-foreground',
        numeric && 'text-right',
        className,
      )}
      {...props}
    />
  )
}

type CellProps = ComponentProps<'td'> & {
  numeric?: boolean
  /** Label shown beside the value in the stacked (phone) layout. */ label?: string
  primary?: boolean
  actions?: boolean
}

export function TableCell({ className, numeric, label, primary, actions, ...props }: CellProps) {
  return (
    <td
      data-label={label}
      data-primary={primary ? '' : undefined}
      data-actions={actions ? '' : undefined}
      className={cn(
        'px-4 align-middle text-foreground [table:not([data-compact])_&]:h-12 [table[data-compact]_&]:h-10',
        numeric && 'num text-right',
        primary && 'font-medium',
        actions && 'w-px whitespace-nowrap text-right',
        className,
      )}
      {...props}
    />
  )
}

type PaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  summary: string
  previousLabel: string
  nextLabel: string
}

/** Footer of a table panel: range summary on the left, previous / next on the right. */
export function Pagination({ page, pageSize, total, onPageChange, summary, previousLabel, nextLabel }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const btn =
    'inline-flex h-8 items-center rounded-md border border-input bg-surface px-3 text-caption text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface pointer-coarse:min-h-11'
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
      <p className="num text-caption text-muted-foreground">{summary}</p>
      <div className="flex gap-2">
        <button type="button" className={btn} onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          {previousLabel}
        </button>
        <button type="button" className={btn} onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
          {nextLabel}
        </button>
      </div>
    </nav>
  )
}
