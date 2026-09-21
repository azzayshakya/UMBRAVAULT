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

  // ── Tab 1: Rotate Password States ──
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // ── Tab 2: Recovery Pipeline States ──
  // Step 1: 'EMAIL_DISPATCH' -> Step 2: 'VERIFY_OTP' -> Step 3: 'NEW_PASSWORD'
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

  // ── 1. Rotate Secret (Change Password) ──
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({
        type: 'error',
        text: 'ERR: All parameters are required for credential re-hash.',
      })
      return
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'ERR: Key mismatch. Target strings do not match.' })
      return
    }
    if (newPassword.length < 8) {
      setFeedback({
        type: 'error',
        text: 'ERR: Entropy failure. Password must be >= 8 characters.',
      })
      return
    }

    setLoading(true)
    try {
      // Calls POST /api/auth/change-password
      await updatePassword({ currentPassword, newPassword, confirmPassword })
      setFeedback({ type: 'success', text: 'ACK: Credentials upgraded. Cipher rotation complete.' })
      message.success('Password updated successfully')
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Access verification failed.'
      setFeedback({ type: 'error', text: `ERR: ${errMsg}` })
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
      setFeedback({ type: 'error', text: 'ERR: Missing destination email node.' })
      return
    }

    setLoading(true)
    try {
      // Calls POST /api/auth/otp/send
      await requestPasswordReset({ email: targetEmail })
      setFeedback({ type: 'success', text: `ACK: 6-digit payload dispatched to ${targetEmail}` })
      setRecoveryStep('VERIFY_OTP')
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Dispatch routing failed.'
      setFeedback({ type: 'error', text: `ERR: ${errMsg}` })
    } finally {
      setLoading(false)
    }
  }

  // ── 2B. Verify Recovery Code ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!recoveryCode || recoveryCode.length !== 6) {
      setFeedback({ type: 'error', text: 'ERR: Verification code must be exactly 6 digits.' })
      return
    }

    setLoading(true)
    try {
      // Calls POST /api/auth/forgot-password/verify-code
      const res = await verifyRecoveryOtp({
        email: (recoveryEmail || userEmail).trim(),
        code: recoveryCode.trim(),
      })
      const token = res?.data?.resetToken || res?.resetToken
      setResetToken(token)
      setFeedback({ type: 'success', text: 'ACK: Code confirmed. Reset token initialized.' })
      setRecoveryStep('NEW_PASSWORD')
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Verification failed.'
      setFeedback({ type: 'error', text: `ERR: ${errMsg}` })
    } finally {
      setLoading(false)
    }
  }

  // ── 2C. Set New Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setFeedback({ type: null, text: '' })

    if (!recoveryNewPassword || !recoveryConfirmPassword) {
      setFeedback({ type: 'error', text: 'ERR: Both password strings are required.' })
      return
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setFeedback({ type: 'error', text: 'ERR: Key mismatch. Target strings do not match.' })
      return
    }
    if (recoveryNewPassword.length < 8) {
      setFeedback({ type: 'error', text: 'ERR: Password must be at least 8 characters.' })
      return
    }

    setLoading(true)
    try {
      // Calls POST /api/auth/reset-password
      await executePasswordReset({
        resetToken,
        newPassword: recoveryNewPassword,
        confirmPassword: recoveryConfirmPassword,
      })
      setFeedback({ type: 'success', text: 'ACK: Password updated. Sessions revoked.' })
      message.success('Password reset successfully')
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Reset execution failed.'
      setFeedback({ type: 'error', text: `ERR: ${errMsg}` })
    } finally {
      setLoading(false)
    }
  }

  // Inline styling tokens
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    // backgroundColor: 'var(--term-bg-panel, #0a0f0d)',
    // color: 'var(--color-text, #e6edf3)',
    // border: '1px solid var(--color-border, #30363d)',
    // borderRadius: '4px',
    outline: 'none',
    fontFamily: 'var(--term-font, monospace)',
    padding: '8px 12px',

    background: 'var(--color-bg-container)',
    border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    color: 'var(--color-text)',
    borderRadius: 'var(--radius, 8px)',
  }

  const labelStyle = {
    display: 'block',
    color: 'var(--color-text-muted, #8b949e)',
    textTransform: 'uppercase',
    fontSize: '10px',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    fontFamily: 'var(--term-font, monospace)',
  }

  return (
    <TerminalModal
      open={open}
      onClose={handleClose}
      title="SECURITY_CORE // CREDENTIALS"
      prompt="sec-ops@umbra-vault:~#"
      width={520}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'var(--term-font, monospace)',
          fontSize: '12px',
        }}
      >
        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid var(--color-border, #30363d)',
            paddingBottom: '8px',
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
              padding: '4px 10px',
              borderRadius: '3px',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '11px',
              border:
                activeTab === 'change'
                  ? '1px solid var(--term-green, #39ff6a)'
                  : '1px solid transparent',
              backgroundColor:
                activeTab === 'change'
                  ? 'var(--term-green-dim, rgba(57, 255, 106, 0.12))'
                  : 'transparent',
              color:
                activeTab === 'change'
                  ? 'var(--term-green, #39ff6a)'
                  : 'var(--color-text-muted, #8b949e)',
            }}
          >
            [01] ROTATE_SECRET
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('forgot')
              setFeedback({ type: null, text: '' })
            }}
            style={{
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '3px',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '11px',
              border:
                activeTab === 'forgot'
                  ? '1px solid var(--term-green, #39ff6a)'
                  : '1px solid transparent',
              backgroundColor:
                activeTab === 'forgot'
                  ? 'var(--term-green-dim, rgba(57, 255, 106, 0.12))'
                  : 'transparent',
              color:
                activeTab === 'forgot'
                  ? 'var(--term-green, #39ff6a)'
                  : 'var(--color-text-muted, #8b949e)',
            }}
          >
            [02] RECOVERY_DISPATCH
          </button>
        </div>

        {/* Feedback Telemetry */}
        {feedback.text && (
          <div
            style={{
              padding: '10px 12px',
              border: `1px solid ${feedback.type === 'error' ? 'var(--color-error, #ef4444)' : 'var(--term-green, #39ff6a)'}`,
              backgroundColor:
                feedback.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(57, 255, 106, 0.08)',
              color:
                feedback.type === 'error'
                  ? 'var(--color-error, #ef4444)'
                  : 'var(--term-green, #39ff6a)',
              borderRadius: '4px',
              fontSize: '11px',
            }}
          >
            &gt; {feedback.text}
          </div>
        )}

        {/* TAB 1: Change Password Form */}
        {activeTab === 'change' && (
          <form
            onSubmit={handleChangePassword}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <label style={labelStyle}>// ACTIVE_CIPHER_KEY (CURRENT PASSWORD)</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>// TARGET_CIPHER_STRING (NEW PASSWORD)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="min. 8 entropy characters"
                disabled={loading}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>// CONFIRM_TARGET_CIPHER</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="re-enter new string"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                style={{
                  padding: '6px 14px',
                  background: 'transparent',
                  border: '1px solid var(--color-border, #30363d)',
                  color: 'var(--color-text-muted, #8b949e)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                ABORT
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '6px 16px',
                  background: 'var(--color-bg-container, #161b22)',
                  border: '1px solid var(--term-green, #39ff6a)',
                  color: 'var(--term-green, #39ff6a)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {loading ? 'EXECUTING_REWRITE...' : 'EXECUTE_UPDATE [↵]'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Forgot Password Multi-step Recovery */}
        {activeTab === 'forgot' && (
          <div>
            {/* Step 1: Transmit Email */}
            {recoveryStep === 'EMAIL_DISPATCH' && (
              <form
                onSubmit={handleRequestRecoveryOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <p
                  style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted, #8b949e)' }}
                >
                  Phase 1: Enter your identity email address to request a secure 6-digit one-time
                  authorization code.
                </p>
                <div>
                  <label style={labelStyle}>// IDENTITY_COMM_NODE (EMAIL)</label>
                  <input
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="operator@network.internal"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    paddingTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                      padding: '6px 14px',
                      background: 'transparent',
                      border: '1px solid var(--color-border, #30363d)',
                      color: 'var(--color-text-muted, #8b949e)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '6px 16px',
                      background: 'var(--color-bg-container, #161b22)',
                      border: '1px solid #f59e0b',
                      color: '#f59e0b',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'DISPATCHING...' : 'DISPATCH_CODE [↵]'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Input 6-Digit OTP */}
            {recoveryStep === 'VERIFY_OTP' && (
              <form
                onSubmit={handleVerifyOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <p
                  style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted, #8b949e)' }}
                >
                  Phase 2: Enter the 6-digit OTP dispatched to your endpoint.
                </p>
                <div>
                  <label style={labelStyle}>// 6-DIGIT_ONE_TIME_CIPHER</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="123456"
                    disabled={loading}
                    style={{
                      ...inputStyle,
                      letterSpacing: '4px',
                      textAlign: 'center',
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setRecoveryStep('EMAIL_DISPATCH')}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted, #8b949e)',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    &lt; RE-ENTER EMAIL
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '6px 16px',
                      background: 'var(--color-bg-container, #161b22)',
                      border: '1px solid var(--term-green, #39ff6a)',
                      color: 'var(--term-green, #39ff6a)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'VALIDATING...' : 'VERIFY_CODE [↵]'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Write New Password */}
            {recoveryStep === 'NEW_PASSWORD' && (
              <form
                onSubmit={handleResetPassword}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <p
                  style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted, #8b949e)' }}
                >
                  Phase 3: Cryptographic verification confirmed. Set your new access credentials.
                </p>
                <div>
                  <label style={labelStyle}>// NEW_TARGET_CIPHER</label>
                  <input
                    type="password"
                    value={recoveryNewPassword}
                    onChange={(e) => setRecoveryNewPassword(e.target.value)}
                    placeholder="min. 8 characters"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>// CONFIRM_NEW_TARGET_CIPHER</label>
                  <input
                    type="password"
                    value={recoveryConfirmPassword}
                    onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                    placeholder="re-enter new string"
                    disabled={loading}
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    paddingTop: '8px',
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '6px 16px',
                      background: 'var(--color-bg-container, #161b22)',
                      border: '1px solid var(--term-green, #39ff6a)',
                      color: 'var(--term-green, #39ff6a)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? 'COMMITTING...' : 'COMMIT_NEW_SECRET [↵]'}
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
