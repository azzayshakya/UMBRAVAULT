import { UserOutlined, LockOutlined, MailFilled } from '@ant-design/icons'
import { CreateAccount } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import Loader from '@devStack/components/spinners/Loader'
import TerminalCard from '@devStack/components/Terminalcard'
import { Form, Input, Button, Typography, message } from 'antd'
import { useState } from 'react'

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

const SignupPage = () => {
  const contentBgUrl = '/images/global/binary-bg.webp'
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await CreateAccount({
        email: values.userEmail,
        password: values.userPassword,
        name: values.name,
      })
      message.success(res?.message)
    } catch (err) {
      handleApiError(err, 'Account Creation failed. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'var(--term-bg)',
        // padding: 16,

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
        title="Add User"
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
            label={<span style={fieldLabelStyle}>NAME</span>}
            name="name"
            rules={[
              { required: true, message: 'Enter your name' },
              { type: 'string', message: 'Enter a valid name' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--term-green-dim)' }} />}
              placeholder="annonymous user"
              autoComplete="new-user"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            label={<span style={fieldLabelStyle}>EMAIL</span>}
            name="userEmail"
            rules={[
              { required: true, message: 'Enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailFilled style={{ color: 'var(--term-green-dim)' }} />}
              placeholder="you@domain.com"
              aautoComplete="new-email"
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
                'ADD USER'
              )}
            </Button>
          </Form.Item>
        </Form>
      </TerminalCard>
    </div>
  )
}

export default SignupPage
