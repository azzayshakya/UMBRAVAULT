import { MoonOutlined, SunOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import HeaderUserProfile from '@devStack/components/userProfile/HeaderUserProfile'
import { ColorScheme } from '@devStack/constants/theme-constants'
import { toggleColorScheme } from '@devStack/store/preferenceSlice'
import { Breadcrumb, Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

const { Header } = Layout

export default function AdminHeaderComponent({
  colorBgContainer,
  setCollapsed,
  collapsed,
  breadcrumbItems,
}) {
  const dispatch = useDispatch()

  const resolvedScheme = useSelector((s) => s.preference.resolvedScheme)
  const isDark = resolvedScheme === ColorScheme.DARK

  const handleToggleTheme = () => {
    dispatch(toggleColorScheme())
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
          <button
            onClick={handleToggleTheme}
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
