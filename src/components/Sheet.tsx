import { X } from 'lucide-react'
import { Dialog as D } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

export const Sheet = D.Root
export const SheetTrigger = D.Trigger

const sides = {
  left: 'inset-y-0 left-0 w-[min(20rem,88vw)] border-r data-[state=open]:animate-sheet-left-in data-[state=closed]:animate-sheet-left-out',
  right:
    'inset-y-0 right-0 w-[min(30rem,100vw)] border-l data-[state=open]:animate-sheet-right-in data-[state=closed]:animate-sheet-right-out',
} as const

type SheetContentProps = ComponentProps<typeof D.Content> & {
  side?: keyof typeof sides
  title: string
  closeLabel: string
  bare?: boolean
  description?: ReactNode
}

/** An edge panel for phone navigation, filters and record detail. */
export function SheetContent({ side = 'right', title, closeLabel, bare, description, className, children, ...props }: SheetContentProps) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-backdrop data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
      <D.Content
        aria-describedby={undefined}
        className={cn(
          'fixed z-50 flex flex-col border-border bg-popover text-popover-foreground shadow-lg outline-none',
          sides[side],
          className,
        )}
        {...props}
      >
        <D.Title className={bare ? 'sr-only' : 'border-b border-border px-5 py-4 pr-14 text-subheading'}>{title}</D.Title>
        {description && !bare ? <D.Description className="px-5 pt-2 text-body text-muted-foreground">{description}</D.Description> : null}
        {children}
        <D.Close
          aria-label={closeLabel}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground pointer-coarse:size-11"
        >
          <X className="size-4" aria-hidden />
        </D.Close>
      </D.Content>
    </D.Portal>
  )
}
