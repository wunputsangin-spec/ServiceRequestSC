import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'gold' | 'dark' | 'outline' | 'ghost' | 'danger' | 'green'
type Size = 'sm' | 'md' | 'lg'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
  loading?: boolean
}

const SIZES: Record<Size, { h: number; px: number; fontSize: number; gap: number; radius: number }> = {
  sm: { h: 38, px: 13, fontSize: 13,   gap: 5,  radius: 11 },
  md: { h: 44, px: 16, fontSize: 14,   gap: 6,  radius: 12 },
  lg: { h: 54, px: 20, fontSize: 15.5, gap: 8,  radius: 14 },
}

const VARIANTS: Record<Variant, React.CSSProperties> = {
  gold: {
    background: 'linear-gradient(180deg, #E8C77A, #DDB056)',
    color: '#161310',
    border: 'none',
    boxShadow: '0 8px 24px -8px rgba(221,176,86,.5)',
  },
  dark: {
    background: 'var(--card-hi)',
    color: 'var(--txt)',
    border: '1px solid var(--line-2)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--gold)',
    border: '1px solid var(--gold)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--txt-2)',
    border: 'none',
  },
  danger: {
    background: 'color-mix(in srgb, #E15B4C 15%, transparent)',
    color: '#E15B4C',
    border: '1px solid color-mix(in srgb, #E15B4C 35%, transparent)',
  },
  green: {
    background: '#06C755',
    color: '#fff',
    border: 'none',
  },
}

export function Btn({ variant = 'dark', size = 'md', full = false, children, loading, style, disabled, ...rest }: BtnProps) {
  const s = SIZES[size]
  const v = VARIANTS[variant]
  return (
    <button
      disabled={disabled || loading}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fontSize,
        fontWeight: 700,
        fontFamily: 'inherit',
        borderRadius: s.radius,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        whiteSpace: 'nowrap',
        transition: 'opacity .15s',
        ...v,
        ...style,
      }}
      {...rest}
    >
      {loading ? <span style={{ opacity: .6 }}>กำลังโหลด…</span> : children}
    </button>
  )
}
