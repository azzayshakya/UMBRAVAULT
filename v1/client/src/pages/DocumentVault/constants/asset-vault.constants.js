export const ASSET_TYPES = [
  { label: 'ALL TYPES', value: undefined },
  { label: 'UI SCREENSHOT', value: 'ui' },
  { label: 'BRAND LOGO', value: 'logo' },
  { label: 'SYSTEM ICON', value: 'icon' },
  { label: 'PROJECT DOCS', value: 'docs' },
  { label: 'SYSTEM BACKUP', value: 'backup' },
  { label: 'REFERENCE', value: 'reference' },
]

export const ASSET_CATEGORIES = [
  { label: 'ALL CATEGORIES', value: undefined },
  { label: 'IMAGES', value: 'image' },
  { label: 'DOCUMENTS', value: 'document' },
  { label: 'ARCHIVES', value: 'archive' },
  { label: 'CODE / SNIPPETS', value: 'code' },
]

export const ASSET_STATUS_BADGES = {
  active: {
    color: 'var(--color-primary)',
    bg: 'rgba(57, 255, 106, 0.08)',
    border: 'var(--term-border)',
    label: 'ACTIVE',
  },
  deprecated: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    label: 'DEPRECATED',
  },
  archived: {
    color: 'var(--color-text-muted)',
    bg: 'rgba(255, 255, 255, 0.04)',
    border: 'var(--color-border)',
    label: 'ARCHIVED',
  },
}
