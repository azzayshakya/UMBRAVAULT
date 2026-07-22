const ROWS = 22
const COLS = 46

const LAND_MASK = [
  '0000111111100000000000111111111000000000000',
  '0001111111110000000001111111111100000000000',
  '0011111111111000000011111111111110000000000',
  '0111111111111100000111111111111111000000000',
  '0111111111111110001111111111111111000000000',
  '0011111111111111011111111111111110000000000',
  '0001111111111111111111111111111100000000000',
  '0000111111111111111111111111100000000000000',
  '0000011111111111111111111110000000000000000',
  '0000001111111111111111111000000000000000000',
  '0000000111111111111111100011111111100000000',
  '0000000011111111111111000111111111110000000',
  '0000000001111111111100001111111111111000000',
  '0000000000111111111000011111111111111100000',
  '0000000000011111100000111111111111111110000',
  '0000000000001110000001111111111111111000000',
  '0000000000000000000011111111111111100000000',
  '0000000000000000000111111111111100000000000',
  '0000000000000000001111111111110000000000000',
  '0000000000000000011111111111000000000000000',
  '0000000000000000111111111000000000000000000',
  '0000000000000000011111100000000000000000000',
]

const WIDTH = 700
const HEIGHT = 300
const DOT_R = 1.4

const dots = []
LAND_MASK.forEach((rowStr, rowIndex) => {
  const cx = (COLS - 1) / 2
  const cy = (ROWS - 1) / 2
  rowStr.split('').forEach((cell, colIndex) => {
    if (cell !== '1') return
    // fade dots slightly based on distance from centre for a globe-curve feel
    const dist = Math.hypot((colIndex - cx) / cx, (rowIndex - cy) / cy)
    dots.push({
      x: (colIndex / (COLS - 1)) * WIDTH,
      y: (rowIndex / (ROWS - 1)) * HEIGHT,
      opacity: Math.max(0.15, 0.55 - dist * 0.25),
    })
  })
})

const GlobeVisual = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', maxHeight: 300 }}
      >
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={DOT_R}
            fill="var(--term-green, #22e07a)"
            opacity={d.opacity}
          />
        ))}

        {/* Pulsing location marker, anchored center-ish over the mask */}
        <g transform={`translate(${WIDTH * 0.5}, ${HEIGHT * 0.42})`}>
          <circle
            r="14"
            fill="var(--term-green, #22e07a)"
            opacity="0.12"
            className="dash-globe__ring dash-globe__ring--1"
          />
          <circle
            r="14"
            fill="var(--term-green, #22e07a)"
            opacity="0.12"
            className="dash-globe__ring dash-globe__ring--2"
          />
          <circle r="5" fill="var(--term-green, #22e07a)" className="dash-globe__core" />
        </g>
      </svg>
    </div>
  )
}

export default GlobeVisual
