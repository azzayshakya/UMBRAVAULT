import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { CreateAccount } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import PageHeader from '@devStack/components/PageHeader'
import Loader from '@devStack/components/spinners/Loader'
import { useIsMobile } from '@devStack/hooks/useIsMobile'
import { useTheme } from '@devStack/store/theme/hooks/useTheme'
import { Theme } from '@devStack/store/theme/utils/theme-constants'
import { Form, Input, Button, message } from 'antd'
import { useState } from 'react'

const SignupPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === Theme.DARK
  const isMobile = useIsMobile()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await CreateAccount({
        email: values.userEmail,
        password: values.userPassword,
        name: values.name,
      })
      message.success(res?.message || 'Account provisioned successfully')
      form.resetFields()
    } catch (err) {
      handleApiError(err, 'Account creation failed. Verify credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Purely token-driven theme mapping
  const tokens = {
    ambientWrapper: '',
    outerCardBg: isDark
      ? 'rgba(6, 18, 10, 0.85)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(238, 244, 240, 0.75) 100%)',
    outerCardBorder: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    outerCardShadow: isDark
      ? '0 24px 64px rgba(0, 0, 0, 0.8), var(--term-glow)'
      : '0 20px 50px -10px rgba(15, 122, 55, 0.1), 0 4px 14px rgba(15, 122, 55, 0.05)',
    inputBg: isDark ? 'rgba(3, 9, 5, 0.9)' : 'var(--primitive-white)',
    inputBorder: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    rightHeroBg: isDark
      ? 'linear-gradient(160deg, #06120a 0%, #030905 100%)'
      : 'linear-gradient(160deg, var(--primitive-gray-900) 0%, var(--primitive-gray-950) 100%)',
    buttonBg: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--color-primary)',
    buttonBorder: isDark ? '1px solid var(--term-border-strong)' : '1px solid var(--color-primary)',
    buttonText: isDark ? 'var(--term-green)' : '#ffffff',
    buttonHoverBg: isDark ? 'rgba(57, 255, 106, 0.2)' : 'var(--color-primary-hover)',
    buttonShadow: 'var(--color-glow)',
  }

  const modernInputStyle = {
    height: isMobile ? 44 : 48,
    borderRadius: 24,
    background: tokens.inputBg,
    border: tokens.inputBorder,
    color: 'var(--color-text)',
    fontFamily: 'var(--term-font, monospace)',
    fontSize: 13,
    padding: '0 16px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  return (
    <PageHeader
      title="PROVISION USER IDENTITY"
      subtitle="root@auth:~# useradd --interactive --vault-provision"
      icon={<UserAddOutlined />}
      showBack={true}
    >
      <div
        style={{
          minHeight: isMobile ? 'auto' : 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '12px 0' : '24px 16px',
          background: tokens.ambientWrapper,
          borderRadius: 16,
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Main Split Floating Canvas */}
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
          {/* Left Column: Form Controls */}
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
            {/* Header / Brand Mark */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: isMobile ? 20 : 28,
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
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  flexShrink: 0,
                }}
              >
                <CheckCircleFilled />
              </div>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  }}
                >
                  SYSTEM ACCESS PROTOCOL
                </span>
              </div>
            </div>

            <h2
              style={{
                fontSize: isMobile ? 22 : 30,
                fontWeight: 800,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: -0.6,
                lineHeight: 1.2,
              }}
            >
              Create an account
            </h2>
            <p
              style={{
                margin: '8px 0 20px',
                fontSize: isMobile ? 12 : 13,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              Please enter credential parameters to provision identity and permissions.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              disabled={loading}
              autoComplete="off"
            >
              {/* Full Name */}
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: 0.8,
                      fontFamily: 'monospace',
                    }}
                  >
                    FULL NAME
                  </span>
                }
                name="name"
                rules={[
                  { required: true, message: 'Please enter account display name' },
                  { min: 2, message: 'Name must have at least 2 characters' },
                ]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  prefix={
                    <UserOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 6,
                      }}
                    />
                  }
                  placeholder="Ayman Shaltoni"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Email Address */}
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: 0.8,
                      fontFamily: 'monospace',
                    }}
                  >
                    EMAIL ADDRESS
                  </span>
                }
                name="userEmail"
                rules={[
                  { required: true, message: 'Please enter registered email' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  prefix={
                    <MailOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 6,
                      }}
                    />
                  }
                  placeholder="identity@devstack.internal"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      letterSpacing: 0.8,
                      fontFamily: 'monospace',
                    }}
                  >
                    SECURITY KEY / PASSWORD
                  </span>
                }
                name="userPassword"
                rules={[
                  { required: true, message: 'Please specify account password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
                style={{ marginBottom: isMobile ? 20 : 28 }}
              >
                <Input.Password
                  prefix={
                    <LockOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 6,
                      }}
                    />
                  }
                  placeholder="••••••••••••"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Themed Submit Button */}
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
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
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
                    label="PROVISIONING..."
                    labelColor="var(--color-primary)"
                  />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightOutlined style={{ fontSize: 11 }} />
                  </>
                )}
              </Button>
            </Form>

            <div
              style={{
                marginTop: 18,
                textAlign: 'center',
                fontSize: 10,
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--term-font, monospace)',
                lineHeight: 1.4,
              }}
            >
              &gt; Sessions protected via HMAC-SHA256 token rotation.
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
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
            {/* Ambient Background Decorative Grid / Radial Sweep */}
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

            {/* Geometric Vector Accent */}
            <div
              style={{
                position: 'absolute',
                bottom: isMobile ? 60 : 120,
                right: 18,
                opacity: 0.12,
                color: 'var(--color-primary)',
                fontSize: isMobile ? 120 : 180,
                lineHeight: 0.8,
                pointerEvents: 'none',
                fontFamily: 'monospace',
                userSelect: 'none',
              }}
            >
              ✱
            </div>

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
                  fontFamily: 'monospace',
                }}
              >
                <SafetyCertificateOutlined /> ROLE-BASED ACCESS CONTROL
              </div>

              <h3
                style={{
                  fontSize: isMobile ? 22 : 30,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  margin: '0 0 12px',
                  letterSpacing: -0.5,
                }}
              >
                What engineers &amp; architects say.
              </h3>

              <div
                style={{
                  fontSize: isMobile ? 28 : 36,
                  color: isDark ? 'var(--term-green)' : 'var(--primitive-green-400)',
                  lineHeight: 1,
                  marginBottom: 2,
                  fontFamily: 'monospace',
                }}
              >
                “
              </div>

              <p
                style={{
                  fontSize: isMobile ? 13 : 14,
                  lineHeight: 1.6,
                  color: 'var(--term-text-muted)',
                  margin: 0,
                  maxWidth: 380,
                }}
              >
                Managing fullstack assets, secure file storage, and cryptographic session cookies in
                one unified portal simplifies developer onboarding tenfold.
              </p>

              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#ffffff' }}>Mas Parjono</div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--term-text-muted)',
                    marginTop: 2,
                    fontFamily: 'monospace',
                  }}
                >
                  Lead Architect at Google Cloud
                </div>
              </div>

              {/* Themed Slider Control Arrows */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
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

            {/* Floating Overlapping Badge */}
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
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: 0.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Instant Role Inheritance
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--color-text-secondary)',
                    marginTop: 2,
                    fontFamily: 'monospace',
                    lineHeight: 1.3,
                  }}
                >
                  New users automatically receive isolated workspaces.
                </div>
              </div>

              {/* Stacked Avatar Rings */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {[
                  'var(--primitive-green-500)',
                  'var(--primitive-green-600)',
                  'var(--primitive-green-700)',
                ].map((bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: bg,
                      border: `2px solid ${isDark ? '#06120a' : '#ffffff'}`,
                      marginLeft: i === 0 ? 0 : -8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      color: '#ffffff',
                    }}
                  >
                    <CheckCircleFilled />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageHeader>
  )
}

export default SignupPage
