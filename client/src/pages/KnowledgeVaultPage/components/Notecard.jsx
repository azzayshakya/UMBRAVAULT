import { PushpinFilled } from '@ant-design/icons'
import { NOTE_CARD_PALETTE } from '@devStack/enums/note-page-enum'

const previewOf = (content = '') =>
  content
    .replace(/[#*`_>-]/g, '')
    .trim()
    .slice(0, 90)

const relativeTime = (dateString) => {
  if (!dateString) return '—'
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

const NoteCard = ({ note, index, pinned, onOpen }) => {
  const palette = NOTE_CARD_PALETTE[index % NOTE_CARD_PALETTE.length]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(note)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(note)}
      style={{
        position: 'relative',
        background: palette.bg,
        color: palette.text,
        borderRadius: 4,
        padding: '16px 14px 12px',
        minHeight: 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
        transform: 'rotate(-0.4deg)',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(0deg) translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(-0.4deg)')}
    >
      {pinned && (
        <PushpinFilled
          style={{ position: 'absolute', top: 8, right: 10, fontSize: 14, opacity: 0.6 }}
        />
      )}

      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3, marginBottom: 6 }}>
          {note.title}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.4, opacity: 0.8 }}>{previewOf(note.content)}</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 0.5,
            padding: '2px 8px',
            borderRadius: 4,
            background: 'rgba(0,0,0,0.12)',
          }}
        >
          {note.type}
        </span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{relativeTime(note.updatedAt)}</span>
      </div>
    </div>
  )
}

export default NoteCard
