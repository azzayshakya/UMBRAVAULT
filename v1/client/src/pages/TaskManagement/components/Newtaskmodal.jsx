import TerminalModal from '@devStack/components/Terminalmodal'
import { TASK_PRIORITY, TASK_PRIORITY_OPTIONS } from '@devStack/enums/task-page-enums'
import { DatePicker, Form, Input, Select, message } from 'antd'

const NewTaskModal = ({ open, onClose, onCreate, submitting }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    }
    const res = await onCreate(payload)
    if (res.success) {
      message.success('Task created')
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
      title="NEW TASK"
      prompt="root@tasks:~# create"
      width={480}
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
            {submitting ? 'CREATING...' : '+ CREATE TASK'}
          </button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ priority: TASK_PRIORITY.MEDIUM }}
      >
        <Form.Item
          name="title"
          label="TITLE"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input placeholder="e.g. Migrate auth to JWT" />
        </Form.Item>

        <Form.Item name="description" label="DESCRIPTION">
          <Input.TextArea rows={2} placeholder="Short description..." />
        </Form.Item>

        <Form.Item name="project" label="PROJECT">
          <Input placeholder="e.g. AssetFlow" />
        </Form.Item>

        <Form.Item name="tags" label="TAGS">
          <Select mode="tags" placeholder="press enter to add tags" open={false} />
        </Form.Item>

        <div style={{ display: 'flex', gap: 12 }}>
          <Form.Item name="priority" label="PRIORITY" style={{ flex: 1 }}>
            <Select options={TASK_PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="dueDate" label="DUE DATE" style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </Form>
    </TerminalModal>
  )
}

export default NewTaskModal
