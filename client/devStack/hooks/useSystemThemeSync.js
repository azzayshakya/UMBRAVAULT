import { themeChanged } from '@devStack/store/preferenceSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Theme, SYSTEM_DARK_QUERY } from '../constants/theme-constants'

/** Call once near the app root. Re-applies DOM when OS theme flips mid-session. */
export function useSystemThemeSync() {
  const theme = useSelector((state) => state.preference.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    if (theme !== Theme.SYSTEM) return

    const media = window.matchMedia(SYSTEM_DARK_QUERY)
    const handleChange = () => dispatch(themeChanged(Theme.SYSTEM)) // re-triggers middleware
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme, dispatch])
}
