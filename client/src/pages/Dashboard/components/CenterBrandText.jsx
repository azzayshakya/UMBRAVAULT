const CenterBrandText = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 6,
      }}
    >
      <span
        className="dash-brand-glitch"
        data-text="TRUST NO ONE"
        style={{
          fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
          fontSize: 'clamp(22px, 3vw, 34px)',
          fontWeight: 700,
          letterSpacing: 4,
          color: 'var(--color-primary, #22e07a)',
        }}
      >
        TRUST NO ONE
      </span>
      <span
        style={{
          fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
          fontSize: 11,
          letterSpacing: 6,
          color: 'var(--color-secondary, #6b8f78)',
        }}
      >
        EVERYTHING IS A LIE
      </span>
    </div>
  )
}

export default CenterBrandText
