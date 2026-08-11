import { statusDotColor } from '../utils/dashboardUtils'

import DashboardPanel from './DashboardPanel'

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '7px 0',
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 12.5,
  borderBottom: '1px solid var(--color-border, rgba(255, 255, 255, 0.05))',
}

const dotStyle = (color) => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: color,
  boxShadow: `0 0 6px ${color}`,
  display: 'inline-block',
  marginRight: 8,
  flexShrink: 0,
})

const SystemStatusPanel = ({ statusList = [], loading }) => {
  return (
    <DashboardPanel title="System Status" style={{ height: '100%' }}>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...rowStyle, borderBottom: 'none' }}>
              <span
                style={{
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic',
                }}
              >
                Loading...
              </span>
            </div>
          ))
        : statusList.map((item, index) => {
            const color = statusDotColor(item.tone)
            const isLast = index === statusList.length - 1

            return (
              <div
                key={item.id}
                style={{
                  ...rowStyle,
                  borderBottom: isLast ? 'none' : rowStyle.borderBottom,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <span style={dotStyle(color)} />
                  {item.label}
                </span>
                <span
                  style={{
                    color: item.tone === 'danger' ? 'var(--color-error)' : 'var(--color-text)',
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </span>
              </div>
            )
          })}
    </DashboardPanel>
  )
}

export default SystemStatusPanel
