import {
  Zap, Droplets, Wind, Sofa, Presentation, MoreHorizontal,
  Package, Truck, LayoutDashboard, Monitor,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { JobCategory } from '@/lib/types'
import { REPAIR_CAT_META, SERVICE_CAT_META } from '@/lib/constants'

const ICONS: Record<string, LucideIcon> = {
  Zap, Droplets, Wind, Sofa, Presentation, MoreHorizontal,
  Package, Truck, LayoutDashboard, Monitor,
}

export function catMeta(cat: JobCategory): { label: string; color: string; Icon: LucideIcon } {
  const meta =
    (REPAIR_CAT_META as Record<string, { label: string; color: string; icon: string }>)[cat] ??
    (SERVICE_CAT_META as Record<string, { label: string; color: string; icon: string }>)[cat] ??
    { label: 'อื่นๆ', color: '#8A8F99', icon: 'MoreHorizontal' }
  return { label: meta.label, color: meta.color, Icon: ICONS[meta.icon] ?? MoreHorizontal }
}

/* Rounded square category icon badge */
export function CatBadge({ cat, size = 44 }: { cat: JobCategory; size?: number }) {
  const { color, Icon } = catMeta(cat)
  return (
    <span style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: size * 0.3,
      background: `color-mix(in srgb, ${color} 16%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 32%, transparent)`,
      display: 'grid', placeItems: 'center', color,
    }}>
      <Icon size={size * 0.46} strokeWidth={2} />
    </span>
  )
}
