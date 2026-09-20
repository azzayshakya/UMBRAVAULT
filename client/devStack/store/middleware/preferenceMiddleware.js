import { createListenerMiddleware } from '@reduxjs/toolkit'

import { sidebarCollapseChanged, themeChanged } from '../preferenceSlice'
import { saveTheme, saveSidebarCollapsed } from '../theme/utils/theme-utils'

export const preferenceMiddleware = createListenerMiddleware()

// Persistence only. DOM updates now live in ThemeProvider (useLayoutEffect),
// synced to React's render/commit — see ThemeProvider.jsx for why.
preferenceMiddleware.startListening({
  actionCreator: themeChanged,
  effect: (action) => {
    saveTheme(action.payload)
  },
})

preferenceMiddleware.startListening({
  actionCreator: sidebarCollapseChanged,
  effect: (action) => {
    saveSidebarCollapsed(action.payload)
  },
})
