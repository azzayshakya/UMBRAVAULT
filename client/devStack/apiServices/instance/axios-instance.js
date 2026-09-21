import { REQUEST_TIMEOUT } from '@devStack/constants'
import { store } from '@devStack/store'
import { setUserSession } from '@devStack/store/userSlice'
import { sleep } from '@devStack/utils/sleep-util'
import { message } from 'antd'
import axios from 'axios'

import {
  getUserSessionLocally,
  removeCompleteSessionAndRedirectToLogin,
  setUserSessionLocally,
} from '../../store/utils/user-session-utils'
import { refreshSession } from '../accounts-me-apis'
import { parseApiError } from '../utils/parse-api-error'

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — same behavior in dev and prod ───────────────────
axiosInstance.interceptors.request.use(
  (request) => {
    const session = getUserSessionLocally()
    if (session?.accessToken) {
      request.headers['Authorization'] = `Bearer ${session.accessToken}`
    }
    return request
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let pendingQueue = []

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  pendingQueue = []
}

// ── Response interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep(import.meta.env.VITE_ARTIFICIAL_DELAY)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // ── Refresh token on 401 (except auth endpoints) ─────────────────────
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/me/logoff') &&
      !originalRequest.url?.includes('/refresh-token')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const newSession = await refreshSession()
        const sessionData = setUserSessionLocally(newSession.data)
        store.dispatch(setUserSession({ user: sessionData, accessToken: sessionData.accessToken }))
        flushQueue(null, sessionData.accessToken)
        originalRequest.headers['Authorization'] = `Bearer ${sessionData.accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        flushQueue(refreshError, null)
        removeCompleteSessionAndRedirectToLogin()
        message.error('Your session has expired. Please log in again.')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const errorMessage = parseApiError(error)

    switch (status) {
      case 400:
      case 409:
      case 429:
      case 422:
        return Promise.reject(error)

      case 401: // Unauthorized: identity unknown or invalid
        message.error(errorMessage)
        removeCompleteSessionAndRedirectToLogin()
        return Promise.reject(error)

      case 403: // Forbidden: authenticated, but unauthorized (identity known, but lacking permission).
        message.error(errorMessage)
        return Promise.reject(error)

      case 404:
        message.error(errorMessage)
        return Promise.reject(error)

      case 500:
      case 502:
      case 503:
        message.error(errorMessage)
        return Promise.reject(error)

      default:
        message.error(errorMessage)
        return Promise.reject(error)
    }
  }
)

export { axiosInstance }
