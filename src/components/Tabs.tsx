import { Tabs as T } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export const Tabs = T.Root
export const TabsContent = T.Content

export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  return <T.List className={cn('mb-4 flex gap-5 border-b border-border', className)} {...props} />
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        '-mb-px inline-flex items-center gap-2 border-b-2 border-transparent px-0.5 py-2.5 text-body font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground pointer-coarse:min-h-11',
        className,
      )}
      {...props}
    />
  )
}
