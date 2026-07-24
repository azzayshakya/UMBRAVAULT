import { getAllUserData } from '@devStack/apiServices/user-api'
import { useEffect, useState } from 'react'

export const useGetAllUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getAllUserData()
      setUsers(response?.data?.users || [])
    } catch (error) {
      console.error(error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    refetch: fetchUsers,
  }
}
