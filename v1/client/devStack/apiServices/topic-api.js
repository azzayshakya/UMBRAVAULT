import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const getAllTopics = (params) => {
  return axiosInstance.get(`${baseAPIURL}/topic`, { params }).then((res) => res.data)
}

const getTopicStats = () => {
  return axiosInstance.get(`${baseAPIURL}/topic/stats`).then((res) => res.data)
}

const getTopicById = (topicId) => {
  return axiosInstance.get(`${baseAPIURL}/topic/${topicId}`).then((res) => res.data)
}

const createTopic = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/topic`, postobj).then((res) => res.data)
}

const updateTopic = (topicId, postobj) => {
  return axiosInstance.patch(`${baseAPIURL}/topic/${topicId}`, postobj).then((res) => res.data)
}

const deleteTopic = (topicId) => {
  return axiosInstance.delete(`${baseAPIURL}/topic/${topicId}`).then((res) => res.data)
}

const getNotesByTopic = (topicId, params) => {
  return axiosInstance
    .get(`${baseAPIURL}/topic/${topicId}/notes`, { params })
    .then((res) => res.data)
}

export {
  getAllTopics,
  getTopicStats,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getNotesByTopic,
}
