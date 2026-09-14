import {
  DownloadOutlined,
  CopyOutlined,
  PartitionOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Drawer, Tag, Modal, message } from 'antd'
import { useSelector } from 'react-redux'

import { ASSET_STATUS_BADGES } from '../constants/asset-vault.constants'

export default function AssetDetailsDrawer({ asset, open, onClose, onDelete }) {
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  if (!asset) return null

  const copyUrl = () => {
    navigator.clipboard.writeText(asset.url)
    message.success('CDN resource URL copied')
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const handleDelete = () => {
    Modal.confirm({
      title: `Purge ${asset.name}?`,
      content: 'This deletes the asset file from storage and cleans up metadata.',
      okText: 'DELETE',
      okButtonProps: { danger: true },
      onOk: async () => {
        const ok = await onDelete(
          asset._id,
          asset.publicId,
          asset.category === 'image' ? 'image' : 'raw'
        )
        if (ok) onClose()
      },
    })
  }

  const statusBadge = ASSET_STATUS_BADGES[asset.status || 'active']

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={480}
      title={
        <span
          style={{
            color: 'var(--color-primary)',
            fontFamily: 'var(--term-font, monospace)',
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: 700,
          }}
        >
          NODE://INSPECTOR → {asset.name}
        </span>
      }
      styles={{
        body: {
          background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
          fontFamily: 'var(--term-font, monospace)',
          color: 'var(--color-text)',
          padding: 24,
        },
        header: {
          background: isDark ? 'var(--term-bg-panel)' : 'var(--primitive-white)',
          borderBottom: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Preview Port */}
        <div
          style={{
            width: '100%',
            height: 230,
            borderRadius: 'var(--term-radius, 10px)',
            background: isDark ? '#020603' : 'var(--primitive-gray-100)',
            border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {asset.category === 'image' ? (
            <img
              src={asset.url}
              alt={asset.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.5 }}>
              <FileTextOutlined style={{ fontSize: 44, color: 'var(--color-primary)' }} />
              <div style={{ fontSize: 12, marginTop: 8 }}>{asset.mimeType}</div>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '2px 8px',
              borderRadius: 4,
              background: statusBadge.bg,
              border: `1px solid ${statusBadge.border}`,
              color: statusBadge.color,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {statusBadge.label}
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={copyUrl}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'var(--color-bg-hover)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <CopyOutlined /> COPY URL
          </button>
          <a
            href={asset.url}
            target="_blank"
            rel="noreferrer"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: isDark ? 'rgba(57, 255, 106, 0.12)' : 'var(--color-primary)',
              border: '1px solid var(--color-primary)',
              color: isDark ? 'var(--term-green)' : '#ffffff',
              textDecoration: 'none',
              fontSize: 12,
            }}
          >
            <DownloadOutlined />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <DeleteOutlined />
          </button>
        </div>

        {/* Specs Table */}
        <div
          style={{
            border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius, 8px)',
            overflow: 'hidden',
          }}
        >
          {[
            ['ORIGINAL FILE', asset.originalName],
            ['PROJECT ROOT', asset.project],
            ['SUBSYSTEM TYPE', (asset.type || 'other').toUpperCase()],
            ['FILE MAGNITUDE', formatBytes(asset.size)],
            ['BUILD VERSION', asset.version || 'v1'],
            ['INDEXED AT', new Date(asset.createdAt).toLocaleDateString()],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: isDark
                  ? '1px solid rgba(57, 255, 106, 0.1)'
                  : '1px solid var(--color-border)',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>{k}</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Tag Index */}
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            DISCOVERY TOKENS
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {asset.tags?.map((t) => (
              <Tag
                key={t}
                style={{
                  background: 'transparent',
                  borderColor: isDark ? 'var(--term-border)' : 'var(--color-border)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--term-font, monospace)',
                  borderRadius: 4,
                  fontSize: 11,
                }}
              >
                #{t}
              </Tag>
            ))}
          </div>
        </div>

        {/* Lineage Tree */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            <PartitionOutlined /> DEPENDENCY MATRIX ({asset.linkedProjects?.length || 0})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {asset.linkedProjects && asset.linkedProjects.length > 0 ? (
              asset.linkedProjects.map((link, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-bg-hover)',
                    border: isDark
                      ? '1px solid var(--term-border)'
                      : '1px solid var(--color-border)',
                    fontSize: 12,
                  }}
                >
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {link.projectName}
                  </div>
                  <div
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    ↳ {link.nodePath}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: 16,
                  border: `1px dashed ${isDark ? 'var(--term-border)' : 'var(--color-border)'}`,
                  borderRadius: 6,
                  color: 'var(--color-text-muted)',
                  fontSize: 11,
                  textAlign: 'center',
                }}
              >
                No active project dependencies linked yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  )
}
