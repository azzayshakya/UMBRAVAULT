const ROLES = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']

const HANDLE_PARTS = [
  'ghost',
  'cypher',
  'neo',
  'silent',
  'root',
  'data',
  'shadow',
  'alpha',
  'quantum',
  'zero',
  'phantom',
  'null',
  'byte',
  'crypt',
  'nova',
  'vortex',
  'raven',
  'glitch',
  'echo',
  'spectre',
]
const HANDLE_SUFFIX = [
  'hunter',
  'x',
  'admin',
  'codex',
  'access',
  'wraith',
  'protocol',
  'node',
  'core',
  'net',
  'io',
  'sys',
  'ops',
  'prime',
  'link',
  'grid',
  'flux',
]
const DOMAINS = ['secure.net', 'darknet.io', 'matrix.net', 'underground.net', 'quantum.net']
const LAST_LOGIN_OPTIONS = [
  '2 min ago',
  '15 min ago',
  '45 min ago',
  '1 hour ago',
  '3 hours ago',
  '5 hours ago',
  '1 day ago',
  '2 days ago',
  '5 days ago',
  '7 days ago',
]

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]

/** Deterministic-ish 200 dummy users for local dev while the users API isn't ready */
export const generateDummyUsers = (count = 200) => {
  return Array.from({ length: count }, (_, i) => {
    const username = `${randomFrom(HANDLE_PARTS)}_${randomFrom(HANDLE_SUFFIX)}`

    return {
      id: `USR_${String(i + 1).padStart(3, '0')}`,
      username,
      email: `${username}@${randomFrom(DOMAINS)}`,
      role: i === 0 ? 'SUPER_ADMIN' : randomFrom(ROLES),
      status: Math.random() > 0.15 ? 'ACTIVE' : 'INACTIVE',
      lastLogin: randomFrom(LAST_LOGIN_OPTIONS),
    }
  })
}
