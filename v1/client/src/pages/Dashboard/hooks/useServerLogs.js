import { useEffect, useState } from 'react'

import { getServerLogs, getNextLiveLogEntry } from '../api/dashboardApi'

const MAX_VISIBLE_LOGS = 6
const LIVE_TICK_MS = 4500

const useServerLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getServerLogs()
      .then((data) => {
        if (isMounted) setLogs(data)
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

  useEffect(() => {
    if (loading) return undefined

    const interval = setInterval(() => {
      setLogs((prev) => [getNextLiveLogEntry(), ...prev].slice(0, MAX_VISIBLE_LOGS))
    }, LIVE_TICK_MS)

    return () => clearInterval(interval)
  }, [loading])

  return { logs, loading, error }
}

export default useServerLogs
