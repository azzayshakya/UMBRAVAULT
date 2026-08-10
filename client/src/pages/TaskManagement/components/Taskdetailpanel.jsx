import {
  ClockCircleOutlined,
  DeleteOutlined,
  HistoryOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import ReusableAntdTag from '@devStack/components/AntdTag/ReusableAntdTag'
import TerminalModal from '@devStack/components/Terminalmodal'
import {
  TASK_PRIORITY_BADGE_CONFIG,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_BADGE_CONFIG,
  TASK_STATUS_OPTIONS,
} from '@devStack/enums/task-page-enums'
import { DatePicker, Input, Select, Tooltip } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const daysLeftLabel = (dueDate) => {
  if (!dueDate) return '—'
  const diff = dayjs(dueDate).startOf('day').diff(dayjs().startOf('day'), 'day')
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'due today'
  return `${diff} days left`
}

const selectVarStyle = {
  background: 'rgba(6, 18, 10, 0.6)',
  border: '1px solid var(--term-border)',
}

const TaskDetailPanel = ({
  task,
  onClose,
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  fetchActivity,
}) => {
  const [activity, setActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')

  useEffect(() => {
    if (!task?._id) return
    let cancelled = false
    setActivityLoading(true)
    fetchActivity(task._id).then((log) => {
      if (!cancelled) setActivity(log)
      setActivityLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [task?._id, fetchActivity])

  if (!task) return null

  const doneCount = task.subtasks?.filter((s) => s.isDone).length || 0
  const totalCount = task.subtasks?.length || 0
  const progressPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

  const handleAddSubtask = () => {
    const title = newSubtask.trim()
    if (!title) return
    onAddSubtask(task._id, title)
    setNewSubtask('')
  }

  const activityLogFooter = (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--color-primary)',
          fontSize: 11,
          letterSpacing: 1,
          marginBottom: 8,
        }}
      >
        <HistoryOutlined /> ACTIVITY LOG
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxHeight: 180,
          overflowY: 'auto',
          paddingRight: '10px', // Prevent scrollbar from clipping text
        }}
      >
        {activityLoading && (
          <span style={{ color: 'var(--color-secondary)', fontSize: 11 }}>reading log...</span>
        )}
        {!activityLoading && activity.length === 0 && (
          <span style={{ color: 'var(--color-secondary)', fontSize: 11 }}>no entries yet</span>
        )}
        {activity.map((entry) => (
          <div key={entry._id} style={{ fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ color: 'var(--color-primary-light)' }}>
              [{dayjs(entry.createdAt).format('YYYY-MM-DD HH:mm:ss')}]
            </div>
            <div
              style={{
                color: 'var(--color-secondary-hover)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {entry.message}
            </div>
            <div style={{ color: 'var(--color-secondary)' }}>
              by {entry.performedBy?.username || entry.performedBy?.name || 'system'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <TerminalModal
      open={!!task}
      onClose={onClose}
      title={task.taskCode || task._id?.slice(-6).toUpperCase()}
      prompt="root@mission-control:~# view"
      width={420}
      footer={activityLogFooter}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div
            style={{
              color: 'var(--color-secondary)',
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            {'>'} STATUS
          </div>
          <Select
            value={task.status}
            options={TASK_STATUS_OPTIONS}
            style={{ width: '100%' }}
            className="hacker-table"
            onChange={(v) => onStatusChange(task._id, v)}
            optionRender={(opt) => (
              <ReusableAntdTag config={TASK_STATUS_BADGE_CONFIG} status={opt.value} />
            )}
            labelRender={() => (
              <ReusableAntdTag config={TASK_STATUS_BADGE_CONFIG} status={task.status} />
            )}
          />
        </div>

        <div>
          <div
            style={{
              color: 'var(--color-secondary)',
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            {'>'} PRIORITY
          </div>
          <Select
            value={task.priority}
            options={TASK_PRIORITY_OPTIONS}
            style={{ width: '100%' }}
            onChange={(v) => onPriorityChange(task._id, v)}
            optionRender={(opt) => (
              <ReusableAntdTag config={TASK_PRIORITY_BADGE_CONFIG} status={opt.value} />
            )}
            labelRender={() => (
              <ReusableAntdTag config={TASK_PRIORITY_BADGE_CONFIG} status={task.priority} />
            )}
          />
        </div>

        <div>
          <div
            style={{
              color: 'var(--color-secondary)',
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            <ClockCircleOutlined /> DUE DATE
          </div>
          <DatePicker
            value={task.dueDate ? dayjs(task.dueDate) : null}
            style={{ width: '100%', ...selectVarStyle }}
            onChange={(d) => onDueDateChange(task._id, d ? d.toISOString() : null)}
          />
          <div style={{ color: 'var(--color-primary-light)', fontSize: 11, marginTop: 4 }}>
            {daysLeftLabel(task.dueDate)}
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--color-secondary)',
              fontSize: 11,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            <span>{'>'} SUBTASKS</span>
            <span style={{ color: 'var(--color-primary)' }}>
              {doneCount} / {totalCount}
            </span>
          </div>

          <div
            style={{
              height: 4,
              background: 'rgba(57,255,106,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: 'var(--color-primary)',
                boxShadow: '0 0 8px var(--color-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {task.subtasks?.map((s) => (
              <div
                key={s._id}
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}
              >
                <input
                  type="checkbox"
                  checked={s.isDone}
                  onChange={(e) => onToggleSubtask(task._id, s._id, e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <Tooltip title={s?.title}>
                  <span
                    style={{
                      flex: 1,
                      color: s.isDone ? 'var(--color-secondary)' : 'var(--color-secondary-hover)',
                      textDecoration: s.isDone ? 'line-through' : 'none',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.title}
                  </span>
                </Tooltip>
                <DeleteOutlined
                  style={{
                    color: 'var(--primitive-red-500)',
                    cursor: 'pointer',
                    fontSize: 11,
                    border: '1px var(--primitive-red-500) solid',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                  onClick={() => onDeleteSubtask(task._id, s._id)}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Input
              size="small"
              placeholder="add subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onPressEnter={handleAddSubtask}
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              style={{
                border: '1px solid var(--term-border)',
                background: 'transparent',
                color: 'var(--color-primary)',
                borderRadius: 5,
                padding: '0 8px',
                cursor: 'pointer',
              }}
            >
              <PlusOutlined style={{ fontSize: 11 }} />
            </button>
          </div>
        </div>
      </div>
    </TerminalModal>
  )
}

export default TaskDetailPanel
