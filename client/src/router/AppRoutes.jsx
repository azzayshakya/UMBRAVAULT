import MENU_KEYS from '@devStack/components/sidebar/constants/MenuKeys'
import MENU_CONFIG from '@devStack/components/sidebar/control/MenuConfig'
import { ROUTES } from '@devStack/components/sidebar/control/RouteConfiguration'
import PageLoader from '@devStack/components/spinners/PageLoader'
import NotFoundPage from '@devStack/pages/NotFoundPage'
import Unauthorized from '@devStack/pages/Unauthorized'
import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import AuthLayout from '@/layouts/AuthLayout'
import MainLayout from '@/layouts/MainLayout'
import AboutUsPage from '@/pages/About/About'
import LoginPage from '@/pages/Auth/Login'
import SignupPage from '@/pages/Auth/Register'
import UserManagementPage from '@/pages/UserRoleMangegment/UserManagementPage'

import ProtectedRoute from './ProtectedRoute'
import ROUTE_ELEMENTS from './RouteElements'
// IMPORT MENU_KEYS HERE

const flattenMenu = (items) =>
  items.reduce((acc, item) => {
    acc.push(item)
    if (item.children?.length) acc.push(...flattenMenu(item.children))
    return acc
  }, [])

const AppRoutes = () => {
  const { user } = useSelector((state) => state.user)
  const flatMenu = flattenMenu(MENU_CONFIG)

  const NotePageElement = ROUTE_ELEMENTS[MENU_KEYS.KNOWLEDGE_VAULT_NOTE]

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/role" element={<UserManagementPage />} />

        {/* Everything inside this Route shares the MainLayout */}
        <Route element={<MainLayout userRole={user?.role ?? undefined} />}>
          {/* 1. Mapped sidebar routes */}
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

          {/* 2. Hidden dynamic note route (shares MainLayout, but not in sidebar) */}
          {NotePageElement && (
            <Route
              path={ROUTES[MENU_KEYS.KNOWLEDGE_VAULT_NOTE]}
              element={
                <ProtectedRoute menuKey={MENU_KEYS.KNOWLEDGE_VAULT_NOTE}>
                  <NotePageElement />
                </ProtectedRoute>
              }
            />
          )}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
