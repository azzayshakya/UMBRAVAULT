import { syncSystemScheme } from '@devStack/store/preferenceSlice'
import getAntdTheme from '@devStack/styles/theme-token'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SYSTEM_DARK_QUERY } from './theme-constants'

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch()
  const resolvedScheme = useSelector((s) => s.preference.resolvedScheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', resolvedScheme)
  }, [resolvedScheme])

  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.add('theme-transitions-enabled')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY)
    const handleSystemChange = () => dispatch(syncSystemScheme())

    mediaQuery.addEventListener('change', handleSystemChange)
    return () => mediaQuery.removeEventListener('change', handleSystemChange)
  }, [dispatch])

  return <ConfigProvider theme={getAntdTheme(resolvedScheme)}>{children}</ConfigProvider>
}
