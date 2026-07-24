import { getAllUserData, updateUserRole } from '@devStack/apiServices/user-api'
import { useCallback, useEffect, useState } from 'react'

export const useUserManagementApi = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [submitting, setSubmitting] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllUserData()
      setUsers(response?.data?.users || [])
    } catch (err) {
      console.error(err)
      setUsers([])
      setError(err?.response?.data?.message || err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  const changeUserRole = useCallback(async (userId, role) => {
    setSubmitting(true)
    setUpdateError(null)
    try {
      const res = await updateUserRole(userId, role)
      if (res?.success === false) {
        const msg = res?.message || 'Failed to update role'
        setUpdateError(msg)
        return { success: false, message: msg }
      }
      return { success: true, data: res }
    } catch (err) {
      console.error(err)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while updating the role'
      setUpdateError(msg)
      return { success: false, message: msg }
    } finally {
      setSubmitting(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    // fetch
    users,
    loading,
    error,
    refetch: fetchUsers,
    // update
    changeUserRole,
    submitting,
    updateError,
  }
}
