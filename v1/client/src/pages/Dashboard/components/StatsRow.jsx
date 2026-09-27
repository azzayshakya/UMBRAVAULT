import {
  SkinOutlined,
  ClusterOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  AimOutlined,
} from '@ant-design/icons'
import { StatCardSkeletonDashboard } from '@devStack/components/Skelton/StatCardSkeltonDashboard'

import { toneColor, buildSparklinePoints } from '../utils/dashboardUtils'

import DashboardPanel from './DashboardPanel'

const ICONS = {
  skull: SkinOutlined,
  server: ClusterOutlined,
  shield: SafetyOutlined,
  db: DatabaseOutlined,
  target: AimOutlined,
}

export const StatCard = ({ icon, label, value, sub, trend, tone, index = 0 }) => {
  const Icon = ICONS[icon] || SafetyOutlined
  const color = toneColor(tone)
  const points = buildSparklinePoints(trend)

  return (
    <div
      style={{
        minWidth: 0,
        height: '100%',
        animation: 'term-fade-in 0.5s ease-out both',
        animationDelay: `${index * 70}ms`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <DashboardPanel
        icon={<Icon style={{ color }} />}
        title={label}
        style={{ minWidth: 0, height: '100%' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justify: 'space-between',
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
                color: 'var(--color-secondary, #6b8f78)',
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
    </div>
  )
}

const StatsRow = ({ stats = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 14, width: '100%' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ flex: 1, minWidth: 0 }}>
            <StatCardSkeletonDashboard index={i} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 14, width: '100%' }}>
      {stats.map((stat, i) => (
        <div key={stat.id || i} style={{ flex: 1, minWidth: 0 }}>
          <StatCard {...stat} index={i} />
        </div>
      ))}
    </div>
  )
}

export default StatsRow
