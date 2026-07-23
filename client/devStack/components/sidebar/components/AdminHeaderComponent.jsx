import { MenuFoldOutlined, MenuUnfoldOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import HeaderUserProfile from '@devStack/components/userProfile/HeaderUserProfile'
import { ColorScheme } from '@devStack/constants/theme-constants'
import { clearUserSession } from '@devStack/store/userSlice'
import useThemeStore from '@devStack/store/useThemeStore'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { removeUserSessionLocally } from '@devStack/utils/user-session-utils'
import { Breadcrumb, Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const { Header } = Layout

const authBtnBase = {
  height: 36,
  padding: '0 16px',
  borderRadius: 6,
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 12,
  letterSpacing: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
}

export default function AdminHeaderComponent({
  colorBgContainer,
  setCollapsed,
  collapsed,
  breadcrumbItems,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const resolvedScheme = useThemeStore((s) => s.resolvedScheme)
  const toggleColorScheme = useThemeStore((s) => s.toggleColorScheme)
  const authenticUser = useSelector((state) => state.user.user)
  const isDark = resolvedScheme === ColorScheme.DARK
  const handleLogout = () => {
    dispatch(clearUserSession())
    removeUserSessionLocally()
    redirectToLoginUtil()
  }
  return (
    <div>
      <Header
        style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderBottom: '2px solid var(--color-border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          // border: '2px red solid',
        }}
      >
        <div
          style={{
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>

        <span style={{ color: 'var(--term-green, var(--color-primary))' }}>&nbsp;&nbsp;{'>_'}</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} style={{ margin: 0 }} />
          )}
        </div>

        {/* pushes toggle + auth buttons to far right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* <button
            onClick={() => navigate('/login')}
            style={{
              ...authBtnBase,
              background: 'transparent',
              border: '1px solid var(--term-border-strong, rgba(34, 224, 122, 0.4))',
              color: 'var(--term-green, #22e07a)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(34, 224, 122, 0.08)'
              e.currentTarget.style.boxShadow = '0 0 10px rgba(34, 224, 122, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            LOGIN
          </button> */}

          {/* <button
            onClick={() => navigate('/signup')}
            style={{
              ...authBtnBase,
              background: 'var(--term-green, #22e07a)',
              border: '1px solid var(--term-green, #22e07a)',
              color: '#04140a',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 14px rgba(34, 224, 122, 0.55)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            SIGN UP
          </button> */}
          {/* <button
            onClick={handleLogout}
            style={{
              ...authBtnBase,
              background: '#d32f2f',
              border: '1px solid #d32f2f',
              color: '#fff',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 14px rgba(211, 47, 47, 0.55)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            LOGOUT
          </button> */}
          <button
            onClick={toggleColorScheme}
            aria-label="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--color-border-default)',
              background: 'var(--toggle-bg)',
              color: 'var(--toggle-icon-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 16,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--toggle-bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--toggle-bg)')}
          >
            {isDark ? <SunOutlined /> : <MoonOutlined />}
          </button>
          <HeaderUserProfile />
        </div>
      </Header>
    </div>
  )
}
