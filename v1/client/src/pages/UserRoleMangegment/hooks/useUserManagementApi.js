import { getAllUserData, updateUserRole } from '@devStack/apiServices/user-api'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { useCallback, useEffect, useState } from 'react'

export const useUserManagementApi = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllUserData()
      setUsers(response?.data?.users || [])
    } catch (err) {
      setUsers([])
      handleApiError(err)
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
      handleApiError(err)
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
    users,
    loading,
    refetch: fetchUsers,
    changeUserRole,
    submitting,
    updateError,
  }
}
