import { Outlet } from 'react-router-dom'

const S = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f0',
    fontFamily: 'Inter, sans-serif',
  },

  sidebar: {
    width: '220px',
    backgroundColor: '#ffffff',
    borderRight: '0.5px solid rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
  },
}

export default function AuthLayout() {
  return (
    <div style={S.root}>
      {/* <aside style={S.sidebar}></aside> */}

      <div style={S.main}>
        <main style={S.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
