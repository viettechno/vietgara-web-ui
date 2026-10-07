import { Avatar as A } from 'radix-ui'
import { cn } from '../lib/cn'

const sizes = { sm: 'size-6 text-[10px]', md: 'size-8 text-caption', lg: 'size-10 text-body' } as const

type AvatarProps = { initials: string; src?: string; size?: keyof typeof sizes; className?: string; shape?: 'circle' | 'square' }

/** Initials on a neutral fill: no random per-person colors. */
export function Avatar({ initials, src, size = 'md', className, shape = 'circle' }: AvatarProps) {
  return (
    <A.Root
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-muted font-semibold text-muted-foreground',
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        sizes[size],
        className,
      )}
    >
      {src && <A.Image src={src} alt="" className="size-full object-cover" />}
      <A.Fallback delayMs={src ? 300 : 0} aria-hidden>
        {initials}
      </A.Fallback>
    </A.Root>
  )
}
