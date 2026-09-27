// import MENU_KEYS from '@devStack/components/sidebar/constants/MenuKeys'
// import { lazy } from 'react'

// export const ROUTE_ELEMENTS = {
//   [MENU_KEYS.HOME]: lazy(() => import('@/pages/Dashboard/Dashboard')),

//   [MENU_KEYS.ABOUT]: lazy(() => import('@/pages/About/About')),

//   [MENU_KEYS.MY_PROFILE]: lazy(() => import('@/pages/MyProfile/MyProfile')),

//   [MENU_KEYS.ADD_USER]: lazy(() => import('@/pages/Auth/Register')),

//   [MENU_KEYS.ROLE_MANAGEMENT]: lazy(() => import('@/pages/UserRoleMangegment/UserManagementPage')),
//   [MENU_KEYS.TASK_MANAGEMENT]: lazy(() => import('@/pages/TaskManagement/Taskmanagementpage')),
//   [MENU_KEYS.KNOWLEDGE_VAULT]: lazy(() => import('@/pages/KnowledgeVaultPage/Knowledgevaultpage')),
//   [MENU_KEYS.KNOWLEDGE_VAULT_NOTE]: lazy(
//     () => import('@/pages/KnowledgeVaultPage/components/Topicvaultpage')
//   ),
// }

// export default ROUTE_ELEMENTS

import MENU_KEYS from '@devStack/components/sidebar/constants/MenuKeys'

import About from '@/pages/About/About'
import Register from '@/pages/Auth/Register'
import Dashboard from '@/pages/Dashboard/Dashboard'
import DocumentVault from '@/pages/DocumentVault/DocumentVault'
import Topicvaultpage from '@/pages/KnowledgeVaultPage/components/NoteVaultPage'
import Knowledgevaultpage from '@/pages/KnowledgeVaultPage/Knowledgevaultpage'
import MyProfile from '@/pages/MyProfile/MyProfile'
import Taskmanagementpage from '@/pages/TaskManagement/Taskmanagementpage'
import UserManagementPage from '@/pages/UserRoleMangegment/UserManagementPage'

export const ROUTE_ELEMENTS = {
  [MENU_KEYS.HOME]: Dashboard,
  [MENU_KEYS.ABOUT]: About,
  [MENU_KEYS.MY_PROFILE]: MyProfile,
  [MENU_KEYS.ADD_USER]: Register,
  [MENU_KEYS.ROLE_MANAGEMENT]: UserManagementPage,
  [MENU_KEYS.TASK_MANAGEMENT]: Taskmanagementpage,
  [MENU_KEYS.KNOWLEDGE_VAULT]: Knowledgevaultpage,
  [MENU_KEYS.KNOWLEDGE_VAULT_NOTE]: Topicvaultpage,
  [MENU_KEYS.DOCUMENT_VAULT]: DocumentVault,
}

export default ROUTE_ELEMENTS
