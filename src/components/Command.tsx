import { Command } from 'cmdk'
import { Dialog as D } from 'radix-ui'
import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

export type CommandItemData = { id: string; label: string; hint?: string; icon?: ReactNode; keywords?: string[]; onSelect: () => void }
export type CommandGroupData = { heading: string; items: CommandItemData[] }

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: CommandGroupData[]
  placeholder: string
  empty: string
  title: string
}

/** Ctrl/⌘ K palette: pages, garages and actions. Every action also exists as visible UI. */
export function CommandPalette({ open, onOpenChange, groups, placeholder, empty, title }: CommandPaletteProps) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-[80] bg-backdrop data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <D.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-[80] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg outline-none data-[state=open]:animate-pop-in"
        >
          <D.Title className="sr-only">{title}</D.Title>
          <Command label={title} loop>
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <Command.Input
                placeholder={placeholder}
                className="h-12 w-full bg-transparent text-body outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-1.5">
              <Command.Empty className="px-3 py-8 text-center text-body text-muted-foreground">{empty}</Command.Empty>
              {groups.map((group) => (
                <Command.Group
                  key={group.heading}
                  heading={group.heading}
                  className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {group.items.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords?.join(' ') ?? ''}`}
                      onSelect={() => {
                        onOpenChange(false)
                        item.onSelect()
                      }}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-body data-[selected=true]:bg-accent [&_svg]:size-4 [&_svg]:text-muted-foreground"
                    >
                      {item.icon}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && <span className="truncate text-caption text-muted-foreground">{item.hint}</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
