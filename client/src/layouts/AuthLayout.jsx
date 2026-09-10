import { Theme } from '@devStack/constants/theme-constants'
import { toggleTheme } from '@devStack/store/preferenceSlice'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const AuthLayout = () => {
  const theme = useSelector((state) => state.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--term-font, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
