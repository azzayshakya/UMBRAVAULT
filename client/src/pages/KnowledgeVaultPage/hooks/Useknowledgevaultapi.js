import {
  createTopic,
  deleteTopic,
  getAllTopics,
  getTopicStats,
  updateTopic,
} from '@devStack/apiServices/topic-api'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { useCallback, useEffect, useState } from 'react'

export const useKnowledgeVaultApi = (filters = {}) => {
  const [topics, setTopics] = useState([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllTopics({ ...filters })
      setTopics(response?.data?.topics || [])
      setTotal(response?.data?.pagination?.total || 0)
    } catch (err) {
      setTopics([])
      handleApiError(err)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const response = await getTopicStats()
      setStats(response?.data || null)
    } catch (err) {
      handleApiError(err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const runMutation = async (fn) => {
    setSubmitting(true)
    setApiError(null)
    try {
      const res = await fn()
      if (res?.success === false) {
        const msg = res?.message || 'Something went wrong'
        setApiError(msg)
        return { success: false, message: msg }
      }
      return { success: true, data: res }
    } catch (err) {
      handleApiError(err)
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong'
      setApiError(msg)
      return { success: false, message: msg }
    } finally {
      setSubmitting(false)
    }
  }

  const addTopic = useCallback((payload) => runMutation(() => createTopic(payload)), [])

  const editTopic = useCallback(
    (topicId, payload) => runMutation(() => updateTopic(topicId, payload)),
    []
  )

  const removeTopic = useCallback((topicId) => runMutation(() => deleteTopic(topicId)), [])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    topics,
    total,
    stats,
    loading,
    statsLoading,
    submitting,
    apiError,
    refetch: fetchTopics,
    refetchStats: fetchStats,
    addTopic,
    editTopic,
    removeTopic,
  }
}
