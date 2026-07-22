import { useCallback, useEffect, useState } from 'react'
import { getUsers } from './users-api'

/** Loads the user list once on mount; exposes a local setter for optimistic role updates */
export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  /** Patches a single user's role in local state without a full refetch */
  const patchUserRole = (userId, role) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
  }

  return { users, loading, refetch: fetchUsers, patchUserRole }
}
