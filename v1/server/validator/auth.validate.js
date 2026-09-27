const Joi = require("joi");

const password = Joi.string()
  .min(8)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must contain at least one letter and one number",
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  });

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password,
  deviceId: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().optional(),
});

// ── OTP & Verification Schemas ──────────────────────────────────────────

const requestOtpSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  purpose: Joi.string()
    .valid("verify-email", "forgot-password")
    .required()
    .messages({
      "any.only": "Purpose must be either 'verify-email' or 'forgot-password'",
      "string.empty": "Purpose is required",
      "any.required": "Purpose is required",
    }),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  code: Joi.string().trim().length(6).required().messages({
    "string.length": "Verification code must be 6 digits",
    "string.empty": "Verification code is required",
    "any.required": "Verification code is required",
  }),
});

const forgotPasswordVerifySchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  code: Joi.string().trim().length(6).required().messages({
    "string.length": "Verification code must be 6 digits",
    "string.empty": "Verification code is required",
    "any.required": "Verification code is required",
  }),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().trim().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),
  newPassword: password,
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
      "any.required": "Confirm password is required",
    }),
});
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),
  newPassword: password,
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .optional()
    .messages({
      "any.only": "Confirm password must match new password",
    }),
});

module.exports = {
  signupSchema,
  loginSchema,
  requestOtpSchema,
  verifyEmailSchema,
  forgotPasswordVerifySchema,
  resetPasswordSchema,
  changePasswordSchema,
};
