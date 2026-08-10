import TerminalModal from '@devStack/components/Terminalmodal'
import { NOTE_TYPE, NOTE_TYPE_OPTIONS } from '@devStack/enums/note-page-enum'
import { Form, Input, Select, message } from 'antd'

const NewNoteModal = ({ open, onClose, onCreate, submitting }) => {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const res = await onCreate(values)
    if (res.success) {
      message.success('Note created')
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
      title="NEW NOTE"
      prompt="root@vault:~# touch"
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
            {submitting ? 'CREATING...' : '+ CREATE NOTE'}
          </button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ type: NOTE_TYPE.THEORY }}
      >
        <Form.Item
          name="title"
          label="TITLE"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input placeholder="e.g. Event Loop Explained" />
        </Form.Item>

        <Form.Item name="type" label="TYPE">
          <Select options={NOTE_TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item name="tags" label="TAGS">
          <Select mode="tags" placeholder="press enter to add tags" open={false} />
        </Form.Item>
      </Form>
    </TerminalModal>
  )
}

export default NewNoteModal
