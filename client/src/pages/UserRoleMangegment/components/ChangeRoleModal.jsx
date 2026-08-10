import TerminalModal from '@devStack/components/Terminalmodal'
import { ASSIGNABLE_ROLES, ROLE_RANK, getRoleLabel } from '@devStack/enums/user-role-enums'
import { message } from 'antd'
import { useState } from 'react'

import { useUserManagementApi } from '../hooks/useUserManagementApi'

const ChangeRoleModal = ({ open, user, onClose, onRoleChanged }) => {
  const [selectedRole, setSelectedRole, updateError] = useState(user?.role)
  const { changeUserRole, submitting } = useUserManagementApi()

  if (!user) return null
  const isEscalation = ROLE_RANK[selectedRole] > ROLE_RANK[user.role]
  const isUnchanged = selectedRole === user.role

  const handleConfirm = async () => {
    const result = await changeUserRole(user._id, selectedRole)
    if (result.success) {
      onRoleChanged?.(user._id, selectedRole)
      onClose()
    } else {
      message.error(result.message || 'Failed to update role. Please try again.')
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
              color: 'var(--color-secondary)',
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
              border: `1px solid ${isEscalation ? '#ff3b3b' : 'var(--color-border-secondary)'}`,
              color: isEscalation ? '#ff3b3b' : 'var(--color-primary)',
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
          <span style={{ fontSize: 11, color: 'var(--color-secondary)', letterSpacing: 1 }}>
            TARGET
          </span>
          <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
            {user.username}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--color-secondary)', letterSpacing: 1 }}>
            CURRENT ROLE
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-primary-light)' }}>
            {getRoleLabel(user.role)}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ASSIGNABLE_ROLES.map((role) => {
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
                  border: `1px solid ${active ? 'var(--color-primary)' : 'var(--term-border)'}`,
                  background: active ? 'rgba(57, 255, 106, 0.14)' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-secondary)',
                  boxShadow: active ? '0 0 10px rgba(57,255,106,0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {getRoleLabel(role)}
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

        {updateError && (
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
            <span style={{ fontSize: 16, color: '#ff3b3b' }}>✕</span>
            <span style={{ fontSize: 10.5, color: '#ff8080', letterSpacing: 0.3, lineHeight: 1.4 }}>
              {updateError}
            </span>
          </div>
        )}
      </div>
    </TerminalModal>
  )
}

export default ChangeRoleModal
