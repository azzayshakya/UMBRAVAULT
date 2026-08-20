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
  const navigate = useNavigate?.() // Safe fallback if react-router-dom is used

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
      {/* Optional Top Navigation / Breadcrumbs */}
      {breadcrumb && <div style={{ marginBottom: 4 }}>{breadcrumb}</div>}

      {/* Main Header Content */}
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
            alignItems: 'flex-start',
            gap: 12,
            flex: '1 1 240px',
            minWidth: 0,
          }}
        >
          {isBackVisible && (
            <button
              type="button"
              onClick={handleBack}
              title="Go Back"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid rgba(57, 255, 106, 0.25)',
                background: 'rgba(57, 255, 106, 0.05)',
                color: 'var(--color-primary, #39ff6a)',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'inherit',
                flexShrink: 0,
                marginTop: 2,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(57, 255, 106, 0.15)'
                e.currentTarget.style.borderColor = 'var(--color-primary, #39ff6a)'
                e.currentTarget.style.boxShadow = '0 0 10px rgba(57, 255, 106, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(57, 255, 106, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(57, 255, 106, 0.25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              ←
            </button>
          )}

          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            {title && (
              <h1
                style={{
                  color: 'var(--color-primary, #39ff6a)',
                  fontSize: 24,
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
