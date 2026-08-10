import {
  FolderOutlined,
  TagsOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { StatCard } from '@devStack/components/StateCard'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import NewTopicModal from './components/Newnotemodal'
import TopicCard from './components/TopicCard'
import { useKnowledgeVaultApi } from './hooks/Useknowledgevaultapi'

const KnowledgeVaultPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [newTopicOpen, setNewTopicOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)

  const isMobile = useIsMobile()

  const filters = useMemo(() => ({ search: search || undefined }), [search])

  const {
    topics,
    stats,
    loading,
    statsLoading,
    submitting,
    refetch,
    addTopic,
    editTopic,
    removeTopic,
  } = useKnowledgeVaultApi(filters)

  const handleOpenTopic = (topic) => navigate(`/knowledge-vault/${topic._id}`)

  const handleCreateTopic = async (payload) => {
    const res = await addTopic(payload)
    if (res.success) refetch()
    return res
  }

  const handleDeleteTopic = (topic) => {
    Modal.confirm({
      title: `Delete "${topic.name}"?`,
      content: 'This removes the topic and every note inside it. This cannot be undone.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await removeTopic(topic._id)
        if (res.success) {
          message.success('Topic deleted')
          refetch()
        } else {
          message.error(res.message)
        }
      },
    })
  }

  // Responsive grid styling for topic cards and skeleton loaders
  const responsiveGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  }

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <PageHeader
        title="KNOWLEDGE VAULT"
        subtitle="root@vault:~# ls ./topics"
        extra={
          <button
            type="button"
            onClick={() => setNewTopicOpen(true)}
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
            <PlusOutlined /> NEW TOPIC
          </button>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon={<FolderOutlined />}
          label="TOTAL TOPICS"
          value={stats?.totalTopics}
          color="#39ff6a"
          loading={statsLoading}
        />
        <StatCard
          icon={<FileTextOutlined />}
          label="TOTAL NOTES"
          value={stats?.totalNotes}
          color="#38bdf8"
          loading={statsLoading}
        />
        <StatCard
          icon={<TagsOutlined />}
          label="TOTAL TAGS"
          value={stats?.totalTags}
          color="#a78bfa"
          loading={statsLoading}
        />
        <StatCard
          icon={<CalendarOutlined />}
          label="LAST UPDATED"
          value={stats?.lastUpdated ? 'Recently' : '—'}
          color="#f5c542"
          loading={statsLoading}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: isMobile ? '100%' : 260, // 👈 Expands full width on mobile screens
            border: '2px var(--term-border) solid',
          }}
        />
      </div>

      {loading ? (
        <div style={responsiveGridStyle}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={130} borderRadius={10} />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--term-border)',
            borderRadius: 10,
            padding: 40,
            textAlign: 'center',
            color: 'var(--term-text-muted)',
          }}
        >
          No topics yet. Create one to start building your vault.
        </div>
      ) : (
        <div style={responsiveGridStyle}>
          {topics.map((topic, index) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              index={index}
              onOpen={handleOpenTopic}
              onEdit={setEditingTopic}
              onDelete={handleDeleteTopic}
            />
          ))}
        </div>
      )}

      <NewTopicModal
        open={newTopicOpen || !!editingTopic}
        onClose={() => {
          setNewTopicOpen(false)
          setEditingTopic(null)
        }}
        submitting={submitting}
        initialValues={
          editingTopic
            ? {
                name: editingTopic.name,
                description: editingTopic.description,
                color: editingTopic.color,
              }
            : null
        }
        onSubmit={
          editingTopic
            ? async (payload) => {
                const res = await editTopic(editingTopic._id, payload)
                if (res.success) refetch()
                return res
              }
            : handleCreateTopic
        }
      />
    </div>
  )
}

export default KnowledgeVaultPage
