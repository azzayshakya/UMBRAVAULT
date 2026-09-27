import {
  BookOutlined,
  FolderOutlined,
  BulbOutlined,
  RocketOutlined,
  CodeOutlined,
  DatabaseOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons'
import TerminalModal from '@devStack/components/Terminalmodal'
import { Form, Input, Select, ColorPicker, message } from 'antd'

const ICON_OPTIONS = [
  {
    value: 'BookOutlined',
    label: (
      <span>
        <BookOutlined /> Book
      </span>
    ),
  },
  {
    value: 'FolderOutlined',
    label: (
      <span>
        <FolderOutlined /> Folder
      </span>
    ),
  },
  {
    value: 'BulbOutlined',
    label: (
      <span>
        <BulbOutlined /> Bulb
      </span>
    ),
  },
  {
    value: 'RocketOutlined',
    label: (
      <span>
        <RocketOutlined /> Rocket
      </span>
    ),
  },
  {
    value: 'CodeOutlined',
    label: (
      <span>
        <CodeOutlined /> Code
      </span>
    ),
  },
  {
    value: 'DatabaseOutlined',
    label: (
      <span>
        <DatabaseOutlined /> Database
      </span>
    ),
  },
  {
    value: 'FireOutlined',
    label: (
      <span>
        <FireOutlined /> Fire
      </span>
    ),
  },
  {
    value: 'StarOutlined',
    label: (
      <span>
        <StarOutlined /> Star
      </span>
    ),
  },
]

const NewTopicModal = ({ open, onClose, onSubmit, submitting }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const res = await onSubmit(values)
    if (res.success) {
      message.success('Topic created')
      form.resetFields()
      onClose()
    } else {
      message.error(res.message)
    }
  }

  return (
    <TerminalModal
      open={open}
      onClose={onClose}
      title="NEW TOPIC"
      prompt="root@vault:~# mkdir"
      width={420}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid var(--term-border)',
              background: 'transparent',
              color: 'var(--color-secondary)',
              borderRadius: 6,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              border: '1px solid var(--color-border-secondary)',
              background: 'rgba(57,255,106,0.08)',
              color: 'var(--color-primary)',
              borderRadius: 6,
              padding: '6px 16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            {submitting ? 'CREATING...' : '+ CREATE TOPIC'}
          </button>
        </div>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="NAME"
          rules={[{ required: true, message: 'Topic name is required' }]}
        >
          <Input placeholder="e.g. Distributed Systems" />
        </Form.Item>

        <Form.Item name="description" label="DESCRIPTION">
          <Input.TextArea
            placeholder="What does this topic cover?"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>

        <Form.Item name="icon" label="ICON">
          <Select options={ICON_OPTIONS} placeholder="Choose an icon" allowClear />
        </Form.Item>

        <Form.Item
          name="color"
          label="COLOR"
          getValueFromEvent={(color) => (typeof color === 'string' ? color : color?.toHexString())}
        >
          <ColorPicker />
        </Form.Item>
      </Form>
    </TerminalModal>
  )
}

export default NewTopicModal
