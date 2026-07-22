const PageLoader = ({ label = 'Loading...', fullScreen = true }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : '240px',
        backgroundColor: 'var(--color-bg-base)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid var(--color-border-default)',
          borderTopColor: 'var(--color-accent)',
          animation: 'page-loader-spin 0.7s linear infinite',
        }}
      />
      {label && (
        <span
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </span>
      )}

      <style>{`
        @keyframes page-loader-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default PageLoader
