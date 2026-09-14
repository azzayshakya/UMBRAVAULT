import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { useState } from 'react'

import CenterBrandText from './components/CenterBrandText'
import LiveSystemFeed from './components/LiveSystemFeed'
import ProjectsGrid from './components/ProjectGrid'
import StatsRow from './components/StatsRow'
import SystemStatusPanel from './components/SystemStatusPanel'
import UserInfoPanel from './components/UserInfoPanel'
import useSystemStatus from './hooks/useSystemStatus'

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  boxSizing: 'border-box',
  overflow: 'hidden',
  color: 'var(--color-secondary-hover, #d7ffe4)',
}

const DashboardHeaderUrl =
  'https://res.cloudinary.com/dehqq4vrf/image/upload/v1789050978/umbra_vault/umbra-vault/krugyitsmgqqrglfmvof.png'

const Dashboard = () => {
  const { statusList, stats, loading: statusLoading } = useSystemStatus()
  const isMobile = useIsMobile()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div style={pageStyle}>
      {/* Top Banner with Skeleton fallback */}
      {/* Top Banner with Cross-Fade */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius, 8px)',
          border: '1px solid var(--term-border)',
          overflow: 'hidden',
          width: '100%',
          aspectRatio: '16 / 4', // Preserves exact banner proportions to eliminate layout shifts
          minHeight: 160,
          background: 'var(--term-bg-panel, #06120a)',
        }}
      >
        {/* Skeleton stays pinned in the background until the image fully fades in */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: imageLoaded ? 0 : 1,
            pointerEvents: 'none',
            transition: 'opacity 0.25s ease-out',
            zIndex: 1,
          }}
        >
          <Skeleton width="100%" height="100%" borderRadius={0} style={{ display: 'block' }} />
        </div>

        {/* Image sits over the skeleton and fades in smoothly */}
        <img
          src={DashboardHeaderUrl}
          alt="Dashboard Header"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            // objectFit: 'cover',
            display: 'block',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '360px 1fr 300px',
          gap: 14,
          flexShrink: 0,
        }}
      >
        <UserInfoPanel />
        {!isMobile && (
          <>
            <div
              style={{
                border: '1px solid var(--term-border)',
                borderRadius: 'var(--radius-sm, 6px)',
              }}
            >
              <CenterBrandText />
            </div>
            <SystemStatusPanel statusList={statusList} loading={statusLoading} />
          </>
        )}
      </div>

      {!isMobile && (
        <div style={{ flexShrink: 0 }}>
          <StatsRow stats={stats} loading={statusLoading} />
        </div>
      )}

      <ProjectsGrid />

      {!isMobile && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px 300px',
            gap: 14,
            flex: 1,
            minHeight: 0,
          }}
        >
          <LiveSystemFeed />
        </div>
      )}
    </div>
  )
}

export default Dashboard
