// import { syncSystemTheme } from '@devStack/store/preferenceSlice'
// import getAntdTheme from '@devStack/styles/theme-token'
// import { resolveTheme } from '@devStack/utils/theme-utils'
// import { ConfigProvider } from 'antd'
// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'

// import { SYSTEM_DARK_QUERY } from './theme-constants'

// export default function ThemeProvider({ children }) {
//   const dispatch = useDispatch()
//   const theme = useSelector((s) => s.preference.theme)
//   const activeTheme = resolveTheme(theme)

//   useEffect(() => {
//     document.documentElement.setAttribute('data-scheme', activeTheme)
//   }, [activeTheme])

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       document.documentElement.classList.add('theme-transitions-enabled')
//     }, 100)
//     return () => clearTimeout(timer)
//   }, [])

//   useEffect(() => {
//     const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY)
//     const handleSystemChange = () => dispatch(syncSystemTheme())

//     mediaQuery.addEventListener('change', handleSystemChange)
//     return () => mediaQuery.removeEventListener('change', handleSystemChange)
//   }, [dispatch])

//   return <ConfigProvider theme={getAntdTheme(activeTheme)}>{children}</ConfigProvider>
// }
import { useSystemThemeSync } from '@devStack/hooks/useSystemThemeSync'
import { useTheme } from '@devStack/hooks/useTheme'
import getAntdTheme from '@devStack/styles/theme-token'
import { applyThemeToDOM } from '@devStack/utils/theme-utils'
import { ConfigProvider } from 'antd'
import { useLayoutEffect } from 'react'

export default function ThemeProvider({ children }) {
  const { resolvedTheme } = useTheme()
  useSystemThemeSync()

  // useLayoutEffect fires synchronously right after commit, before paint —
  // so data-scheme (drives your CSS vars) and Ant Design's theme tokens
  // (drives AntD components) always update in the same frame. Doing this
  // from the middleware caused a 1-frame flash because the middleware's
  // microtask timing isn't tied to React's paint cycle.
  useLayoutEffect(() => {
    applyThemeToDOM(resolvedTheme)
  }, [resolvedTheme])

  return <ConfigProvider theme={getAntdTheme(resolvedTheme)}>{children}</ConfigProvider>
}
