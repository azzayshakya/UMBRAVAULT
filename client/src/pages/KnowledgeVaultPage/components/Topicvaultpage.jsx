import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import NewNoteModal from '../components/Newnotemodal'
import NoteCard from '../components/Notecard'
import NoteEditorPanel from '../components/Noteeditorpanel'
import { useTopicNotesApi } from '../hooks/Usetopicnotesapi'

const TopicVaultPage = () => {
  const { topicId } = useParams()

  const [search, setSearch] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)

  const isMobile = useIsMobile()

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

  const responsiveGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  }

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <PageHeader
        title={topic?.name || 'LOADING...'}
        titleStyle={{ fontSize: 22, letterSpacing: 1 }}
        subtitle={`${notes.length} notes`}
        extra={
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
        }
      />

      <div style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined style={{ color: 'var(--term-green-dim)' }} />}
          placeholder="Search notes in this topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: isMobile ? '100%' : 260, // 👈 Expands full width on mobile screens
            border: '2px var(--term-border) solid',
          }}
        />
      </div>

      {/* Main Container: Switches to column stack on mobile if preferred, or keeps flex */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          alignItem: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {loading ? (
            <div style={responsiveGridStyle}>
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
            <div style={responsiveGridStyle}>
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
