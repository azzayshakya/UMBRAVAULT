import { CloseOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { NOTE_TYPE_OPTIONS } from '@devStack/enums/note-page-enum'
import { Input, Select } from 'antd'

import { useNoteEditorApi } from '../hooks/useNoteEditorApi'

const SAVE_STATUS_LABEL = {
  idle: '',
  saving: 'Saving...',
  saved: 'Autosaved',
  error: 'Save failed',
}

const NoteEditorPanel = ({ noteId, onClose, onDeleted }) => {
  const { note, loading, saveStatus, saveNow, saveDebounced } = useNoteEditorApi(noteId)

  if (!noteId) return null

  return (
    <div className="terminal-frame" style={{ width: 380, flexShrink: 0, alignSelf: 'flex-start' }}>
      <span className="terminal-frame__corner terminal-frame__corner--tl" />
      <span className="terminal-frame__corner terminal-frame__corner--tr" />
      <span className="terminal-frame__corner terminal-frame__corner--bl" />
      <span className="terminal-frame__corner terminal-frame__corner--br" />
      <span className="terminal-frame__scanlines" />
      <span className="terminal-frame__beam" />

      <div className="terminal-frame__header">
        <span
          className="terminal-frame__prompt"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ color: 'var(--term-green)' }}>●</span>
          {loading ? 'LOADING...' : note?.title || 'NOTE'}
        </span>
        <button type="button" className="terminal-frame__close" onClick={onClose}>
          <CloseOutlined style={{ fontSize: 10 }} />
        </button>
      </div>

      {!loading && note && (
        <div
          className="terminal-frame__body"
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <Input
            value={note.title}
            onChange={(e) => saveDebounced({ title: e.target.value })}
            placeholder="Note title..."
            style={{
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--term-text)',
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
            autoSize={{ minRows: 10, maxRows: 20 }}
            style={{
              background: 'rgba(6, 18, 10, 0.6)',
              border: '1px solid var(--term-border)',
              color: 'var(--term-text)',
              fontSize: 13,
              lineHeight: 1.6,
            }}
          />
        </div>
      )}

      <div className="terminal-frame__footer">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: saveStatus === 'error' ? '#ef4444' : 'var(--term-text-muted)',
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
      </div>
    </div>
  )
}

export default NoteEditorPanel
