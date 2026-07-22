import { useNavigate, useRouteError } from 'react-router-dom'

const S = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  card: {
    textAlign: 'center',
    maxWidth: '420px',
    padding: '0 24px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#FEF0EE',
    color: '#c0392b',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 10px',
  },
  sub: {
    fontSize: '14px',
    color: '#888',
    lineHeight: '1.6',
    margin: '0 0 8px',
  },
  detail: {
    fontSize: '12px',
    color: '#bbb',
    fontFamily: 'monospace',
    margin: '0 0 32px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '9px 20px',
    backgroundColor: '#534AB7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '9px 20px',
    backgroundColor: '#fff',
    color: '#534AB7',
    border: '1px solid #e0dff8',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '500',
    cursor: 'pointer',
  },
}

const messages = {
  403: { heading: 'Access denied', sub: "You don't have permission to view this page." },
  404: { heading: 'Page not found', sub: "This page doesn't exist or was moved." },
  500: { heading: 'Something went wrong', sub: 'An error occurred on our end. Try refreshing.' },
}

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const status = error?.status
  const { heading, sub } = messages[status] || {
    heading: 'Unexpected error',
    sub: 'Something went wrong. Please try again.',
  }

  return (
    <div style={S.root}>
      <div style={S.card}>
        <span style={S.badge}>{status ? `Error ${status}` : 'Error'}</span>
        <h1 style={S.heading}>{heading}</h1>
        <p style={S.sub}>{sub}</p>
        {error?.message && <p style={S.detail}>{error.message}</p>}
        <div style={S.actions}>
          <button style={S.btnPrimary} onClick={() => window.location.reload()}>
            Refresh
          </button>
          <button style={S.btnSecondary} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
