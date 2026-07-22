// components/StatsRow.jsx
import StatCard from './StatCard'

const StatsRow = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: 14, width: '100%' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 96,
              border: '1px solid var(--term-border, rgba(34, 224, 122, 0.2))',
              borderRadius: 'var(--radius-sm, 6px)',
              background: 'rgba(6, 14, 9, 0.4)',
              opacity: 0.4,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 14, width: '100%' }}>
      {stats.map((stat) => (
        <div key={stat.id} style={{ flex: 1, minWidth: 0 }}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  )
}

export default StatsRow
