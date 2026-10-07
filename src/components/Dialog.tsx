import { X } from 'lucide-react'
import { Dialog as D } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'

export const Dialog = D.Root
export const DialogTrigger = D.Trigger
export const DialogClose = D.Close

const sizes = { sm: 'sm:w-[400px]', md: 'sm:w-[480px]', lg: 'sm:w-[720px]' } as const

type DialogContentProps = ComponentProps<typeof D.Content> & {
  size?: keyof typeof sizes
  closeLabel: string
  /** Close on a click outside. Turn off for destructive or form dialogs holding input. */
  dismissOnOutsideClick?: boolean
}

/** Centered dialog; a bottom sheet below the sm breakpoint. Focus trap, restore and Esc come from Radix. */
export function DialogContent({
  size = 'md',
  closeLabel,
  dismissOnOutsideClick = true,
  className,
  children,
  onInteractOutside,
  ...props
}: DialogContentProps) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[60] bg-backdrop data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
      <D.Content
        onInteractOutside={(event) => {
          if (!dismissOnOutsideClick) event.preventDefault()
          onInteractOutside?.(event)
        }}
        className={cn(
          'fixed z-[60] flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg outline-none',
          'max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[92dvh] max-sm:rounded-t-xl max-sm:data-[state=open]:animate-sheet-bottom-in max-sm:data-[state=closed]:animate-sheet-bottom-out',
          'sm:left-1/2 sm:top-1/2 sm:max-w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:data-[state=open]:animate-dialog-in sm:data-[state=closed]:animate-dialog-out',
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
        <D.Close
          aria-label={closeLabel}
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground pointer-coarse:size-11"
        >
          <X className="size-4" aria-hidden />
        </D.Close>
      </D.Content>
    </D.Portal>
  )
}

export function DialogHeader({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <div className="px-6 pb-2 pt-6 pr-12">
      <D.Title className="text-subheading">{title}</D.Title>
      {description ? (
        <D.Description className="mt-1.5 text-body text-muted-foreground">{description}</D.Description>
      ) : (
        <D.Description className="sr-only">{typeof title === 'string' ? title : ''}</D.Description>
      )}
    </div>
  )
}

export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-3', className)} {...props} />
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 border-t border-border bg-surface-sunken px-6 py-4 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}
