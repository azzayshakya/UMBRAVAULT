import MENU_CONFIG from '@devStack/components/sidebar/control/MenuConfig'
import { ROUTES } from '@devStack/components/sidebar/control/RouteConfiguration'
import PageLoader from '@devStack/components/spinners/PageLoader'
import NotFoundPage from '@devStack/pages/NotFoundPage'
import Unauthorized from '@devStack/pages/Unauthorized'
import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import LoginPage from '@/pages/Auth/Login'
import SignupPage from '@/pages/Auth/Register'
import UserManagementPage from '@/pages/UserRoleMangegment/UserManagementPage'

import ProtectedRoute from './ProtectedRoute'
import ROUTE_ELEMENTS from './RouteElements'

const flattenMenu = (items) =>
  items.reduce((acc, item) => {
    acc.push(item)
    if (item.children?.length) acc.push(...flattenMenu(item.children))
    return acc
  }, [])

const AppRoutes = () => {
  const { user } = useSelector((state) => state.user)

  const flatMenu = flattenMenu(MENU_CONFIG)

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/role" element={<UserManagementPage />} />
        <Route element={<MainLayout userRole={user?.role ?? undefined} />}>
          {flatMenu.map((item) => {
            const path = ROUTES[item.key]
            const Element = ROUTE_ELEMENTS[item.key]
            if (!path || !Element) return null

            return (
              <Route
                key={item.key}
                path={path}
                element={
                  <ProtectedRoute menuKey={item.key}>
                    <Element />
                  </ProtectedRoute>
                }
              />
            )
          })}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
