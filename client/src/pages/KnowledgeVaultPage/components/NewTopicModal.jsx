import TerminalModal from '@devStack/components/Terminalmodal'
import { NOTE_TYPE_OPTIONS } from '@devStack/enums/note-page-enum'
import { Form, Input, Select, message } from 'antd'
import { useParams } from 'react-router-dom'

const NewNoteModal = ({ open, onClose, onCreate, submitting, parentNoteId = null }) => {
  const [form] = Form.useForm()
  const { topicId } = useParams()

  const handleFinish = async () => {
    try {
      const values = await form.validateFields()

      const payload = {
        title: values.title.trim(),
        content: values.content || '',
        type: values.type || 'theory',
        tags: values.tags || [],
        topic: topicId,
        ...(parentNoteId ? { parentNote: parentNoteId } : {}),
      }

      const res = await onCreate(payload)
      if (res.success) {
        message.success('Note created successfully')
        form.resetFields()
        onClose()
      } else {
        message.error(res.message || 'Failed to create note')
      }
    } catch (error) {
      // Form validation errors handled automatically by AntD
    }
  }

  return (
    <TerminalModal
      open={open}
      onClose={onClose}
      title="NEW NOTE"
      prompt="root@vault:~# touch"
      width={520}
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
            onClick={handleFinish}
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
        initialValues={{
          type: 'theory',
          tags: [],
        }}
      >
        <Form.Item
          name="title"
          label="TITLE"
          rules={[{ required: true, message: 'Note title is required' }]}
        >
          <Input placeholder="e.g. CAP Theorem & Network Partitions" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 12 }}>
          <Form.Item name="type" label="TYPE" style={{ flex: 1 }}>
            <Select options={NOTE_TYPE_OPTIONS} placeholder="Select type" />
          </Form.Item>

          <Form.Item name="tags" label="TAGS" style={{ flex: 1.5 }}>
            <Select
              mode="tags"
              placeholder="Add tags (press Enter)"
              open={false}
              tokenSeparators={[',']}
            />
          </Form.Item>
        </div>

        <Form.Item name="content" label="CONTENT">
          <Input.TextArea
            placeholder="Write initial note content (Markdown supported)..."
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
      </Form>
    </TerminalModal>
  )
}

export default NewNoteModal
