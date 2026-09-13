import { Theme, PREFS_STORAGE_KEY, SYSTEM_DARK_QUERY } from '../constants/theme-constants'
const TRANSITION_CLASS = 'theme-transitions-enabled'
const TRANSITION_DURATION_MS = 200
let transitionTimeoutId = null

const VALID_THEMES = Object.values(Theme)
const DEFAULT_THEME = Theme.DARK

/** Reads the whole preferences object from localStorage. Never throws. */
export function getUserPreferences() {
  try {
    const saved = localStorage.getItem(PREFS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('[theme] Failed to parse preferences, using defaults.', error)
    return {}
  }
}

/** Merges a partial update into stored preferences. Single write point. */
function updateUserPreferences(partial) {
  try {
    const prefs = { ...getUserPreferences(), ...partial }
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
  } catch (error) {
    console.error('[theme] Failed to save preferences.', error)
  }
}

export function getSavedTheme() {
  const { theme } = getUserPreferences()
  return VALID_THEMES.includes(theme) ? theme : DEFAULT_THEME
}

/** Turns 'system' into an actual 'light' | 'dark' based on the OS setting. */
export function resolveTheme(theme) {
  if (theme !== Theme.SYSTEM) return theme
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? Theme.DARK : Theme.LIGHT
}

export function applyThemeToDOM(theme) {
  const root = document.documentElement
  root.setAttribute('data-scheme', resolveTheme(theme))

  root.classList.add(TRANSITION_CLASS)
  clearTimeout(transitionTimeoutId)
  transitionTimeoutId = setTimeout(() => {
    root.classList.remove(TRANSITION_CLASS)
  }, TRANSITION_DURATION_MS)
}

export function saveTheme(theme) {
  if (!VALID_THEMES.includes(theme)) {
    console.error(`[theme] Invalid theme "${theme}". Expected one of ${VALID_THEMES.join(', ')}`)
    return
  }
  updateUserPreferences({ theme })
}

export function getSavedSidebarCollapsed() {
  const { sidebarCollapsed } = getUserPreferences()
  return typeof sidebarCollapsed === 'boolean' ? sidebarCollapsed : false
}

export function saveSidebarCollapsed(collapsed) {
  updateUserPreferences({ sidebarCollapsed: collapsed })
}

/** Called once, before React mounts, so the correct scheme is set instantly. */
export function bootstrapTheme() {
  applyThemeToDOM(getSavedTheme())
}
