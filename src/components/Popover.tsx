import { Popover as P } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const Popover = P.Root
export const PopoverTrigger = P.Trigger
export const PopoverAnchor = P.Anchor

export function PopoverContent({ className, align = 'start', sideOffset = 6, ...props }: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-40 w-72 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-pop-in',
          className,
        )}
        {...props}
      />
    </P.Portal>
  )
}
