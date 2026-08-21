import { Theme, PREFS_STORAGE_KEY, SYSTEM_DARK_QUERY } from '../constants/theme-constants'

const VALID_THEMES = Object.values(Theme)

// Helper: Safely parse the user preferences from localStorage
export function getUserPreferences() {
  try {
    const saved = localStorage.getItem(PREFS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (error) {
    console.error('Failed to parse user_preferences, returning defaults.', error)
    return {}
  }
}

export function getSavedTheme() {
  const prefs = getUserPreferences()
  const savedTheme = prefs.theme

  return VALID_THEMES.includes(savedTheme) ? savedTheme : Theme.DARK
}

export function resolveTheme(theme) {
  if (theme !== Theme.SYSTEM) return theme
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? Theme.DARK : Theme.LIGHT
}

export function applyThemeToDOM({ theme }) {
  const root = document.documentElement
  const resolved = resolveTheme(theme)
  root.setAttribute('data-scheme', resolved)
}

export function saveTheme(value) {
  if (!VALID_THEMES.includes(value)) {
    console.error(`saveTheme: expected one of ${VALID_THEMES.join(', ')}, got`, value)
    return
  }

  const prefs = getUserPreferences()

  if (value === Theme.SYSTEM) {
    delete prefs.theme
  } else {
    prefs.theme = value
  }

  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
}

export function bootstrapTheme() {
  applyThemeToDOM({ theme: getSavedTheme() })
}
