import {
  CheckCircleOutlined,
  ClearOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import ReusableAntdTag from '@devStack/components/AntdTag/ReusableAntdTag'
import PageHeader from '@devStack/components/PageHeader'
import { StatCard } from '@devStack/components/StateCard'
import CrudTable from '@devStack/components/table/CrudTable'
import { Theme } from '@devStack/constants/theme-constants'
import {
  TASK_PRIORITY_BADGE_CONFIG,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_BADGE_CONFIG,
  TASK_STATUS_OPTIONS,
} from '@devStack/enums/task-page-enums'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import NewTaskModal from './components/Newtaskmodal'
import TaskDetailPanel from './components/Taskdetailpanel'
import { useTaskManagementApi } from './hooks/Usetaskmanagementapi'

const TaskManagementPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState()
  const [priority, setPriority] = useState()
  const [project, setProject] = useState()
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK
  const isMobile = useIsMobile()

  const filters = useMemo(
    () => ({ search: search || undefined, status, priority, project }),
    [search, status, priority, project]
  )

  const {
    tasks,
    total,
    stats,
    loading,
    submitting,
    refetch,
    addTask,
    editTask,
    removeTask,
    addTaskSubtask,
    toggleSubtask,
    removeSubtask,
    fetchActivity,
  } = useTaskManagementApi(filters, paramObj)

  const selectedTask = tasks?.find((t) => t._id === selectedTaskId) || null

  const clearFilters = () => {
    setSearch('')
    setStatus(undefined)
    setPriority(undefined)
    setProject(undefined)
  }

  const handleDelete = async (taskId) => {
    const res = await removeTask(taskId)
    if (res.success) {
      if (selectedTaskId === taskId) setSelectedTaskId(null)
      refetch()
    }
  }

  const actionBtnStyle = {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm, 6px)',
    background: isDark ? 'rgba(57, 255, 106, 0.06)' : 'var(--color-bg-hover)',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 95,
      render: (v) => (
        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          #{v?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      title: ':TITLE',
      dataIndex: 'title',
      key: 'title',
      width: 240,
      render: (v, record) => (
        <div>
          <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{v}</div>
          {record.description && (
            <div
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: ':PROJECT',
      dataIndex: 'project',
      key: 'project',
      width: 130,
      render: (v) => <span style={{ color: 'var(--color-text-secondary)' }}>{v || '—'}</span>,
    },
    {
      title: ':STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (v) => <ReusableAntdTag config={TASK_STATUS_BADGE_CONFIG} status={v} />,
    },
    {
      title: ':PRIORITY',
      dataIndex: 'priority',
      key: 'priority',
      width: 130,
      render: (v) => <ReusableAntdTag config={TASK_PRIORITY_BADGE_CONFIG} status={v} />,
    },
    {
      title: ':DUE DATE',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (v) => (
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
          {v ? dayjs(v).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: ':TAGS',
      dataIndex: 'tags',
      key: 'tags',
      width: 170,
      render: (tags) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tags?.map((t) => (
            <Tag
              key={t}
              style={{
                background: isDark ? 'transparent' : 'var(--primitive-gray-50)',
                borderColor: isDark ? 'var(--term-border)' : 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm, 4px)',
                fontFamily: 'var(--term-font, monospace)',
              }}
            >
              {t}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 90,
      fixed: isMobile ? false : 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={actionBtnStyle}
            onClick={() => setSelectedTaskId(record._id)}
            aria-label="View task details"
          >
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button
            style={{
              ...actionBtnStyle,
              color: 'var(--color-error)',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#fee2e2',
              background: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
            }}
            onClick={() => handleDelete(record._id)}
            aria-label="Delete task"
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <PageHeader
      title="TASK MANAGEMENT"
      subtitle="root@mission-control → tail -f ./tasks"
      icon={<UnorderedListOutlined />}
    >
      {/* 1. Stat Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          icon={<UnorderedListOutlined />}
          label="TOTAL TASKS"
          value={stats?.total}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={<ThunderboltOutlined />}
          label="IN PROGRESS"
          value={stats?.inProgress}
          color="#f5c542"
          loading={loading}
        />
        <StatCard
          icon={<LockOutlined />}
          label="BLOCKED"
          value={stats?.blocked}
          color="var(--color-error)"
          loading={loading}
        />
        <StatCard
          icon={<CheckCircleOutlined />}
          label="DONE"
          value={stats?.done}
          color={isDark ? 'var(--term-green)' : 'var(--primitive-emerald-500)'}
          loading={loading}
        />
        <StatCard
          icon={<WarningOutlined />}
          label="OVERDUE"
          value={stats?.overdue}
          color="#f97316"
          loading={loading}
        />
      </div>

      {/* 2. Table Section Card */}
      <div
        style={{
          border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
          borderRadius: 'var(--term-radius, 10px)',
          padding: isMobile ? 14 : 20,
          background: 'var(--color-bg-container)',
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Table Controls Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              color: 'var(--color-primary)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            TASKS // TABLE VIEW
          </span>

          <button
            type="button"
            onClick={() => setNewTaskOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: isDark ? '1px solid var(--term-border)' : '1px solid rgba(6, 95, 70, 0.25)',
              background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.45)',
              color: isDark ? 'var(--term-green)' : '#065f46',
              borderRadius: 'var(--radius, 8px)',
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              fontFamily: 'var(--term-font, monospace)',
              transition: 'all 0.15s ease',
            }}
          >
            <PlusOutlined /> NEW TASK
          </button>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 18,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
          }}
        >
          <Input
            prefix={
              <SearchOutlined
                style={{ color: isDark ? 'var(--term-green)' : 'var(--color-primary)' }}
              />
            }
            placeholder="Search tasks..."
            value={search}
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: isMobile ? '100%' : 200,
              borderRadius: 'var(--radius, 8px)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
              background: 'var(--color-bg-container)',
              color: 'var(--color-text)',
              fontFamily: 'var(--term-font, monospace)',
            }}
          />
          <Select
            placeholder="ALL STATUS"
            allowClear
            value={status}
            options={TASK_STATUS_OPTIONS}
            onChange={setStatus}
            style={{
              width: isMobile ? '100%' : 140,
            }}
          />
          <Select
            placeholder="ALL PRIORITY"
            allowClear
            value={priority}
            options={TASK_PRIORITY_OPTIONS}
            onChange={setStatus}
            style={{
              width: isMobile ? '100%' : 140,
            }}
          />
          <Input
            placeholder="Project..."
            allowClear
            value={project}
            onChange={(e) => setProject(e.target.value || undefined)}
            style={{
              width: isMobile ? '100%' : 140,
              borderRadius: 'var(--radius, 8px)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
              background: 'var(--color-bg-container)',
              color: 'var(--color-text)',
              fontFamily: 'var(--term-font, monospace)',
            }}
          />
          <button
            type="button"
            onClick={clearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              border: isDark
                ? '1px solid var(--color-border-secondary)'
                : '1px solid var(--color-border)',
              background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius, 8px)',
              padding: '6px 18px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
              transition: 'all 0.15s ease',
            }}
          >
            <ClearOutlined /> CLEAR
          </button>
        </div>

        {/* Table View */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <CrudTable
            tableData={tasks}
            columns={columns}
            loading={loading}
            paramObj={{ ...paramObj, total }}
            setParamObj={setParamObj}
            setRefreshCounter={() => refetch()}
            scroll={{ x: 950 }}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={(id, v) => editTask(id, { status: v }).then(refetch)}
          onPriorityChange={(id, v) => editTask(id, { priority: v }).then(refetch)}
          onDueDateChange={(id, v) => editTask(id, { dueDate: v }).then(refetch)}
          onAddSubtask={(id, t) => addTaskSubtask(id, t).then(refetch)}
          onToggleSubtask={(id, subId, done) => toggleSubtask(id, subId, done).then(refetch)}
          onDeleteSubtask={(id, subId) => removeSubtask(id, subId).then(refetch)}
          fetchActivity={fetchActivity}
        />
      )}

      <NewTaskModal
        open={newTaskOpen}
        onClose={() => setNewTaskOpen(false)}
        onCreate={addTask}
        submitting={submitting}
      />
    </PageHeader>
  )
}

export default TaskManagementPage
