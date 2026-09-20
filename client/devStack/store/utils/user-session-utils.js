import { StorageKey } from '@devStack/enums/storage-key-enums'
import { Theme } from '@devStack/enums/theme-enums'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24h — local gating only, not tied to the JWT's real expiry

const getUserSessionLocally = () => {
  try {
    return JSON.parse(localStorage.getItem(StorageKey.USER_SESSION) || 'null')
  } catch {
    return null
  }
}

/** Persists the /login or /refresh-token response — only these two ever carry a fresh accessToken */
const setUserSessionLocally = (userSession) => {
  const { user = {}, accessToken, refreshToken, deviceId } = userSession
  const existing = getUserSessionLocally()
  const sessionToSave = {
    name: user.name,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userInitials: user.userInitials,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    interests: user?.interests,
    bio: user?.bio,
    accessToken: accessToken ?? existing?.accessToken ?? null,
    refreshToken: refreshToken ?? existing?.refreshToken ?? null,
    deviceId: deviceId ?? existing?.deviceId ?? null,
    expiresOn: new Date(Date.now() + SESSION_TTL_MS),
  }

  localStorage.setItem(StorageKey.USER_SESSION, JSON.stringify(sessionToSave))
  setUserPreferencesLocally()
  return sessionToSave
}

/** True only if a session exists AND its locally-tracked TTL hasn't lapsed */
const isUserSessionValid = () => {
  const session = getUserSessionLocally()
  if (!session?.accessToken || !session?.expiresOn) return false
  return Date.now() < new Date(session.expiresOn).getTime()
}

const setUserPreferencesLocally = (userPreferences) => {
  const existing = JSON.parse(localStorage.getItem(StorageKey.USER_PREFERENCES) || 'null')
  if (!userPreferences && existing?.theme) return
  localStorage.setItem(
    StorageKey.USER_PREFERENCES,
    JSON.stringify({ theme: userPreferences?.theme || Theme.LIGHT })
  )
}

const removeUserSessionLocally = () => {
  localStorage.removeItem(StorageKey.USER_SESSION)
  // localStorage.removeItem(StorageKey.USER_PREFERENCES)
}

export {
  getUserSessionLocally,
  isUserSessionValid,
  removeUserSessionLocally,
  setUserPreferencesLocally,
  setUserSessionLocally,
}
