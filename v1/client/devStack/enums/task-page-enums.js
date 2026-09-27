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
  [TASK_STATUS.BACKLOG]: {
    label: 'BACKLOG',
    color: 'blue',
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: 'IN PROGRESS',
    color: 'cyan',
  },
  [TASK_STATUS.REVIEW]: {
    label: 'REVIEW',
    color: 'gold',
  },
  [TASK_STATUS.BLOCKED]: {
    label: 'BLOCKED',
    color: 'volcano',
  },
  [TASK_STATUS.DONE]: {
    label: 'DONE',
    color: 'green',
  },
}

export const TASK_PRIORITY_BADGE_CONFIG = {
  [TASK_PRIORITY.LOW]: {
    label: 'LOW',
    color: 'default',
  },
  [TASK_PRIORITY.MEDIUM]: {
    label: 'MEDIUM',
    color: 'gold',
  },
  [TASK_PRIORITY.HIGH]: {
    label: 'HIGH',
    color: 'orange',
  },
  [TASK_PRIORITY.URGENT]: {
    label: 'URGENT',
    color: 'red',
  },
}
export const TASK_STATUS_OPTIONS = TASK_STATUS_VALUES.map((v) => ({
  value: v,
  label: TASK_STATUS_BADGE_CONFIG[v].label,
}))

export const TASK_PRIORITY_OPTIONS = TASK_PRIORITY_VALUES.map((v) => ({
  value: v,
  label: TASK_PRIORITY_BADGE_CONFIG[v].label,
}))
