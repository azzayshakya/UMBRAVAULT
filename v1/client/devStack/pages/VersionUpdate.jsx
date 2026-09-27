import { useState, useEffect } from 'react'

const styles = {
  '@keyframes': {},
  root: {
    minHeight: '100vh',
    background: '#050810',
    fontFamily: "'DM Sans', sans-serif",
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const injectGlobalStyles = () => {
  if (document.getElementById('template-page-styles')) return
  const style = document.createElement('style')
  style.id = 'template-page-styles'
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

    @keyframes floatUp {
      0%   { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.92); opacity: 0.6; }
      50%  { transform: scale(1.05); opacity: 0.15; }
      100% { transform: scale(0.92); opacity: 0.6; }
    }
    @keyframes drift {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33%       { transform: translateY(-18px) translateX(10px); }
      66%       { transform: translateY(10px) translateX(-12px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes scanline {
      0%   { top: -4%; }
      100% { top: 104%; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes badgePop {
      0%   { transform: scale(0.7); opacity: 0; }
      70%  { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes borderRotate {
      from { --angle: 0deg; }
      to   { --angle: 360deg; }
    }
    @keyframes orb1 {
      0%, 100% { transform: translate(0,0) scale(1); }
      50%       { transform: translate(60px, -40px) scale(1.15); }
    }
    @keyframes orb2 {
      0%, 100% { transform: translate(0,0) scale(1); }
      50%       { transform: translate(-50px, 50px) scale(0.9); }
    }
    @keyframes orb3 {
      0%, 100% { transform: translate(0,0) scale(1); }
      50%       { transform: translate(30px, 60px) scale(1.1); }
    }
    .tag-pill:hover {
      background: rgba(99,210,255,0.18) !important;
      color: #63d2ff !important;
      transform: translateY(-2px);
    }
    .cta-btn:hover {
      background: linear-gradient(135deg, #63d2ff, #a78bfa) !important;
      color: #050810 !important;
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(99,210,255,0.35) !important;
    }
    .feature-card:hover {
      background: rgba(255,255,255,0.07) !important;
      border-color: rgba(99,210,255,0.35) !important;
      transform: translateY(-4px);
    }
    .feature-card:hover .feat-icon {
      transform: scale(1.15);
    }
  `
  document.head.appendChild(style)
}

const features = [
  { icon: '⚡', label: 'Vite Powered', desc: 'Instant HMR, blazing fast builds' },
  { icon: '🔐', label: 'Auth Ready', desc: 'Context + protected routes wired' },
  { icon: '🌐', label: 'Axios + RQ', desc: 'Centralized API layer out of the box' },
  { icon: '🧩', label: 'Modular', desc: 'Feature-folder architecture' },
  { icon: '🎨', label: 'CSS Tokens', desc: 'Design system via custom properties' },
  { icon: '🧪', label: 'Vitest + RTL', desc: 'Testing configured, MSW included' },
]

const tags = [
  'React 18',
  'React Router v6',
  'React Query',
  'Axios',
  'Zod',
  'MSW',
  'Vitest',
  'Husky',
]

export default function VersionUpdate() {
  const [visible, setVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'azzayshakya'

  useEffect(() => {
    injectGlobalStyles()
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1))
      i++
      if (i >= fullText.length) clearInterval(interval)
    }, 90)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <div style={styles.root}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            top: '-10%',
            left: '-8%',
            background: 'radial-gradient(circle, rgba(99,210,255,0.13) 0%, transparent 70%)',
            animation: 'orb1 9s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            bottom: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
            animation: 'orb2 12s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            top: '40%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
            animation: 'orb3 15s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, rgba(99,210,255,0.06), transparent)',
            animation: 'scanline 6s linear infinite',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 860,
          width: '100%',
          margin: '0 auto',
          padding: '48px 24px',
          animation: visible ? 'floatUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
          opacity: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 32,
            animation: visible
              ? 'badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s forwards'
              : 'none',
            opacity: 0,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 999,
              background: 'rgba(99,210,255,0.08)',
              border: '1px solid rgba(99,210,255,0.25)',
              color: '#63d2ff',
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#63d2ff',
                boxShadow: '0 0 8px #63d2ff',
                animation: 'blink 1.4s ease-in-out infinite',
                display: 'inline-block',
              }}
            />
            Latest Release — v2.0
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            React + Vite{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #63d2ff 0%, #a78bfa 50%, #34d399 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              Template
            </span>
          </h1>

          <p
            style={{
              marginTop: 16,
              fontSize: 17,
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 300,
              letterSpacing: '0.01em',
            }}
          >
            Production-ready scaffold — clone it, ship it.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginBottom: 44,
            animation: visible ? 'fadeIn 0.6s ease 0.5s forwards' : 'none',
            opacity: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #63d2ff, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: '#050810',
              flexShrink: 0,
            }}
          >
            A
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Developed by</span>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            {typedText}
            <span style={{ animation: 'blink 0.8s step-end infinite', color: '#63d2ff' }}>|</span>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 44,
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.label}
              className="feature-card"
              style={{
                padding: '20px 22px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.25s ease',
                animation: visible
                  ? `floatUp 0.6s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.07}s forwards`
                  : 'none',
                opacity: 0,
                cursor: 'default',
              }}
            >
              <div
                className="feat-icon"
                style={{
                  fontSize: 26,
                  marginBottom: 10,
                  display: 'inline-block',
                  transition: 'transform 0.25s ease',
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                {f.label}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 48,
          }}
        >
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="tag-pill"
              style={{
                padding: '5px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s ease',
                cursor: 'default',
                animation: visible ? `fadeIn 0.4s ease ${0.6 + i * 0.05}s forwards` : 'none',
                opacity: 0,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: visible ? 'floatUp 0.6s ease 0.9s forwards' : 'none',
            opacity: 0,
          }}
        >
          <button
            className="cta-btn"
            style={{
              padding: '13px 32px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid rgba(99,210,255,0.4)',
              color: '#63d2ff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}
            onClick={() => window.open('https://github.com/azzayshakya', '_blank')}
          >
            View on GitHub →
          </button>
          <button
            className="cta-btn"
            style={{
              padding: '13px 32px',
              borderRadius: 12,
              background: 'rgba(99,210,255,0.1)',
              border: '1px solid rgba(99,210,255,0.2)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            Get Started
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 48,
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.04em',
            animation: visible ? 'fadeIn 0.6s ease 1.1s forwards' : 'none',
            opacity: 0,
          }}
        >
          MIT LICENSE · REACT 18 · VITE 6 · v2.0
        </p>
      </div>
    </div>
  )
}
