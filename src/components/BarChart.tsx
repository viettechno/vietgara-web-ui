import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../lib/cn'

export type BarPoint = { label: string; value: number }

type BarChartProps = {
  points: BarPoint[]
  /** Accessible summary of the chart. */
  label: string
  formatValue: (value: number) => string
  formatTick?: (value: number) => string
  className?: string
}

const H = 200
const PAD = { top: 12, right: 8, bottom: 26, left: 48 }

function niceMax(value: number): number {
  if (value <= 0) return 1
  const exp = 10 ** Math.floor(Math.log10(value))
  const n = value / exp
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * exp
}

/** A bar chart with a fixed number of slots (so one data point never fills the canvas), a baseline, gridlines and a tooltip. */
export function BarChart({ points, label, formatValue, formatTick = formatValue, className }: BarChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const figureRef = useRef<HTMLElement>(null)
  // The svg is drawn at its real width so text keeps its size on phones.
  const [W, setWidth] = useState(720)
  useEffect(() => {
    const node = figureRef.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(Math.round(entry.contentRect.width), 240)))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const titleId = useId()
  const max = niceMax(Math.max(0, ...points.map((p) => p.value)))
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const slot = points.length ? plotW / points.length : plotW
  const barW = Math.max(slot * 0.62, 2)
  const ticks = [0, 0.5, 1].map((r) => r * max)
  const every = Math.ceil(points.length / (W < 480 ? 4 : 6))
  const activePoint = active === null ? null : points[active]

  return (
    <figure ref={figureRef} className={cn('relative m-0', className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={titleId}
        width={W}
        height={H}
        className="block h-auto w-full"
        onMouseLeave={() => setActive(null)}
      >
        <title id={titleId}>{label}</title>
        {ticks.map((tick) => {
          const y = PAD.top + plotH - (tick / max) * plotH
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="var(--border)"
                strokeDasharray={tick === 0 ? undefined : '3 4'}
              />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)" className="num">
                {formatTick(tick)}
              </text>
            </g>
          )
        })}
        {points.map((p, i) => {
          const h = (p.value / max) * plotH
          const x = PAD.left + i * slot + (slot - barW) / 2
          return (
            <g key={i} onMouseEnter={() => setActive(i)}>
              <rect x={PAD.left + i * slot} y={PAD.top} width={slot} height={plotH} fill="transparent" />
              {p.value > 0 && (
                <rect
                  x={x}
                  y={PAD.top + plotH - h}
                  width={barW}
                  height={Math.max(h, 1)}
                  rx="2"
                  fill="var(--chart-1)"
                  opacity={active === null || active === i ? 1 : 0.45}
                />
              )}
              {i % every === 0 && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
                  {p.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <div
        aria-live="polite"
        className="pointer-events-none absolute right-0 top-0 min-h-6 rounded-md bg-foreground px-2 py-1 text-caption text-background transition-opacity"
        style={{ opacity: activePoint ? 1 : 0 }}
      >
        {activePoint ? `${activePoint.label}: ${formatValue(activePoint.value)}` : ''}
      </div>
    </figure>
  )
}
