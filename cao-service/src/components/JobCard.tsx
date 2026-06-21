'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { RepairRequest, WorkType } from '@/lib/types'
import { WORK_TYPE_CONFIG } from '@/lib/mock-data'
import { StatusPill } from './StatusPill'

interface JobCardProps {
  request: RepairRequest
  defaultExpanded?: boolean
  onRate?: (ticketNo: string, rating: number) => void
}

function TypeBadge({ type }: { type: WorkType }) {
  const cfg = WORK_TYPE_CONFIG[type]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: 600,
        color: cfg.color,
        background: cfg.bg,
        padding: '3px 9px',
        borderRadius: '7px',
      }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  )
}

function Timeline({ steps }: { steps: RepairRequest['timeline'] }) {
  return (
    <div>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <div key={i} style={{ display: 'flex', gap: '11px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {step.status === 'done' && (
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    flex: '0 0 22px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
              {step.status === 'current' && (
                <span style={{ position: 'relative', width: '22px', height: '22px', borderRadius: '50%', background: '#1A56DB', display: 'grid', placeItems: 'center', flex: '0 0 22px' }}>
                  <span className="animate-ping-slow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(26,86,219,.4)' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff', position: 'relative' }} />
                </span>
              )}
              {step.status === 'pending' && (
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#E5E7EB', display: 'grid', placeItems: 'center', flex: '0 0 22px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#9CA3AF' }} />
                </span>
              )}
              {!isLast && (
                <span
                  style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '20px',
                    background: step.status === 'done' ? (steps[i + 1]?.status === 'pending' ? '#1A56DB' : '#16A34A') : '#E5E7EB',
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: isLast ? 0 : '15px' }}>
              <div
                style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: step.status === 'current' ? '#1A56DB' : step.status === 'pending' ? '#9CA3AF' : '#111827',
                }}
              >
                {step.label}
              </div>
              <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '1px', fontFamily: 'var(--mono)' }}>
                {step.time ?? 'รอดำเนินการ'}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RatingSection({ request, onRate }: { request: RepairRequest; onRate?: (ticketNo: string, rating: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)

  if (request.rating !== null) return null
  if (request.status !== 'done') return null

  const handleSubmit = () => {
    if (selected > 0 && onRate) onRate(request.ticketNo, selected)
  }

  return (
    <div
      style={{
        background: '#F0FBF4',
        border: '1px solid #C5EBD3',
        borderRadius: '12px',
        padding: '13px 14px',
        marginTop: '14px',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', marginBottom: '10px' }}>
        ช่างดำเนินการเสร็จแล้ว — ให้คะแนนความพึงพอใจ
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(star)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Star
              size={32}
              fill={(hovered || selected) >= star ? '#F5A623' : '#E2E8F0'}
              stroke={(hovered || selected) >= star ? '#F5A623' : '#E2E8F0'}
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected === 0}
        style={{
          width: '100%',
          height: '40px',
          border: 'none',
          borderRadius: '10px',
          background: selected > 0 ? '#16A34A' : '#9CA3AF',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 700,
          cursor: selected > 0 ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
        }}
      >
        ส่งคะแนนประเมิน
      </button>
    </div>
  )
}

function TechnicianRow({ technician, rating }: { technician: string; rating: number | null }) {
  const initials = technician.split(' ').map(w => w[0]).join('').slice(0, 2)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '11px', paddingTop: '11px', borderTop: '1px dashed #E5E7EB', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'linear-gradient(150deg,#1A56DB,#1542AB)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {initials}
        </span>
        <span style={{ fontSize: '13px', color: '#374151' }}>
          ช่าง: <span style={{ fontWeight: 700 }}>{technician}</span>
        </span>
      </div>
      {rating !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[1, 2, 3, 4, 5].map(s => (
            <Star
              key={s}
              size={14}
              fill={s <= rating ? '#F5A623' : '#E2E8F0'}
              stroke={s <= rating ? '#F5A623' : '#E2E8F0'}
            />
          ))}
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginLeft: '3px', fontFamily: 'var(--mono)' }}>
            {rating}.0
          </span>
        </div>
      )}
    </div>
  )
}

export function JobCard({ request, defaultExpanded = false, onRate }: JobCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const isHighlighted = request.status === 'in_progress'

  return (
    <div
      style={{
        background: '#fff',
        border: isHighlighted ? '1px solid #D5E2FB' : '1px solid #E5E7EB',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isHighlighted ? '0 10px 26px -16px rgba(26,86,219,.4)' : '0 1px 3px rgba(17,24,39,.05)',
      }}
    >
      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '14px', fontFamily: 'inherit' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12.5px', color: '#9CA3AF', fontFamily: 'var(--mono)', fontWeight: 600 }}>
            {request.ticketNo}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusPill status={request.status} />
            {expanded ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
          </div>
        </div>
        <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#111827', textAlign: 'left' }}>
          {request.building} · ชั้น {request.floor} · {request.room}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {request.types.map(t => <TypeBadge key={t} type={t} />)}
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>แจ้ง {request.createdAt}</span>
        </div>
        {request.technician && (
          <TechnicianRow technician={request.technician} rating={request.rating} />
        )}
      </button>

      {/* Expanded section */}
      {expanded && (
        <div style={{ borderTop: '1px solid #E5E7EB', background: '#FAFBFF', padding: '15px 14px' }}>
          <div style={{ fontSize: '13.5px', color: '#4B5563', lineHeight: 1.55, marginBottom: '14px' }}>
            {request.description}
          </div>

          {request.adminMessages.length > 0 && (
            <div style={{ display: 'flex', gap: '9px', marginBottom: '16px' }}>
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#1A56DB',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '13px',
                  flex: '0 0 26px',
                }}
              >
                🛠️
              </span>
              <div
                style={{
                  background: '#EFF4FE',
                  border: '1px solid #D5E2FB',
                  borderRadius: '4px 14px 14px 14px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#1A56DB', marginBottom: '3px' }}>
                  {request.adminMessages[0].from}
                </div>
                <div style={{ fontSize: '13px', color: '#1542AB', lineHeight: 1.5 }}>
                  {request.adminMessages[0].text}
                </div>
              </div>
            </div>
          )}

          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#6B7280', marginBottom: '11px' }}>
            ไทม์ไลน์สถานะ
          </div>
          <Timeline steps={request.timeline} />

          <RatingSection request={request} onRate={onRate} />
        </div>
      )}
    </div>
  )
}
