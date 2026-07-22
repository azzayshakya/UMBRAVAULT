import {
  SkinOutlined,
  ClusterOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  AimOutlined,
} from '@ant-design/icons'

import { toneColor, buildSparklinePoints } from '../utils/dashboardUtils'

import DashboardPanel from './DashboardPanel'

const ICONS = {
  skull: SkinOutlined,
  server: ClusterOutlined,
  shield: SafetyOutlined,
  db: DatabaseOutlined,
  target: AimOutlined,
}

const StatCard = ({ icon, label, value, sub, trend, tone }) => {
  const Icon = ICONS[icon] || SafetyOutlined
  const color = toneColor(tone)
  const points = buildSparklinePoints(trend)

  return (
    <DashboardPanel icon={<Icon style={{ color }} />} title={label} style={{ minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flex: 1,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
              fontSize: 26,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          <span
            style={{
              fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
              fontSize: 11,
              color: 'var(--term-text-muted, #6b8f78)',
            }}
          >
            {sub}
          </span>
        </div>

        {points && (
          <svg width="64" height="24" style={{ flexShrink: 0 }}>
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dash-sparkline"
            />
          </svg>
        )}
      </div>
    </DashboardPanel>
  )
}

export default StatCard
