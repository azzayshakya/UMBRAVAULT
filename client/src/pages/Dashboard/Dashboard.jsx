import { useIsMobile } from '@devStack/utils/useIsMobile'

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
const DashboardHeaderUrl = '/images/global/dashboard_header.png'
const Dashboard = () => {
  const { statusList, stats, loading: statusLoading } = useSystemStatus()
  const isMobile = useIsMobile()
  return (
    <div style={pageStyle}>
      <div
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          borderRadius: 'var(--radius)',
          // padding: 'var(--page-padding)',
          border: '1px solid var(--term-border)',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <img style={{ width: '100%' }} src={DashboardHeaderUrl} />
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
              {/* <div
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
                  borderRadius: 'var(--radius)',
                  // padding: 'var(--page-padding)',
                  border: '1px solid var(--term-border)',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <img style={{ width: '100%' }} src={DashboardHeaderUrl} />
              </div> */}
              {/* <GlobeVisual /> */}
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
