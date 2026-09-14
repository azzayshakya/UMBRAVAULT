import {
  FolderOutlined,
  TagsOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import EmptyState from '@devStack/components/EmptyState/EmptyState'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { StatCard } from '@devStack/components/StateCard'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, message, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import NewTopicModal from './components/Newnotemodal'
import TopicCard from './components/TopicCard'
import { useKnowledgeVaultApi } from './hooks/Useknowledgevaultapi'

const KnowledgeVaultPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [newTopicOpen, setNewTopicOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK
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

  const responsiveGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
  }

  return (
    <PageHeader
      title="KNOWLEDGE VAULT"
      subtitle="root@vault:~# ls -la ./topics"
      icon={<FolderOutlined />}
      extra={
        <button
          type="button"
          onClick={() => setNewTopicOpen(true)}
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
          <PlusOutlined /> NEW TOPIC
        </button>
      }
    >
      {/* 1. Stat Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          icon={<FolderOutlined />}
          label="TOTAL TOPICS"
          value={stats?.totalTopics}
          color={isDark ? 'var(--term-green)' : 'var(--primitive-emerald-500)'}
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
          value={stats?.lastUpdated ? 'NA' : '—'}
          color="#f5c542"
          loading={statsLoading}
        />
      </div>

      {/* 2. Search & Filter Bar */}
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
              style={{ color: isDark ? 'var(--term-green)' : 'var(--color-primary)' }}
            />
          }
          placeholder="Search topics..."
          value={search}
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: isMobile ? '100%' : 280,
            borderRadius: 'var(--radius, 8px)',
            border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            background: 'var(--color-bg-container)',
            color: 'var(--color-text)',
            fontFamily: 'var(--term-font, monospace)',
          }}
        />
      </div>

      {/* 3. Topics Grid / Empty State */}
      {loading ? (
        <div style={responsiveGridStyle}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={130} borderRadius={10} />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <EmptyState
          variant={search ? 'search' : 'default'}
          query={search}
          actionText={search ? 'Clear Search' : 'CREATE TOPIC'}
          onAction={search ? () => setSearch('') : () => setNewTopicOpen(true)}
          secondaryActionText={search ? 'Create Topic' : undefined}
          onSecondaryAction={search ? () => setNewTopicOpen(true) : undefined}
        />
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

      {/* 4. Modals */}
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
    </PageHeader>
  )
}

export default KnowledgeVaultPage
