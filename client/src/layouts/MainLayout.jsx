import AdminHeaderComponent from '@devStack/components/sidebar/components/AdminHeaderComponent'
import MENU_CONFIG from '@devStack/components/sidebar/control/MenuConfig'
import useMenu from '@devStack/components/sidebar/hooks/UseMenu'
import { buildBreadcrumbs } from '@devStack/components/sidebar/utilities/breadCrumbBuilder'
import { buildMenuItems } from '@devStack/components/sidebar/utilities/MenuBuilder'
import SidebarQuoteCard from '@devStack/components/Sidebarquotecard'
import { App_Name, App_ShortName } from '@devStack/constants'
import { setSidebarCollapsed } from '@devStack/store/preferenceSlice'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { ConfigProvider, Layout, Menu, Typography } from 'antd'
import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

const { Sider } = Layout
const { Text } = Typography

const MainLayout = ({ userRole, userData = null }) => {
  const dispatch = useDispatch()

  const collapsed = useSelector((s) => s.preference.sidebarCollapsed)
  const scheme = useSelector((s) => s.preference.colorScheme)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      dispatch(setSidebarCollapsed(true))
    }
  }, [isMobile, dispatch])

  const userPreference = useSelector((s) => s.preference)
  const isDark = userPreference.colorScheme === 'dark'
  const { selectedKeys, openKeys, handleMenuClick, handleOpenChange } = useMenu({
    defaultSelectedKey: 'dashboard',
    persistState: true,
  })
  const image = '/images/global/my-profile.jpg'
  const menuItems = useMemo(() => {
    return buildMenuItems(MENU_CONFIG, userRole)
  }, [userRole])

  const breadcrumbItems = useMemo(() => {
    return buildBreadcrumbs(selectedKeys[0])
  }, [selectedKeys])

  const handleCollapse = (value) => {
    dispatch(setSidebarCollapsed(value))
  }
  const avatarFrameStyle = {
    position: 'relative',
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: '50%',
    border: '1.5px solid var(--color-primary, var(--color-primary))',
    boxShadow: '0 0 10px rgba(34, 224, 122, 0.4)',
    overflow: 'hidden',
    background: 'var(--color-bg-container)',
  }

  const avatarImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  return (
    <Layout style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Sider
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={250}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'var(--color-bg-container)',
          borderRight: '1px solid var(--color-border)',
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed || isMobile ? 'center' : 'flex-start',
              gap: '10px',
              background: 'var(--color-bg-hover)',
              margin: isMobile ? '8px' : '16px',
              padding: collapsed || isMobile ? '0' : '0 16px',
              borderRadius: 'var(--radius)',
              flexShrink: 0,
            }}
          >
            <div style={avatarFrameStyle}>
              <img style={avatarImgStyle} src={image} alt={'user avatar'} />
            </div>

            {!collapsed && !isMobile && (
              <Text
                strong
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '20px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {App_Name}
              </Text>
            )}
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Menu: {
                      itemSelectedColor: 'var(--color-primary)',
                      itemSelectedBg: 'var(--color-bg-hover)',
                      itemHoverColor: 'var(--color-primary)',
                      itemActiveBg: 'var(--color-bg-hover)',

                      darkItemSelectedColor: 'var(--color-primary)',
                      darkItemSelectedBg: 'var(--color-bg-hover)',
                      darkItemHoverColor: 'var(--color-primary)',
                      darkItemHoverBg: 'var(--color-bg-hover)',
                    },
                  },
                }}
              >
                <Menu
                  theme={scheme === 'dark' ? 'dark' : 'light'}
                  mode="inline"
                  selectedKeys={selectedKeys}
                  openKeys={openKeys}
                  items={menuItems}
                  onClick={handleMenuClick}
                  onOpenChange={handleOpenChange}
                  style={{
                    background: 'transparent',
                    borderInlineEnd: 'none',
                  }}
                />
              </ConfigProvider>
            </div>

            <div style={{ marginTop: 'auto', flexShrink: 0 }}>
              <SidebarQuoteCard collapsed={collapsed} />
            </div>
          </div>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'margin-left 0.2s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AdminHeaderComponent
          colorBgContainer="var(--color-bg-container)"
          setCollapsed={handleCollapse}
          collapsed={collapsed}
          userData={userData}
          breadcrumbItems={breadcrumbItems}
        />

        <div
          style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius)',
            padding: 'var(--page-padding)',
            flex: 1,
          }}
        >
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}

export default MainLayout
