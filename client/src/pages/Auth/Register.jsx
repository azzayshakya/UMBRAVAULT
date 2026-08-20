import { UserOutlined, LockOutlined, MailFilled } from '@ant-design/icons'
import { CreateAccount } from '@devStack/apiServices/accounts-auth-apis'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import PageHeader from '@devStack/components/PageHeader'
import Loader from '@devStack/components/spinners/Loader'
import TerminalCard from '@devStack/components/Terminalcard'
import { Form, Input, Button, Typography, message } from 'antd'
import { useState } from 'react'

const { Text } = Typography

const inputStyle = {
  background: 'var(--color-bg-container)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  fontFamily: 'var(--term-font, monospace)',
  fontSize: 13,
  borderRadius: 6,
}

const fieldLabelStyle = {
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--term-font, monospace)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
}

const SignupPage = () => {
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
      style={
        {
          // display: 'flex',
          // flexDirection: 'column',
          // minHeight: '100%',
          // padding: 'var(--page-padding)',
          // flex: 1,
        }
      }
    >
      <PageHeader
        title="Create User Account"
        subtitle="Provision a new user access credential into the system"
        showBack={true}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '24px 0',
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
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--term-font, monospace)',
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
                prefix={<UserOutlined style={{ color: 'var(--color-primary)' }} />}
                placeholder="anonymous user"
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
                prefix={<MailFilled style={{ color: 'var(--color-primary)' }} />}
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
                prefix={<LockOutlined style={{ color: 'var(--color-primary)' }} />}
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
                  background: loading ? 'var(--color-bg-hover)' : 'var(--color-primary)',
                  border: '1px solid var(--color-border-secondary)',
                  color: loading ? 'var(--color-primary)' : 'var(--color-bg)',
                  fontFamily: 'var(--term-font, monospace)',
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: loading ? 'none' : 'var(--color-glow)',
                  transition: 'background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
                }}
              >
                {loading ? (
                  <Loader
                    size={16}
                    thickness={2}
                    color="var(--color-primary)"
                    trackColor="var(--color-border)"
                    label="AUTHENTICATING..."
                    labelColor="var(--color-primary)"
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
    </div>
  )
}

export default SignupPage
