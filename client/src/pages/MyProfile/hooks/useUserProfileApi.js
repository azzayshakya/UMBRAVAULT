import { getUserProfile, updateUserProfile } from '@devStack/apiServices/accounts-me-apis'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { message } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const useUserProfileApi = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  // ── Theme State Integration ────────────────────────────────────────────────
  const theme = useSelector((state) => state?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUserProfile()
      // res.data is expected from standard ApiResponse wrapper
      const userData = res?.data?.user || res
      setProfile(userData)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch user profile'
      setError(errMsg)
      message.error(errMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = async (formData) => {
    setUpdating(true)
    try {
      const res = await updateUserProfile(formData)
      const updatedUser = res?.data || res

      setProfile((prev) => ({ ...prev, ...updatedUser }))
      message.success('Profile updated successfully')
      return { success: true, data: updatedUser }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Update failed'
      message.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    updating,
    error,
    refetch: fetchProfile,
    updateProfile,
    theme,
    isDark,
  }
}
