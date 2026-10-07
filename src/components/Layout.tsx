import type { ComponentProps, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

/** Page container: owns gutters, max width and vertical rhythm. */
export function PageLayout({ className, wide, ...props }: ComponentProps<'div'> & { wide?: boolean }) {
  return (
    <div
      className={cn('mx-auto flex w-full flex-col gap-6 px-4 py-6 md:px-6 lg:px-8', wide ? 'max-w-none' : 'max-w-[1280px]', className)}
      {...props}
    />
  )
}

type BreadcrumbItem = { label: ReactNode; href?: string }

export function Breadcrumb({
  items,
  label,
  renderLink,
}: {
  items: BreadcrumbItem[]
  label: string
  renderLink: (item: BreadcrumbItem) => ReactNode
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-1 text-caption text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-foreground' : undefined}>
                  {item.label}
                </span>
              ) : (
                renderLink(item)
              )}
              {!last && <ChevronRight className="size-3.5" aria-hidden />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

type PageHeaderProps = { title: ReactNode; description?: ReactNode; breadcrumb?: ReactNode; actions?: ReactNode; meta?: ReactNode }

/** Title row: breadcrumb on detail pages, title (+ status), optional one-line description, actions on the right. */
export function PageHeader({ title, description, breadcrumb, actions, meta }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      {breadcrumb}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-title text-foreground">{title}</h1>
            {meta}
          </div>
          {description && <p className="mt-1 text-body text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:[&>*]:flex-1">{actions}</div>}
      </div>
    </header>
  )
}

/** A hairline-bordered surface: tables, forms, lists. Not for every section. */
export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-surface text-surface-foreground', className)} {...props} />
  )
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-border px-5 py-4', className)}>
      <div className="min-w-0">
        <h2 className="text-heading">{title}</h2>
        {description && <p className="mt-0.5 text-body text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

export function PanelBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-5 max-sm:p-4', className)} {...props} />
}

/** A title + content block without a box: for sections that need hierarchy but not a border. */
export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-heading">{title}</h2>
          {description && <p className="mt-0.5 text-body text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

/** Key-value details: labels above values, in a responsive grid. */
export function DescriptionList({ items, className }: { items: Array<{ label: ReactNode; value: ReactNode }>; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-6 gap-y-4', className)}>
      {items.map((item, index) => (
        <div key={index} className="min-w-0">
          <dt className="text-caption text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 break-words text-body text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A bar of actions pinned to the bottom of the viewport while a long form is on screen. */
export function StickyActionBar({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8',
        className,
      )}
      {...props}
    />
  )
}
