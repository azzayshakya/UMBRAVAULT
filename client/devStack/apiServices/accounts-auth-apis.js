import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

/** Checks the availability of an email. */
const isEmailAvailable = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/is-email-available`, postobj).then((res) => res.data)
}

/** Creates a verification code for the provided username and request type. */
const createVerificationCode = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/create-code`, postobj).then((res) => res.data)
}

/** Checks if the verification code matches for "ResetPwd" and other request types. */
const checkVerificationCode = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/verify-code`, postobj).then((res) => res.data)
}
const CreateAccount = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/auth/signup`, postobj).then((res) => res.data)
}

const loginUser = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/auth/login`, postobj).then((res) => res.data)
}
const logOutUser = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/auth/logout`, postobj).then((res) => res.data)
}

const logOutAllSession = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/auth/logout-all`, postobj).then((res) => res.data)
}
export {
  checkVerificationCode,
  createVerificationCode,
  isEmailAvailable,
  logOutAllSession,
  logOutUser,
  loginUser,
  CreateAccount,
}
