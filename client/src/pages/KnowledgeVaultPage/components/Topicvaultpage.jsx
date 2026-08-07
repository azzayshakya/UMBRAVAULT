import { ArrowLeftOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import NewNoteModal from '../components/Newnotemodal'
import NoteCard from '../components/Notecard'
import NoteEditorPanel from '../components/Noteeditorpanel'
import { useTopicNotesApi } from '../hooks/Usetopicnotesapi'

const TopicVaultPage = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)

  const filters = useMemo(() => ({ search: search || undefined }), [search])

  const { topic, notes, loading, submitting, refetch, addNote, removeNote } = useTopicNotesApi(
    topicId,
    filters
  )

  const handleCreateNote = async (payload) => {
    const res = await addNote(payload)
    if (res.success) {
      refetch()
      setSelectedNoteId(res.data?.data?.note?._id || null)
    }
    return res
  }

  const handleDeleteNote = (noteId) => {
    Modal.confirm({
      title: 'Delete this note?',
      content: 'Any sub-notes nested under it will be deleted too. This cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await removeNote(noteId)
        if (res.success) {
          message.success('Note deleted')
          if (selectedNoteId === noteId) setSelectedNoteId(null)
          refetch()
        } else {
          message.error(res.message)
        }
      },
    })
  }

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--term-text-muted)',
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/knowledge-vault')}
            style={{
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              background: 'transparent',
              color: 'var(--term-text-muted)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: 6 }} />
            Knowledge Vault
          </button>
          <span>/</span>
          <span style={{ color: 'var(--term-green)' }}>{topic?.name || '...'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1
              style={{
                color: 'var(--term-green)',
                fontSize: 22,
                letterSpacing: 1,
                margin: 0,
                textShadow: '0 0 10px rgba(57,255,106,0.35)',
              }}
            >
              {topic?.name || 'LOADING...'}
            </h1>
            <p style={{ color: 'var(--term-text-muted)', fontSize: 12, marginTop: 4 }}>
              {notes.length} notes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewNoteOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid var(--term-border-strong)',
              background: 'rgba(57,255,106,0.08)',
              color: 'var(--term-green)',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            <PlusOutlined /> NEW NOTE
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--term-green-dim)' }} />}
          placeholder="Search notes in this topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={150} borderRadius={4} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div
              style={{
                border: '1px dashed var(--term-border)',
                borderRadius: 10,
                padding: 40,
                textAlign: 'center',
                color: 'var(--term-text-muted)',
              }}
            >
              No notes here yet. Create the first one.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {notes.map((note, index) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  index={index}
                  onOpen={(n) => setSelectedNoteId(n._id)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedNoteId && (
          <NoteEditorPanel
            noteId={selectedNoteId}
            onClose={() => {
              setSelectedNoteId(null)
              refetch()
            }}
            onDeleted={handleDeleteNote}
          />
        )}
      </div>

      <NewNoteModal
        open={newNoteOpen}
        onClose={() => setNewNoteOpen(false)}
        onCreate={handleCreateNote}
        submitting={submitting}
      />
    </div>
  )
}

export default TopicVaultPage
