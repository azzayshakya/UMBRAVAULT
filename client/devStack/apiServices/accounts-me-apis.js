import { StorageKey } from '@devStack/enums/storage-key-enums'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { message } from 'antd'

import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const terminateUserSessions = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/terminate-my-sessions`, postobj).then((res) => res.data)
}

const getMySession = () => {
  return axiosInstance.get(`${baseAPIURL}/auth/my-session`).then((res) => res.data)
}

const refreshSession = () => {
  const session = localStorage.getItem(StorageKey.USER_SESSION)
  const data = session ? JSON.parse(session) : null
  const refreshToken = data?.refreshToken
  const deviceId = data?.deviceId
  return axiosInstance
    .post(`${baseAPIURL}/auth/refresh-token`, { refreshToken, deviceId })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.message || 'Session refresh failed. Please log in again.')
      redirectToLoginUtil()
      return null
    })
}
const logoffFromCurrentSession = () => {
  return axiosInstance.put(`${baseAPIURL}/logoff`).then((res) => res.data)
}

export { getMySession, logoffFromCurrentSession, refreshSession, terminateUserSessions }
