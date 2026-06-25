import { Check } from 'lucide-react'
import type { Job } from '@/lib/types'
import { buildTimeline } from '@/lib/timeline'

export function Timeline({ job }: { job: Job }) {
  const steps = buildTimeline(job)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        const isDone = step.state === 'done'
        const isCurrent = step.state === 'current'
        const color = isDone ? 'var(--st-done)' : isCurrent ? 'var(--gold)' : 'var(--line-2)'

        return (
          <div key={step.status} style={{ display: 'flex', gap: 13 }}>
            {/* Rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{
                width: 26, height: 26, flexShrink: 0,
                borderRadius: '50%',
                background: isDone
                  ? 'var(--st-done)'
                  : isCurrent
                    ? 'color-mix(in srgb, var(--gold) 20%, transparent)'
                    : 'var(--surface-2)',
                border: `2px solid ${color}`,
                display: 'grid', placeItems: 'center',
                ...(isCurrent ? { boxShadow: '0 0 0 4px color-mix(in srgb, var(--gold) 14%, transparent)' } : {}),
              }}>
                {isDone
                  ? <Check size={14} strokeWidth={3} color="#fff" />
                  : <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: isCurrent ? 'var(--gold)' : 'var(--txt-3)',
                    }} />}
              </span>
              {!last && (
                <span style={{
                  width: 2, flex: 1, minHeight: 26,
                  background: isDone ? 'var(--st-done)' : 'var(--line-2)',
                  marginTop: 2, marginBottom: 2,
                }} />
              )}
            </div>

            {/* Text */}
            <div style={{ paddingBottom: last ? 0 : 18, flex: 1 }}>
              <div style={{
                fontSize: 14, fontWeight: 700,
                color: step.state === 'pending' ? 'var(--txt-3)' : 'var(--txt)',
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: 12, color: 'var(--txt-3)', marginTop: 2, lineHeight: 1.45,
              }}>
                {step.sub}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
