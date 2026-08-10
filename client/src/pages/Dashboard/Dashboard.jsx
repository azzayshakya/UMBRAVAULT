import { useIsMobile } from '@devStack/utils/useIsMobile'

import CenterBrandText from './components/CenterBrandText'
import LiveSystemFeed from './components/LiveSystemFeed'
import ProjectsGrid from './components/ProjectGrid'
import QuickAccessPanel from './components/QuickAccessPanel'
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
  // Both the status list and the stat-card row are backed by the same
  // getSystemStatus() call, so it's fetched once here and passed down.
  const { statusList, stats, loading: statusLoading } = useSystemStatus()
  const isMobile = useIsMobile()
  return (
    <div style={pageStyle}>
      <style>{DASH_ANIMATION_CSS}</style>
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
          // On mobile: 1 column that fits the content naturally
          // On desktop: your original 3-column split layout
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
                border: '1px solid var(--term-border, rgba(34, 224, 122, 0.2))',
                borderRadius: 'var(--radius-sm, 6px)',
                background: 'rgba(6, 14, 9, 0.35)',
              }}
            >
              {/* <GlobeVisual /> */}
            </div>
            <SystemStatusPanel statusList={statusList} loading={statusLoading} />
          </>
        )}
      </div>

      {/* Row 2 — key metrics */}
      {!isMobile && (
        <div style={{ flexShrink: 0 }}>
          <StatsRow stats={stats} loading={statusLoading} />
        </div>
      )}

      <ProjectsGrid />
      {/* Row 3 — live feed, brand statement, shortcuts */}
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
          <CenterBrandText />
          <QuickAccessPanel />
        </div>
      )}
    </div>
  )
}

const DASH_ANIMATION_CSS = `
.dash-user-panel { position: relative; }
.dash-user-panel__scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(34, 224, 122, 0.06) 50%,
    transparent 100%
  );
  animation: dash-scan 4s linear infinite;
  pointer-events: none;
}
@keyframes dash-scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.dash-globe__ring { transform-origin: center; animation: dash-ring-pulse 2.4s ease-out infinite; }
.dash-globe__ring--2 { animation-delay: 1.2s; }
.dash-globe__core { animation: dash-core-pulse 2.4s ease-in-out infinite; }
@keyframes dash-ring-pulse {
  0% { r: 4; opacity: 0.5; }
  100% { r: 26; opacity: 0; }
}
@keyframes dash-core-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dash-sparkline {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: dash-draw 1.4s ease-out forwards;
}
@keyframes dash-draw {
  to { stroke-dashoffset: 0; }
}

.dash-live-dot-wrap { position: relative; display: inline-flex; }
.dash-live-dot {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary, #22e07a);
  box-shadow: 0 0 6px var(--color-primary, #22e07a);
  animation: dash-blink 1.6s ease-in-out infinite;
}
@keyframes dash-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.dash-log-row--new {
  animation: dash-log-in 0.5s ease-out;
}
@keyframes dash-log-in {
  0% { opacity: 0; transform: translateY(-6px); background: rgba(34, 224, 122, 0.12); }
  100% { opacity: 1; transform: translateY(0); background: transparent; }
}

.dash-brand-glitch { position: relative; display: inline-block; }
.dash-brand-glitch::before,
.dash-brand-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  overflow: hidden;
  color: var(--color-primary, #22e07a);
  background: transparent;
}
.dash-brand-glitch::before {
  animation: dash-glitch-1 3.2s infinite linear alternate-reverse;
  clip-path: inset(0 0 60% 0);
  transform: translate(-1px, -1px);
  opacity: 0.7;
}
.dash-brand-glitch::after {
  animation: dash-glitch-2 3.6s infinite linear alternate-reverse;
  clip-path: inset(60% 0 0 0);
  transform: translate(1px, 1px);
  opacity: 0.7;
}
@keyframes dash-glitch-1 {
  0%, 92%, 100% { transform: translate(-1px, -1px); }
  93% { transform: translate(2px, -1px); }
  96% { transform: translate(-2px, 1px); }
}
@keyframes dash-glitch-2 {
  0%, 92%, 100% { transform: translate(1px, 1px); }
  94% { transform: translate(-2px, 0); }
  97% { transform: translate(2px, -1px); }
}

.dash-quick-access-item {
  transition: background 0.15s ease, padding-left 0.15s ease;
}
.dash-quick-access-item:hover {
  background: rgba(34, 224, 122, 0.08) !important;
  padding-left: 12px !important;
}
`

export default Dashboard
