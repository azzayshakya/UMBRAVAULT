import { DeleteOutlined } from '@ant-design/icons'
import Loader from '@devStack/components/spinners/Loader'
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

  if (!noteId) return null

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
          fontFamily: 'var(--term-font, monospace)',
        }}
      >
        {saveStatus === 'saving' && (
          <Loader
            size={12}
            thickness={2}
            color="var(--color-primary, #39ff6a)"
            trackColor="rgba(57, 255, 106, 0.15)"
          />
        )}
        {SAVE_STATUS_LABEL[saveStatus]}
      </span>

      <button
        type="button"
        disabled={loading}
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
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.4 : 1,
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
      title={loading ? 'FETCHING NOTE BUFFER...' : note?.title || 'NOTE'}
      prompt="root@vault:~# edit"
      width={700}
      footer={footerContent}
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 340,
            borderRadius: 8,
            border: '1px dashed rgba(57, 255, 106, 0.15)',
            gap: 12,
          }}
        >
          <Loader
            size={36}
            thickness={3}
            color="var(--color-primary, #39ff6a)"
            trackColor="rgba(57, 255, 106, 0.12)"
            label="Reading note data from vault..."
            labelPosition="bottom"
            labelSize={12}
            labelColor="var(--color-secondary, #888)"
          />
        </div>
      ) : note ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            value={note.title}
            onChange={(e) => saveDebounced({ title: e.target.value })}
            placeholder="Note title..."
            style={{
              // background: 'rgba(6, 18, 10, 0.6)',
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
            autoSize={{ minRows: 15, maxRows: 25 }}
            style={{
              border: '1px solid var(--term-border)',
              color: 'var(--color-secondary-hover)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          />
        </div>
      ) : null}
    </TerminalModal>
  )
}

export default NoteEditorPanel
