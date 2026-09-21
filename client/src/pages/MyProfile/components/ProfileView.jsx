import React, { useState } from 'react'
import { useUserProfileApi } from './hooks/useUserProfileApi'
import { PasswordManagementModal } from './PasswordManagementModal'

export const ProfileView = () => {
  const { profile, loading, updating, updateProfile } = useUserProfileApi()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [fullName, setFullName] = useState('')

  React.useEffect(() => {
    if (profile?.name) {
      setFullName(profile.name)
    }
  }, [profile])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    await updateProfile({ name: fullName })
  }

  if (loading) {
    return (
      <div className="p-8 font-mono text-[var(--term-green)] flex items-center gap-3">
        <span className="animate-spin text-lg">⠋</span>
        <span>ACQUIRING_ENTITY_STATE...</span>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl font-mono text-[var(--color-text)]">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-6">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[var(--term-green)] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--term-green)] animate-ping" />
            OPERATOR_PROFILE // {profile?.email || 'ANONYMOUS'}
          </h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">UMBRA_VAULT // CORE_SECURITY</p>
        </div>

        {/* Security Access Button */}
        <button
          type="button"
          onClick={() => setIsPasswordModalOpen(true)}
          className="cursor-pointer text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-sm border border-[var(--term-border)] bg-[var(--term-bg-panel)] text-[var(--term-green)] hover:border-[var(--term-green)] hover:shadow-[var(--term-glow)] transition-all flex items-center gap-2"
        >
          <span className="text-[10px]">#KEY</span>
          <span>SEC_CREDENTIALS</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase text-[var(--color-text-muted)] mb-1">
            // OPERATOR_IDENTIFIER (NAME)
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={updating}
            className="w-full bg-[var(--color-bg-container)] text-[var(--color-text)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-xs focus:border-[var(--term-green)] focus:shadow-[var(--term-glow)] outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[var(--color-text-muted)] mb-1">
            // COMMUNICATION_ENDPOINT (EMAIL)
          </label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="w-full bg-[var(--term-bg-panel)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-sm px-3 py-2 text-xs cursor-not-allowed opacity-75"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 bg-[var(--color-bg-container)] border border-[var(--term-green)] text-[var(--term-green)] hover:bg-[var(--color-bg-hover)] shadow-[var(--term-glow)] rounded-sm text-xs cursor-pointer transition-all disabled:opacity-50"
          >
            {updating ? 'APPLYING_STATE...' : 'SAVE_PROFILE [↵]'}
          </button>
        </div>
      </form>

      {/* Password Management Modal */}
      <PasswordManagementModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={profile?.email}
      />
    </div>
  )
}
