import { useNavigate } from 'react-router-dom'

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
    maxWidth: '400px',
    padding: '0 24px',
  },
  code: {
    fontSize: '96px',
    fontWeight: '700',
    color: '#EEEDFE',
    lineHeight: 1,
    letterSpacing: '-4px',
    userSelect: 'none',
    // Signature: the number itself is the illustration — no icons, no astronauts
    WebkitTextStroke: '2px #534AB7',
    WebkitTextFillColor: '#EEEDFE',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '20px 0 8px',
  },
  sub: {
    fontSize: '14px',
    color: '#888',
    lineHeight: '1.6',
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

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={S.root}>
      <div style={S.card}>
        <div style={S.code}>404</div>
        <h1 style={S.heading}>Page not found</h1>
        <p style={S.sub}>The page you're looking for doesn't exist or may have been moved.</p>
        <div style={S.actions}>
          <button style={S.btnPrimary} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
          <button style={S.btnSecondary} onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
