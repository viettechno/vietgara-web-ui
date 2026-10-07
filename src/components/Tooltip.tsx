import { Tooltip as T } from 'radix-ui'
import type { ReactNode } from 'react'

export const TooltipProvider = T.Provider

type TooltipProps = { content: ReactNode; children: ReactNode; side?: 'top' | 'right' | 'bottom' | 'left'; disabled?: boolean }

/** Inverted label for icon-only controls and truncated text. Never the only home of essential information. */
export function Tooltip({ content, children, side = 'top', disabled }: TooltipProps) {
  if (disabled || !content) return <>{children}</>
  return (
    <T.Root delayDuration={400}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          className="z-[90] max-w-60 rounded-sm bg-foreground px-2 py-1 text-caption text-background shadow-md data-[state=delayed-open]:animate-pop-in data-[state=instant-open]:animate-pop-in"
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}
