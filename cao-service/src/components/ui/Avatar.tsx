interface AvatarProps {
  name: string
  size?: number
  gold?: boolean
  color?: string
  className?: string
}

/* Consistent color from name hash */
function nameColor(name: string): string {
  const colors = ['#E0902E','#4F8DD6','#46BFA6','#C58BE0','#DDB056','#43B581','#E15B4C','#B9933B']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ name, size = 40, gold = false, color, className }: AvatarProps) {
  const initial = (name || '?')[0].toUpperCase()
  const bg = gold
    ? 'linear-gradient(180deg, #E8C77A, #C2933E)'
    : `color-mix(in srgb, ${color ?? nameColor(name)} 90%, #000)`
  const textColor = gold ? '#161310' : '#fff'

  return (
    <span
      className={className}
      style={{
        width: size, height: size, flexShrink: 0,
        borderRadius: '50%',
        background: bg,
        display: 'grid', placeItems: 'center',
        fontSize: size * 0.38, fontWeight: 700, color: textColor,
        userSelect: 'none',
        ...(gold ? { boxShadow: '0 6px 16px -6px rgba(221,176,86,.5)' } : {}),
      }}
    >
      {initial}
    </span>
  )
}
