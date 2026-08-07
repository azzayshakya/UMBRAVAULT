import MENU_KEYS from '@devStack/components/sidebar/constants/MenuKeys'
import { lazy } from 'react'

export const ROUTE_ELEMENTS = {
  [MENU_KEYS.HOME]: lazy(() => import('@/pages/Dashboard/Dashboard')),

  [MENU_KEYS.ABOUT]: lazy(() => import('@/pages/About/About')),

  [MENU_KEYS.MY_PROFILE]: lazy(() => import('@/pages/MyProfile/MyProfile')),

  [MENU_KEYS.ADD_USER]: lazy(() => import('@/pages/Auth/Register')),

  [MENU_KEYS.ROLE_MANAGEMENT]: lazy(() => import('@/pages/UserRoleMangegment/UserManagementPage')),
  [MENU_KEYS.TASK_MANAGEMENT]: lazy(() => import('@/pages/TaskManagement/Taskmanagementpage')),
  [MENU_KEYS.KNOWLEDGE_VAULT]: lazy(() => import('@/pages/KnowledgeVaultPage/Knowledgevaultpage')),
  [MENU_KEYS.KNOWLEDGE_VAULT_NOTE]: lazy(
    () => import('@/pages/KnowledgeVaultPage/components/Topicvaultpage')
  ),
}

export default ROUTE_ELEMENTS
