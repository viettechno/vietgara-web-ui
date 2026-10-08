import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { cn } from '../lib/cn'
import { useMediaQuery } from '../lib/useMediaQuery'
import { Count } from './Badge'
import { IconButton } from './IconButton'
import { Sheet, SheetContent } from './Sheet'
import { Tooltip } from './Tooltip'

type ShellContextValue = {
  closeNav: () => void
  /** The sidebar currently shows icons only (collapsed rail). */
  compact: boolean
}

const ShellContext = createContext<ShellContextValue>({ closeNav: () => undefined, compact: false })

const STORAGE_KEY = 'vietgara.sidebar'
type SidebarState = 'expanded' | 'collapsed'

function readSidebarState(): SidebarState {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'collapsed' ? 'collapsed' : 'expanded'
  } catch {
    return 'expanded'
  }
}

/** Pointer must rest on a collapsed sidebar this long (ms) before it opens, so brushing the edge does nothing. */
const PEEK_DELAY = 150

type AppShellProps = {
  /** Sidebar contents: brand, nav groups, footer. Rendered in the desktop sidebar and the phone sheet. */
  sidebar: ReactNode
  /** Header contents (right side). The menu button for phones is added on the left. */
  header: ReactNode
  /** Content to the left of the header's actions, e.g. the garage switcher. */
  headerStart?: ReactNode
  children: ReactNode
  labels: { menu: string; close: string; skip: string; navigation: string; collapse: string; expand: string }
}

/**
 * Light sidebar, 56px header, skip link and a focusable main landmark.
 * Desktop: expanded (256px) or collapsed to an icon rail (64px) with a toggle that remembers the choice;
 * a collapsed sidebar opens over the page while the pointer rests on it or keyboard focus is inside it.
 * Tablet: always the icon rail (same peek). Phone: a navigation sheet.
 */
export function AppShell({ sidebar, header, headerStart, children, labels }: AppShellProps) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState<SidebarState>(readSidebarState)
  const [peek, setPeek] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const desktop = useMediaQuery('(min-width: 1024px)')

  // The rail is the resting state below lg, and when the user collapsed the sidebar on desktop.
  const rail = !desktop || pinned === 'collapsed'
  const expanded = !rail || peek
  const overlay = rail && peek

  useEffect(() => () => clearTimeout(timer.current), [])

  const choose = useCallback((next: SidebarState) => {
    setPinned(next)
    setPeek(false)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable: the choice lasts the session */
    }
  }, [])

  const onPointerEnter = (event: PointerEvent) => {
    if (!rail || event.pointerType !== 'mouse') return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPeek(true), PEEK_DELAY)
  }
  const onPointerLeave = () => {
    clearTimeout(timer.current)
    setPeek(false)
  }
  const onFocus = () => {
    if (rail) setPeek(true)
  }
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPeek(false)
  }

  return (
    <ShellContext.Provider value={{ closeNav: () => setOpen(false), compact: !expanded }}>
      <div className="min-h-dvh bg-background">
        <a
          href="#main"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-body font-medium text-primary-foreground focus:translate-y-0"
        >
          {labels.skip}
        </a>
        <aside
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            'fixed inset-y-0 left-0 z-[35] hidden flex-col overflow-hidden border-r border-border bg-sidebar text-sidebar-foreground transition-[width,box-shadow] duration-base ease-standard md:flex',
            expanded ? 'w-64' : 'w-16',
            overlay && 'shadow-lg',
          )}
        >
          {sidebar}
          <div className="hidden shrink-0 border-t border-border p-3 lg:block">
            <Tooltip content={pinned === 'expanded' ? labels.collapse : labels.expand} side="right" disabled={expanded}>
              <button
                type="button"
                aria-expanded={pinned === 'expanded'}
                aria-label={pinned === 'expanded' ? labels.collapse : labels.expand}
                onClick={() => choose(pinned === 'expanded' ? 'collapsed' : 'expanded')}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-body font-medium text-sidebar-foreground transition-colors hover:bg-accent hover:text-foreground',
                  !expanded && 'justify-center px-0',
                )}
              >
                {pinned === 'expanded' ? (
                  <PanelLeftClose className="size-5 shrink-0" aria-hidden />
                ) : (
                  <PanelLeftOpen className="size-5 shrink-0" aria-hidden />
                )}
                {expanded && <span className="truncate">{pinned === 'expanded' ? labels.collapse : labels.expand}</span>}
              </button>
            </Tooltip>
          </div>
        </aside>
        <div className={cn('transition-[padding] duration-base ease-standard md:pl-16', pinned === 'expanded' && 'lg:pl-64')}>
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
            <ShellContext.Provider value={{ closeNav: () => setOpen(false), compact: false }}>
              <div className="flex h-full flex-col">{sidebar}</div>
            </ShellContext.Provider>
          </SheetContent>
        </Sheet>
      </div>
    </ShellContext.Provider>
  )
}

export function SidebarBrand({ children }: { children: ReactNode }) {
  const { compact } = useShell()
  return <div className={cn('flex h-14 shrink-0 items-center px-4', compact && 'justify-center px-0')}>{children}</div>
}

export function SidebarNav({ children, label }: { children: ReactNode; label: string }) {
  const { compact } = useShell()
  return (
    <nav aria-label={label} className={cn('flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3', compact && 'px-2')}>
      {children}
    </nav>
  )
}

export function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  const { compact } = useShell()
  return (
    <div className={cn('mt-5 first:mt-2', compact && 'mt-3 border-t border-border pt-3 first:border-t-0 first:pt-0')}>
      <p className={cn('mb-1 px-2.5 text-caption text-muted-foreground', compact && 'sr-only')}>{label}</p>
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
  const { closeNav, compact } = useShell()
  const classes = cn(
    'group relative flex h-9 items-center gap-2.5 rounded-md px-2.5 text-body font-medium text-sidebar-foreground transition-colors hover:bg-accent hover:text-foreground pointer-coarse:min-h-11',
    compact && 'justify-center px-0',
    'aria-[current=page]:bg-sidebar-active aria-[current=page]:font-semibold aria-[current=page]:text-sidebar-active-foreground',
    'aria-[current=page]:before:absolute aria-[current=page]:before:-left-3 aria-[current=page]:before:h-5 aria-[current=page]:before:w-[3px] aria-[current=page]:before:rounded-r-full aria-[current=page]:before:bg-primary aria-[current=page]:before:content-[""]',
    compact && 'aria-[current=page]:before:-left-2',
    className,
  )
  return (
    <li>
      <Tooltip content={label} side="right" disabled={!compact}>
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
          <span className={cn('min-w-0 flex-1 truncate', compact && 'sr-only')}>{label}</span>
          {count ? (
            <Count tone="primary" className={compact ? 'absolute right-1 top-0 h-4 min-w-4 px-1 text-[10px]' : undefined}>
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
  const { compact } = useShell()
  return <div className={cn('shrink-0 border-t border-border p-3', compact && 'px-2')}>{children}</div>
}

/** Whether the sidebar currently shows icons only (for wordmarks and other content a collapsed sidebar hides). */
export function useSidebarCompact() {
  return useShell().compact
}
