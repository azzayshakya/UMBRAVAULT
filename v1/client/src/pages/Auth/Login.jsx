import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { loginUser } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import PageHeader from '@devStack/components/PageHeader'
import Loader from '@devStack/components/spinners/Loader'
import { useIsMobile } from '@devStack/hooks/useIsMobile'
import { useTheme } from '@devStack/store/theme/hooks/useTheme'
import { Theme } from '@devStack/store/theme/utils/theme-constants'
import { setUserSession, clearUserSession } from '@devStack/store/userSlice'
import {
  setUserSessionLocally,
  removeUserSessionLocally,
} from '@devStack/store/utils/user-session-utils'
import { getPostLoginRedirectPath } from '@devStack/utils/redirect-utils'
import { Form, Input, Button } from 'antd'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

const LoginPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === Theme.DARK
  const isMobile = useIsMobile()

  useEffect(() => {
    removeUserSessionLocally()
    dispatch(clearUserSession())
  }, [dispatch])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await loginUser({ email: values.userEmail, password: values.userPassword })
      const sessionData = setUserSessionLocally(res.data)
      dispatch(
        setUserSession({
          user: sessionData,
          accessToken: sessionData?.accessToken,
          refreshToken: sessionData?.refreshToken,
          deviceId: sessionData?.deviceId,
        })
      )
      navigate(getPostLoginRedirectPath(), { replace: true })
    } catch (err) {
      handleApiError(err, 'Login failed. Please verify your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Consistent theme mapping
  const tokens = {
    outerCardBg: isDark
      ? 'rgba(6, 18, 10, 0.85)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(238, 244, 240, 0.75) 100%)',
    outerCardBorder: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    outerCardShadow: isDark
      ? '0 24px 64px rgba(0, 0, 0, 0.8), var(--term-glow)'
      : '0 20px 50px -10px rgba(15, 122, 55, 0.1), 0 4px 14px rgba(15, 122, 55, 0.05)',
    inputBg: isDark ? 'rgba(3, 9, 5, 0.9)' : 'var(--primitive-white, #ffffff)',
    inputBorder: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    rightHeroBg: isDark
      ? 'linear-gradient(160deg, #06120a 0%, #030905 100%)'
      : 'linear-gradient(160deg, var(--primitive-gray-900, #111827) 0%, var(--primitive-gray-950, #030712) 100%)',
    buttonBg: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--color-primary)',
    buttonBorder: isDark ? '1px solid var(--term-border-strong)' : '1px solid var(--color-primary)',
    buttonText: isDark ? 'var(--term-green)' : '#ffffff',
    buttonShadow: 'var(--color-glow)',
  }

  const modernInputStyle = {
    height: isMobile ? 44 : 48,
    borderRadius: 24,
    background: tokens.inputBg,
    border: tokens.inputBorder,
    color: 'var(--color-text)',
    fontSize: 13,
    padding: '0 16px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <PageHeader
      title="SECURE LOGIN"
      subtitle="Access your developer dashboard"
      icon={<LoginOutlined />}
    >
      <div
        style={{
          minHeight: isMobile ? 'auto' : 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '12px 0' : '24px 16px',
          borderRadius: 16,
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Main Floating Bento Canvas */}
        <div
          style={{
            width: '100%',
            maxWidth: 1040,
            borderRadius: isMobile ? 20 : 32,
            background: tokens.outerCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: tokens.outerCardBorder,
            boxShadow: tokens.outerCardShadow,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))',
            overflow: 'hidden',
            padding: isMobile ? 12 : 18,
            gap: isMobile ? 14 : 18,
          }}
        >
          {/* Left Column: Login Form */}
          <div
            style={{
              padding: isMobile ? '20px 14px' : '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: isMobile ? 18 : 26,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--primitive-green-50)',
                  border: `1px solid ${isDark ? 'var(--term-border)' : 'var(--primitive-green-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                <SafetyCertificateOutlined />
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                  }}
                >
                  ACCOUNT VERIFICATION
                </span>
              </div>
            </div>

            <h2
              style={{
                fontSize: isMobile ? 24 : 30,
                fontWeight: 800,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: -0.6,
                lineHeight: 1.2,
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                margin: '8px 0 24px',
                fontSize: isMobile ? 12 : 13,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              Sign in to manage your projects, credentials, and API services.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              disabled={loading}
              autoComplete="off"
            >
              {/* Email Input */}
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: 0.5,
                    }}
                  >
                    EMAIL ADDRESS
                  </span>
                }
                name="userEmail"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Input
                  prefix={
                    <MailOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 8,
                      }}
                    />
                  }
                  placeholder="name@company.com"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Password Input */}
              <Form.Item
                label={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        letterSpacing: 0.5,
                      }}
                    >
                      PASSWORD
                    </span>
                  </div>
                }
                name="userPassword"
                rules={[{ required: true, message: 'Please enter your password' }]}
                style={{ marginBottom: isMobile ? 22 : 28 }}
              >
                <Input.Password
                  prefix={
                    <LockOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 8,
                      }}
                    />
                  }
                  placeholder="••••••••••••"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Submit Button */}
              <Button
                htmlType="submit"
                block
                disabled={loading}
                style={{
                  height: isMobile ? 44 : 48,
                  borderRadius: 24,
                  background: loading ? 'var(--color-bg-hover)' : tokens.buttonBg,
                  border: tokens.buttonBorder,
                  color: loading ? 'var(--color-text-muted)' : tokens.buttonText,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  boxShadow: loading ? 'none' : tokens.buttonShadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? (
                  <Loader
                    size={15}
                    color="var(--color-primary)"
                    label="AUTHENTICATING..."
                    labelColor="var(--color-primary)"
                  />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightOutlined style={{ fontSize: 12 }} />
                  </>
                )}
              </Button>
            </Form>

            {/* <div
              style={{
                marginTop: 22,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
              <span>Don't have an account?</span>
              <Link
                to="/signup"
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Create Account
              </Link>
            </div> */}
          </div>

          {/* Right Column: Information & Platform Overview */}
          <div
            style={{
              borderRadius: isMobile ? 18 : 26,
              background: tokens.rightHeroBg,
              color: 'var(--term-text)',
              padding: isMobile ? '24px 20px' : '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: isDark
                ? '1px solid var(--term-border)'
                : '1px solid var(--primitive-gray-800)',
              boxSizing: 'border-box',
            }}
          >
            {/* Ambient Radial Accent */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: isMobile ? 180 : 260,
                height: isMobile ? 180 : 260,
                borderRadius: '50%',
                background: isDark
                  ? 'radial-gradient(circle, rgba(57, 255, 106, 0.18) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(22, 163, 74, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Upper Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 14,
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${isDark ? 'var(--term-border)' : 'rgba(255, 255, 255, 0.15)'}`,
                  fontSize: 10,
                  color: isDark ? 'var(--term-green)' : 'var(--primitive-green-300)',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                <CheckCircleFilled /> ENTERPRISE CLOUD WORKSPACE
              </div>

              <h3
                style={{
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  margin: '0 0 14px',
                  letterSpacing: -0.5,
                }}
              >
                Seamless authentication for developer productivity.
              </h3>

              <p
                style={{
                  fontSize: isMobile ? 13 : 14,
                  lineHeight: 1.6,
                  color: 'var(--term-text-muted)',
                  margin: 0,
                  maxWidth: 380,
                }}
              >
                Access your cloud storage, manage authenticated device sessions, and configure
                role-based access tokens with zero configuration overhead.
              </p>

              {/* Slider Control Arrows */}
              <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
                <button
                  type="button"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: isDark
                      ? '1px solid var(--term-border)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    color: isDark ? 'var(--term-green)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ArrowLeftOutlined style={{ fontSize: 11 }} />
                </button>
                <button
                  type="button"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: isDark
                      ? '1px solid var(--term-border)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    color: isDark ? 'var(--term-green)' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ArrowRightOutlined style={{ fontSize: 11 }} />
                </button>
              </div>
            </div>

            {/* Bottom Security Card */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: isMobile ? 24 : 36,
                background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
                color: isDark ? 'var(--term-text)' : 'var(--color-text)',
                borderRadius: 16,
                padding: isMobile ? '12px 14px' : '16px 20px',
                boxShadow: isDark
                  ? '0 16px 36px rgba(0, 0, 0, 0.7), var(--term-glow)'
                  : '0 16px 36px rgba(0, 0, 0, 0.15)',
                border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: 0.3,
                  }}
                >
                  Active Session Protection
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                    marginTop: 2,
                    lineHeight: 1.3,
                  }}
                >
                  Rotated authentication tokens keep unauthorized devices locked out.
                </div>
              </div>

              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: isDark ? 'rgba(57, 255, 106, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                <CheckCircleFilled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageHeader>
  )
}

export default LoginPage
