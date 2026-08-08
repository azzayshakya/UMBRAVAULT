import { Skeleton } from './Skelton/Skeleton'

export const StatCard = ({ icon, label, value, color, loading }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: '1px solid var(--term-border)',
      borderRadius: 10,
      padding: '14px 16px',
      background: 'rgba(6, 18, 10, 0.4)',
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}22`,
        color,
        fontSize: 18,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: 'var(--term-text-muted)', fontSize: 11, letterSpacing: 1 }}>{label}</div>
      {loading ? (
        <Skeleton height={22} width={48} borderRadius={4} style={{ marginTop: 4 }} />
      ) : (
        <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value ?? '—'}</div>
      )}
    </div>
  </div>
)
