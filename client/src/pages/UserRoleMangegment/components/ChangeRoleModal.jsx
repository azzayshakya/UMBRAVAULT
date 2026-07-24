import { useState } from 'react'

import TerminalModal from '@devStack/components/Terminalmodal'
import { updateUserRole } from '@devStack/apiServices/user-api'

const ROLES = ['user', 'admin', 'superadmin']
const ROLE_RANK = { USER: 0, MODERATOR: 1, ADMIN: 2, SUPER_ADMIN: 3 }

const ChangeRoleModal = ({ open, user, onClose, onRoleChanged }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role)
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  const isEscalation = ROLE_RANK[selectedRole] > ROLE_RANK[user.role]
  const isUnchanged = selectedRole === user.role

  const handleConfirm = async () => {
    setSubmitting(true)
    const res = await updateUserRole(user.id, selectedRole)
    setSubmitting(false)
    if (res?.success !== false) {
      onRoleChanged?.(user.id, selectedRole)
      onClose()
    }
  }

  return (
    <TerminalModal
      open={open}
      onClose={onClose}
      title="MODIFY ACCESS LEVEL"
      prompt="root@access-control:~#"
      width={440}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--term-border)',
              color: 'var(--term-text-muted)',
              fontFamily: 'var(--term-font)',
              fontSize: 11,
              letterSpacing: 1,
              padding: '8px 16px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            ABORT
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || isUnchanged}
            style={{
              background: isEscalation ? 'rgba(255, 59, 59, 0.12)' : 'rgba(57, 255, 106, 0.12)',
              border: `1px solid ${isEscalation ? '#ff3b3b' : 'var(--term-border-strong)'}`,
              color: isEscalation ? '#ff3b3b' : 'var(--term-green)',
              fontFamily: 'var(--term-font)',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1,
              padding: '8px 18px',
              borderRadius: 6,
              cursor: submitting || isUnchanged ? 'not-allowed' : 'pointer',
              opacity: submitting || isUnchanged ? 0.5 : 1,
              boxShadow: isEscalation
                ? '0 0 14px rgba(255,59,59,0.35)'
                : '0 0 14px rgba(57,255,106,0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            {submitting ? 'EXECUTING...' : 'EXECUTE CHANGE'}
          </button>
        </div>
      }
    >
      <style>{`
        @keyframes pulse-warn {
          0%, 100% { opacity: 1; text-shadow: 0 0 6px #ff3b3b; }
          50% { opacity: 0.35; text-shadow: none; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--term-text-muted)', letterSpacing: 1 }}>
            TARGET
          </span>
          <span style={{ fontSize: 13, color: 'var(--term-green)', fontWeight: 600 }}>
            {user.username}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--term-text-muted)', letterSpacing: 1 }}>
            CURRENT ROLE
          </span>
          <span style={{ fontSize: 12, color: 'var(--term-green-dim)' }}>{user.role}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ROLES.map((role) => {
            const active = role === selectedRole
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '7px 12px',
                  fontSize: 11,
                  fontFamily: 'var(--term-font)',
                  letterSpacing: 0.5,
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: `1px solid ${active ? 'var(--term-green)' : 'var(--term-border)'}`,
                  background: active ? 'rgba(57, 255, 106, 0.14)' : 'transparent',
                  color: active ? 'var(--term-green)' : 'var(--term-text-muted)',
                  boxShadow: active ? '0 0 10px rgba(57,255,106,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {role}
              </button>
            )
          })}
        </div>

        {isEscalation && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              border: '1px solid rgba(255, 59, 59, 0.5)',
              background: 'rgba(255, 59, 59, 0.08)',
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 16, color: '#ff3b3b', animation: 'pulse-warn 1.2s infinite' }}>
              ⚠
            </span>
            <span style={{ fontSize: 10.5, color: '#ff8080', letterSpacing: 0.3, lineHeight: 1.4 }}>
              PRIVILEGE ESCALATION — ACTION WILL BE LOGGED
            </span>
          </div>
        )}
      </div>
    </TerminalModal>
  )
}

export default ChangeRoleModal
