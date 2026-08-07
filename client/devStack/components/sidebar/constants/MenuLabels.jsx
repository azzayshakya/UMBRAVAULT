export const MENU_LABELS = {
  home: 'Home',
  about: 'About',
  my_profile: 'My Profile',
  add_user: 'Add User',
  role_management: 'Role Management',
  task_management: 'Task Management',
  Knowledge_vault: 'Knowledge Vault',
}

export const getMenuLabel = (key) => {
  return MENU_LABELS[key] || key
}

export default MENU_LABELS
