import { MENU_KEYS } from '../constants/MenuKeys'

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}

export const MENU_PERMISSIONS = {
  [MENU_KEYS.HOME]: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST],

  [MENU_KEYS.ABOUT]: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.GUEST],

  [MENU_KEYS.MY_PROFILE]: [USER_ROLES.ADMIN, USER_ROLES.USER],

  [MENU_KEYS.ADD_USER]: [USER_ROLES.ADMIN, USER_ROLES.USER],

  [MENU_KEYS.ROLE_MANAGEMENT]: [USER_ROLES.ADMIN, USER_ROLES.USER],
}

export const hasMenuPermission = (menuKey, userRole) => {
  const allowedRoles = MENU_PERMISSIONS[menuKey]
  return allowedRoles ? allowedRoles.includes(userRole) : false
}

export default MENU_PERMISSIONS
