// hooks/useSystemStatus.js
import { useEffect, useState } from 'react'

import { getSystemStatus } from '../api/dashboardApi'

/**
 * Powers both the top-right "SYSTEM STATUS" list and the stat-card row —
 * both come from the same `getSystemStatus` call so they can never drift
 * out of sync with each other.
 */
const useSystemStatus = () => {
  const [statusList, setStatusList] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getSystemStatus()
      .then(({ statusList: list, stats: statCards }) => {
        if (!isMounted) return
        setStatusList(list)
        setStats(statCards)
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

  return { statusList, stats, loading, error }
}

export default useSystemStatus
