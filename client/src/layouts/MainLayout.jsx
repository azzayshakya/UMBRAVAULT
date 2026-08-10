import AdminHeaderComponent from '@devStack/components/sidebar/components/AdminHeaderComponent'
import MENU_CONFIG from '@devStack/components/sidebar/control/MenuConfig'
import useMenu from '@devStack/components/sidebar/hooks/UseMenu'
import { buildBreadcrumbs } from '@devStack/components/sidebar/utilities/breadCrumbBuilder'
import { buildMenuItems } from '@devStack/components/sidebar/utilities/MenuBuilder'
import SidebarQuoteCard from '@devStack/components/Sidebarquotecard'
import { App_Name, App_ShortName } from '@devStack/constants'
import { setSidebarCollapsed } from '@devStack/store/preferenceSlice'
import useThemeStore from '@devStack/store/useThemeStore'
import { Layout, Menu, Typography } from 'antd'
import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

const { Sider } = Layout
const { Text } = Typography

const MainLayout = ({ userRole, userData = null }) => {
  const dispatch = useDispatch()

  const collapsed = useSelector((s) => s.preference.sidebarCollapsed)
  const scheme = useThemeStore((s) => s.scheme)

  const contentBgUrl = '/images/global/binary-bg.jpg'

  const { selectedKeys, openKeys, handleMenuClick, handleOpenChange } = useMenu({
    defaultSelectedKey: 'dashboard',
    persistState: true,
  })

  const menuItems = useMemo(() => {
    return buildMenuItems(MENU_CONFIG, userRole)
  }, [userRole])

  const breadcrumbItems = useMemo(() => {
    return buildBreadcrumbs(selectedKeys[0])
  }, [selectedKeys])

  const handleCollapse = (value) => {
    dispatch(setSidebarCollapsed(value))
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={250}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'var(--color-bg-container)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-primary-light)',
              margin: '16px',
              borderRadius: 'var(--radius)',
            }}
          >
            <Text
              strong
              style={{
                color: 'var(--color-primary)',
                fontSize: collapsed ? '16px' : '20px',
                transition: 'font-size 0.3s',
              }}
            >
              {collapsed ? App_ShortName : App_Name}
            </Text>
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
            </div>

            <div style={{ marginTop: 'auto' }}>
              <SidebarQuoteCard collapsed={collapsed} />
            </div>
          </div>
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'margin-left 0.2s',
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
            background: `linear-gradient(rgba(8, 11, 9, 0.72), rgba(8, 11, 9, 0.72)), url(${contentBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
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
