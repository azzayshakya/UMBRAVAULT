// ── Required ────────────────────────────────────────────────
const reqError = (label) => `${label} is required`

// ── Length ──────────────────────────────────────────────────
const minLenError = (label, length) => `${label} must be at least ${length} characters long`
const maxLenError = (label, length) => `${label} must not exceed ${length} characters`
const exactLenError = (label, length) => `${label} must be exactly ${length} characters`

// ── Numeric range ────────────────────────────────────────────
const minError = (label, min) => `${label}'s value must be greater than or equal to ${min}`
const maxError = (label, max) => `${label}'s value must be less than or equal to ${max}`
const rangeError = (label, min, max) => `${label}'s value must be between ${min} and ${max}`

// ── Format ───────────────────────────────────────────────────
const emailError = () => 'Invalid email address'
const urlError = (label) => `${label} must be a valid URL`
const phoneError = (label) =>
  `${label} can only contain digits (0-9), hyphen (-), space ( ), dot (.), hash (#), star (*) and plus (+)`
const pwdError = (label) =>
  `${label} must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character`
const confirmPwdError = () => 'Passwords do not match'

// ── Character rules ──────────────────────────────────────────
const nameError = (label) => `${label} can only contain letters and a single space between words`
const alphaNumericError = (label) =>
  `${label} can only contain letters, numbers and a single space between words`
const numericError = (label) => `${label} can only contain digits`
const variableError = (label) => `${label} can only contain letters, numbers and underscores`
const noWhitespaceError = (label) => `${label} does not allow whitespace`
const slugError = (label) => `${label} can only contain lowercase letters, numbers and hyphens`

// ── Selection ────────────────────────────────────────────────
const selectError = (label) => `Please select a ${label}`
const minSelectError = (label, min) => `Please select at least ${min} ${label}`
const maxSelectError = (label, max) => `You can select at most ${max} ${label}`

// ── File ─────────────────────────────────────────────────────
const fileSizeError = (maxMB) => `File size must not exceed ${maxMB}MB`
const fileTypeError = (types) => `Only ${types.join(', ')} files are allowed`

// ── Availability ─────────────────────────────────────────────
const takenError = (label, value) => `${value} is already taken as ${label}`
const notFoundError = (label) => `${label} not found`

export {
  // Required
  reqError,

  // Length
  minLenError,
  maxLenError,
  exactLenError,

  // Numeric range
  minError,
  maxError,
  rangeError,

  // Format
  emailError,
  urlError,
  phoneError,
  pwdError,
  confirmPwdError,

  // Character rules
  nameError,
  alphaNumericError,
  numericError,
  variableError,
  noWhitespaceError,
  slugError,

  // Selection
  selectError,
  minSelectError,
  maxSelectError,

  // File
  fileSizeError,
  fileTypeError,

  // Availability
  takenError,
  notFoundError,
}
