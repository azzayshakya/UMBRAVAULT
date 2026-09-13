import { themeChanged } from '@devStack/store/preferenceSlice'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Theme } from '../constants/theme-constants'
import { resolveTheme } from '../utils/theme-utils'

export function useTheme() {
  const theme = useSelector((state) => state.preference.theme)
  const dispatch = useDispatch()

  const resolvedTheme = resolveTheme(theme) // always 'light' | 'dark', never 'system'

  const setTheme = useCallback((next) => dispatch(themeChanged(next)), [dispatch])

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK
    dispatch(themeChanged(next))
  }, [dispatch, resolvedTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
