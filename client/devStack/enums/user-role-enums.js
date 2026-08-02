export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'superadmin',
  TESTER: 'tester',
})

export const USER_ROLE_LABELS = Object.freeze({
  [USER_ROLES.ADMIN]: 'ADMIN',
  [USER_ROLES.USER]: 'USER',
  [USER_ROLES.SUPER_ADMIN]: 'SUPER ADMIN',
  [USER_ROLES.TESTER]: 'TESTER',
})

export const getRoleLabel = (role) =>
  USER_ROLE_LABELS[role] ?? (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown')

export const ROLE_RANK = Object.freeze({
  [USER_ROLES.USER]: 0,
  [USER_ROLES.TESTER]: 1,
  [USER_ROLES.ADMIN]: 2,
  [USER_ROLES.SUPER_ADMIN]: 3,
})

export const ASSIGNABLE_ROLES = [USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]

export const ROLE_BADGE_CONFIG = Object.freeze({
  [USER_ROLES.ADMIN]: { label: USER_ROLE_LABELS[USER_ROLES.ADMIN], color: 'blue' },
  [USER_ROLES.SUPER_ADMIN]: { label: USER_ROLE_LABELS[USER_ROLES.SUPER_ADMIN], color: 'red' },
  [USER_ROLES.USER]: { label: USER_ROLE_LABELS[USER_ROLES.USER], color: 'purple' },
  [USER_ROLES.TESTER]: { label: USER_ROLE_LABELS[USER_ROLES.TESTER], color: 'default' },
})
