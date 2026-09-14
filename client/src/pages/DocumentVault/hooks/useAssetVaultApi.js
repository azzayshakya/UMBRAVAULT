import {
  fetchAssetsApi,
  uploadFileToStorage,
  createAssetRecord,
  deleteAssetApi,
  linkAssetUsageApi,
} from '@devStack/apiServices/asset-vault.apis'
import { message } from 'antd'
import { useState, useCallback, useEffect } from 'react'

export const useAssetVaultApi = (filters = {}) => {
  const [assets, setAssets] = useState([])
  const [stats, setStats] = useState({ image: 0, document: 0, archive: 0 })
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Fetch asset catalog
  const loadAssets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAssetsApi(filters)
      setAssets(data?.assets || [])
      setStats(data?.stats || { image: 0, document: 0, archive: 0 })
      setTotal(data?.total || 0)
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to load assets')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  // End-to-end commit: Cloudinary upload -> MongoDB document creation
  const uploadAndIndexAsset = async (file, metadata) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      // 1. Send file stream to Cloudinary
      const storageResult = await uploadFileToStorage(
        file,
        `umbra_vault/${metadata.project || 'general'}`,
        (pct) => setUploadProgress(pct)
      )

      // 2. Commit metadata node to MongoDB
      const assetPayload = {
        name: metadata.name || file.name,
        originalName: file.name,
        type: metadata.type || 'other',
        category: storageResult.resourceType === 'image' ? 'image' : 'document',
        mimeType: storageResult.mimeType || file.type,
        size: storageResult.bytes || file.size,
        url: storageResult.url,
        thumbnailUrl: storageResult.thumbnailUrl || null,
        publicId: storageResult.publicId,
        project: metadata.project || 'umbra-vault',
        version: metadata.version || 'v1',
        description: metadata.description || '',
        tags: metadata.tags || [],
        metadata: {
          format: storageResult.format,
        },
      }

      const newAsset = await createAssetRecord(assetPayload)
      message.success('Asset indexed successfully')
      loadAssets()
      return { success: true, asset: newAsset }
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || 'Upload failed')
      return { success: false }
    } finally {
      setUploading(false)
    }
  }

  // Remove asset
  const removeAsset = async (assetId, publicId, resourceType) => {
    try {
      await deleteAssetApi(assetId, publicId, resourceType)
      message.success('Asset purged successfully')
      loadAssets()
      return true
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to delete asset')
      return false
    }
  }

  // Attach usage relation
  const linkAsset = async (assetId, linkData) => {
    try {
      const updated = await linkAssetUsageApi(assetId, linkData)
      message.success('Dependency linked')
      loadAssets()
      return updated
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to link dependency')
      return null
    }
  }

  return {
    assets,
    stats,
    total,
    loading,
    uploading,
    uploadProgress,
    refetch: loadAssets,
    uploadAndIndexAsset,
    removeAsset,
    linkAsset,
  }
}
