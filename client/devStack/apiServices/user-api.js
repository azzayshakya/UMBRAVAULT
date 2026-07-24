import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const getAllUserData = (postobj) => {
  return axiosInstance.get(`${baseAPIURL}/user/all-users`, postobj).then((res) => res.data)
}

export { getAllUserData }
