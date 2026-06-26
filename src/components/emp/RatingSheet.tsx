'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Btn } from '@/components/ui/Btn'
import { TextArea } from '@/components/ui/Field'
import { RATING_LABELS } from '@/lib/constants'

interface RatingSheetProps {
  open: boolean
  techNames: string
  onClose: () => void
  onSubmit: (rating: number, feedback: string) => void
}

export function RatingSheet({ open, techNames, onClose, onSubmit }: RatingSheetProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [feedback, setFeedback] = useState('')

  const active = hover || rating

  return (
    <BottomSheet open={open} onClose={onClose} title="ให้คะแนนช่าง" subtitle={techNames} maxWidth={390}>
      <div style={{ padding: '20px 22px 4px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2 }}
              >
                <Star
                  size={38}
                  strokeWidth={1.6}
                  color={n <= active ? '#DDB056' : 'var(--line-2)'}
                  fill={n <= active ? '#DDB056' : 'transparent'}
                />
              </button>
            ))}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: active ? 'var(--gold)' : 'var(--txt-3)', minHeight: 20 }}>
            {active ? RATING_LABELS[active] : 'แตะดาวเพื่อให้คะแนน'}
          </div>
        </div>

        <TextArea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)"
        />

        <Btn variant="gold" size="lg" full disabled={rating === 0} onClick={() => onSubmit(rating, feedback.trim())}>
          ส่งคะแนน
        </Btn>
      </div>
    </BottomSheet>
  )
}
