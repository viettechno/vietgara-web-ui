import { LazyMotion, MotionConfig, domMax, m } from 'motion/react'
import { Toaster as Sonner } from 'sonner'
import type { ReactNode } from 'react'
import { ThemeProvider, useTheme } from './Theme'
import { TooltipProvider } from './Tooltip'

export { toast } from 'sonner'
// Light-weight motion components (the features load once, in UIProvider).
export { m } from 'motion/react'

function Toaster({ closeLabel }: { closeLabel?: string }) {
  const { resolved } = useTheme()
  return (
    <Sonner
      theme={resolved}
      position="bottom-right"
      closeButton
      richColors={false}
      toastOptions={{
        duration: 5000,
        classNames: {
          toast: '!rounded-lg !border !border-border !bg-popover !text-popover-foreground !shadow-md !font-sans !text-body',
          description: '!text-muted-foreground',
          closeButton: '!border-border !bg-popover !text-foreground',
        },
        closeButtonAriaLabel: closeLabel,
      }}
    />
  )
}

/** Theme, tooltips, reduced-motion handling and the toast layer for the whole app. */
export function UIProvider({ children, closeLabel }: { children: ReactNode; closeLabel?: string }) {
  return (
    <ThemeProvider>
      <LazyMotion features={domMax} strict>
        <MotionConfig reducedMotion="user">
          <TooltipProvider delayDuration={400}>
            {children}
            <Toaster closeLabel={closeLabel} />
          </TooltipProvider>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  )
}

/** Fades route content in (100 ms); keyed by the route so each navigation replays it. */
export function PageTransition({ id, children }: { id: string; children: ReactNode }) {
  return (
    <m.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}>
      {children}
    </m.div>
  )
}
