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
  border: '1px solid #d1fae5',
  borderRadius: 6,
  background: '#f0fdf4',
  color: '#059669',
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

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 95,
      render: (v) => (
        <span style={{ color: '#059669', fontWeight: 600 }}>#{v?.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      title: ':TITLE',
      dataIndex: 'title',
      key: 'title',
      width: 240,
      render: (v, record) => (
        <div>
          <div style={{ color: '#065f46', fontWeight: 700 }}>{v}</div>
          {record.description && (
            <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: ':PROJECT',
      dataIndex: 'project',
      key: 'project',
      width: 130,
      render: (v) => <span style={{ color: '#475569' }}>{v || '—'}</span>,
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
        <span style={{ color: '#475569', fontSize: 12 }}>
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
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                color: '#475569',
                borderRadius: 4,
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
          <button style={actionBtnStyle} onClick={() => setSelectedTaskId(record._id)}>
            <EyeOutlined style={{ fontSize: 12 }} />
          </button>
          <button
            style={{
              ...actionBtnStyle,
              color: '#ef4444',
              borderColor: '#fee2e2',
              background: '#fef2f2',
            }}
            onClick={() => handleDelete(record._id)}
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
          color="#ef4444"
          loading={loading}
        />
        <StatCard
          icon={<CheckCircleOutlined />}
          label="DONE"
          value={stats?.done}
          color="green"
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
          border: '1.5px solid #d1fae5',
          borderRadius: 16,
          padding: isMobile ? 14 : 20,
          background: '#ffffff',
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
              color: '#065f46',
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
              border: '1.5px solid #10b981',
              background: '#ecfdf5',
              color: '#047857',
              borderRadius: 8,
              padding: '7px 16px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
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
            prefix={<SearchOutlined style={{ color: '#059669' }} />}
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: isMobile ? '100%' : 200,
              borderRadius: 8,
              borderColor: '#a7f3d0',
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
            onChange={setPriority}
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
              borderRadius: 8,
              borderColor: '#a7f3d0',
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
              border: '1px solid #a7f3d0',
              background: '#f0fdf4',
              color: '#047857',
              borderRadius: 8,
              padding: '6px 18px',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
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
