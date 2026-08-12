import {
  TeamOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  CodeOutlined,
  RightOutlined,
} from '@ant-design/icons'

import DashboardPanel from './DashboardPanel'

const ITEMS = [
  { id: 'users', label: 'User Management', icon: TeamOutlined },
  { id: 'logs', label: 'System Logs', icon: FileTextOutlined },
  { id: 'security', label: 'Security Center', icon: SafetyCertificateOutlined },
  { id: 'terminal', label: 'Terminal Access', icon: CodeOutlined },
]

const handleClick = (id) => {
  console.log(`quick-access:${id}`)
}

const QuickAccessPanel = () => {
  return (
    <DashboardPanel title="Quick Access" style={{ height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            className="dash-quick-access-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '9px 8px',
              background: 'transparent',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              color: 'var(--color-secondary-hover, #d7ffe4)',
              fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
              fontSize: 12.5,
              textAlign: 'left',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon style={{ color: 'var(--color-primary-light, #6fae87)' }} />
              {label}
            </span>
            <RightOutlined style={{ fontSize: 10, color: 'var(--color-secondary, #6b8f78)' }} />
          </button>
        ))}
      </div>
    </DashboardPanel>
  )
}

export default QuickAccessPanel
