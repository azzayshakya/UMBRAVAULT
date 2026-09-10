import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  CompassOutlined,
} from '@ant-design/icons'
import EmptyState from '@devStack/components/EmptyState/EmptyState'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { StatCard } from '@devStack/components/StateCard'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Tag } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { EditProfileForm } from './components/EditProfileForm'
import { useUserProfileApi } from './hooks/useUserProfileApi'

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { profile, loading, updating, error, refetch, updateProfile } = useUserProfileApi()
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const handleUpdate = async (formData) => {
    const res = await updateProfile(formData)
    if (res.success) {
      setIsEditing(false)
    }
  }

  return (
    <PageHeader
      title="USER PROFILE"
      subtitle="root@auth:~# cat /proc/user_profile --extended"
      icon={<UserOutlined />}
      extra={
        !isEditing && profile ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 'var(--radius, 8px)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid rgba(6, 95, 70, 0.25)',
              background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.45)',
              color: isDark ? 'var(--term-green)' : '#065f46',
              fontFamily: 'var(--term-font, monospace)',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)',
            }}
          >
            <EditOutlined /> EDIT PROFILE
          </button>
        ) : null
      }
    >
      {/* 1. Loading State */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={100} borderRadius={10} />
            ))}
          </div>
          <Skeleton height={320} borderRadius={12} />
        </div>
      ) : error ? (
        /* 2. Error State */
        <EmptyState variant="error" description={error} actionText="RETRY" onAction={refetch} />
      ) : isEditing ? (
        /* 3. Editing View */
        <div
          style={{
            background: 'var(--color-bg-container)',
            border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
            borderRadius: 'var(--term-radius, 10px)',
            padding: 24,
            maxWidth: 820,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: 1 }}>
              EDIT_PROFILE // FORM
            </span>
          </div>
          <EditProfileForm
            initialValues={profile}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitting={updating}
          />
        </div>
      ) : (
        /* 4. Display Profile View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Activity Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            <StatCard
              icon={<CompassOutlined />}
              label="TOTAL SESSIONS"
              value={profile?.stats?.sessions ?? 0}
              color={isDark ? 'var(--term-green)' : 'var(--primitive-emerald-500)'}
            />
            <StatCard
              icon={<ProjectOutlined />}
              label="PROJECTS ACCESSED"
              value={profile?.stats?.projects ?? 0}
              color="#38bdf8"
            />
            <StatCard
              icon={<CheckCircleOutlined />}
              label="TASKS COMPLETED"
              value={profile?.stats?.tasksCompleted ?? 0}
              color="#a78bfa"
            />
          </div>

          {/* Profile Card & Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {/* Identity Card */}
            <div
              style={{
                background: 'var(--color-bg-container)',
                border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
                borderRadius: 'var(--term-radius, 10px)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={profile?.avatar || '/images/global/my-profile.jpg'}
                  alt="Profile"
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-primary)',
                    boxShadow: 'var(--color-glow)',
                  }}
                />
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {profile?.name}
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    @{profile?.username}
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-primary)',
                      fontSize: 11,
                    }}
                  >
                    <SafetyCertificateOutlined /> {profile?.role}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
                <div
                  style={{ color: 'var(--color-text-secondary)', fontSize: 11, marginBottom: 6 }}
                >
                  BIOGRAPHY
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)' }}>
                  {profile?.bio || 'No bio entered yet.'}
                </p>
              </div>

              <div>
                <div
                  style={{ color: 'var(--color-text-secondary)', fontSize: 11, marginBottom: 8 }}
                >
                  EXPERTISE & TAGS
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {profile?.interests?.map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        background: 'transparent',
                        borderColor: isDark ? 'var(--term-border)' : 'var(--color-border)',
                        color: 'var(--color-primary)',
                        borderRadius: 6,
                        fontFamily: 'var(--term-font, monospace)',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Information Table */}
            <div
              style={{
                background: 'var(--color-bg-container)',
                border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
                borderRadius: 'var(--term-radius, 10px)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 16,
                  }}
                >
                  ACCOUNT // CONTACT DATA
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { icon: <MailOutlined />, label: 'EMAIL', value: profile?.email },
                    {
                      icon: <PhoneOutlined />,
                      label: 'MOBILE',
                      value: profile?.phone || 'Not configured',
                    },
                    {
                      icon: <UserOutlined />,
                      label: 'USER ID',
                      value: `#${profile?._id?.slice(-6).toUpperCase()}`,
                    },
                    {
                      icon: <SafetyCertificateOutlined />,
                      label: 'ACCOUNT STATUS',
                      value: 'VERIFIED / ACTIVE',
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--color-bg-hover)',
                        borderRadius: 'var(--radius, 8px)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {row.icon}
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>
                          {row.label}
                        </span>
                      </div>
                      <span
                        style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 600 }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 12,
                }}
              >
                &gt; Security: Changes require verification on critical attributes.
              </div>
            </div>
          </div>
        </div>
      )}
    </PageHeader>
  )
}

export default MyProfile
