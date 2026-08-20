import { MoreOutlined } from '@ant-design/icons'
import { TOPIC_CARD_PALETTE } from '@devStack/enums/note-page-enum'
import { Dropdown } from 'antd'

const initialsFor = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

const TopicCard = ({ topic, index, onOpen, onEdit, onDelete }) => {
  const palette = TOPIC_CARD_PALETTE[index % TOPIC_CARD_PALETTE.length]
  const accent = topic.color || palette.accent

  const menuItems = [
    { key: 'edit', label: 'Edit topic' },
    { key: 'delete', label: 'Delete topic', danger: true },
  ]

  const handleMenuClick = ({ key, domEvent }) => {
    domEvent.stopPropagation()
    if (key === 'edit') onEdit(topic)
    if (key === 'delete') onDelete(topic)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(topic)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(topic)}
      style={{
        border: '1px solid var(--term-border)',
        borderRadius: 10,
        padding: 18,
        background: palette.bg,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        // e.currentTarget.style.borderColor = 'var(--term-border-hover)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        // e.currentTarget.style.borderColor = 'var(--term-border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${accent}22`,
            color: accent,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.5,
          }}
        >
          {initialsFor(topic.name)}
        </div>

        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']}>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-secondary)',
              cursor: 'pointer',
            }}
          >
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>

      <div style={{ marginTop: 12, color: 'var(--color-primary)', fontWeight: 600, fontSize: 15 }}>
        {topic.name}
      </div>

      {topic.description && (
        <div
          style={{
            marginTop: 4,
            color: 'var(--color-secondary)',
            fontSize: 12,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {topic.description}
        </div>
      )}

      <div style={{ marginTop: 14, color: 'var(--color-secondary)', fontSize: 11 }}>
        {topic.noteCount ?? 0} notes
      </div>
    </div>
  )
}

export default TopicCard
