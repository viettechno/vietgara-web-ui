import { CircleAlert, CircleCheck, Info, OctagonAlert, type LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--muted)_25%,var(--accent)_50%,var(--muted)_75%)] bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  )
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn('inline-block', className)}>
      <span className="block size-4 animate-spin-slow rounded-full border-2 border-muted-foreground/30 border-t-primary" aria-hidden />
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}

type AlertTone = 'info' | 'success' | 'warning' | 'destructive'
const alertIcons: Record<AlertTone, LucideIcon> = { info: Info, success: CircleCheck, warning: CircleAlert, destructive: OctagonAlert }
const alertStyles: Record<AlertTone, string> = {
  info: 'border-info/30 bg-info-subtle text-info-subtle-foreground',
  success: 'border-success/30 bg-success-subtle text-success-subtle-foreground',
  warning: 'border-warning/40 bg-warning-subtle text-warning-subtle-foreground',
  destructive: 'border-destructive/30 bg-destructive-subtle text-destructive-subtle-foreground',
}

type AlertProps = { tone: AlertTone; title: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }

/** An inline notice the user must see and may act on. Transient feedback belongs in a Toast. */
export function Alert({ tone, title, children, action, className }: AlertProps) {
  const Icon = alertIcons[tone]
  return (
    <div
      role={tone === 'destructive' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-lg border p-4 max-sm:flex-wrap', alertStyles[tone], className)}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium">{title}</p>
        {children && <div className="mt-0.5 text-body opacity-90">{children}</div>}
      </div>
      {action && <div className="shrink-0 max-sm:w-full max-sm:[&>*]:w-full">{action}</div>}
    </div>
  )
}

/** Shared reminder shown after sending an e-mail OTP. */
export function OtpEmailNotice({ locale }: { locale: 'en' | 'vi' }) {
  const message =
    locale === 'en'
      ? "If you don't see the e-mail, check your spam or junk folder."
      : 'Nếu không thấy email, hãy kiểm tra thư mục thư rác (Spam/Junk).'

  return <Alert tone="info" title={message} />
}

/** Duotone spot illustrations for empty and error states (decorative). */
export function Illustration({ kind, className }: { kind: 'list' | 'search' | 'error'; className?: string }) {
  const common = { viewBox: '0 0 120 90', fill: 'none', 'aria-hidden': true, className: cn('h-[90px] w-[120px]', className) } as const
  if (kind === 'search')
    return (
      <svg {...common}>
        <rect x="10" y="62" width="100" height="6" rx="3" fill="var(--muted)" />
        <circle cx="52" cy="38" r="20" fill="var(--primary-subtle)" stroke="var(--primary)" strokeWidth="3" />
        <path d="m67 53 18 18" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
        <path d="M44 38h16" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" opacity=".5" />
      </svg>
    )
  if (kind === 'error')
    return (
      <svg {...common}>
        <rect x="10" y="66" width="100" height="6" rx="3" fill="var(--muted)" />
        <path d="M60 14 98 62H22L60 14Z" fill="var(--warning-subtle)" stroke="var(--warning)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M60 32v14" stroke="var(--warning)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="54" r="2.5" fill="var(--warning)" />
      </svg>
    )
  return (
    <svg {...common}>
      <rect x="8" y="66" width="104" height="6" rx="3" fill="var(--muted)" />
      <path
        d="M22 60V46l8-14c1-2 3-3 5-3h50c2 0 4 1 5 3l8 14v14H22Z"
        fill="var(--primary-subtle)"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M33 46h54" stroke="var(--primary)" strokeWidth="3" opacity=".5" />
      <circle cx="40" cy="60" r="7" fill="var(--surface)" stroke="var(--primary)" strokeWidth="3" />
      <circle cx="80" cy="60" r="7" fill="var(--surface)" stroke="var(--primary)" strokeWidth="3" />
    </svg>
  )
}

type StateProps = {
  title?: ReactNode
  message: ReactNode
  action?: ReactNode
  kind?: 'list' | 'search' | 'error'
  className?: string
  compact?: boolean
}

/** Centered empty / no-results / error state with at most one primary action. */
export function EmptyState({ title, message, action, kind = 'list', className, compact }: StateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 text-center', compact ? 'py-8' : 'py-14', className)}>
      <Illustration kind={kind} />
      {title && <h2 className="mt-4 text-subheading">{title}</h2>}
      <p className={cn('max-w-sm text-body text-muted-foreground', title ? 'mt-1' : 'mt-4')}>{message}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
