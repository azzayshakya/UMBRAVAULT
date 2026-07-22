const USER_STORAGE_KEY = 'azc_dashboard_user'

const mockDelay = (data, ms = 800) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })

const DUMMY_USER = {
  name: 'R4Z0R_7',
  role: 'SUPER ADMIN',
  clearanceLevel: 'OMEGA',
  accessLevel: 'ROOT',
  sessionId: 'AX71-K9L2-9QZ8',
  lastLogin: '16.07.2025 18:42:11',
  avatarUrl: null,
}

const DUMMY_SYSTEM_STATUS = [
  { id: 'uptime', label: 'Server Uptime', value: '23d 14h 27m', tone: 'ok' },
  { id: 'users', label: 'Active Users', value: 12, tone: 'ok' },
  { id: 'cpu', label: 'CPU Usage', value: '21%', tone: 'ok' },
  { id: 'ram', label: 'RAM Usage', value: '43%', tone: 'ok' },
  { id: 'threat', label: 'Threat Level', value: 'CRITICAL', tone: 'danger' },
]

const DUMMY_STATS = [
  {
    id: 'sessions',
    icon: 'skull',
    label: 'ACTIVE SESSIONS',
    value: '12',
    sub: '/ 256 Logged In',
    trend: [4, 6, 5, 8, 7, 9, 12],
    tone: 'ok',
  },
  {
    id: 'load',
    icon: 'server',
    label: 'SYSTEM LOAD',
    value: '21%',
    sub: 'Optimal',
    trend: [10, 14, 12, 16, 15, 18, 21],
    tone: 'ok',
  },
  {
    id: 'security',
    icon: 'shield',
    label: 'SECURITY SCORE',
    value: '87%',
    sub: 'Secure',
    trend: [70, 74, 78, 80, 83, 85, 87],
    tone: 'ok',
  },
  {
    id: 'breaches',
    icon: 'db',
    label: 'DATA BREACHES',
    value: '0',
    sub: 'Last 24h',
    trend: [0, 0, 0, 0, 0, 0, 0],
    tone: 'ok',
  },
  {
    id: 'threat-detection',
    icon: 'target',
    label: 'THREAT DETECTION',
    value: 'CRITICAL',
    sub: 'High Risk Activity',
    trend: [3, 5, 4, 9, 12, 18, 24],
    tone: 'danger',
  },
]

const DUMMY_LOGS = [
  {
    id: 1,
    time: '18:42:11',
    actor: 'ROOT@192.168.1.1',
    action: 'Login Successful',
    status: 'success',
  },
  { id: 2, time: '18:41:03', actor: 'FILE_ACCESS', action: '/etc/shadow', status: 'success' },
  {
    id: 3,
    time: '18:40:22',
    actor: 'FIREWALL_BYPASS',
    action: 'Attempt Blocked',
    status: 'warning',
  },
  {
    id: 4,
    time: '18:39:18',
    actor: 'DB_QUERY',
    action: 'Users Table Extracted',
    status: 'success',
  },
  { id: 5, time: '18:38:45', actor: 'PORT_SCAN', action: '192.168.1.0/24', status: 'complete' },
]

// Pool used only to keep the "live" feed feeling alive after mount.
const LOG_POOL = [
  { actor: 'AUTH_SERVICE', action: 'Token Refreshed', status: 'success' },
  { actor: 'INTRUSION_IDS', action: 'Suspicious Packet Flagged', status: 'warning' },
  { actor: 'BACKUP_DAEMON', action: 'Snapshot Complete', status: 'complete' },
  { actor: 'ROOT@10.0.0.4', action: 'Privilege Escalation', status: 'warning' },
  { actor: 'CRON_JOB', action: 'Cleanup Executed', status: 'success' },
]

// ---- Public API -------------------------------------------------------------

export const getUserInfo = async () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    const user = stored ? JSON.parse(stored) : DUMMY_USER
    return await mockDelay(user, 1200)
  } catch {
    // Corrupt/missing localStorage entry — fall back to the dummy user.
    return mockDelay(DUMMY_USER, 1200)
  }
}

export const getSystemStatus = async () =>
  mockDelay({ statusList: DUMMY_SYSTEM_STATUS, stats: DUMMY_STATS }, 900)

export const getServerLogs = async () => mockDelay(DUMMY_LOGS, 700)

export const getNextLiveLogEntry = () => {
  const template = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)]
  const now = new Date()
  const time = now.toTimeString().slice(0, 8)
  return { id: `${now.getTime()}`, time, ...template }
}
