import { getMySession } from '@devStack/apiServices/accounts-me-apis'
import { setUserSession } from '@devStack/store/userSlice'
import {
  isUserSessionValid,
  removeCompleteSessionAndRedirectToLogin,
  setUserSessionLocally,
} from '@devStack/store/utils/user-session-utils'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

export const useValidateUserSession = () => {
  const dispatch = useDispatch()
  const [isPending, setIsPending] = useState(true)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (window.location.pathname.startsWith('/login')) {
      setIsPending(false)
      return
    }

    const validate = async () => {
      // cheap local check first — skip the network call entirely if
      // there's nothing (or an expired-by-our-own-TTL) session saved
      // if (!isUserSessionValid()) {
      //   removeCompleteSessionAndRedirectToLogin()
      //   setIsPending(false)
      //   return
      // }

      // locally-valid session → confirm with the server and pick up any
      // changes (role change, name change, etc.)
      // axiosInstance's request interceptor attaches the Authorization
      // header from localStorage automatically — nothing to pass manually here.
      try {
        const httpResponse = await getMySession()
        const sessionData = setUserSessionLocally(httpResponse?.data)
        dispatch(
          setUserSession({
            user: sessionData,
            accessToken: sessionData?.accessToken,
            refreshToken: sessionData?.refreshToken,
          })
        )
      } catch (error) {
        console.error('Session validation failed:', error)
      } finally {
        setIsPending(false)
      }
    }

    validate()
  }, [dispatch])

  return { isPending }
}
