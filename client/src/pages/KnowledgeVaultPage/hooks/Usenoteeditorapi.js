import { getNoteById, updateNote } from '@devStack/apiServices/note-api'
import { handleApiError } from '@devStack/apiServices/utils/handle-api-error'
import { useCallback, useEffect, useRef, useState } from 'react'

const AUTOSAVE_DELAY_MS = 800

export const useNoteEditorApi = (noteId) => {
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  const debounceRef = useRef(null)

  const fetchNote = useCallback(async () => {
    if (!noteId) return
    try {
      setLoading(true)
      const response = await getNoteById(noteId)
      setNote(response?.data?.note || null)
      setSaveStatus('idle')
    } catch (err) {
      setNote(null)
      handleApiError(err)
    } finally {
      setLoading(false)
    }
  }, [noteId])

  const persist = useCallback(
    async (payload) => {
      try {
        setSaveStatus('saving')
        const res = await updateNote(noteId, payload)
        if (res?.success === false) {
          setSaveStatus('error')
          return
        }
        setSaveStatus('saved')
      } catch (err) {
        handleApiError(err)
        setSaveStatus('error')
      }
    },
    [noteId]
  )

  // Immediate save — used for discrete changes like type or tags
  const saveNow = useCallback(
    (payload) => {
      setNote((prev) => (prev ? { ...prev, ...payload } : prev))
      persist(payload)
    },
    [persist]
  )

  // Debounced save — used while the user is actively typing title/content
  const saveDebounced = useCallback(
    (payload) => {
      setNote((prev) => (prev ? { ...prev, ...payload } : prev))
      setSaveStatus('saving')

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        persist(payload)
      }, AUTOSAVE_DELAY_MS)
    },
    [persist]
  )

  useEffect(() => {
    fetchNote()
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchNote])

  return {
    note,
    loading,
    saveStatus,
    saveNow,
    saveDebounced,
    refetch: fetchNote,
  }
}
