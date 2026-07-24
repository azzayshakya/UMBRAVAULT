import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const getAllUserData = () => {
  return axiosInstance.get(`${baseAPIURL}/user/all-users`).then((res) => res.data)
}

const updateUserRole = (userId, role) => {
  return axiosInstance
    .patch(`${baseAPIURL}/user/update-role/${userId}`, { role })
    .then((res) => res.data)
}

export { getAllUserData, updateUserRole }
