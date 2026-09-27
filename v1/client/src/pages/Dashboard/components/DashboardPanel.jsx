const panelStyle = {
  border: '1px solid var(--color-border, rgba(34, 224, 122, 0.25))',
  background: 'var(--color-bg-container, rgba(6, 14, 9, 0.55))',
  borderRadius: 'var(--radius-sm, 6px)',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100%',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
  color: 'var(--color-primary, #6fae87)',
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 11,
  letterSpacing: 1,
  textTransform: 'uppercase',
  fontWeight: 600,
}

const DashboardPanel = ({ icon, title, right, children, style, bodyStyle }) => {
  return (
    <div style={{ ...panelStyle, ...style }}>
      {(icon || title || right) && (
        <div style={{ ...headerStyle, justifyContent: right ? 'space-between' : 'flex-start' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {icon}
            {title}
          </span>
          {right}
        </div>
      )}
      <div
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, ...bodyStyle }}
      >
        {children}
      </div>
    </div>
  )
}

export default DashboardPanel
