import useThemeStore from '@devStack/store/useThemeStore'
import getAntdTheme from '@devStack/styles/theme-token'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react'

import { SYSTEM_DARK_QUERY } from './theme-constants'

export default function ThemeProvider({ children }) {
  const resolvedScheme = useThemeStore((s) => s.resolvedScheme)
  const syncSystemScheme = useThemeStore((s) => s.syncSystemScheme)

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
    mediaQuery.addEventListener('change', syncSystemScheme)
    return () => mediaQuery.removeEventListener('change', syncSystemScheme)
  }, [syncSystemScheme])

  return <ConfigProvider theme={getAntdTheme(resolvedScheme)}>{children}</ConfigProvider>
}
