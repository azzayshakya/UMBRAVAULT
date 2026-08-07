import { createNote, deleteNote, updateNote } from '@devStack/apiServices/note-api'
import { getNotesByTopic } from '@devStack/apiServices/topic-api'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { useCallback, useEffect, useState } from 'react'

export const useTopicNotesApi = (topicId, filters = {}) => {
  const [topic, setTopic] = useState(null)
  const [notes, setNotes] = useState([])
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const fetchNotes = useCallback(async () => {
    if (!topicId) return
    try {
      setLoading(true)
      const response = await getNotesByTopic(topicId, { ...filters })
      setTopic(response?.data?.topic || null)
      setNotes(response?.data?.notes || [])
      setTotal(response?.data?.pagination?.total || 0)
    } catch (err) {
      setNotes([])
      handleApiError(err)
    } finally {
      setLoading(false)
    }
  }, [topicId, JSON.stringify(filters)])

  const runMutation = async (fn) => {
    setSubmitting(true)
    setApiError(null)
    try {
      const res = await fn()
      if (res?.success === false) {
        const msg = res?.message || 'Something went wrong'
        setApiError(msg)
        return { success: false, message: msg }
      }
      return { success: true, data: res }
    } catch (err) {
      handleApiError(err)
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong'
      setApiError(msg)
      return { success: false, message: msg }
    } finally {
      setSubmitting(false)
    }
  }

  const addNote = useCallback(
    (payload) => runMutation(() => createNote({ ...payload, topic: topicId })),
    [topicId]
  )

  const editNote = useCallback(
    (noteId, payload) => runMutation(() => updateNote(noteId, payload)),
    []
  )

  const removeNote = useCallback((noteId) => runMutation(() => deleteNote(noteId)), [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return {
    topic,
    notes,
    total,
    loading,
    submitting,
    apiError,
    refetch: fetchNotes,
    addNote,
    editNote,
    removeNote,
  }
}
