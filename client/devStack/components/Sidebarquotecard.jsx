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
  border: '1px solid var(--color-border, var(--term-border))',
  background: 'linear-gradient(180deg, var(--color-bg-hover), var(--color-bg-container))',
  boxShadow: 'var(--color-glow)',
  overflow: 'hidden',
  flexShrink: 0,
  minHeight: '210px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}

const imageWrapStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 12,
}

const imageStyle = {
  width: 90,
  height: 80,
  filter: 'drop-shadow(var(--color-glow))',
  opacity: 0.95,
  pointerEvents: 'none',
  borderRadius: '10%',
  objectFit: 'cover',
}

const quoteTextStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 11,
  lineHeight: 1.6,
  color: 'var(--color-text)',
  letterSpacing: 0.2,
  transition: 'opacity 0.35s ease',
  textAlign: 'center',
}

const tagStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: 10.5,
  lineHeight: 1.6,
  color: 'var(--color-text-secondary)',
  marginTop: 6,
  transition: 'opacity 0.35s ease',
  textAlign: 'center',
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
