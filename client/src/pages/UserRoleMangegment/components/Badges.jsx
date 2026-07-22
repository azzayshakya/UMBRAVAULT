const ROLE_COLORS = {
  USER: 'var(--term-green-dim)',
  MODERATOR: 'var(--term-green)',
  ADMIN: 'var(--term-green)',
  SUPER_ADMIN: '#ffb347',
}

const badgeBase = {
  display: 'inline-block',
  padding: '3px 10px',
  fontSize: 10,
  fontFamily: 'var(--term-font)',
  letterSpacing: 1,
  borderRadius: 4,
  textTransform: 'uppercase',
}

export const RoleBadge = ({ role }) => {
  const color = ROLE_COLORS[role] || 'var(--term-green-dim)'
  return <span style={{ ...badgeBase, border: `1px solid ${color}`, color }}>{role}</span>
}

export const StatusBadge = ({ status }) => {
  const isActive = status === 'ACTIVE'
  const color = isActive ? 'var(--term-green)' : '#ff3b3b'
  return (
    <span
      style={{
        ...badgeBase,
        border: `1px solid ${color}`,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 5px ${color}`,
        }}
      />
      {status}
    </span>
  )
}
