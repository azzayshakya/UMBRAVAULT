import { REQUEST_TIMEOUT } from '@devStack/constants'
import { store } from '@devStack/store'
import { setUserSession } from '@devStack/store/userSlice'
import { redirectToLoginUtil } from '@devStack/utils/redirect-utils'
import { sleep } from '@devStack/utils/sleep-util'
import { message } from 'antd'
import axios from 'axios'

import {
  getUserSessionLocally,
  removeUserSessionLocally,
  setUserSessionLocally,
} from '../../utils/user-session-utils'
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
        removeUserSessionLocally()
        message.error('Your session has expired. Please log in again.')
        redirectToLoginUtil()
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

      case 401:
        message.error(errorMessage)
        removeUserSessionLocally()
        redirectToLoginUtil()
        return Promise.reject(error)

      case 403:
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

// GEMINI_API_KEY=AQ.
// Ab8RN6IGYjs59lG1CYbRmDNlHlhWxo1hQt-HKH10d01-U2XVEg
// GEMINI_MODEL=gemini-3.5-flash
// MONGO_URI=mongodb+srv://ajayajay:ajayajay@cluster0.agfg3rb.mongodb.net/?appName=Cluster0
// # MONGO_URI=mongodb://127.0.0.1:27017/assetflow

// MONGO_URI=mongodb://
// ajayajay:ajayajay@ac-zbpkf2z-shard-00-00.agfg3rb.mongodb.net:27017,ac-zbpkf2z-shard-00-01.agfg3rb.
// mongodb.
// net:27017,ac-zbpkf2z-shard-00-02.agfg3rb.mongodb.
// net:27017/umbravault?ssl=true&replicaSet=atlas-pytax1-shard-0&authSource=admin&appName=Cluster0

// JWT_ACCESS_SECRET=azx
// JWT_REFRESH_SECRET=asd
// JWT_ISSUER=lskjdf

// UPSTASH_REDIS_URL=rediss://default:
// gQAAAAAAAqzbAAIgcDI5YTcyZDBjMDgwMjY0ZWMyYjU0NDQ2MzU2ZDM4ZDA3Mw@deciding-starfish-175323.upstash.io:6379

// SMTP_HOST=in-v3.mailjet.com
// SMTP_PORT=587
// SMTP_SECURE=false
// SMTP_USER=91d5eb109a815dfef528e26b607bffea
// SMTP_PASS=053dc478394e59808441624d3ff42848
// MAIL_FROM="UmbraVault <ajayshakya7376@gmail.com>"
