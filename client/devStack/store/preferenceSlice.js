import { createSlice } from '@reduxjs/toolkit'

import { ColorScheme, PREFS_STORAGE_KEY } from '../constants/theme-constants'
import {
  applyThemeToDOM,
  getSavedColorScheme,
  getUserPreferences,
  resolveColorScheme,
  saveColorScheme,
} from '../utils/theme-utils'

const initialColorScheme = getSavedColorScheme()

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
  colorScheme: initialColorScheme,
  resolvedScheme: resolveColorScheme(initialColorScheme),
  sidebarCollapsed: getSavedSidebarCollapsed(),
}

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    colorSchemeChanged: (state, action) => {
      state.colorScheme = action.payload
      state.resolvedScheme = resolveColorScheme(action.payload)
    },
    sidebarCollapseChanged: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const { colorSchemeChanged, sidebarCollapseChanged } = preferenceSlice.actions
export default preferenceSlice.reducer

export const setColorScheme = (colorScheme) => (dispatch) => {
  saveColorScheme(colorScheme)
  applyThemeToDOM({ colorScheme })
  dispatch(colorSchemeChanged(colorScheme))
}

export const toggleColorScheme = () => (dispatch, getState) => {
  const { resolvedScheme } = getState().preference
  dispatch(
    setColorScheme(resolvedScheme === ColorScheme.DARK ? ColorScheme.LIGHT : ColorScheme.DARK)
  )
}

export const syncSystemScheme = () => (dispatch, getState) => {
  const { colorScheme } = getState().preference
  if (colorScheme !== ColorScheme.SYSTEM) return
  applyThemeToDOM({ colorScheme: ColorScheme.SYSTEM })
  dispatch(colorSchemeChanged(ColorScheme.SYSTEM))
}

export const setSidebarCollapsed = (collapsed) => (dispatch) => {
  saveSidebarCollapsed(collapsed)
  dispatch(sidebarCollapseChanged(collapsed))
}
