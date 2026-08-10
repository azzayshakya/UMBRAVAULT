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
import {
  TASK_PRIORITY_BADGE_CONFIG,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_BADGE_CONFIG,
  TASK_STATUS_OPTIONS,
} from '@devStack/enums/task-page-enums'
import { useIsMobile } from '@devStack/utils/useIsMobile'
import { Input, Select, Tag } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import NewTaskModal from './components/Newtaskmodal'
import TaskDetailPanel from './components/Taskdetailpanel'
import { useTaskManagementApi } from './hooks/Usetaskmanagementapi'

const actionBtnStyle = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--term-border)',
  borderRadius: 5,
  background: 'transparent',
  color: 'var(--color-primary)',
  cursor: 'pointer',
}

const TaskManagementPage = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState()
  const [priority, setPriority] = useState()
  const [project, setProject] = useState()
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [paramObj, setParamObj] = useState({ limit: 10, offset: 0, total: 0 })

  const isMobile = useIsMobile() // 👈 Track mobile breakpoint (768px default)

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

  const selectedTask = tasks.find((t) => t._id === selectedTaskId) || null

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

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 90,
      render: (v) => (
        <span style={{ color: 'var(--color-primary)' }}>#{v.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      title: ':TITLE',
      dataIndex: 'title',
      key: 'title',
      width: 220, // Added fixed width so table respects scrolling bounds on mobile
      render: (v, record) => (
        <div>
          <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{v}</div>
          {record.description && (
            <div style={{ color: 'var(--color-secondary)', fontSize: 11 }}>
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
      width: 140,
      render: (v) => <span style={{ color: 'var(--color-secondary)' }}>{v || '—'}</span>,
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
        <span style={{ color: 'var(--color-secondary)', fontSize: 12 }}>
          {v ? dayjs(v).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: ':TAGS',
      dataIndex: 'tags',
      key: 'tags',
      width: 180,
      render: (tags) => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tags?.map((t) => (
            <Tag
              key={t}
              style={{
                background: 'transparent',
                borderColor: 'var(--term-border)',
                color: 'var(--color-secondary)',
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
      fixed: isMobile ? false : 'right', // Freeze actions column on desktop for better usability
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={actionBtnStyle} onClick={() => setSelectedTaskId(record._id)}>
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button
            style={{ ...actionBtnStyle, color: '#ef4444' }}
            onClick={() => handleDelete(record._id)}
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ fontFamily: 'var(--term-font)' }}>
      <PageHeader
        title="TASK MANAGEMENT"
        titleStyle={{ letterSpacing: 2 }}
        subtitle="root@mission-control:~# tail -f ./tasks"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon={<UnorderedListOutlined />}
          label="TOTAL TASKS"
          value={stats?.total}
          color="#d6ffe4"
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
          color="#ef4444"
          loading={loading}
        />
        <StatCard
          icon={<CheckCircleOutlined />}
          label="DONE"
          value={stats?.done}
          color="#39ff6a"
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

      {/* Main Table Container */}
      <div
        style={{
          border: '1px solid var(--term-border)',
          borderRadius: 10,
          padding: isMobile ? 12 : 20, // Adjust padding automatically for mobile screens
          background: 'var(--color-bg-container)',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <span style={{ color: 'var(--color-secondary)', fontSize: 12, letterSpacing: 1 }}>
            TASKS // TABLE VIEW
          </span>
          <button
            type="button"
            onClick={() => setNewTaskOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid var(--color-border-secondary)',
              background: 'rgba(57,255,106,0.08)',
              color: 'var(--color-primary)',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            <PlusOutlined /> NEW TASK
          </button>
        </div>

        {/* Filter Controls Row: Fluid widths on mobile */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'stretch' : 'flex-end',
          }}
        >
          <Input
            prefix={<SearchOutlined style={{ color: 'var(--color-primary-light)' }} />}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: isMobile ? '100%' : 200, border: '2px var(--term-border) solid' }}
          />
          <Select
            placeholder="ALL STATUS"
            allowClear
            value={status}
            options={TASK_STATUS_OPTIONS}
            onChange={setStatus}
            style={{ width: isMobile ? '100%' : 150, border: '2px var(--term-border) solid' }}
          />
          <Select
            placeholder="ALL PRIORITY"
            allowClear
            value={priority}
            options={TASK_PRIORITY_OPTIONS}
            onChange={setPriority}
            style={{ width: isMobile ? '100%' : 150, border: '2px var(--term-border) solid' }}
          />
          <Input
            placeholder="Project..."
            allowClear
            value={project}
            onChange={(e) => setProject(e.target.value || undefined)}
            style={{ width: isMobile ? '100%' : 150, border: '2px var(--term-border) solid' }}
          />
          <button
            type="button"
            onClick={clearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              border: '1px solid var(--color-border-secondary)',
              background: 'rgba(57,255,106,0.08)',
              color: 'var(--color-primary)',
              borderRadius: 6,
              padding: '6px 25px',
              fontSize: 12,
              letterSpacing: 1,
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <ClearOutlined /> CLEAR
          </button>
        </div>

        {/* CrudTable wrapper with built-in Ant Design horizontal overflow handling */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <CrudTable
            tableData={tasks}
            columns={columns}
            loading={loading}
            paramObj={{ ...paramObj, total }}
            setParamObj={setParamObj}
            setRefreshCounter={() => refetch()}
            scroll={{ x: 900 }} // 👈 Forces the table to enable fluid horizontal scrolling on mobile screens
          />
        </div>
      </div>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={(id, v) => editTask(id, { status: v }).then(refetch)}
          onPriorityChange={(id, v) => editTask(id, { priority: v }).then(refetch)}
          onDueDateChange={(id, v) => editTask(id, { dueDate: v }).then(refetch)}
          onAddSubtask={(id, title) => addTaskSubtask(id, title).then(refetch)}
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
    </div>
  )
}

export default TaskManagementPage
