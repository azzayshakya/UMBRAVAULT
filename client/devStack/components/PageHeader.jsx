import React from 'react'

const PageHeader = ({
  title,
  subtitle,
  breadcrumb,
  extra,
  titleStyle,
  subtitleStyle,
  style,
  className = '',
}) => {
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
          flexWrap: 'wrap', // Ensures full responsiveness on smaller screens
        }}
      >
        {/* Left Side: Title & Subtitle */}
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
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

        {/* Right Side: Extra Actions / Buttons */}
        {extra && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              marginLeft: 'auto', // Pushes right on desktop, wraps naturally on mobile
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
