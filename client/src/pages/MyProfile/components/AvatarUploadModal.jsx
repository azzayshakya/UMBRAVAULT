import { InboxOutlined, CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { uploadFileToStorage } from '@devStack/apiServices/asset-vault.apis'
import Loader from '@devStack/components/spinners/Loader'
import { Modal, Upload, Progress, message } from 'antd'
import { useState } from 'react'

const { Dragger } = Upload

export const AvatarUploadModal = ({ open, onClose, onUploadSuccess, isDark }) => {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleBeforeUpload = (selectedFile) => {
    const isImage = selectedFile.type.startsWith('image/')
    if (!isImage) {
      message.error('You can only upload an image file (PNG, JPG, WebP)!')
      return Upload.LIST_IGNORE
    }

    const isLt2M = selectedFile.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!')
      return Upload.LIST_IGNORE
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    return false
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const data = await uploadFileToStorage(file, 'avatars', (percent) => {
        setProgress(percent)
      })

      const secureUrl = data?.url || data?.secure_url

      if (secureUrl) {
        message.success('Avatar uploaded successfully!')
        onUploadSuccess(secureUrl)
        handleClose()
      } else {
        throw new Error('Upload succeeded but no URL was returned')
      }
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Avatar upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (uploading) return
    setFile(null)
    setPreviewUrl('')
    setProgress(0)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      width={440}
      title={
        <span
          style={{
            color: 'var(--color-primary)',
            fontFamily: 'var(--term-font, monospace)',
            letterSpacing: 1,
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          SYS://UPDATE_PROFILE_AVATAR
        </span>
      }
      styles={{
        content: {
          background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
          border: isDark ? '1.5px solid var(--term-border)' : '1.5px solid var(--color-border)',
          borderRadius: 'var(--term-radius, 10px)',
          padding: 22,
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
        {/* Preview Circle */}
        {previewUrl && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={previewUrl}
              alt="Avatar Preview"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--color-primary)',
                boxShadow: 'var(--color-glow)',
              }}
            />
          </div>
        )}

        {/* Dropzone */}
        <Dragger
          multiple={false}
          showUploadList={false}
          disabled={uploading}
          beforeUpload={handleBeforeUpload}
          style={{
            background: isDark ? 'rgba(57, 255, 106, 0.02)' : 'var(--color-bg-hover)',
            border: `1.5px dashed ${isDark ? 'var(--term-border)' : 'var(--color-border-secondary)'}`,
            borderRadius: 'var(--radius, 8px)',
            padding: '16px 10px',
          }}
        >
          <p className="ant-upload-drag-icon" style={{ marginBottom: 6 }}>
            <InboxOutlined style={{ color: 'var(--color-primary)', fontSize: 32 }} />
          </p>
          <p
            style={{
              color: 'var(--color-text)',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
              fontWeight: 600,
              margin: 0,
            }}
          >
            {file ? `Selected: ${file.name}` : 'Click or drag image to this area'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 11, margin: '4px 0 0' }}>
            PNG, JPG, or WebP up to 2MB
          </p>
        </Dragger>

        {/* Progress Display */}
        {uploading && (
          <div>
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
              <span>TRANSMITTING_BINARY...</span>
              <span>{progress}%</span>
            </div>
            <Progress percent={progress} showInfo={false} strokeColor="var(--color-primary)" />
          </div>
        )}

        {/* Modal Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            borderTop: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            paddingTop: 14,
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--term-font, monospace)',
              fontSize: 12,
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 18px',
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
              <Loader size={12} color="currentColor" label="UPLOADING..." />
            ) : (
              <>
                <CloudUploadOutlined /> UPLOAD
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
