import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
  className?: string
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--txt-2)' }}>
        {label}
        {required && <span style={{ color: 'var(--st-urgent)', marginLeft: 3 }}>*</span>}
      </div>
      {children}
      {hint && (
        <div style={{ fontSize: 11.5, color: 'var(--txt-3)', lineHeight: 1.4 }}>{hint}</div>
      )}
    </div>
  )
}

/* Styled select wrapper */
interface SelectFieldProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  icon?: ReactNode
  placeholder?: string
}

export function SelectField({ value, onChange, options, icon, placeholder }: SelectFieldProps) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', display: 'grid', placeItems: 'center', color: 'var(--txt-3)',
        }}>
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none',
          width: '100%',
          height: 52,
          padding: `0 44px 0 ${icon ? 44 : 14}px`,
          borderRadius: 14,
          background: 'var(--surface-2)',
          border: '1px solid var(--line-2)',
          color: value ? 'var(--txt)' : 'var(--txt-3)',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--txt-3)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </span>
    </div>
  )
}

/* Text input */
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

export function TextInput({ icon, style, ...rest }: TextInputProps) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: 'var(--txt-3)',
        }}>
          {icon}
        </span>
      )}
      <input
        style={{
          width: '100%',
          height: 52,
          padding: `0 14px 0 ${icon ? 44 : 14}px`,
          borderRadius: 14,
          background: 'var(--surface-2)',
          border: '1px solid var(--line-2)',
          color: 'var(--txt)',
          fontSize: 15,
          fontWeight: 500,
          fontFamily: 'inherit',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
    </div>
  )
}

/* Textarea */
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ style, ...rest }: TextAreaProps) {
  return (
    <textarea
      style={{
        width: '100%',
        minHeight: 96,
        resize: 'none',
        padding: '12px 14px',
        borderRadius: 14,
        background: 'var(--surface-2)',
        border: '1px solid var(--line-2)',
        color: 'var(--txt)',
        fontSize: 13.5,
        fontFamily: 'inherit',
        lineHeight: 1.55,
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    />
  )
}
