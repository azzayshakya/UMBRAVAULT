import { axiosInstance } from './instance/axios-instance'

const baseAPIURL = `${import.meta.env.VITE_ACCOUNTS_API_URL}`

const getNoteById = (noteId) => {
  return axiosInstance.get(`${baseAPIURL}/note/${noteId}`).then((res) => res.data)
}

const getNoteChildren = (noteId) => {
  return axiosInstance.get(`${baseAPIURL}/note/${noteId}/children`).then((res) => res.data)
}

const createNote = (postobj) => {
  return axiosInstance.post(`${baseAPIURL}/note`, postobj).then((res) => res.data)
}

const updateNote = (noteId, postobj) => {
  return axiosInstance.patch(`${baseAPIURL}/note/${noteId}`, postobj).then((res) => res.data)
}

const deleteNote = (noteId) => {
  return axiosInstance.delete(`${baseAPIURL}/note/${noteId}`).then((res) => res.data)
}

const searchNotes = (params) => {
  return axiosInstance.get(`${baseAPIURL}/note/search`, { params }).then((res) => res.data)
}

export { getNoteById, getNoteChildren, createNote, updateNote, deleteNote, searchNotes }
