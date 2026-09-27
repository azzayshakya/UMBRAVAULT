import { createSlice } from '@reduxjs/toolkit'

import { getSavedTheme, getSavedSidebarCollapsed } from './theme/utils/theme-utils'

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
