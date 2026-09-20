import { sidebarCollapseChanged } from '@devStack/store/preferenceSlice'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function useSidebarCollapsed() {
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state) => Boolean(state.preference.sidebarCollapsed))

  const setCollapsed = useCallback(
    (nextState) => {
      dispatch(sidebarCollapseChanged(Boolean(nextState)))
    },
    [dispatch]
  )

  const toggleSidebar = useCallback(() => {
    dispatch(sidebarCollapseChanged(!isCollapsed))
  }, [dispatch, isCollapsed])

  return {
    isCollapsed,
    setCollapsed,
    toggleSidebar,
  }
}
