import { useEffect, useState } from 'react'

const DEFAULT_QUOTES = [
  {
    text: 'The quieter you become, the more you are able to hear.',
    tag: 'We do not hack systems, we study them.',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    tag: '— Alan Kay',
  },
]

const wrapStyle = {
  position: 'relative',
  margin: '16px',
  padding: '16px 14px',
  borderRadius: 'var(--radius, 8px)',
  border: '1px solid var(--term-border, rgba(57, 255, 106, 0.25))',
  background:
    'linear-gradient(180deg, rgba(57,255,106,0.05), rgba(3,9,5,0.92)), var(--color-bg-container)',
  overflow: 'hidden',
  flexShrink: 0,
  minHeight: '210px',
  // border: '2px red solid',
}

const imageWrapStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 12,
}

const imageStyle = {
  width: 100,
  height: 89,
  filter: 'drop-shadow(0 0 10px rgba(57, 255, 106, 0.45))',
  opacity: 0.92,
  pointerEvents: 'none',
  borderRadius: '40%',
}
const quoteTextStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 11,
  lineHeight: 1.6,
  color: 'var(--color-secondary-hover, var(--color-text))',
  letterSpacing: 0.2,
  transition: 'opacity 0.35s ease',
}

const tagStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 10.5,
  lineHeight: 1.6,
  color: 'var(--color-secondary, var(--color-text-muted))',
  marginTop: 6,
  transition: 'opacity 0.35s ease',
}

const SidebarQuoteCard = ({
  quotes = DEFAULT_QUOTES,
  image = '/images/global/user_profile_2.png',
  intervalMs = 8000,
  collapsed = false,
}) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (collapsed || quotes.length <= 1) return

    const rotate = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length)
        setVisible(true)
      }, 350)
    }, intervalMs)

    return () => clearInterval(rotate)
  }, [collapsed, quotes.length, intervalMs])

  if (collapsed) return null

  const current = quotes[index]

  return (
    <div style={wrapStyle}>
      <div style={imageWrapStyle}>
        <img src={image} alt="" style={imageStyle} draggable={false} />
      </div>
      <p style={{ ...quoteTextStyle, opacity: visible ? 1 : 0 }}>&quot;{current.text}&quot;</p>
      <p style={{ ...tagStyle, opacity: visible ? 1 : 0 }}>{current.tag}</p>
    </div>
  )
}

export default SidebarQuoteCard
