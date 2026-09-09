import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({
  title,
  subtitle,
  icon,
  breadcrumb,
  extra,
  children,
  onBack,
  showBack = false,
  className = '',
  style = {},
}) => {
  const navigate = typeof useNavigate === 'function' ? useNavigate() : null
  const [isHovered, setIsHovered] = useState(false)

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else if (navigate) {
      navigate(-1)
    } else {
      window.history.back()
    }
  }

  const isBackVisible = showBack || Boolean(onBack)

  return (
    <div
      className={`page-wrapper-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 24,
        border: '1.5px solid #a7f3d0',
        background: '#ffffff',
        boxShadow: '0 12px 36px rgba(16, 185, 129, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        margin: '16px auto',
        width: '100%',
        fontFamily: 'var(--term-font, monospace)',
        ...style,
      }}
    >
      {/* Upper Terminal Banner */}
      <div
        style={{
          position: 'relative',
          padding: '24px 30px',
          background: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 45%, #34d399 100%)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Cyber / Circuit decorative lines */}
        <svg
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            height: '100%',
            width: '45%',
            opacity: 0.28,
            pointerEvents: 'none',
          }}
          viewBox="0 0 450 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 50 20 L 150 20 L 180 50 L 320 50 L 350 80 L 450 80"
            stroke="#047857"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 120 75 L 210 75 L 240 105 L 390 105"
            stroke="#047857"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect x="180" y="46" width="22" height="8" rx="2" fill="#047857" />
          <rect x="240" y="101" width="24" height="8" rx="2" fill="#047857" />
          <rect x="350" y="76" width="20" height="8" rx="2" fill="#047857" />
        </svg>

        {breadcrumb && <div style={{ marginBottom: 8, opacity: 0.85 }}>{breadcrumb}</div>}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Left Title Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {isBackVisible && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: '1px solid rgba(6, 95, 70, 0.2)',
                  background: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                  color: '#064e3b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isHovered ? 'translateX(-2px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {icon && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.35)',
                  border: '1px solid rgba(6, 95, 70, 0.15)',
                  color: '#047857',
                  fontSize: 22,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {icon}
              </div>
            )}

            <div>
              {title && (
                <h1
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: '#065f46',
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    color: '#064e3b',
                    letterSpacing: 0.8,
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{extra}</div>}
        </div>
      </div>

      {/* Main Page Body Card Area */}
      <div
        style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: '#ffffff',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PageHeader
