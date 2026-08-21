import {
  CompassOutlined,
  LockOutlined,
  InfoCircleOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Theme } from '@devStack/constants/theme-constants'
import { toggleTheme } from '@devStack/store/preferenceSlice'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const AuthLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector((state) => state.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--term-font, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(var(--color-bg-container), 0.75)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => navigate('/about-us')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--color-bg-container)',
                border: '1px solid var(--color-border-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
                boxShadow: 'var(--color-glow)',
              }}
            >
              <CompassOutlined style={{ fontSize: '18px' }} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '15px',
                letterSpacing: '1.5px',
                fontFamily: 'monospace',
                color: 'var(--color-text)',
              }}
            >
              UMBRA<span style={{ color: 'var(--color-primary)' }}>VAULT</span>
            </span>
          </div>

          {/* Navigation Route Pills */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 6px',
              borderRadius: '30px',
              background: 'var(--color-bg-container)',
              border: '1px solid var(--color-border)',
            }}
          >
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                border: isActive
                  ? '1px solid var(--color-border-secondary)'
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <InfoCircleOutlined /> About Us
            </NavLink>

            <NavLink
              to="/login"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                border: isActive
                  ? '1px solid var(--color-border-secondary)'
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <LockOutlined /> Login
            </NavLink>
          </nav>

          {/* Right Action: Theme Switcher & Terminal Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label="Toggle Theme"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-container)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.boxShadow = 'var(--color-glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isDark ? <SunOutlined /> : <MoonOutlined />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Router Outlet ─────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
