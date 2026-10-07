import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { cn } from '../lib/cn'

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-colors duration-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:translate-y-px',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-accent active:translate-y-px',
        outline: 'border border-input bg-surface text-foreground hover:bg-accent active:translate-y-px',
        ghost: 'text-foreground hover:bg-accent',
        destructive: 'bg-destructive text-destructive-foreground hover:brightness-95 active:translate-y-px',
        link: 'h-auto rounded-sm p-0 text-primary-subtle-foreground underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-3.5',
        lg: 'h-10 px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Renders the child element (e.g. a router Link) with button styling. */
    asChild?: boolean
    /** Shows a spinner in place of the leading icon and blocks clicks; the label and width stay. */
    loading?: boolean
    ref?: Ref<HTMLButtonElement>
  }

export function Button({ className, variant, size, asChild, loading, disabled, children, type, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), 'pointer-coarse:min-h-11', className)
  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    )
  }
  return (
    <button type={type ?? 'button'} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Loader2 className="animate-spin-slow" aria-hidden />}
      {children}
    </button>
  )
}
