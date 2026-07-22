import { message, notification } from 'antd'
const STATUS_MESSAGES = {
  400: 'Invalid request. Please check the details you entered.',
  401: 'Session expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  405: 'This action is not allowed.',
  408: 'Request timed out. Please try again.',
  409: 'This action conflicts with existing data.',
  413: 'The data you sent is too large.',
  422: 'Some fields are invalid. Please review and try again.',
  429: 'Too many requests. Please slow down and try again.',
  500: 'Something went wrong on our server. Please try again later.',
  502: 'Server is temporarily unavailable (bad gateway).',
  503: 'Service unavailable. Please try again shortly.',
  504: 'Server took too long to respond. Please try again.',
}

const DEFAULT_FALLBACK = 'Something went wrong. Please try again.'
const NETWORK_FALLBACK = 'Server connection lost! Please try again later.'

const extractBackendMessage = (data) => {
  if (!data) return null
  if (typeof data === 'string') return data

  return (
    data.remarks || // your primary backend convention
    data.reason || // some endpoints
    data.message || // express/default
    data.error || // legacy routes
    data.detail || // some python/DRF-style backends, just in case
    null
  )
}

export const parseApiError = (error) => {
  // axios request cancelled (AbortController / CancelToken)
  const isCancelled = error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError'

  if (isCancelled) {
    return {
      status: null,
      message: '',
      fieldErrors: [],
      isNetworkError: false,
      isTimeout: false,
      isCancelled: true,
      raw: error,
    }
  }

  const isTimeout = error?.code === 'ECONNABORTED' && /timeout/i.test(error?.message || '')

  // No response at all -> network / CORS / DNS / server down
  if (!error?.response) {
    return {
      status: null,
      message: isTimeout ? STATUS_MESSAGES[408] : NETWORK_FALLBACK,
      fieldErrors: [],
      isNetworkError: !isTimeout,
      isTimeout,
      isCancelled: false,
      raw: error,
    }
  }

  const { status, data } = error.response
  const backendMessage = extractBackendMessage(data)

  return {
    status,
    message: backendMessage || STATUS_MESSAGES[status] || DEFAULT_FALLBACK,
    isNetworkError: false,
    isTimeout: false,
    isCancelled: false,
    raw: error,
  }
}

export const handleApiError = (error, options = {}) => {
  const { silent = false, fallbackMessage, as = 'message', duration, onError } = options

  const parsed = parseApiError(error)

  if (parsed.isCancelled) return parsed

  const finalMessage = fallbackMessage || parsed.message

  if (!silent) {
    if (as === 'notification') {
      notification.error({
        message: parsed.status ? `Error ${parsed.status}` : 'Error',
        description: finalMessage,
        duration,
      })
    } else {
      message.error(finalMessage, duration)
    }
  }

  console.error('[API Error]', {
    status: parsed.status,
    message: parsed.message,
    fieldErrors: parsed.fieldErrors,
    raw: parsed.raw,
  })

  if (typeof onError === 'function') onError(parsed)

  return parsed
}

export default handleApiError
