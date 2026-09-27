import { configureStore } from '@reduxjs/toolkit'

import { preferenceMiddleware } from './middleware/preferenceMiddleware'
import preferenceReducer from './preferenceSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    preference: preferenceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(preferenceMiddleware.middleware),
})
