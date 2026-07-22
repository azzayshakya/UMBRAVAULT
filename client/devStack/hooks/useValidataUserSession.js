import { getMySession } from '@devStack/apiServices/accounts-me-apis'
import { clearUserSession, setUserSession } from '@devStack/store/userSlice'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import {
  isUserSessionValid,
  removeUserSessionLocally,
  setUserSessionLocally,
} from '@devStack/utils/user-session-utils'
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
      if (!isUserSessionValid()) {
        dispatch(clearUserSession())
        removeUserSessionLocally()
        setIsPending(false)
        redirectToLoginUtil()
        return
      }

      // locally-valid session → confirm with the server and pick up any
      // changes (role change, name change, etc.)
      // axiosInstance's request interceptor attaches the Authorization
      // header from localStorage automatically — nothing to pass manually here.
      try {
        const httpResponse = await getMySession()
        const sessionData = setUserSessionLocally(httpResponse.data)
        dispatch(
          setUserSession({
            user: sessionData,
            accessToken: sessionData?.accessToken,
            refreshToken: sessionData?.refreshToken,
          })
        )
      } catch (error) {
        // getMySession already went through the response interceptor's
        // 401 → refresh → retry flow if it was a token issue. If we're
        // still in catch, refresh also failed (or it's a non-401 error) —
        // either way, the session isn't valid, so clear and redirect.
        dispatch(clearUserSession())
        removeUserSessionLocally()
        redirectToLoginUtil()
      } finally {
        setIsPending(false)
      }
    }

    validate()
  }, [dispatch])

  return { isPending }
}
