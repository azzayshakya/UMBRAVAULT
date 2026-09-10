import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

// Step 1: Upload raw binary to Cloudinary (image, pdf, archive, raw)
export const uploadFileToStorage = (file, folder = 'umbra_vault', onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  return axiosInstance
    .post(`${baseAPIURL}/files/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          const percent = Math.round((e.loaded * 100) / e.total)
          onProgress(percent)
        }
      },
    })
    .then((res) => res.data?.data || res.data)
}

// Step 2: Index asset metadata in MongoDB
export const createAssetRecord = (payload) => {
  return axiosInstance
    .post(`${baseAPIURL}/assets`, payload)
    .then((res) => res.data?.data || res.data)
}

// Fetch indexed assets with filtering
export const fetchAssetsApi = (params = {}) => {
  return axiosInstance
    .get(`${baseAPIURL}/assets`, { params })
    .then((res) => res.data?.data || res.data)
}

// Delete asset record and associated Cloudinary file
export const deleteAssetApi = (assetId, publicId, resourceType = 'image') => {
  return Promise.all([
    axiosInstance.delete(`${baseAPIURL}/assets/${assetId}`),
    axiosInstance.delete(`${baseAPIURL}/files`, { data: { publicId, resourceType } }),
  ]).then(([assetRes]) => assetRes.data)
}

// Link an asset to project nodes
export const linkAssetUsageApi = (assetId, linkPayload) => {
  return axiosInstance
    .post(`${baseAPIURL}/assets/${assetId}/link`, linkPayload)
    .then((res) => res.data?.data || res.data)
}
