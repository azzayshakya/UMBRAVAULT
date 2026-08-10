const terminalFrameStyle = {
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  background: 'var(--color-secondary-light)',
  border: '1px solid var(--term-border)',
  borderRadius: 'var(--term-radius)',
  boxShadow: 'var(--color-glow)',
  fontFamily: 'var(--term-font)',
  color: 'var(--color-secondary-hover)',
}

const cornerBaseStyle = {
  position: 'absolute',
  width: 14,
  height: 14,
  zIndex: 3,
  pointerEvents: 'none',
  animation: 'term-corner-pulse 3s ease-in-out infinite',
}

const scanlinesStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(57,255,106,0.035) 3px)',
  mixBlendMode: 'overlay',
}

const shimmerBaseStyle = {
  backgroundImage:
    'linear-gradient(90deg, rgba(57,255,106,0.05) 25%, rgba(57,255,106,0.16) 50%, rgba(57,255,106,0.05) 75%)',
  backgroundSize: '300px 100%',
  animation: 'proj-shimmer-sweep 1.3s infinite linear',
  borderRadius: 4,
}

export function ProjectCardSkeleton({ index }) {
  return (
    <div
      style={{
        ...terminalFrameStyle,
        padding: 0,
        minHeight: 240,
        animationDelay: `${index * 70}ms`,
      }}
    >
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          left: -1,
          borderTop: '2px solid var(--color-primary)',
          borderLeft: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          right: -1,
          borderTop: '2px solid var(--color-primary)',
          borderRight: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          left: -1,
          borderBottom: '2px solid var(--color-primary)',
          borderLeft: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          right: -1,
          borderBottom: '2px solid var(--color-primary)',
          borderRight: '2px solid var(--color-primary)',
        }}
      />
      <span style={scanlinesStyle} />

      <div
        style={{
          minHeight: 240,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            ...shimmerBaseStyle,
            width: 50,
            height: 10,
            alignSelf: 'flex-end',
          }}
        />

        <div
          style={{
            ...shimmerBaseStyle,
            width: 70,
            height: 70,
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            ...shimmerBaseStyle,
            width: '70%',
            height: 18,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div style={{ ...shimmerBaseStyle, width: '90%', height: 10 }} />
          <div style={{ ...shimmerBaseStyle, width: '75%', height: 10 }} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          <div
            style={{
              ...shimmerBaseStyle,
              width: 60,
              height: 20,
            }}
          />

          <div
            style={{
              ...shimmerBaseStyle,
              width: 60,
              height: 20,
            }}
          />
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--term-border)',
          }}
        >
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
        </div>
      </div>
    </div>
  )
}
