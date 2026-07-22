import { create } from 'zustand'

import { ColorScheme } from '../constants/theme-constants'
import {
  applyThemeToDOM,
  getSavedColorScheme,
  resolveColorScheme,
  saveColorScheme,
} from '../utils/theme-utils'

const useThemeStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  colorScheme: getSavedColorScheme(), // "light" | "dark" | "system"
  resolvedScheme: resolveColorScheme(getSavedColorScheme()), // actual "light" | "dark"

  // ── Actions ───────────────────────────────────────────────────────────────

  setColorScheme: (colorScheme) => {
    const resolvedScheme = resolveColorScheme(colorScheme)
    saveColorScheme(colorScheme)
    applyThemeToDOM({ colorScheme })
    set({ colorScheme, resolvedScheme })
  },

  toggleColorScheme: () => {
    const next = get().resolvedScheme === ColorScheme.DARK ? ColorScheme.LIGHT : ColorScheme.DARK
    get().setColorScheme(next)
  },

  syncSystemScheme: () => {
    if (get().colorScheme !== 'system') return
    const resolvedScheme = resolveColorScheme('system')
    applyThemeToDOM({ colorScheme: 'system' })
    set({ resolvedScheme })
  },
}))

export default useThemeStore
