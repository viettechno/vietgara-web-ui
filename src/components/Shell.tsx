import { Menu } from 'lucide-react'
import { createContext, useContext, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useMediaQuery } from '../lib/useMediaQuery'
import { Count } from './Badge'
import { IconButton } from './IconButton'
import { Sheet, SheetContent } from './Sheet'
import { Tooltip } from './Tooltip'

const ShellContext = createContext<{ closeNav: () => void }>({ closeNav: () => undefined })

type AppShellProps = {
  /** Sidebar contents: brand, nav groups, footer. Rendered in the desktop rail and the phone sheet. */
  sidebar: ReactNode
  /** Header contents (right side). The menu button for phones is added on the left. */
  header: ReactNode
  /** Content to the left of the header's actions, e.g. the garage switcher. */
  headerStart?: ReactNode
  children: ReactNode
  labels: { menu: string; close: string; skip: string; navigation: string }
}

/** Light sidebar (rail at md, sheet below md), 56px header, skip link and a focusable main landmark. */
export function AppShell({ sidebar, header, headerStart, children, labels }: AppShellProps) {
  const [open, setOpen] = useState(false)
  return (
    <ShellContext.Provider value={{ closeNav: () => setOpen(false) }}>
      <div className="min-h-dvh bg-background">
        <a
          href="#main"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-body font-medium text-primary-foreground focus:translate-y-0"
        >
          {labels.skip}
        </a>
        <aside className="fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-border bg-sidebar text-sidebar-foreground md:flex md:w-16 lg:w-64">
          {sidebar}
        </aside>
        <div className="md:pl-16 lg:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface px-3 md:px-6">
            <IconButton className="md:hidden" label={labels.menu} icon={<Menu aria-hidden />} onClick={() => setOpen(true)} />
            <div className="min-w-0 flex-1">{headerStart}</div>
            <div className="flex shrink-0 items-center gap-1">{header}</div>
          </header>
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            title={labels.navigation}
            closeLabel={labels.close}
            bare
            className="bg-sidebar p-0 text-sidebar-foreground"
          >
            <div className="flex h-full flex-col">{sidebar}</div>
          </SheetContent>
        </Sheet>
      </div>
    </ShellContext.Provider>
  )
}

export function SidebarBrand({ children }: { children: ReactNode }) {
  return <div className="flex h-14 shrink-0 items-center px-4 md:max-lg:justify-center md:max-lg:px-0">{children}</div>
}

export function SidebarNav({ children, label }: { children: ReactNode; label: string }) {
  return (
    <nav aria-label={label} className="flex-1 overflow-y-auto px-3 pb-3 md:max-lg:px-2">
      {children}
    </nav>
  )
}

export function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 first:mt-2">
      <p className="mb-1 px-2.5 text-caption text-muted-foreground md:max-lg:sr-only">{label}</p>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  )
}

type NavItemProps = {
  icon: ReactNode
  label: string
  count?: number
  /** The link element to render, e.g. react-router's NavLink (its active state sets aria-current="page"). Defaults to <a>. */
  as?: ElementType
  className?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  [prop: string]: unknown
}

/** A sidebar link. The active state follows aria-current="page". */
export function NavItem({ icon, label, count, as: Link = 'a', className, onClick, ...props }: NavItemProps) {
  const { closeNav } = useShell()
  const rail = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const classes = cn(
    'group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-body font-medium text-sidebar-foreground transition-colors hover:bg-accent hover:text-foreground md:max-lg:justify-center md:max-lg:px-0 pointer-coarse:min-h-11',
    'aria-[current=page]:bg-sidebar-active aria-[current=page]:font-semibold aria-[current=page]:text-sidebar-active-foreground',
    'aria-[current=page]:before:absolute aria-[current=page]:before:-left-3 aria-[current=page]:before:h-5 aria-[current=page]:before:w-[3px] aria-[current=page]:before:rounded-r-full aria-[current=page]:before:bg-primary aria-[current=page]:before:content-[""] md:max-lg:aria-[current=page]:before:-left-2',
    className,
  )
  return (
    <li>
      <Tooltip content={label} side="right" disabled={!rail}>
        <Link
          className={classes}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            onClick?.(event)
            closeNav()
          }}
          {...props}
        >
          <span className="grid size-5 shrink-0 place-items-center [&_svg]:size-5" aria-hidden>
            {icon}
          </span>
          <span className="min-w-0 flex-1 truncate md:max-lg:sr-only">{label}</span>
          {count ? (
            <Count
              tone="primary"
              className="md:max-lg:absolute md:max-lg:right-1 md:max-lg:top-0 md:max-lg:h-4 md:max-lg:min-w-4 md:max-lg:px-1 md:max-lg:text-[10px]"
            >
              {count}
            </Count>
          ) : null}
        </Link>
      </Tooltip>
    </li>
  )
}

export function useShell() {
  return useContext(ShellContext)
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="shrink-0 border-t border-border p-3 md:max-lg:px-2">{children}</div>
}
