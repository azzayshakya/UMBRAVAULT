export function parseApiError(err) {
  // ── 1. No internet connection ──────────────────────────────────────────
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network and try again.'
  }

  // ── 2. Request was sent but no response received (timeout / server down) ──
  if (err.request && !err.response) {
    return 'Unable to reach the server. Please try again in a moment.'
  }

  // ── 3. Backend responded with an error ────────────────────────────────
  if (err.response) {
    const { status, data } = err.response
    // Your backend contract: error message is always in `remark`
    if (data?.message) return data.message

    // Status-based fallbacks (when backend sends no remark)
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.'
      case 401:
        return 'Your session has expired. Please log in again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 408:
        return 'The request timed out. Please try again.'
      case 409:
        return 'This action conflicts with existing data. Please refresh and retry.'
      case 422:
        return 'The submitted data could not be processed.'
      case 429:
        return 'Too many requests. Please slow down and try again.'
      case 500:
        return 'An internal server error occurred. Please try again later.'
      case 502:
        return 'The server is temporarily unavailable. Please try again later.'
      case 503:
        return 'Service is currently unavailable. Please try again later.'
      default:
        return `Unexpected error (${status}). Please try again.`
    }
  }

  // ── 4. Axios-level error (cancelled request, config error, etc.) ───────
  if (err.message) return err.message

  // ── 5. Unknown ─────────────────────────────────────────────────────────
  return 'Something went wrong. Please try again.'
}
