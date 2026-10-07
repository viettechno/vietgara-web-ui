import { DropdownMenu as M } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const DropdownMenu = M.Root
export const DropdownMenuTrigger = M.Trigger

export function DropdownMenuContent({ className, align = 'end', sideOffset = 6, ...props }: ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-40 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-pop-in',
          className,
        )}
        {...props}
      />
    </M.Portal>
  )
}

export function DropdownMenuItem({ className, destructive, ...props }: ComponentProps<typeof M.Item> & { destructive?: boolean }) {
  return (
    <M.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-body outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent pointer-coarse:min-h-11 [&_svg]:size-4 [&_svg]:shrink-0',
        destructive ? 'text-destructive-subtle-foreground' : 'text-popover-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof M.RadioItem>) {
  return (
    <M.RadioItem
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2.5 text-body outline-none data-[highlighted]:bg-accent pointer-coarse:min-h-11',
        className,
      )}
      {...props}
    >
      <M.ItemIndicator className="absolute left-2.5 grid size-4 place-items-center">
        <span className="size-1.5 rounded-full bg-primary" />
      </M.ItemIndicator>
      {children}
    </M.RadioItem>
  )
}

export const DropdownMenuRadioGroup = M.RadioGroup

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof M.Label>) {
  return <M.Label className={cn('px-2.5 py-1.5 text-caption text-muted-foreground', className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof M.Separator>) {
  return <M.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
}
