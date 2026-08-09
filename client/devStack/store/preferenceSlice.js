import { createSlice } from '@reduxjs/toolkit'

import { ColorScheme } from '../constants/theme-constants'
import {
  applyThemeToDOM,
  getSavedColorScheme,
  resolveColorScheme,
  saveColorScheme,
} from '../utils/theme-utils'

const initialColorScheme = getSavedColorScheme()

const initialState = {
  colorScheme: initialColorScheme,
  resolvedScheme: resolveColorScheme(initialColorScheme),
  // future preferences (language, layoutDensity, etc.) go here
}

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    colorSchemeChanged: (state, action) => {
      state.colorScheme = action.payload
      state.resolvedScheme = resolveColorScheme(action.payload)
    },
  },
})

export const { colorSchemeChanged } = preferenceSlice.actions
export default preferenceSlice.reducer

// ── Thunks ──────────────────────────────────────
export const setColorScheme = (colorScheme) => (dispatch) => {
  saveColorScheme(colorScheme) // Now saves to the user_preferences object
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
