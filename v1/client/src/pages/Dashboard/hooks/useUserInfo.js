import { useEffect, useState } from 'react'

import { getUserInfo } from '../api/dashboardApi'

const useUserInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getUserInfo()
      .then((data) => {
        if (isMounted) setUser(data)
      })
      .catch((err) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { user, loading, error }
}

export default useUserInfo
