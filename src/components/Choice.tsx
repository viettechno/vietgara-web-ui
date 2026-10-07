import { Switch as S } from 'radix-ui'
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useFieldProps } from './Field'

const check = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3.5 8.5 3 3 6-7'/%3E%3C/svg%3E")`
const dot = `radial-gradient(circle, white 0 3px, transparent 3.5px)`

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
  description?: ReactNode
  wrapperClassName?: string
}

function Choice({ kind, label, description, className, wrapperClassName, ...props }: ChoiceProps & { kind: 'checkbox' | 'radio' }) {
  const field = useFieldProps()
  return (
    <label
      className={cn(
        'flex items-start gap-2.5 text-body text-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60',
        wrapperClassName,
      )}
    >
      <input
        type={kind}
        {...field}
        {...props}
        style={{ '--mark': kind === 'checkbox' ? check : dot } as CSSProperties}
        className={cn(
          'mt-0.5 size-4 shrink-0 appearance-none border border-input bg-surface bg-(image:--mark) bg-no-repeat bg-[length:0] transition-colors duration-100 hover:border-foreground/50 checked:border-primary checked:bg-primary checked:bg-[length:100%_100%] indeterminate:bg-primary pointer-coarse:size-5',
          kind === 'checkbox' ? 'rounded-sm' : 'rounded-full',
          className,
        )}
      />
      <span className="min-w-0">
        {label}
        {description && <span className="block text-caption text-muted-foreground">{description}</span>}
      </span>
    </label>
  )
}

/** A native checkbox styled to the system, with its label. Use for multi-select and "agree" flags. */
export function Checkbox(props: ChoiceProps) {
  return <Choice kind="checkbox" {...props} />
}

export function Radio(props: ChoiceProps) {
  return <Choice kind="radio" {...props} />
}

type SwitchProps = { checked: boolean; onCheckedChange: (checked: boolean) => void; label: string; disabled?: boolean; name?: string }

/** An immediate on/off setting. Never inside a form with a Save button (use Checkbox there). */
export function Switch({ checked, onCheckedChange, label, disabled, name }: SwitchProps) {
  return (
    <S.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      disabled={disabled}
      name={name}
      className="relative h-5 w-9 shrink-0 rounded-full border border-input bg-muted transition-colors duration-100 data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <S.Thumb className="block size-3.5 translate-x-0.5 rounded-full bg-foreground shadow-sm transition-transform duration-100 data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground" />
    </S.Root>
  )
}
