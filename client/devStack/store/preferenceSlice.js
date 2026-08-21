import { createSlice } from '@reduxjs/toolkit'

import { Theme, PREFS_STORAGE_KEY } from '../constants/theme-constants'
import {
  applyThemeToDOM,
  getSavedTheme,
  getUserPreferences,
  resolveTheme,
  saveTheme,
} from '../utils/theme-utils'

const getSavedSidebarCollapsed = () => {
  const prefs = getUserPreferences()
  return typeof prefs.sidebarCollapsed === 'boolean' ? prefs.sidebarCollapsed : false
}

const saveSidebarCollapsed = (collapsed) => {
  try {
    const prefs = getUserPreferences()
    prefs.sidebarCollapsed = collapsed
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
  } catch (error) {
    console.error('Failed to save sidebar collapsed preference to localStorage', error)
  }
}

const initialState = {
  theme: getSavedTheme(),
  sidebarCollapsed: getSavedSidebarCollapsed(),
}

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    themeChanged: (state, action) => {
      state.theme = action.payload
    },
    sidebarCollapseChanged: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const { themeChanged, sidebarCollapseChanged } = preferenceSlice.actions
export default preferenceSlice.reducer

export const setTheme = (theme) => (dispatch) => {
  saveTheme(theme)
  applyThemeToDOM({ theme })
  dispatch(themeChanged(theme))
}

export const toggleTheme = () => (dispatch, getState) => {
  const { theme } = getState().preference
  const currentResolved = resolveTheme(theme)
  dispatch(setTheme(currentResolved === Theme.DARK ? Theme.LIGHT : Theme.DARK))
}

export const syncSystemTheme = () => (dispatch, getState) => {
  const { theme } = getState().preference
  if (theme !== Theme.SYSTEM) return
  applyThemeToDOM({ theme: Theme.SYSTEM })
  dispatch(themeChanged(Theme.SYSTEM))
}

export const setSidebarCollapsed = (collapsed) => (dispatch) => {
  saveSidebarCollapsed(collapsed)
  dispatch(sidebarCollapseChanged(collapsed))
}
