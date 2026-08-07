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
  [NOTE_TYPE.THEORY]: { label: 'theory', color: 'var(--term-green)' },
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
  { bg: '#e9d873', text: '#2a2205' },
  { bg: '#9fe6a0', text: '#0c2b0d' },
  { bg: '#f2a6c1', text: '#3a0f22' },
  { bg: '#9cd6f0', text: '#082430' },
  { bg: '#c9b6f2', text: '#26123f' },
  { bg: '#f0b978', text: '#3a1e04' },
]
