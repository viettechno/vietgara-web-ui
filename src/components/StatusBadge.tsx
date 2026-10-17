import { CircleAlert, CircleCheck, CircleDot, Clock, Info } from 'lucide-react'
import { Badge } from './Badge'

export type StatusTone = 'active' | 'pending' | 'danger' | 'info' | 'neutral'

type StatusBadgeProps = {
  tone: StatusTone
  label: string
}

const TONES = {
  active: { tone: 'success', icon: CircleCheck },
  pending: { tone: 'warning', icon: Clock },
  danger: { tone: 'destructive', icon: CircleAlert },
  info: { tone: 'info', icon: Info },
  neutral: { tone: 'neutral', icon: CircleDot },
} as const

/** A status always pairs its color with an icon and visible text. */
export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const { tone: badgeTone, icon: Icon } = TONES[tone]
  return (
    <Badge tone={badgeTone} icon={<Icon aria-hidden />}>
      {label}
    </Badge>
  )
}
