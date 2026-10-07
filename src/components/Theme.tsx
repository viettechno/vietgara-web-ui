import { Monitor, Moon, Sun } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './Menu'
import { Tooltip } from './Tooltip'

export type ThemeChoice = 'light' | 'dark' | 'system'
const STORAGE_KEY = 'vietgara.theme'

type ThemeContextValue = { choice: ThemeChoice; resolved: 'light' | 'dark'; setChoice: (choice: ThemeChoice) => void }
const ThemeContext = createContext<ThemeContextValue>({ choice: 'system', resolved: 'light', setChoice: () => undefined })

function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

function systemTheme(): 'light' | 'dark' {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Inline script for index.html <head>: applies the stored theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var c=localStorage.getItem('${STORAGE_KEY}');var d=c==='dark'||((!c||c==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light')}catch(e){}})()`

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readChoice)
  const [system, setSystem] = useState<'light' | 'dark'>(systemTheme)
  const resolved = choice === 'system' ? system : choice

  useEffect(() => {
    const list = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!list) return
    const onChange = () => setSystem(list.matches ? 'dark' : 'light')
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved)
  }, [resolved])

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = useMemo(() => ({ choice, resolved, setChoice }), [choice, resolved, setChoice])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

type ThemeToggleProps = { label: string; options: Record<ThemeChoice, string> }

/** Light / dark / system chooser for the header. */
export function ThemeToggle({ label, options }: ThemeToggleProps) {
  const { choice, resolved, setChoice } = useTheme()
  const Icon = resolved === 'dark' ? Moon : Sun
  const icons = { light: Sun, dark: Moon, system: Monitor }
  return (
    <DropdownMenu>
      <Tooltip content={label}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={label} data-touch>
            <Icon aria-hidden />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={choice} onValueChange={(next) => setChoice(next as ThemeChoice)}>
          {(['light', 'dark', 'system'] as const).map((key) => {
            const ItemIcon = icons[key]
            return (
              <DropdownMenuRadioItem key={key} value={key}>
                <ItemIcon className="size-4 text-muted-foreground" aria-hidden />
                {options[key]}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Light / dark / system radio group for an account menu (the phone's way to the theme). */
export function ThemeMenuItems({ label, options }: ThemeToggleProps) {
  const { choice, setChoice } = useTheme()
  const icons = { light: Sun, dark: Moon, system: Monitor }
  return (
    <>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuRadioGroup value={choice} onValueChange={(next) => setChoice(next as ThemeChoice)}>
        {(['light', 'dark', 'system'] as const).map((key) => {
          const ItemIcon = icons[key]
          return (
            <DropdownMenuRadioItem key={key} value={key} onSelect={(event) => event.preventDefault()}>
              <ItemIcon className="size-4 text-muted-foreground" aria-hidden />
              {options[key]}
            </DropdownMenuRadioItem>
          )
        })}
      </DropdownMenuRadioGroup>
    </>
  )
}
