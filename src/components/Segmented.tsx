import { ToggleGroup } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type SegmentedProps<T extends string> = {
  value: T
  onValueChange: (value: T) => void
  options: Array<{ value: T; label: ReactNode }>
  label: string
  disabled?: boolean
  className?: string
}

/** Two to four modes of one setting (not a dropdown, not a tab bar). */
export function SegmentedControl<T extends string>({ value, onValueChange, options, label, disabled, className }: SegmentedProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && onValueChange(next as T)}
      aria-label={label}
      disabled={disabled}
      className={cn('inline-flex w-fit rounded-md border border-input bg-muted p-0.5', className)}
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="inline-flex h-7 items-center rounded-sm px-3 text-body font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-surface data-[state=on]:text-foreground data-[state=on]:shadow-sm pointer-coarse:min-h-10"
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
