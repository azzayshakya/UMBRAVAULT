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
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Form, Input, Button, message } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const SignupPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

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
    // isDark
    //   ? 'radial-gradient(ellipse at top left, rgba(57, 255, 106, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(28, 138, 69, 0.12) 0%, transparent 70%)'
    //   : 'rsdfadial-gradient(ellipse at 10% 20%, var(--primitive-green-100) 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, var(--primitive-gray-200) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, var(--primitive-green-50) 0%, transparent 50%)',
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
    // Exact button palette aligned with your variables
    buttonBg: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--color-primary)',
    buttonBorder: isDark ? '1px solid var(--term-border-strong)' : '1px solid var(--color-primary)',
    buttonText: isDark ? 'var(--term-green)' : '#ffffff',
    buttonHoverBg: isDark ? 'rgba(57, 255, 106, 0.2)' : 'var(--color-primary-hover)',
    buttonShadow: 'var(--color-glow)',
  }

  const modernInputStyle = {
    height: 48,
    borderRadius: 24,
    background: tokens.inputBg,
    border: tokens.inputBorder,
    color: 'var(--color-text)',
    fontFamily: 'var(--term-font, monospace)',
    fontSize: 13,
    padding: '0 18px',
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
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // padding: '24px 16px',
          background: tokens.ambientWrapper,
          borderRadius: 16,
          position: 'relative',
        }}
      >
        {/* Main Split Floating Canvas */}
        <div
          style={{
            width: '100%',
            maxWidth: 1040,
            borderRadius: 32,
            background: tokens.outerCardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: tokens.outerCardBorder,
            boxShadow: tokens.outerCardShadow,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            overflow: 'hidden',
            padding: 18,
            gap: 18,
          }}
        >
          {/* Left Column: Form Controls */}
          <div
            style={{
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Header / Brand Mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--primitive-green-50)',
                  border: `1px solid ${isDark ? 'var(--term-border)' : 'var(--primitive-green-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary)',
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                //
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
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
                fontSize: 30,
                fontWeight: 800,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: -0.8,
                lineHeight: 1.15,
              }}
            >
              Create an account
            </h2>
            <p
              style={{
                margin: '8px 0 28px',
                fontSize: 13,
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
                      fontSize: 11,
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
                style={{ marginBottom: 16 }}
              >
                <Input
                  prefix={
                    <UserOutlined
                      style={{
                        color: 'var(--color-primary)',
                        marginRight: 8,
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
                      fontSize: 11,
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
                  placeholder="identity@devstack.internal"
                  style={modernInputStyle}
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                label={
                  <span
                    style={{
                      fontSize: 11,
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
                style={{ marginBottom: 28 }}
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

              {/* Themed Pill Submit Button */}
              <Button
                htmlType="submit"
                block
                disabled={loading}
                style={{
                  height: 48,
                  borderRadius: 24,
                  background: loading ? 'var(--color-bg-hover)' : tokens.buttonBg,
                  border: tokens.buttonBorder,
                  color: loading ? 'var(--color-text-muted)' : tokens.buttonText,
                  fontSize: 13,
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
                    size={16}
                    color="var(--color-primary)"
                    label="PROVISIONING..."
                    labelColor="var(--color-primary)"
                  />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightOutlined style={{ fontSize: 12 }} />
                  </>
                )}
              </Button>
            </Form>

            <div
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontSize: 11,
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--term-font, monospace)',
              }}
            >
              &gt; Sessions protected via HMAC-SHA256 token rotation.
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Matching Themed Accent */}
          <div
            style={{
              borderRadius: 26,
              background: tokens.rightHeroBg,
              color: 'var(--term-text)',
              padding: '40px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              border: isDark
                ? '1px solid var(--term-border)'
                : '1px solid var(--primitive-gray-800)',
            }}
          >
            {/* Ambient Background Decorative Grid / Radial Sweep */}
            <div
              style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 260,
                height: 260,
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
                bottom: 120,
                right: 28,
                opacity: 0.14,
                color: 'var(--color-primary)',
                fontSize: 180,
                lineHeight: 0.8,
                pointerEvents: 'none',
                fontFamily: 'monospace',
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
                  padding: '5px 12px',
                  borderRadius: 16,
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${isDark ? 'var(--term-border)' : 'rgba(255, 255, 255, 0.15)'}`,
                  fontSize: 11,
                  color: isDark ? 'var(--term-green)' : 'var(--primitive-green-300)',
                  fontWeight: 600,
                  marginBottom: 20,
                  fontFamily: 'monospace',
                }}
              >
                <SafetyCertificateOutlined /> ROLE-BASED ACCESS CONTROL
              </div>

              <h3
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  margin: '0 0 16px',
                  letterSpacing: -0.6,
                }}
              >
                What engineers &amp; architects say.
              </h3>

              <div
                style={{
                  fontSize: 36,
                  color: isDark ? 'var(--term-green)' : 'var(--primitive-green-400)',
                  lineHeight: 1,
                  marginBottom: 4,
                  fontFamily: 'monospace',
                }}
              >
                “
              </div>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: 'var(--term-text-muted)',
                  margin: 0,
                  maxWidth: 380,
                }}
              >
                Managing fullstack assets, secure file storage, and cryptographic session cookies in
                one unified portal simplifies developer onboarding tenfold.
              </p>

              <div style={{ marginTop: 22 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>Mas Parjono</div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--term-text-muted)',
                    marginTop: 2,
                    fontFamily: 'monospace',
                  }}
                >
                  Lead Architect at Google Cloud
                </div>
              </div>

              {/* Themed Slider Control Arrows */}
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button
                  type="button"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
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
                  <ArrowLeftOutlined style={{ fontSize: 12 }} />
                </button>
                <button
                  type="button"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
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
                  <ArrowRightOutlined style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>

            {/* Floating Overlapping Badge */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: 36,
                background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
                color: isDark ? 'var(--term-text)' : 'var(--color-text)',
                borderRadius: 20,
                padding: '16px 20px',
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
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: 0.3,
                  }}
                >
                  Instant Role Inheritance
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                    marginTop: 2,
                    fontFamily: 'monospace',
                  }}
                >
                  New users automatically receive isolated workspaces.
                </div>
              </div>

              {/* Stacked Avatar Rings */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  'var(--primitive-green-500)',
                  'var(--primitive-green-600)',
                  'var(--primitive-green-700)',
                ].map((bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: bg,
                      border: `2px solid ${isDark ? '#06120a' : '#ffffff'}`,
                      marginLeft: i === 0 ? 0 : -8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
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
