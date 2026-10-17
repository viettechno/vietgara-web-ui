import type { ReactNode } from 'react'
import { Alert } from './Feedback'

type AlertBannerProps = {
  tone: 'info' | 'warning' | 'error' | 'success'
  title: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}

/** Application-facing alert that uses `error` rather than the design system's `destructive` tone. */
export function AlertBanner({ tone, ...props }: AlertBannerProps) {
  return <Alert tone={tone === 'error' ? 'destructive' : tone} {...props} />
}
