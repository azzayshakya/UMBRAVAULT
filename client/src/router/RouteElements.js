import MENU_KEYS from '@devStack/components/sidebar/constants/MenuKeys'
import { lazy } from 'react'

export const ROUTE_ELEMENTS = {
  [MENU_KEYS.HOME]: lazy(() => import('@/pages/Dashboard/Dashboard')),

  [MENU_KEYS.ABOUT]: lazy(() => import('@/pages/About/About')),

  [MENU_KEYS.MY_PROFILE]: lazy(() => import('@/pages/MyProfile/MyProfile')),

  [MENU_KEYS.ADD_USER]: lazy(() => import('@/pages/Auth/Register')),

  [MENU_KEYS.ROLE_MANAGEMENT]: lazy(() => import('@/pages/UserRoleMangegment/UserManagementPage')),
}

export default ROUTE_ELEMENTS
