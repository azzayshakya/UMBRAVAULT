import { useSystemThemeSync } from '@devStack/store/theme/hooks/useSystemThemeSync'
import getAntdTheme from '@devStack/store/theme/utils/theme-token'
import { applyThemeToDOM } from '@devStack/store/theme/utils/theme-utils'
import { ConfigProvider } from 'antd'
import { useLayoutEffect } from 'react'

import { useTheme } from '../hooks/useTheme'

export default function ThemeProvider({ children }) {
  const { resolvedTheme } = useTheme()
  useSystemThemeSync()

  useLayoutEffect(() => {
    applyThemeToDOM(resolvedTheme)
  }, [resolvedTheme])

  return <ConfigProvider theme={getAntdTheme(resolvedTheme)}>{children}</ConfigProvider>
}
