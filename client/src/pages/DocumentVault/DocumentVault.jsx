import {
  FileImageOutlined,
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FolderOpenOutlined,
  FileZipOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import EmptyState from '@devStack/components/EmptyState/EmptyState'
import PageHeader from '@devStack/components/PageHeader'
import { Skeleton } from '@devStack/components/Skelton/Skeleton'
import { StatCard } from '@devStack/components/StateCard'
import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { Input, Select, Radio } from 'antd'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import AssetDetailsDrawer from './components/AssetDetailsDrawer'
import UploadAssetModal from './components/UploadAssetModal'
import { ASSET_TYPES, ASSET_CATEGORIES } from './constants/asset-vault.constants'
import { useAssetVaultApi } from './hooks/useAssetVaultApi'

export default function AssetVaultPage() {
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(undefined)
  const [categoryFilter, setCategoryFilter] = useState(undefined)
  const [viewMode, setViewMode] = useState('grid')

  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [inspectedAsset, setInspectedAsset] = useState(null)

  const filters = useMemo(
    () => ({
      search: search || undefined,
      type: typeFilter,
      category: categoryFilter,
    }),
    [search, typeFilter, categoryFilter]
  )

  // Plugged into custom hook
  const {
    assets,
    stats,
    total,
    loading,
    uploading,
    uploadProgress,
    uploadAndIndexAsset,
    removeAsset,
  } = useAssetVaultApi(filters)

  return (
    <PageHeader
      title="ASSET VAULT"
      subtitle="root@vault:~# find ./assets --metadata-index --reusable"
      icon={<FileImageOutlined />}
      extra={
        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 'var(--radius, 8px)',
            border: isDark ? '1px solid var(--term-border)' : '1px solid rgba(6, 95, 70, 0.25)',
            background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.45)',
            color: isDark ? 'var(--term-green)' : '#065f46',
            fontFamily: 'var(--term-font, monospace)',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 1,
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.15s ease',
          }}
        >
          <PlusOutlined /> UPLOAD ASSET
        </button>
      }
    >
      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          icon={<FolderOpenOutlined />}
          label="TOTAL ASSETS"
          value={total}
          color={isDark ? 'var(--term-green)' : 'var(--primitive-emerald-500)'}
          loading={loading}
        />
        <StatCard
          icon={<FileImageOutlined />}
          label="UI & GRAPHICS"
          value={stats?.image || 0}
          color="#38bdf8"
          loading={loading}
        />
        <StatCard
          icon={<FileTextOutlined />}
          label="DOCUMENTATION"
          value={stats?.document || 0}
          color="#a78bfa"
          loading={loading}
        />
        <StatCard
          icon={<FileZipOutlined />}
          label="PACKAGES & BACKUPS"
          value={stats?.archive || 0}
          color="#f5c542"
          loading={loading}
        />
      </div>

      {/* Query Engine Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginTop: 4,
        }}
      >
        <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260, flexWrap: 'wrap' }}>
          <Input
            prefix={
              <SearchOutlined
                style={{ color: isDark ? 'var(--term-green)' : 'var(--color-primary)' }}
              />
            }
            placeholder="Search assets by tag, project or identifier..."
            value={search}
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: 280,
              borderRadius: 'var(--radius, 8px)',
              border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
              background: 'var(--color-bg-container)',
              color: 'var(--color-text)',
              fontFamily: 'var(--term-font, monospace)',
            }}
          />
          <Select
            placeholder="SUBSYSTEM TYPE"
            allowClear
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 160 }}
            options={ASSET_TYPES}
          />
          <Select
            placeholder="CATEGORY"
            allowClear
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 160 }}
            options={ASSET_CATEGORIES}
          />
        </div>

        <Radio.Group
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="grid">
            <AppstoreOutlined />
          </Radio.Button>
          <Radio.Button value="list">
            <BarsOutlined />
          </Radio.Button>
        </Radio.Group>
      </div>

      {/* Explorer Surface */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={190} borderRadius={10} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          variant={search || typeFilter || categoryFilter ? 'search' : 'default'}
          query={search}
          actionText="INDEX FIRST ASSET"
          onAction={() => setUploadModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        /* Visual Tile Matrix */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {assets.map((asset) => (
            <div
              key={asset._id}
              onClick={() => setInspectedAsset(asset)}
              style={{
                borderRadius: 'var(--radius, 8px)',
                border: isDark ? '1px solid var(--term-border)' : '1.5px solid var(--color-border)',
                background: 'var(--color-bg-container)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark
                  ? 'var(--term-border)'
                  : 'var(--color-border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div
                style={{
                  height: 130,
                  background: isDark ? '#020603' : 'var(--primitive-gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: isDark
                    ? '1px solid var(--term-border)'
                    : '1px solid var(--color-border)',
                  overflow: 'hidden',
                }}
              >
                {asset.category === 'image' ? (
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', opacity: 0.4 }}>
                    <FileTextOutlined style={{ fontSize: 36, color: 'var(--color-primary)' }} />
                  </div>
                )}
              </div>

              <div style={{ padding: 12 }}>
                <div
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {asset.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: 'var(--color-text-secondary)',
                    marginTop: 6,
                  }}
                >
                  <span>{asset.project}</span>
                  <span
                    style={{
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: 'var(--color-bg-hover)',
                      border: '1px solid var(--color-border)',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {asset.version}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tabular Line-Item View */
        <div
          style={{
            border: isDark ? '1px solid var(--term-border)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius, 8px)',
            overflow: 'hidden',
            background: 'var(--color-bg-container)',
          }}
        >
          {assets.map((asset, i) => (
            <div
              key={asset._id}
              onClick={() => setInspectedAsset(asset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom:
                  i === assets.length - 1
                    ? 'none'
                    : `1px solid ${isDark ? 'rgba(57,255,106,0.1)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ color: 'var(--color-primary)', fontSize: 16 }}>
                  {asset.category === 'image' ? <FileImageOutlined /> : <FileTextOutlined />}
                </span>
                <div>
                  <div
                    style={{
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {asset.name}
                  </div>
                  <div
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {asset.originalName}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span>{asset.project}</span>
                <span style={{ minWidth: 60, textAlign: 'center' }}>
                  {(asset.type || 'other').toUpperCase()}
                </span>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'var(--color-bg-hover)',
                    border: '1px solid var(--color-border)',
                    fontSize: 11,
                  }}
                >
                  {asset.version}
                </span>
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals & Inspection Drawers */}
      <UploadAssetModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={uploadAndIndexAsset}
        uploading={uploading}
        uploadProgress={uploadProgress}
      />

      <AssetDetailsDrawer
        asset={inspectedAsset}
        open={Boolean(inspectedAsset)}
        onClose={() => setInspectedAsset(null)}
        onDelete={removeAsset}
      />
    </PageHeader>
  )
}
