import { create } from 'zustand'

export const useUserSessionStore = create((set) => ({
  userSession: null,

  setUserSession: (session) =>
    set({
      userSession: session,
    }),

  clearUserSession: () =>
    set({
      userSession: null,
    }),

  isAuthenticated: () => Boolean(useUserSessionStore.getState().userSession),
}))
