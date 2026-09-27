import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const getAllTasks = (params) => {
  return axiosInstance.get(`${baseAPIURL}/task`, { params }).then((res) => res.data)
}

const getTaskStats = () => {
  return axiosInstance.get(`${baseAPIURL}/task/stats`).then((res) => res.data)
}

const getTaskById = (taskId) => {
  return axiosInstance.get(`${baseAPIURL}/task/${taskId}`).then((res) => res.data)
}

const createTask = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/task`, postobj).then((res) => res.data)
}

const updateTask = (taskId, postobj) => {
  return axiosInstance.patch(`${baseAPIURL}/task/${taskId}`, postobj).then((res) => res.data)
}

const deleteTask = (taskId) => {
  return axiosInstance.delete(`${baseAPIURL}/task/${taskId}`).then((res) => res.data)
}

const addSubtask = (taskId, postobj) => {
  return axiosInstance
    .post(`${baseAPIURL}/task/${taskId}/subtasks`, postobj)
    .then((res) => res.data)
}

const updateSubtask = (taskId, subtaskId, postobj) => {
  return axiosInstance
    .patch(`${baseAPIURL}/task/${taskId}/subtasks/${subtaskId}`, postobj)
    .then((res) => res.data)
}

const deleteSubtask = (taskId, subtaskId) => {
  return axiosInstance
    .delete(`${baseAPIURL}/task/${taskId}/subtasks/${subtaskId}`)
    .then((res) => res.data)
}

const getTaskActivity = (taskId) => {
  return axiosInstance.get(`${baseAPIURL}/task/${taskId}/activity`).then((res) => res.data)
}

export {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getTaskActivity,
}
