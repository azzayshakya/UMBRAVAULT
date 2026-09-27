import {
  KeyOutlined,
  MailOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import {
  updatePassword,
  requestPasswordReset,
  verifyRecoveryOtp,
  executePasswordReset,
} from '@devStack/apiServices/accounts-me-apis'
import TerminalModal from '@devStack/components/Terminalmodal'
import { Theme } from '@devStack/enums/theme-enums'
import { useTheme } from '@devStack/store/theme/hooks/useTheme'
import { message } from 'antd'
import React, { useState } from 'react'

export const PasswordManagementModal = ({ open, onClose, userEmail = '' }) => {
  const [activeTab, setActiveTab] = useState('change') // 'change' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: null, text: '' })

  // ── Tab 1: Change Password States ──
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // ── Tab 2: Forgot Password Recovery Pipeline States ──
  const [recoveryStep, setRecoveryStep] = useState('EMAIL_DISPATCH')
  const [recoveryEmail, setRecoveryEmail] = useState(userEmail)
  const [recoveryCode, setRecoveryCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('')
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('')

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === Theme.DARK

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setRecoveryCode('')
    setResetToken('')
    setRecoveryNewPassword('')
    setRecoveryConfirmPassword('')
    setRecoveryStep('EMAIL_DISPATCH')
    setFeedback({ type: null, text: '' })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // ── 1. Change Password ──
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({
        type: 'error',
        text: 'All fields are required to update your password.',
      })
      return
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }
    if (newPassword.length < 8) {
      setFeedback({
        type: 'error',
        text: 'Password must be at least 8 characters long.',
      })
      return
    }

    setLoading(true)
    try {
      await updatePassword({ currentPassword, newPassword, confirmPassword })
      setFeedback({ type: 'success', text: 'Password updated successfully.' })
      message.success('Password updated successfully')
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update password.'
      setFeedback({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  // ── 2A. Request Recovery Code ──
  const handleRequestRecoveryOtp = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    const targetEmail = (recoveryEmail || userEmail).trim()
    if (!targetEmail) {
      setFeedback({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset({ email: targetEmail })
      setFeedback({
        type: 'success',
        text: `A 6-digit verification code was sent to ${targetEmail}`,
      })
      setRecoveryStep('VERIFY_OTP')
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || 'Could not send verification code.'
      setFeedback({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  // ── 2B. Verify Recovery Code ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!recoveryCode || recoveryCode.length !== 6) {
      setFeedback({ type: 'error', text: 'Please enter the complete 6-digit verification code.' })
      return
    }

    setLoading(true)
    try {
      const res = await verifyRecoveryOtp({
        email: (recoveryEmail || userEmail).trim(),
        code: recoveryCode.trim(),
      })
      const token = res?.data?.resetToken || res?.resetToken
      setResetToken(token)
      setFeedback({ type: 'success', text: 'Code verified. You can now set your new password.' })
      setRecoveryStep('NEW_PASSWORD')
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || 'Invalid or expired verification code.'
      setFeedback({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  // ── 2C. Set New Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!recoveryNewPassword || !recoveryConfirmPassword) {
      setFeedback({ type: 'error', text: 'Please fill in both password fields.' })
      return
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    if (recoveryNewPassword.length < 8) {
      setFeedback({ type: 'error', text: 'Password must be at least 8 characters long.' })
      return
    }

    setLoading(true)
    try {
      await executePasswordReset({
        resetToken,
        newPassword: recoveryNewPassword,
        confirmPassword: recoveryConfirmPassword,
      })
      setFeedback({
        type: 'success',
        text: 'Password reset successfully. Other sessions logged out.',
      })
      message.success('Password reset successfully')
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to reset password.'
      setFeedback({ type: 'error', text: errMsg })
    } finally {
      setLoading(false)
    }
  }

  // Modern UI Style Definitions
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    padding: '10px 14px',
    background: 'var(--color-bg-container, #ffffff)',
    border: isDark
      ? '1px solid var(--term-border, #243527)'
      : '1px solid var(--color-border, #d9d9d9)',
    color: 'var(--color-text, #111827)',
    borderRadius: '8px',
    fontSize: '13px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--color-text-secondary, #6b7280)',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '6px',
  }

  return (
    <TerminalModal
      open={open}
      onClose={handleClose}
      title="Security & Password Settings"
      prompt="account@security:~"
      width={520}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontSize: '13px',
        }}
      >
        {/* Modern Tab Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: isDark
              ? '1px solid var(--term-border, #243527)'
              : '1px solid var(--color-border, #e5e7eb)',
            paddingBottom: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('change')
              setFeedback({ type: null, text: '' })
            }}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              border:
                activeTab === 'change'
                  ? '1px solid var(--color-primary, #10b981)'
                  : '1px solid transparent',
              backgroundColor:
                activeTab === 'change'
                  ? isDark
                    ? 'rgba(57, 255, 106, 0.12)'
                    : 'rgba(16, 185, 129, 0.08)'
                  : 'transparent',
              color:
                activeTab === 'change'
                  ? 'var(--color-primary, #10b981)'
                  : 'var(--color-text-secondary, #6b7280)',
              transition: 'all 0.15s ease',
            }}
          >
            <KeyOutlined /> Change Password
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot')
              setFeedback({ type: null, text: '' })
            }}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              border:
                activeTab === 'forgot'
                  ? '1px solid var(--color-primary, #10b981)'
                  : '1px solid transparent',
              backgroundColor:
                activeTab === 'forgot'
                  ? isDark
                    ? 'rgba(57, 255, 106, 0.12)'
                    : 'rgba(16, 185, 129, 0.08)'
                  : 'transparent',
              color:
                activeTab === 'forgot'
                  ? 'var(--color-primary, #10b981)'
                  : 'var(--color-text-secondary, #6b7280)',
              transition: 'all 0.15s ease',
            }}
          >
            <SafetyCertificateOutlined /> Reset via Email
          </button>
        </div>

        {/* Clean Status & Alert Message Box */}
        {feedback.text && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              border: `1px solid ${
                feedback.type === 'error'
                  ? 'var(--color-error, #ef4444)'
                  : 'var(--color-primary, #10b981)'
              }`,
              backgroundColor:
                feedback.type === 'error'
                  ? 'rgba(239, 68, 68, 0.08)'
                  : isDark
                    ? 'rgba(57, 255, 106, 0.08)'
                    : 'rgba(16, 185, 129, 0.08)',
              color:
                feedback.type === 'error'
                  ? 'var(--color-error, #ef4444)'
                  : 'var(--color-primary, #10b981)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {feedback.type === 'error' ? '✕' : <CheckCircleOutlined />} {feedback.text}
          </div>
        )}

        {/* TAB 1: Change Password Form */}
        {activeTab === 'change' && (
          <form
            onSubmit={handleChangePassword}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <div>
              <label style={labelStyle}>
                <LockOutlined /> Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <KeyOutlined /> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <CheckCircleOutlined /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                paddingTop: '6px',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: isDark
                    ? '1px solid var(--term-border, #243527)'
                    : '1px solid var(--color-border, #d9d9d9)',
                  color: 'var(--color-text-secondary, #6b7280)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '8px 20px',
                  background: loading ? 'var(--color-bg-hover)' : 'var(--color-primary, #10b981)',
                  border: '1px solid var(--color-primary, #10b981)',
                  color: isDark ? 'var(--term-green, #39ff6a)' : '#ffffff',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {loading && <LoadingOutlined />}
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Forgot Password Multi-step Recovery */}
        {activeTab === 'forgot' && (
          <div>
            {/* Step 1: Send Verification Code */}
            {recoveryStep === 'EMAIL_DISPATCH' && (
              <form
                onSubmit={handleRequestRecoveryOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--color-text-secondary, #6b7280)',
                    lineHeight: 1.5,
                  }}
                >
                  Enter your registered email address to receive a secure 6-digit verification code.
                </p>
                <div>
                  <label style={labelStyle}>
                    <MailOutlined /> Email Address
                  </label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="user@example.com"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    paddingTop: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: isDark
                        ? '1px solid var(--term-border, #243527)'
                        : '1px solid var(--color-border, #d9d9d9)',
                      color: 'var(--color-text-secondary, #6b7280)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      background: 'var(--color-primary, #10b981)',
                      border: '1px solid var(--color-primary, #10b981)',
                      color: isDark ? 'var(--term-green, #39ff6a)' : '#ffffff',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {loading && <LoadingOutlined />}
                    {loading ? 'Sending Code...' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Input 6-Digit Code */}
            {recoveryStep === 'VERIFY_OTP' && (
              <form
                onSubmit={handleVerifyOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--color-text-secondary, #6b7280)',
                    lineHeight: 1.5,
                  }}
                >
                  Please enter the 6-digit code sent to your inbox.
                </p>
                <div>
                  <label style={labelStyle}>
                    <SafetyCertificateOutlined /> 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="123456"
                    disabled={loading}
                    style={{
                      ...inputStyle,
                      letterSpacing: '6px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setRecoveryStep('EMAIL_DISPATCH')}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary, #6b7280)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ArrowLeftOutlined /> Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      background: 'var(--color-primary, #10b981)',
                      border: '1px solid var(--color-primary, #10b981)',
                      color: isDark ? 'var(--term-green, #39ff6a)' : '#ffffff',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {loading && <LoadingOutlined />}
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {recoveryStep === 'NEW_PASSWORD' && (
              <form
                onSubmit={handleResetPassword}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: 'var(--color-text-secondary, #6b7280)',
                    lineHeight: 1.5,
                  }}
                >
                  Identity confirmed. Enter your new password below.
                </p>
                <div>
                  <label style={labelStyle}>
                    <LockOutlined /> New Password
                  </label>
                  <input
                    type="password"
                    value={recoveryNewPassword}
                    onChange={(e) => setRecoveryNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <CheckCircleOutlined /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={recoveryConfirmPassword}
                    onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    paddingTop: '6px',
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '8px 20px',
                      background: 'var(--color-primary, #10b981)',
                      border: '1px solid var(--color-primary, #10b981)',
                      color: isDark ? 'var(--term-green, #39ff6a)' : '#ffffff',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {loading && <LoadingOutlined />}
                    {loading ? 'Saving...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </TerminalModal>
  )
}
