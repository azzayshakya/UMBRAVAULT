import { message } from 'antd'

import { parseApiError } from './parse-api-error'

export function handleApiError(err, fallback) {
  const errorMessage = parseApiError(err) || fallback
  message.error(errorMessage)
}
