export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'superadmin',
  TESTER: 'tester',
})

export const USER_ROLE_LABELS = Object.freeze({
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.TESTER]: 'Tester',
})

export const getRoleLabel = (role) =>
  USER_ROLE_LABELS[role] ?? (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown')
