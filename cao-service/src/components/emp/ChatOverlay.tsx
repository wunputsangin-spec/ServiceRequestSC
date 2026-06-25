'use client'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import type { Job, ChatMessage } from '@/lib/types'
import { Avatar } from '@/components/ui/Avatar'

interface ChatOverlayProps {
  job: Job
  onClose: () => void
  onSend: (text: string) => void
}

export function ChatOverlay({ job, onClose, onSend }: ChatOverlayProps) {
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [job.chat.length])

  const submit = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
    }} className="animate-fadein">
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
        borderBottom: '1px solid var(--line)', background: 'var(--surface)',
      }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none', color: 'var(--txt-2)',
          width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--txt)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.title}
          </div>
          <div className="num" style={{ fontSize: 11.5, color: 'var(--txt-3)' }}>{job.code}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="scrollbar-hide" style={{
        flex: 1, overflowY: 'auto', padding: '16px 14px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {job.chat.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: 13, marginTop: 40 }}>
            ยังไม่มีข้อความ — เริ่มพูดคุยกับช่างได้เลย
          </div>
        )}
        {job.chat.map(m => <Bubble key={m.id} msg={m} mine={m.from === 'employee'} />)}
      </div>

      {/* Composer */}
      <div style={{
        flexShrink: 0, padding: '10px 12px 16px',
        borderTop: '1px solid var(--line)', background: 'var(--surface)',
        display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit() }}
          placeholder="พิมพ์ข้อความ…"
          style={{
            flex: 1, height: 44, padding: '0 16px', borderRadius: 22,
            background: 'var(--surface-2)', border: '1px solid var(--line-2)',
            color: 'var(--txt)', fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button onClick={submit} style={{
          width: 44, height: 44, flexShrink: 0, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(180deg,#E8C77A,#DDB056)', color: '#161310',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
          boxShadow: '0 6px 16px -6px rgba(221,176,86,.5)',
        }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

function Bubble({ msg, mine }: { msg: ChatMessage; mine: boolean }) {
  if (msg.from === 'system') {
    return (
      <div style={{ textAlign: 'center', margin: '2px 0' }}>
        <span style={{
          fontSize: 11.5, color: 'var(--txt-3)', background: 'var(--surface-2)',
          border: '1px solid var(--line)', padding: '5px 12px', borderRadius: 999,
          display: 'inline-block', maxWidth: '85%',
        }}>
          {msg.text}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex', gap: 8,
      flexDirection: mine ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
    }}>
      {!mine && <Avatar name={msg.senderName} size={28} />}
      <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
        {!mine && (
          <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 3, marginLeft: 2 }}>{msg.senderName}</div>
        )}
        <div style={{
          padding: '9px 13px', borderRadius: 14,
          background: mine ? 'linear-gradient(180deg,#E8C77A,#DDB056)' : 'var(--card-hi)',
          color: mine ? '#161310' : 'var(--txt)',
          border: mine ? 'none' : '1px solid var(--line-2)',
          fontSize: 13.5, lineHeight: 1.45, fontWeight: mine ? 600 : 500,
          borderBottomRightRadius: mine ? 4 : 14,
          borderBottomLeftRadius: mine ? 14 : 4,
        }}>
          {msg.text}
        </div>
        <div className="num" style={{ fontSize: 10, color: 'var(--txt-3)', marginTop: 3, padding: '0 2px' }}>{msg.time}</div>
      </div>
    </div>
  )
}
