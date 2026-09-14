import { InboxOutlined, CloudUploadOutlined, CloseOutlined } from '@ant-design/icons'
import Loader from '@devStack/components/spinners/Loader'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Modal, Upload, Input, Select, Progress } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const { Dragger } = Upload

export default function UploadAssetModal({ open, onClose, onUpload, uploading, uploadProgress }) {
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('ui')
  const [project, setProject] = useState('umbra-vault')
  const [version, setVersion] = useState('v1')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState(['ui', 'dashboard'])
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase()
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean])
      setTagInput('')
    }
  }

  const handleRemoveTag = (t) => {
    setTags(tags.filter((item) => item !== t))
  }

  const handleSubmit = async () => {
    if (!file || uploading) return

    const res = await onUpload(file, {
      name,
      type,
      project,
      version,
      description,
      tags,
    })

    if (res?.success) {
      setFile(null)
      setName('')
      setDescription('')
      onClose()
    }
  }

  const terminalInputStyle = {
    background: 'var(--color-bg-container)',
    border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
    color: 'var(--color-text)',
    fontFamily: 'var(--term-font, monospace)',
    borderRadius: 'var(--radius-sm, 6px)',
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      title={
        <span
          style={{
            color: 'var(--color-primary)',
            fontFamily: 'var(--term-font, monospace)',
            letterSpacing: 1.2,
            fontWeight: 700,
          }}
        >
          SYS://UPLOAD_NEW_ASSET
        </span>
      }
      styles={{
        content: {
          background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
          border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
          borderRadius: 'var(--term-radius, 10px)',
          padding: 24,
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
        <Dragger
          multiple={false}
          showUploadList={false}
          disabled={uploading}
          beforeUpload={(f) => {
            setFile(f)
            if (!name) setName(f.name.replace(/\.[^/.]+$/, '').toUpperCase())
            return false
          }}
          style={{
            background: isDark ? 'rgba(57, 255, 106, 0.02)' : 'var(--color-bg-hover)',
            border: `1.5px dashed ${isDark ? 'var(--term-border)' : 'var(--color-border-secondary)'}`,
            borderRadius: 'var(--radius, 8px)',
            padding: '16px 0',
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: 'var(--color-primary)', fontSize: 36 }} />
          </p>
          <p
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {file ? `STAGED: ${file.name}` : 'DROP ASSET BINARY OR CLICK TO BROWSE'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 11, margin: 0 }}>
            PNG, WEBP, PDF, DOCX, ZIP (MAX 25MB)
          </p>
        </Dragger>

        <div>
          <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            IDENTIFIER NAME
          </label>
          <Input
            disabled={uploading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. UV_DASHBOARD_HERO"
            style={{ ...terminalInputStyle, marginTop: 4 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              SUBSYSTEM TYPE
            </label>
            <Select
              disabled={uploading}
              value={type}
              onChange={setType}
              style={{ width: '100%', marginTop: 4 }}
              options={[
                { value: 'ui', label: 'UI SCREEN' },
                { value: 'logo', label: 'LOGO' },
                { value: 'icon', label: 'ICON' },
                { value: 'docs', label: 'DOCUMENTATION' },
                { value: 'backup', label: 'BACKUP / PKG' },
                { value: 'reference', label: 'REFERENCE' },
              ]}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              PROJECT TARGET
            </label>
            <Input
              disabled={uploading}
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="umbra-vault"
              style={{ ...terminalInputStyle, marginTop: 4 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              VERSION
            </label>
            <Input
              disabled={uploading}
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v1"
              style={{ ...terminalInputStyle, marginTop: 4 }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            DISCOVERY TAGS
          </label>
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: 6,
            }}
          >
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
                  border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  fontSize: 11,
                  fontFamily: 'var(--term-font, monospace)',
                }}
              >
                #{t}
                {!uploading && (
                  <CloseOutlined
                    style={{ fontSize: 9, cursor: 'pointer' }}
                    onClick={() => handleRemoveTag(t)}
                  />
                )}
              </span>
            ))}
            {!uploading && (
              <Input
                size="small"
                value={tagInput}
                placeholder="+ Add Tag"
                onChange={(e) => setTagInput(e.target.value)}
                onPressEnter={handleAddTag}
                style={{ ...terminalInputStyle, width: 90, height: 24, fontSize: 11 }}
              />
            )}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            DESCRIPTION // CONTEXT
          </label>
          <Input.TextArea
            disabled={uploading}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Context, intended screen location, or revisions..."
            style={{ ...terminalInputStyle, marginTop: 4 }}
          />
        </div>

        {uploading && (
          <div style={{ marginTop: 4 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--term-font, monospace)',
                fontSize: 11,
                color: 'var(--color-primary)',
                marginBottom: 4,
              }}
            >
              <span>UPLOADING_CLOUDINARY_STREAM...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress
              percent={uploadProgress}
              showInfo={false}
              strokeColor="var(--color-primary)"
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 10,
            borderTop: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            paddingTop: 14,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
            }}
          >
            DISCARD
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || uploading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 18px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              color: isDark ? 'var(--term-green)' : '#ffffff',
              cursor: !file || uploading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: isDark ? 'var(--term-glow)' : 'var(--color-glow)',
            }}
          >
            {uploading ? (
              <Loader size={14} color="currentColor" label="TRANSMITTING..." />
            ) : (
              <>
                <CloudUploadOutlined /> COMMIT ASSET
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
