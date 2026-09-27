export const NOTE_TYPE = {
  THEORY: 'theory',
  SNIPPET: 'snippet',
  QUESTION: 'question',
}

export const NOTE_TYPE_OPTIONS = [
  { label: 'THEORY', value: NOTE_TYPE.THEORY },
  { label: 'SNIPPET', value: NOTE_TYPE.SNIPPET },
  { label: 'QUESTION', value: NOTE_TYPE.QUESTION },
]

export const NOTE_TYPE_BADGE_CONFIG = {
  [NOTE_TYPE.THEORY]: { label: 'theory', color: 'var(--color-primary)' },
  [NOTE_TYPE.SNIPPET]: { label: 'snippet', color: '#38bdf8' },
  [NOTE_TYPE.QUESTION]: { label: 'question', color: '#f5c542' },
}

// Sticky-note card colors, cycled by topic so the vault grid stays visually
// distinct without every topic needing a manually picked color
export const TOPIC_CARD_PALETTE = [
  { accent: '#f5c542', bg: 'rgba(245, 197, 66, 0.08)' },
  { accent: '#39ff6a', bg: 'rgba(57, 255, 106, 0.08)' },
  { accent: '#38bdf8', bg: 'rgba(56, 189, 248, 0.08)' },
  { accent: '#a78bfa', bg: 'rgba(167, 139, 250, 0.08)' },
  { accent: '#f97316', bg: 'rgba(249, 115, 22, 0.08)' },
  { accent: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)' },
]
export const NOTE_CARD_PALETTE = [
  { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' }, // Sky Blue
  { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }, // Mint / Emerald
  { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' }, // Iris / Lavender
  { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' }, // Rose Tint
  { bg: '#ccfbf1', text: '#0f766e', border: '#99f6e4' }, // Modern Teal
  { bg: '#fef3c7', text: '#b45309', border: '#fde68a' }, // Warm Amber (Balanced)
]
