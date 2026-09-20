import { setUserSession, setAccessToken, clearUserSession } from '@devStack/store/userSlice'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const accessToken = useSelector((state) => state.user.accessToken)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // Actions
  const login = useCallback(
    ({ user: userData, accessToken: token }) => {
      dispatch(setUserSession({ user: userData, accessToken: token }))
    },
    [dispatch]
  )

  const updateToken = useCallback(
    (token) => {
      dispatch(setAccessToken(token))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(clearUserSession())
  }, [dispatch])

  // Convenience computed helpers
  const role = useMemo(() => user?.role ?? null, [user])
  const userId = useMemo(() => user?.id ?? user?._id ?? null, [user])

  return {
    user,
    accessToken,
    isAuthenticated,
    role,
    userId,
    login,
    updateToken,
    logout,
  }
}
