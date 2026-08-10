// components/SystemStatusPanel.jsx
import useSystemStatus from '../hooks/useSystemStatus'
import { statusDotColor } from '../utils/dashboardUtils'

import DashboardPanel from './DashboardPanel'

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '7px 0',
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 12.5,
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

// Shared instance so this panel's data comes from the same
// `getSystemStatus` call the stat-card row consumes below.
const SystemStatusPanel = ({ statusList, loading }) => {
  return (
    <DashboardPanel title="System Status" style={{ height: '100%' }}>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...rowStyle, opacity: 0.35 }}>
              <span style={{ color: 'var(--color-secondary, #6b8f78)' }}>Loading...</span>
            </div>
          ))
        : statusList.map((item) => {
            const color = statusDotColor(item.tone)
            return (
              <div key={item.id} style={rowStyle}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-secondary, #9bb8a7)',
                  }}
                >
                  <span style={dotStyle(color)} />
                  {item.label}
                </span>
                <span
                  style={{
                    color: item.tone === 'danger' ? color : 'var(--color-secondary-hover, #d7ffe4)',
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
