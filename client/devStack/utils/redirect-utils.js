import { StorageKey } from '@devStack/enums/storage-key-enums'

/** Saves current path to LS so user can be sent back after login */
const savePostLoginRedirectPath = () => {
  const path = window.location.pathname
  if (path !== '/login') {
    localStorage.setItem(StorageKey.POST_LOGIN_REDIRECT, path)
  }
}

/** Reads and clears the saved post-login redirect path */
const getPostLoginRedirectPath = () => {
  const path = localStorage.getItem(StorageKey.POST_LOGIN_REDIRECT) || '/'
  localStorage.removeItem(StorageKey.POST_LOGIN_REDIRECT)
  return path
}

let navigateRef = null

/** Called once from AppRoutes/main.jsx to give this util access to router navigate */
const setNavigateRef = (navigate) => {
  navigateRef = navigate
}

/** Redirects to login, remembering where the user was so they can be sent back after */
const redirectToLoginUtil = () => {
  if (window.location.pathname.startsWith('/login')) return // already there — no-op, breaks the loop

  savePostLoginRedirectPath()

  if (navigateRef) {
    navigateRef('/login', { replace: true })
  } else {
    // fallback only if navigate isn't wired up yet
    window.location.href = '/login'
  }
}

/** Hard redirects to any given path */
const redirectToUtil = (path) => {
  window.location.replace(path)
}

export {
  redirectToLoginUtil,
  redirectToUtil,
  savePostLoginRedirectPath,
  getPostLoginRedirectPath,
  setNavigateRef,
}
