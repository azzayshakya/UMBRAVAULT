import { StorageKey } from '@devStack/enums/storage-key-enums'
import { jwtDecode } from 'jwt-decode'

/** Decodes a JWT string and returns the payload object */
const getDecodedToken = (token) => {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

/** Returns decoded JWT from LS in DEV, or from the provided token string in PROD */
const getActiveDecodedToken = (accessToken) => {
  const token = import.meta.env.DEV ? localStorage.getItem(StorageKey.DEV_JWT) || '' : accessToken
  return getDecodedToken(token)
}

/** Returns true if the token's exp claim is in the past */
const isTokenExpired = (token) => {
  const decoded = getDecodedToken(token)
  if (!decoded?.exp) return true
  return new Date(decoded.exp * 1000) <= new Date()
}

export { getDecodedToken, getActiveDecodedToken, isTokenExpired }
