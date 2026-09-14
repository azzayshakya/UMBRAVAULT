import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  InstagramOutlined,
  CodeOutlined,
  CopyOutlined,
  ExportOutlined,
  CalendarOutlined,
  IdcardOutlined,
  LinkOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import EmptyState from '@devStack/components/EmptyState/EmptyState'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { StatCard } from '@devStack/components/StateCard'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Tag, Tooltip, message } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { EditProfileForm } from './components/EditProfileForm'
import { useUserProfileApi } from './hooks/useUserProfileApi'

const SOCIAL_NETWORKS = [
  {
    key: 'github',
    label: 'GitHub',
    icon: <GithubOutlined />,
    field: 'github',
    brandColor: '#38bdf8',
    formatUrl: (u) => `https://github.com/${u}`,
  },
  {
    key: 'leetcode',
    label: 'LeetCode',
    icon: <CodeOutlined />,
    field: 'leetcode',
    brandColor: '#f59e0b',
    formatUrl: (u) => `https://leetcode.com/${u}`,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: <LinkedinOutlined />,
    field: 'linkedin',
    brandColor: '#0ea5e9',
    formatUrl: (u) => `https://linkedin.com/in/${u}`,
  },
  {
    key: 'twitter',
    label: 'X / Twitter',
    icon: <TwitterOutlined />,
    field: 'twitter',
    brandColor: '#a78bfa',
    formatUrl: (u) => `https://twitter.com/${u}`,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: <InstagramOutlined />,
    field: 'instagram',
    brandColor: '#ec4899',
    formatUrl: (u) => `https://instagram.com/${u}`,
  },
]

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const { profile, loading, updating, error, refetch, updateProfile } = useUserProfileApi()

  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const handleUpdate = async (formData) => {
    const res = await updateProfile(formData)
    if (res?.success) {
      setIsEditing(false)
    }
  }

  const copyToClipboard = (text, label) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    message.success(`${label} copied to clipboard`)
  }

  const handlePlatformClick = (platform, handle) => {
    if (!handle) {
      message.info({
        content: `${platform.label} link not provided yet. Click "Edit Profile" to connect your handle.`,
        icon: <InfoCircleOutlined style={{ color: 'var(--color-primary)' }} />,
      })
      return
    }
    window.open(platform.formatUrl(handle), '_blank', 'noopener,noreferrer')
  }

  const userSocialLinks = profile?.socialLinks || {}

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
              padding: '8px 20px',
              borderRadius: 'var(--radius, 8px)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-primary)',
              background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-primary)',
              color: isDark ? 'var(--term-green)' : '#ffffff',
              fontFamily: 'var(--term-font, monospace)',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: isDark ? 'var(--term-glow)' : 'var(--color-glow)',
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
          <Skeleton height={180} borderRadius={16} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={90} borderRadius={10} />
            ))}
          </div>
          <Skeleton height={320} borderRadius={16} />
        </div>
      ) : error ? (
        /* 2. Error Fallback */
        <EmptyState variant="error" description={error} actionText="RETRY" onAction={refetch} />
      ) : isEditing ? (
        /* 3. Modern Edit Mode */
        <div
          style={{
            background: 'var(--color-bg-container)',
            border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
            borderRadius: 16,
            padding: 28,
            maxWidth: 860,
            margin: '0 auto',
            width: '100%',
            boxShadow: isDark ? 'var(--term-glow)' : '0 12px 32px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isDark ? 'rgba(57,255,106,0.1)' : 'var(--color-bg-hover)',
                color: 'var(--color-primary)',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              /
            </span>
            <span
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: 13,
                fontFamily: 'var(--term-font, monospace)',
              }}
            >
              BUFFER // MODIFY_ATTRIBUTES
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
        /* 4. Display Profile Surface */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Banner Card */}
          <div
            style={{
              background: 'var(--color-bg-container)',
              borderRadius: 18,
              border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: isDark ? 'var(--term-glow)' : '0 8px 30px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                height: 120,
                background: isDark
                  ? 'radial-gradient(ellipse at 80% 20%, rgba(57, 255, 106, 0.18), transparent 60%), linear-gradient(135deg, #020603 0%, #06180c 100%)'
                  : 'radial-gradient(ellipse at 80% 20%, var(--primitive-green-100), transparent 65%), linear-gradient(135deg, var(--primitive-green-50) 0%, var(--primitive-gray-100) 100%)',
                borderBottom: isDark
                  ? '1px solid var(--term-border)'
                  : '1px solid var(--color-border)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 20,
                  fontFamily: 'var(--term-font, monospace)',
                  fontSize: 11,
                  color: isDark ? 'var(--term-green-dim)' : 'var(--primitive-green-700)',
                  fontWeight: 600,
                }}
              >
                UID: #{profile?._id?.slice(-6)?.toUpperCase()}
              </div>
            </div>

            <div
              style={{
                padding: '0 28px 24px',
                position: 'relative',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -48 }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={profile?.avatar || '/images/global/my-profile.jpg'}
                    alt="User Avatar"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `4px solid var(--color-bg-container)`,
                      boxShadow: 'var(--color-glow)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--primitive-emerald-500)',
                      border: '3px solid var(--color-bg-container)',
                    }}
                  />
                </div>

                <div style={{ paddingBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'var(--color-primary)',
                        letterSpacing: -0.5,
                      }}
                    >
                      {profile?.name}
                    </h2>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'var(--term-font, monospace)',
                        background: isDark ? 'rgba(57,255,106,0.1)' : 'var(--color-bg-hover)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {profile?.role?.toUpperCase() || 'USER'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-secondary)',
                      marginTop: 2,
                      fontFamily: 'var(--term-font, monospace)',
                    }}
                  >
                    @{profile?.username} · {profile?.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingBottom: 6 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: 'var(--color-bg-hover)',
                    border: '1px solid var(--color-border)',
                    fontSize: 11,
                    fontFamily: 'var(--term-font, monospace)',
                  }}
                >
                  <CalendarOutlined style={{ color: 'var(--color-primary)' }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    MEMBER SINCE{' '}
                    {new Date(profile?.createdAt || Date.now()).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
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
              value={profile?.stats?.sessions ?? 47}
              color={isDark ? 'var(--term-green)' : 'var(--primitive-emerald-500)'}
            />
            <StatCard
              icon={<ProjectOutlined />}
              label="LINKED PROJECTS"
              value={profile?.stats?.projects ?? 12}
              color="#38bdf8"
            />
            <StatCard
              icon={<CheckCircleOutlined />}
              label="COMMITTED TASKS"
              value={profile?.stats?.tasksCompleted ?? 108}
              color="#a78bfa"
            />
          </div>

          {/* Split Bento Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {/* Left Card: Developer Profile & Networks */}
            <div
              style={{
                background: 'var(--color-bg-container)',
                border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 22,
              }}
            >
              {/* Biography */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--term-font, monospace)',
                    marginBottom: 10,
                  }}
                >
                  <FileTextOutlined /> SYSTEM BIOGRAPHY
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: 'var(--color-text)',
                    background: 'var(--color-bg-hover)',
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {profile?.bio ||
                    'Software Engineer focused on high-performance developer workflows, scalable systems, and modern UI architectures.'}
                </div>
              </div>

              {/* Specializations / Interests */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--term-font, monospace)',
                    marginBottom: 10,
                  }}
                >
                  <ApartmentOutlined /> SPECIALIZATIONS &amp; TECH STACK
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(profile?.interests?.length
                    ? profile.interests
                    : ['Node.js', 'React', 'MongoDB', 'Cloudinary', 'Security', 'Docker']
                  ).map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 12px',
                        borderRadius: 8,
                        background: isDark ? 'rgba(57,255,106,0.06)' : 'var(--color-bg-hover)',
                        borderColor: isDark ? 'var(--term-border)' : 'var(--color-border)',
                        color: 'var(--color-primary)',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'var(--term-font, monospace)',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                        }}
                      />
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>

              {/* Developer Platforms & Links (Interactive Buttons with Unlinked Notification) */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--term-font, monospace)',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LinkOutlined /> DEVELOPER PLATFORMS &amp; LINKS
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    PORTAL CONNECTORS
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 10,
                  }}
                >
                  {SOCIAL_NETWORKS.map((network) => {
                    const handle = userSocialLinks[network.field]
                    const hasLink = Boolean(handle)

                    return (
                      <div
                        key={network.key}
                        onClick={() => handlePlatformClick(network, handle)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: hasLink
                            ? isDark
                              ? 'rgba(57, 255, 106, 0.03)'
                              : 'var(--color-bg-hover)'
                            : isDark
                              ? 'rgba(255, 255, 255, 0.02)'
                              : 'rgba(0, 0, 0, 0.02)',
                          border: hasLink
                            ? isDark
                              ? '1px solid var(--term-border)'
                              : '1px solid var(--color-border)'
                            : isDark
                              ? '1px dashed rgba(255, 255, 255, 0.12)'
                              : '1px dashed rgba(0, 0, 0, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = hasLink
                            ? network.brandColor
                            : 'var(--color-text-muted)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          if (hasLink) {
                            e.currentTarget.style.boxShadow = isDark
                              ? `0 4px 14px ${network.brandColor}22`
                              : '0 4px 12px rgba(0,0,0,0.06)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = hasLink
                            ? isDark
                              ? 'var(--term-border)'
                              : 'var(--color-border)'
                            : isDark
                              ? 'rgba(255, 255, 255, 0.12)'
                              : 'rgba(0, 0, 0, 0.15)'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              color: hasLink ? network.brandColor : 'var(--color-text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {network.icon}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: hasLink ? 'var(--color-text)' : 'var(--color-text-muted)',
                              }}
                            >
                              {network.label}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: hasLink
                                  ? 'var(--color-text-secondary)'
                                  : 'var(--color-text-muted)',
                                fontFamily: 'var(--term-font, monospace)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {hasLink ? `@${handle}` : 'NOT LINKED'}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 6 }}
                        >
                          {hasLink ? (
                            <>
                              <Tooltip title="Copy Handle">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(handle, network.label)
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                    padding: 3,
                                  }}
                                >
                                  <CopyOutlined style={{ fontSize: 11 }} />
                                </button>
                              </Tooltip>
                              <Tooltip title={`Open ${network.label}`}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePlatformClick(network, handle)
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    cursor: 'pointer',
                                    padding: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <ExportOutlined style={{ fontSize: 11 }} />
                                </button>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Link not provided yet">
                              <span
                                style={{
                                  fontSize: 10,
                                  color: 'var(--color-text-muted)',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  background: isDark
                                    ? 'rgba(255,255,255,0.04)'
                                    : 'rgba(0,0,0,0.04)',
                                  fontFamily: 'var(--term-font, monospace)',
                                }}
                              >
                                + LINK
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Card: Security & Verification Parameters */}
            <div
              style={{
                background: 'var(--color-bg-container)',
                border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--term-font, monospace)',
                    marginBottom: 14,
                  }}
                >
                  <SafetyCertificateOutlined /> IDENTITY &amp; SECURITY PROTOCOLS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: <MailOutlined />, label: 'REGISTERED EMAIL', val: profile?.email },
                    {
                      icon: <PhoneOutlined />,
                      label: 'RECOVERY PHONE',
                      val: profile?.phone || 'Not configured',
                    },
                    {
                      icon: <SafetyCertificateOutlined />,
                      label: 'AUTHORIZATION LEVEL',
                      val: `${profile?.role?.toUpperCase() || 'USER'} (ELEVATED ACCESS)`,
                    },
                    {
                      icon: <IdcardOutlined />,
                      label: 'DATABASE IDENTIFIER',
                      val: profile?._id || 'N/A',
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 10,
                        background: 'var(--color-bg-hover)',
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
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--term-font, monospace)',
                          }}
                        >
                          {row.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--term-font, monospace)',
                          }}
                        >
                          {row.val}
                        </span>
                        {row.val && row.val !== 'Not configured' && row.val !== 'N/A' && (
                          <Tooltip title={`Copy ${row.label}`}>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(row.val, row.label)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                padding: 2,
                                display: 'flex',
                              }}
                            >
                              <CopyOutlined style={{ fontSize: 11 }} />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 12,
                  fontFamily: 'var(--term-font, monospace)',
                }}
              >
                &gt; Cryptographic verification: Critical attributes are locked to session token
                signatures.
              </div>
            </div>
          </div>
        </div>
      )}
    </PageHeader>
  )
}
