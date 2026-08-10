import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { loginUser } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import Loader from '@devStack/components/spinners/Loader'
import TerminalCard from '@devStack/components/Terminalcard'
import { setUserSession } from '@devStack/store/userSlice'
import { getPostLoginRedirectPath } from '@devStack/utils/redirect-utils'
import { setUserSessionLocally } from '@devStack/utils/user-session-utils'
import { Form, Input, Button, Typography } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const inputStyle = {
  background: 'rgba(6, 18, 10, 0.6)',
  border: '1px solid var(--term-border)',
  color: 'var(--term-text)',
  fontFamily: 'var(--term-font)',
  fontSize: 13,
  borderRadius: 6,
}

const fieldLabelStyle = {
  color: 'var(--term-green-dim)',
  fontFamily: 'var(--term-font)',
  fontSize: 12,
  letterSpacing: 0.5,
}

const LoginPage = () => {
  const contentBgUrl = '/images/global/binary-bg.webp'
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      handleApiError(err, 'Login failed. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(8, 11, 9, 0.72), rgba(8, 11, 9, 0.72)), url(${contentBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        borderRadius: 'var(--radius)',
        padding: 'var(--page-padding)',
        flex: 1,
      }}
    >
      <TerminalCard
        title="Login"
        prompt="root@auth:~#"
        maxWidth={420}
        footer={
          <Text
            style={{
              fontSize: 11,
              color: 'var(--term-text-muted)',
              fontFamily: 'var(--term-font)',
              letterSpacing: 0.3,
            }}
          >
            Unauthorized access is prohibited. All sessions are logged.
          </Text>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          disabled={loading}
          autoComplete="off"
        >
          <Form.Item
            label={<span style={fieldLabelStyle}>EMAIL</span>}
            name="userEmail"
            rules={[
              { required: true, message: 'Enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--term-green-dim)' }} />}
              placeholder="you@domain.com"
              autoComplete="new-email"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            label={<span style={fieldLabelStyle}>PASSWORD</span>}
            name="userPassword"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--term-green-dim)' }} />}
              placeholder="********"
              autoComplete="new-password"
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Button
              htmlType="submit"
              block
              disabled={loading}
              style={{
                height: 42,
                background: loading ? 'rgba(57, 255, 106, 0.12)' : 'var(--term-green)',
                border: '1px solid var(--term-border-strong)',
                color: loading ? 'var(--term-green)' : '#04150a',
                fontFamily: 'var(--term-font)',
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: loading ? 'none' : '0 0 14px rgba(57, 255, 106, 0.35)',
                transition: 'background 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {loading ? (
                <Loader
                  size={16}
                  thickness={2}
                  color="var(--term-green)"
                  trackColor="rgba(57, 255, 106, 0.2)"
                  label="AUTHENTICATING..."
                  labelColor="var(--term-green)"
                  labelSize={12}
                />
              ) : (
                'CONNECT'
              )}
            </Button>
          </Form.Item>
        </Form>
      </TerminalCard>
    </div>
  )
}

export default LoginPage
