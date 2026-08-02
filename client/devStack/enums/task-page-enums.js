export const TASK_STATUS = {
  BACKLOG: 'BACKLOG',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
}

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
}

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS)
export const TASK_PRIORITY_VALUES = Object.values(TASK_PRIORITY)

// ── Badge configs — same shape as ROLE_BADGE_CONFIG, feed straight into
//    <ReusableAntdTag config={...} status={record.status} /> ────────────────

export const TASK_STATUS_BADGE_CONFIG = {
  [TASK_STATUS.BACKLOG]: { label: 'BACKLOG', color: '#4da3ff' },
  [TASK_STATUS.IN_PROGRESS]: { label: 'IN PROGRESS', color: '#f5c542' },
  [TASK_STATUS.REVIEW]: { label: 'REVIEW', color: '#a855f7' },
  [TASK_STATUS.BLOCKED]: { label: 'BLOCKED', color: '#ef4444' },
  [TASK_STATUS.DONE]: { label: 'DONE', color: '#39ff6a' },
}

export const TASK_PRIORITY_BADGE_CONFIG = {
  [TASK_PRIORITY.LOW]: { label: 'LOW', color: '#64748b' },
  [TASK_PRIORITY.MEDIUM]: { label: 'MEDIUM', color: '#f59e0b' },
  [TASK_PRIORITY.HIGH]: { label: 'HIGH', color: '#f97316' },
  [TASK_PRIORITY.URGENT]: { label: 'URGENT', color: '#ef4444' },
}

// Dropdown option lists — feed straight into <Select options={...} />
export const TASK_STATUS_OPTIONS = TASK_STATUS_VALUES.map((v) => ({
  value: v,
  label: TASK_STATUS_BADGE_CONFIG[v].label,
}))

export const TASK_PRIORITY_OPTIONS = TASK_PRIORITY_VALUES.map((v) => ({
  value: v,
  label: TASK_PRIORITY_BADGE_CONFIG[v].label,
}))
