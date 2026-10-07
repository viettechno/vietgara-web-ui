import type { ReactNode } from 'react'
import { Tooltip } from './Tooltip'
import { Button, type ButtonProps } from './Button'

type IconButtonProps = Omit<ButtonProps, 'children' | 'aria-label' | 'asChild'> & {
  /** Required accessible name; also shown as a tooltip. */
  label: string
  icon: ReactNode
}

/** A square icon-only button. The label is both its accessible name and its tooltip. */
export function IconButton({ label, icon, variant = 'ghost', size = 'icon', ...props }: IconButtonProps) {
  return (
    <Tooltip content={label}>
      <Button variant={variant} size={size} aria-label={label} data-touch {...props}>
        {icon}
      </Button>
    </Tooltip>
  )
}
