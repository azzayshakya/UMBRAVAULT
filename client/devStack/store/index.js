import { configureStore } from '@reduxjs/toolkit'

import preferenceReducer from './preferenceSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    preference: preferenceReducer,
  },
})
