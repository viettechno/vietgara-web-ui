import { AlertCircle } from 'lucide-react'
import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '../lib/cn'

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean; required: boolean }
const FieldContext = createContext<FieldContextValue | null>(null)

/** Props a control gets from its enclosing Field (id, aria-describedby, aria-invalid, aria-required). */
export function useFieldProps(): { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: true; 'aria-required'?: true } {
  const ctx = useContext(FieldContext)
  if (!ctx) return {}
  return {
    id: ctx.id,
    'aria-describedby': ctx.describedBy,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
  }
}

type FieldProps = {
  label: ReactNode
  /** Helper text under the control. */
  hint?: ReactNode
  /** Validation message; replaces the hint and marks the control invalid. */
  error?: ReactNode
  required?: boolean
  className?: string
  /** Visually hide the label (it stays for assistive technology). */
  hideLabel?: boolean
  children: ReactNode
}

/** The one way to place a control in a form: label, control, hint or error, all wired for assistive technology. */
export function Field({ label, hint, error, required, className, hideLabel, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const hasMessage = Boolean(error || hint)
  return (
    <FieldContext.Provider
      value={{ id, describedBy: hasMessage ? messageId : undefined, invalid: Boolean(error), required: Boolean(required) }}
    >
      <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
        <label htmlFor={id} className={cn('text-body font-medium text-foreground', hideLabel && 'sr-only')}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive-subtle-foreground" aria-hidden>
              *
            </span>
          )}
        </label>
        {children}
        {hasMessage &&
          (error ? (
            <p id={messageId} className="flex items-start gap-1.5 text-caption text-destructive-subtle-foreground">
              <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
              <span>{error}</span>
            </p>
          ) : (
            <p id={messageId} className="text-caption text-muted-foreground">
              {hint}
            </p>
          ))}
      </div>
    </FieldContext.Provider>
  )
}
