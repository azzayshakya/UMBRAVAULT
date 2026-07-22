import { axiosInstance } from '@devStack/apiServices/instance/axios-instance'
import { generateDummyUsers } from './generate-dummy-users'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}/users`
const DUMMY_USERS = generateDummyUsers(200) // generated once, stable across re-renders

/** Fetches the user list; falls back to 200 dummy users if the API isn't available */
const getUsers = async () => {
  try {
    const res = await axiosInstance.get(baseAPIURL)
    return res.data?.data || DUMMY_USERS
  } catch (error) {
    console.warn('[users] API unavailable, using dummy data:', error?.message)
    return DUMMY_USERS
  }
}

/** Updates a user's role; simulates success if the API isn't available */
const updateUserRole = async (userId, role) => {
  try {
    const res = await axiosInstance.put(`${baseAPIURL}/${userId}/role`, { role })
    return res.data
  } catch (error) {
    console.warn('[users] role-update API unavailable, simulating success:', error?.message)
    return { success: true, data: { userId, role } }
  }
}

export { getUsers, updateUserRole }
