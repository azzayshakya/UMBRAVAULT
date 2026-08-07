import {
  FolderOutlined,
  TagsOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import NewTopicModal from './components/Newnotemodal'
import TopicCard from './components/TopicCard'
import { useKnowledgeVaultApi } from './hooks/Useknowledgevaultapi'

const StatCard = ({ icon, label, value, color, loading }) => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      border: '1px solid var(--term-border)',
      borderRadius: 10,
      padding: '14px 16px',
      background: 'rgba(6, 18, 10, 0.4)',
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}22`,
        color,
        fontSize: 18,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ color: 'var(--term-text-muted)', fontSize: 11, letterSpacing: 1 }}>{label}</div>
      {loading ? (
        <Skeleton height={22} width={48} borderRadius={4} style={{ marginTop: 4 }} />
      ) : (
        <div style={{ color, fontSize: 22, fontWeight: 700 }}>{value ?? '—'}</div>
      )}
    </div>
  </div>
)

const KnowledgeVaultPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [newTopicOpen, setNewTopicOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)

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

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              color: 'var(--term-green)',
              fontSize: 24,
              letterSpacing: 2,
              margin: 0,
              textShadow: '0 0 10px rgba(57,255,106,0.35)',
            }}
          >
            KNOWLEDGE VAULT
          </h1>
          <p style={{ color: 'var(--term-text-muted)', fontSize: 12, marginTop: 4 }}>
            root@vault:~# ls ./topics
          </p>
        </div>

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
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
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
          style={{ width: 260 }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
