import { WifiOutlined } from '@ant-design/icons'

import useServerLogs from '../hooks/useServerLogs'
import { statusDotColor } from '../utils/dashboardUtils'

import DashboardPanel from './DashboardPanel'

const STATUS_LABEL = {
  success: 'SUCCESS',
  warning: 'WARNING',
  complete: 'COMPLETE',
}

const LiveSystemFeed = () => {
  const { logs, loading } = useServerLogs()

  return (
    <DashboardPanel
      icon={
        <span className="dash-live-dot-wrap">
          <WifiOutlined />
          <span className="dash-live-dot" />
        </span>
      }
      title="Live System Feed"
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 14,
                  opacity: 0.25,
                  fontFamily: 'var(--term-font, monospace)',
                  fontSize: 12,
                }}
              >
                loading...
              </div>
            ))
          : logs.map((log, index) => {
              const color = statusDotColor(log.status)
              return (
                <div
                  key={log.id}
                  className={index === 0 ? 'dash-log-row dash-log-row--new' : 'dash-log-row'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <span style={{ color: 'var(--color-secondary, #6b8f78)' }}>[{log.time}]</span>
                  <span style={{ color: 'var(--color-primary, #22e07a)' }}>{log.actor}</span>
                  <span style={{ color: 'var(--color-secondary, #6b8f78)' }}>→</span>
                  <span style={{ color: 'var(--color-secondary-hover, #d7ffe4)' }}>
                    {log.action}
                  </span>
                  {STATUS_LABEL[log.status] && (
                    <span style={{ color, marginLeft: 'auto', fontWeight: 600, flexShrink: 0 }}>
                      [{STATUS_LABEL[log.status]}]
                    </span>
                  )}
                </div>
              )
            })}
      </div>
    </DashboardPanel>
  )
}

export default LiveSystemFeed
