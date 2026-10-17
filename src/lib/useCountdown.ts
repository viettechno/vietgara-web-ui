import { useEffect, useState } from 'react'

/** Whole seconds left until `until` (0 once passed), ticking every second. */
export function useCountdown(until: string | Date | undefined): number {
  const target = until ? new Date(until).getTime() : 0
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!target) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  return Math.max(0, Math.ceil((target - now) / 1000))
}

/** Formats seconds as m:ss. */
export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
