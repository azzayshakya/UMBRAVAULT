import { MENU_KEYS } from '../constants/MenuKeys'

export const ROUTES = {
  [MENU_KEYS.HOME]: '/',
  [MENU_KEYS.ABOUT]: '/about',
  [MENU_KEYS.MY_PROFILE]: '/profile',
  [MENU_KEYS.ADD_USER]: '/users/add',
  [MENU_KEYS.ROLE_MANAGEMENT]: '/roles-management',
  [MENU_KEYS.TASK_MANAGEMENT]: '/task-management',
  [MENU_KEYS.KNOWLEDGE_VAULT]: '/knowledge-vault',
  [MENU_KEYS.KNOWLEDGE_VAULT_NOTE]: '/knowledge-vault/:topicId',
}

export const getRoute = (key) => {
  return ROUTES[key] || '/'
}

export const getKeyFromRoute = (path) => {
  return Object.keys(ROUTES).find((key) => ROUTES[key] === path) || null
}
