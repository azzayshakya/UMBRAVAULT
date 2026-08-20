import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Remove if not using react-router

const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  extra,
  onBack, // Custom back function: () => navigate(...)
  showBack = true, // Boolean to enable the back button
  titleStyle,
  subtitleStyle,
  style,
  className = '',
}) => {
  const navigate = useNavigate?.()
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
      className={`page-header-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 20,
        fontFamily: 'var(--term-font, monospace)',
        ...style,
      }}
    >
      {breadcrumb && <div style={{ marginBottom: 4 }}>{breadcrumb}</div>}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side: Back Button + Title & Subtitle */}
        <div
          style={{
            display: 'flex',
            alignItems: subtitle ? 'flex-start' : 'center',
            gap: 12,
            flex: '1 1 240px',
            minWidth: 0,
          }}
        >
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
                width: 32,
                height: 32,
                padding: 0,
                borderRadius: '6px',
                border: 'none',
                background: isHovered
                  ? 'var(--color-bg-hover, rgba(0, 0, 0, 0.05))'
                  : 'transparent',
                color: isHovered
                  ? 'var(--color-text, #0f172a)'
                  : 'var(--color-text-secondary, #64748b)',
                cursor: 'pointer',
                flexShrink: 0,
                marginTop: subtitle ? 0 : 0,
                alignSelf: subtitle ? 'flex-start' : 'center',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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

          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            {title && (
              <h1
                style={{
                  color: 'var(--color-primary, #39ff6a)',
                  fontSize: 24,
                  lineHeight: '32px',
                  letterSpacing: 1.5,
                  margin: 0,
                  fontWeight: 700,
                  textShadow: '0 0 10px rgba(57, 255, 106, 0.35)',
                  wordBreak: 'break-word',
                  ...titleStyle,
                }}
              >
                {title}
              </h1>
            )}

            {subtitle && (
              <p
                style={{
                  color: 'var(--color-secondary, #888)',
                  fontSize: 12,
                  marginTop: 4,
                  marginBottom: 0,
                  lineHeight: 1.4,
                  ...subtitleStyle,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {extra && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              marginLeft: 'auto',
            }}
          >
            {extra}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
