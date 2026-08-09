import { ColorScheme, PREFS_STORAGE_KEY, SYSTEM_DARK_QUERY } from '../constants/theme-constants'

const VALID_SCHEMES = Object.values(ColorScheme)

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

export function getSavedColorScheme() {
  const prefs = getUserPreferences()
  const savedTheme = prefs.theme // Look inside the JSON object

  // self-heals: only trust the stored value if it's a real enum value
  return VALID_SCHEMES.includes(savedTheme) ? savedTheme : ColorScheme.SYSTEM
}

export function resolveColorScheme(colorScheme) {
  if (colorScheme !== ColorScheme.SYSTEM) return colorScheme
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? ColorScheme.DARK : ColorScheme.LIGHT
}

export function applyThemeToDOM({ colorScheme }) {
  const root = document.documentElement
  const resolved = resolveColorScheme(colorScheme)
  root.setAttribute('data-scheme', resolved)
}

export function saveColorScheme(value) {
  if (!VALID_SCHEMES.includes(value)) {
    console.error(`saveColorScheme: expected one of ${VALID_SCHEMES.join(', ')}, got`, value)
    return
  }

  // Get current preferences so we don't overwrite other future settings
  const prefs = getUserPreferences()

  if (value === ColorScheme.SYSTEM) {
    delete prefs.theme // Remove theme key if reverting to system
  } else {
    prefs.theme = value // Set to 'light' or 'dark'
  }

  // Save the updated object back to localStorage
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
}

export function bootstrapTheme() {
  applyThemeToDOM({ colorScheme: getSavedColorScheme() })
}
