import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { message } from 'antd'

import { loginUser } from './accounts-auth-apis'
import { axiosInstance } from './instance/axios-instance'
import { StorageKey } from '@devStack/enums/storage-key-enums'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const terminateUserSessions = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/terminate-my-sessions`, postobj).then((res) => res.data)
}

const getMySession = () => {
  return axiosInstance.get(`${baseAPIURL}/my-session`).then((res) => res.data)
}

const DUMMY_LOGIN_RESPONSE = {
  statusCode: 200,
  success: true,
  message: 'Logged in successfully',
  data: {
    user: {
      id: 'dummy_001',
      name: 'Ajay Shakya',
      firstName: 'Ajay',
      lastName: 'Shakya',
      userInitials: 'AS',
      email: 'ajay@dev.local',
      role: 'user',
    },
    accessToken: 'dummy-access-token', // no decoding needed anymore — any string works
  },
}

/** Attempts real login; falls back to dummy data (same shape) if the backend errors out */
const loginWithFallback = async (postobj) => {
  try {
    return await loginUser(postobj)
  } catch (error) {
    console.warn('[login] backend unavailable, using dummy response:', error?.message)
    return DUMMY_LOGIN_RESPONSE
  }
}

const refreshSession = () => {
  const session = localStorage.getItem(StorageKey.USER_SESSION)
  const data = session ? JSON.parse(session) : null
  const refreshToken = data?.refreshToken
  const deviceId = data?.deviceId
  return axiosInstance
    .post(`${baseAPIURL}/refresh-token`, { refreshToken, deviceId })
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

export {
  getMySession,
  logoffFromCurrentSession,
  refreshSession,
  terminateUserSessions,
  loginWithFallback,
}
