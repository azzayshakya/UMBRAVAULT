import { PlusOutlined, SearchOutlined, FolderOpenOutlined } from '@ant-design/icons'
import EmptyState from '@devStack/components/EmptyState/EmptyState'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useTopicNotesApi } from '../hooks/Usetopicnotesapi'

import NewNoteModal from './NewTopicModal'
import NoteCard from './Notecard'
import NoteEditorPanel from './Noteeditorpanel'

const TopicVaultPage = () => {
  const { topicId } = useParams()

  const [search, setSearch] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK
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
    <PageHeader
      showBack={true}
      icon={<FolderOpenOutlined />}
      title={topic?.name || 'LOADING TOPIC...'}
      subtitle={`root@vault:~# cat ./topics/${topic?.name?.toLowerCase().replace(/\s+/g, '-') || topicId || 'current'} → ${notes?.length || 0} notes indexed`}
      extra={
        <button
          type="button"
          onClick={() => setNewNoteOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            border: isDark ? '1px solid var(--term-border)' : '1px solid rgba(6, 95, 70, 0.25)',
            background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.45)',
            color: isDark ? 'var(--term-green)' : '#065f46',
            borderRadius: 'var(--radius, 8px)',
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            fontFamily: 'var(--term-font, monospace)',
            transition: 'all 0.15s ease',
          }}
        >
          <PlusOutlined /> NEW NOTE
        </button>
      }
    >
      {/* Search Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Input
          prefix={
            <SearchOutlined
            // style={{ color: isDark ? 'var(--term-green)' : 'var(--color-primary)' }}
            />
          }
          placeholder="Search notes in this topic..."
          value={search}
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: isMobile ? '100%' : 280,
            borderRadius: 'var(--radius, 8px)',
            border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            // background: 'var(--color-bg-container)',
            // color: 'var(--color-text)',
            fontFamily: 'var(--term-font, monospace)',
          }}
        />
      </div>

      {/* Main Content Area: Notes Grid + Editor Drawer */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
          {loading ? (
            <div style={responsiveGridStyle}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height={150} borderRadius={10} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <EmptyState
              variant={search ? 'search' : 'default'}
              query={search}
              actionText={search ? 'Clear Search' : 'NEW NOTE'}
              onAction={search ? () => setSearch('') : () => setNewNoteOpen(true)}
              secondaryActionText={search ? 'Create Note' : undefined}
              onSecondaryAction={search ? () => setNewNoteOpen(true) : undefined}
            />
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

      {/* New Note Creation Modal */}
      <NewNoteModal
        open={newNoteOpen}
        onClose={() => setNewNoteOpen(false)}
        onCreate={handleCreateNote}
        submitting={submitting}
      />
    </PageHeader>
  )
}

export default TopicVaultPage
