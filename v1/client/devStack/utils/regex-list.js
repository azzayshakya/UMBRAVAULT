// ── Email & URL ──────────────────────────────────────────────

/** Valid email address */
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

/** Valid URL (http/https) */
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/

// ── Phone ────────────────────────────────────────────────────

/** Phone: digits, hyphen, space, dot, hash, star, plus */
const phoneRegex = /^[0-9\s\-+.#*]+$/

// ── Names & Text ─────────────────────────────────────────────

/** Letters only with single space between words */
const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)*$/

/** Letters and numbers with single space between words */
const alphaNumericRegex = /^[a-zA-Z0-9]+(\s[a-zA-Z0-9]+)*$/

/** Letters, numbers, hyphens — no spaces (for slugs/handles/usernames in URLs) */
const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/

// ── Code & Variables ─────────────────────────────────────────

/** Valid variable name: letters, numbers, underscores — must start with letter or underscore */
const variableRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/

/** Hex color code: #fff or #ffffff */
const hexColorRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/

// ── Numeric ──────────────────────────────────────────────────

/** Digits only */
const numericRegex = /^[0-9]+$/

/** Positive or negative integers and decimals */
const decimalRegex = /^-?[0-9]+(\.[0-9]+)?$/

/** Positive integers only (no zero) */
const positiveIntRegex = /^[1-9][0-9]*$/

// ── Whitespace ───────────────────────────────────────────────

/** No whitespace allowed anywhere */
const noWhitespaceRegex = /^\S+$/

/** No leading or trailing whitespace (spaces in middle are fine) */
const noTrimWhitespaceRegex = /^(?!\s).*(?<!\s)$/

// ── Password ─────────────────────────────────────────────────

/** Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char */
const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#@$%^&*\-]).{8,}$/

/** Strong password: same as above but min 12 chars */
const strongPwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#@$%^&*\-]).{12,}$/

// ── Date & Time ──────────────────────────────────────────────

/** Date in DD/MM/YYYY format */
const dateDMYRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

/** Date in YYYY-MM-DD format (ISO) */
const dateISORegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

/** Time in HH:MM 24-hour format */
const time24Regex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

// ── Identity / Finance ───────────────────────────────────────

/** OTP / PIN: digits only, 4–8 characters */
const otpRegex = /^[0-9]{4,8}$/

/** Basic credit card: 13–19 digits, optional spaces/hyphens between groups */
const creditCardRegex = /^[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{1,7}$/

export {
  // Email & URL
  emailRegex,
  urlRegex,

  // Phone
  phoneRegex,

  // Names & Text
  nameRegex,
  alphaNumericRegex,
  slugRegex,

  // Code & Variables
  variableRegex,
  hexColorRegex,

  // Numeric
  numericRegex,
  decimalRegex,
  positiveIntRegex,

  // Whitespace
  noWhitespaceRegex,
  noTrimWhitespaceRegex,

  // Password
  pwdRegex,
  strongPwdRegex,

  // Date & Time
  dateDMYRegex,
  dateISORegex,
  time24Regex,

  // Identity / Finance
  otpRegex,
  creditCardRegex,
}
