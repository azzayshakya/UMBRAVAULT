import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  CloseOutlined,
  CameraOutlined,
} from '@ant-design/icons'
import Loader from '@devStack/components/spinners/Loader'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Form, Input, Tag } from 'antd'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AvatarUploadModal } from './AvatarUploadModal'

export const EditProfileForm = ({ initialValues, onSubmit, onCancel, submitting }) => {
  const [form] = Form.useForm()
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  // Track editable form values in real-time
  const watchedValues = Form.useWatch([], form)

  const [avatarUrl, setAvatarUrl] = useState(
    initialValues?.avatar || '/images/global/my-profile.jpg'
  )
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [interests, setInterests] = useState(initialValues?.interests || [])
  const [newTagInput, setNewTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)

  // Verify whether any field, the avatar, or interests array has changed
  const isDirty = useMemo(() => {
    // 1. Check avatar URL
    const originalAvatar = initialValues?.avatar || '/images/global/my-profile.jpg'
    if (avatarUrl !== originalAvatar) return true

    // 2. Check interests tags array
    const originalInterests = initialValues?.interests || []
    if (interests.length !== originalInterests.length) return true
    const interestsChanged = interests.some((tag, idx) => tag !== originalInterests[idx])
    if (interestsChanged) return true

    // 3. Check Form text fields
    const currentName = (watchedValues?.name ?? initialValues?.name ?? '').trim()
    const originalName = (initialValues?.name ?? '').trim()
    if (currentName !== originalName) return true

    const currentPhone = (watchedValues?.phone ?? initialValues?.phone ?? '').trim()
    const originalPhone = (initialValues?.phone ?? '').trim()
    if (currentPhone !== originalPhone) return true

    const currentBio = (watchedValues?.bio ?? initialValues?.bio ?? '').trim()
    const originalBio = (initialValues?.bio ?? '').trim()
    if (currentBio !== originalBio) return true

    return false
  }, [watchedValues, avatarUrl, interests, initialValues])

  const handleRemoveInterest = (tagToRemove) => {
    setInterests(interests.filter((tag) => tag !== tagToRemove))
  }

  const handleAddInterest = () => {
    if (newTagInput.trim() && !interests.includes(newTagInput.trim())) {
      setInterests([...interests, newTagInput.trim()])
      setNewTagInput('')
      setShowTagInput(false)
    }
  }

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      avatar: avatarUrl,
      interests,
    })
  }

  const inputStyle = {
    background: 'var(--color-bg-container)',
    border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    color: 'var(--color-text)',
    borderRadius: 'var(--radius, 8px)',
    fontFamily: 'var(--term-font, monospace)',
    padding: '8px 12px',
  }

  const isSaveDisabled = !isDirty || submitting

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        requiredMark={false}
        style={{ width: '100%' }}
      >
        {/* Avatar Edit Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 24,
            padding: '16px 20px',
            background: 'var(--color-bg-hover)',
            borderRadius: 'var(--radius, 8px)',
            border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
          }}
        >
          <div style={{ position: 'relative', width: 70, height: 70 }}>
            <img
              src={avatarUrl}
              alt="User"
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-primary)',
              }}
            />
            <button
              type="button"
              title="Change Avatar"
              onClick={() => setAvatarModalOpen(true)}
              disabled={submitting}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: 'var(--color-bg)',
                border: '2px solid var(--color-bg-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: 12,
              }}
            >
              <CameraOutlined />
            </button>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 14 }}>
              PROFILE PHOTO
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Click the camera icon to upload a photo. PNG, JPG or WebP up to 2MB.
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <Form.Item
            name="name"
            label={<span style={{ color: 'var(--color-primary)', fontSize: 12 }}>FULL NAME</span>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--color-primary)' }} />}
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span style={{ color: 'var(--color-primary)', fontSize: 12 }}>EMAIL ADDRESS</span>
            }
            rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'var(--color-primary)' }} />}
              style={inputStyle}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span style={{ color: 'var(--color-primary)', fontSize: 12 }}>PHONE NUMBER</span>
            }
          >
            <Input
              prefix={<PhoneOutlined style={{ color: 'var(--color-primary)' }} />}
              style={inputStyle}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label={
              <span style={{ color: 'var(--color-primary)', fontSize: 12 }}>ROLE / TITLE</span>
            }
          >
            <Input style={inputStyle} disabled />
          </Form.Item>
        </div>

        <Form.Item
          name="bio"
          label={
            <span style={{ color: 'var(--color-primary)', fontSize: 12 }}>BIO DESCRIPTION</span>
          }
        >
          <Input.TextArea rows={3} style={inputStyle} />
        </Form.Item>

        {/* Dynamic Tags/Interests */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              color: 'var(--color-primary)',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            SPECIALIZATIONS & INTERESTS
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {interests.map((tag) => (
              <Tag
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--term-font, monospace)',
                  fontSize: 12,
                }}
              >
                {tag}
                <CloseOutlined
                  style={{ fontSize: 10, cursor: 'pointer' }}
                  onClick={() => handleRemoveInterest(tag)}
                />
              </Tag>
            ))}

            {showTagInput ? (
              <Input
                size="small"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onPressEnter={handleAddInterest}
                onBlur={handleAddInterest}
                autoFocus
                placeholder="Tag name..."
                style={{
                  width: 110,
                  borderRadius: 16,
                  fontSize: 12,
                  border: '1px solid var(--color-primary)',
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowTagInput(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px dashed var(--color-primary)',
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <PlusOutlined /> Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 16,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius, 8px)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
            }}
          >
            CANCEL
          </button>

          <button
            type="submit"
            disabled={isSaveDisabled}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 24px',
              borderRadius: 'var(--radius, 8px)',
              border: isSaveDisabled
                ? isDark
                  ? '1px solid var(--term-border)'
                  : '1px solid var(--color-border)'
                : isDark
                  ? '1px solid var(--term-border)'
                  : '1px solid var(--color-primary)',
              background: isSaveDisabled
                ? isDark
                  ? 'rgba(57, 255, 106, 0.03)'
                  : 'var(--color-bg-hover)'
                : isDark
                  ? 'rgba(57, 255, 106, 0.1)'
                  : 'var(--color-primary)',
              color: isSaveDisabled
                ? 'var(--color-text-muted)'
                : isDark
                  ? 'var(--term-green)'
                  : '#ffffff',
              fontWeight: 700,
              cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
              boxShadow: isSaveDisabled ? 'none' : 'var(--color-glow)',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
              opacity: isSaveDisabled ? 0.45 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {submitting ? (
              <Loader size={14} color="currentColor" label="SAVING..." />
            ) : (
              'SAVE CHANGES'
            )}
          </button>
        </div>
      </Form>

      {/* Avatar Modal */}
      <AvatarUploadModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onUploadSuccess={(url) => setAvatarUrl(url)}
        isDark={isDark}
      />
    </>
  )
}
