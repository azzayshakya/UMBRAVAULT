import {
  addSubtask,
  createTask,
  deleteSubtask,
  deleteTask,
  getAllTasks,
  getTaskActivity,
  getTaskStats,
  updateSubtask,
  updateTask,
} from '@devStack/apiServices/task-api'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { useCallback, useEffect, useState } from 'react'

export const useTaskManagementApi = (filters = {}, paramObj = { limit: 10, offset: 0 }) => {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllTasks({
        ...filters,
        page: paramObj.offset + 1,
        limit: paramObj.limit,
      })
      setTasks(response?.data?.tasks || [])
      setTotal(response?.data?.pagination?.total || 0)
    } catch (err) {
      setTasks([])
      handleApiError(err)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters), paramObj.offset, paramObj.limit])

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      const response = await getTaskStats()
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

  const addTask = useCallback((payload) => runMutation(() => createTask(payload)), [])

  const editTask = useCallback(
    (taskId, payload) => runMutation(() => updateTask(taskId, payload)),
    []
  )

  const removeTask = useCallback((taskId) => runMutation(() => deleteTask(taskId)), [])

  const addTaskSubtask = useCallback(
    (taskId, title) => runMutation(() => addSubtask(taskId, { title })),
    []
  )

  const toggleSubtask = useCallback(
    (taskId, subtaskId, isDone) => runMutation(() => updateSubtask(taskId, subtaskId, { isDone })),
    []
  )

  const removeSubtask = useCallback(
    (taskId, subtaskId) => runMutation(() => deleteSubtask(taskId, subtaskId)),
    []
  )

  const fetchActivity = useCallback(async (taskId) => {
    try {
      const response = await getTaskActivity(taskId)
      return response?.data?.activity || []
    } catch (err) {
      handleApiError(err)
      return []
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    tasks,
    total,
    stats,
    loading,
    statsLoading,
    submitting,
    apiError,
    refetch: fetchTasks,
    refetchStats: fetchStats,
    addTask,
    editTask,
    removeTask,
    addTaskSubtask,
    toggleSubtask,
    removeSubtask,
    fetchActivity,
  }
}
