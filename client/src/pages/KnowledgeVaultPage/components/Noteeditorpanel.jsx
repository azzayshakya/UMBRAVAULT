import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import TerminalModal from '@devStack/components/Terminalmodal'
import { NOTE_TYPE_OPTIONS } from '@devStack/enums/note-page-enum'
import { Input, Select } from 'antd'

import { useNoteEditorApi } from '../hooks/Usenoteeditorapi'

const SAVE_STATUS_LABEL = {
  idle: '',
  saving: 'Saving...',
  saved: 'Autosaved',
  error: 'Save failed',
}

const NoteEditorPanel = ({ noteId, onClose, onDeleted }) => {
  const { note, loading, saveStatus, saveNow, saveDebounced } = useNoteEditorApi(noteId)

  // Don't render the modal at all if there's no selected note
  if (!noteId) return null

  // The footer containing the Save Status and Delete button
  const footerContent = (
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
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: saveStatus === 'error' ? '#ef4444' : 'var(--color-secondary)',
          fontSize: 11,
        }}
      >
        {saveStatus === 'saving' && <LoadingOutlined style={{ fontSize: 11 }} />}
        {SAVE_STATUS_LABEL[saveStatus]}
      </span>

      <button
        type="button"
        onClick={() => onDeleted(note?._id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: '1px solid var(--term-border)',
          background: 'transparent',
          color: '#ef4444',
          borderRadius: 5,
          padding: '4px 10px',
          fontSize: 11,
          cursor: 'pointer',
        }}
      >
        <DeleteOutlined style={{ fontSize: 11 }} /> DELETE
      </button>
    </div>
  )

  return (
    <TerminalModal
      open={!!noteId}
      onClose={onClose}
      title={loading ? 'LOADING...' : note?.title || 'NOTE'}
      prompt="root@vault:~# edit"
      width={700} // Wider width for comfortable reading/editing
      footer={footerContent}
    >
      {!loading && note && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            value={note.title}
            onChange={(e) => saveDebounced({ title: e.target.value })}
            placeholder="Note title..."
            style={{
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--color-secondary-hover)',
              fontWeight: 600,
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              value={note.type}
              options={NOTE_TYPE_OPTIONS}
              onChange={(v) => saveNow({ type: v })}
              style={{ flex: 1 }}
            />
            <Select
              mode="tags"
              value={note.tags}
              placeholder="Add tags..."
              open={false}
              onChange={(v) => saveNow({ tags: v })}
              style={{ flex: 1 }}
            />
          </div>

          <Input.TextArea
            value={note.content}
            onChange={(e) => saveDebounced({ content: e.target.value })}
            placeholder="Write your notes here (markdown supported)..."
            autoSize={{ minRows: 15, maxRows: 25 }} // Taller default view for the modal
            style={{
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--color-secondary-hover)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          />
        </div>
      )}
    </TerminalModal>
  )
}

export default NoteEditorPanel
