import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
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
