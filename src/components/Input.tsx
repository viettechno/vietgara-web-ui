import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/cn'
import { useFieldProps } from './Field'

export const controlClasses =
  'w-full rounded-md border border-input bg-surface px-3 text-body text-foreground transition-colors duration-100 placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:border-input aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:outline-destructive pointer-coarse:text-body-lg'

export function Input({ className, ref, ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  const field = useFieldProps()
  return <input ref={ref} {...field} {...props} className={cn(controlClasses, 'h-9 pointer-coarse:h-11', className)} />
}

export function Textarea({ className, ref, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  const field = useFieldProps()
  return <textarea ref={ref} {...field} {...props} className={cn(controlClasses, 'min-h-20 py-2 leading-5', className)} />
}

type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & { ref?: Ref<HTMLSelectElement>; wrapperClassName?: string }

/** A native select (form-friendly, best on touch) with the design system's trigger styling. */
export function NativeSelect({ className, wrapperClassName, children, ref, ...props }: NativeSelectProps) {
  const field = useFieldProps()
  return (
    <span className={cn('relative block', wrapperClassName)}>
      <select ref={ref} {...field} {...props} className={cn(controlClasses, 'h-9 appearance-none pr-9 pointer-coarse:h-11', className)}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </span>
  )
}

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { icon: ReactNode; clearLabel?: string; onClear?: () => void }

/** A text input with a leading icon (pass the 16px search glyph). */
export function SearchInput({ icon, className, onClear, clearLabel, value, ...props }: SearchInputProps) {
  const field = useFieldProps()
  return (
    <span className="relative block w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <input
        type="search"
        {...field}
        {...props}
        value={value}
        className={cn(
          controlClasses,
          'h-9 pl-9 pointer-coarse:h-11 [&::-webkit-search-cancel-button]:hidden',
          onClear && value ? 'pr-9' : '',
          className,
        )}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel ?? 'Clear'}
          className="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <span aria-hidden className="text-body leading-none">
            ×
          </span>
        </button>
      ) : null}
    </span>
  )
}
