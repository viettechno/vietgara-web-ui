import { useEffect, type ReactNode } from 'react'
import { Avatar } from './Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './Menu'

type AccountMenuProps = { initials: string; name?: string; email?: string; label: string; children: ReactNode }

/** Avatar button opening the account menu (name and e-mail, then the app's items). */
export function AccountMenu({ initials, name, email, label, children }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="grid size-9 place-items-center rounded-full transition-opacity hover:opacity-85 pointer-coarse:size-11"
        >
          <Avatar initials={initials} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        {(name || email) && (
          <>
            <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
              {name && <span className="truncate text-body font-medium text-popover-foreground">{name}</span>}
              {email && <span className="truncate text-caption">{email}</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Calls `onTrigger` on Ctrl/⌘ K (and prevents the browser default). */
export function useCommandShortcut(onTrigger: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onTrigger])
}
