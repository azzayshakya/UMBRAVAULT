export const toneColor = (tone) => {
  switch (tone) {
    case 'danger':
      return 'var(--term-red, #ef4444)'
    case 'warning':
      return 'var(--term-amber, #f59e0b)'
    case 'ok':
    default:
      return 'var(--color-primary, #22e07a)'
  }
}

export const statusDotColor = (status) => {
  switch (status) {
    case 'warning':
      return 'var(--term-amber, #f59e0b)'
    case 'danger':
      return 'var(--term-red, #ef4444)'
    default:
      return 'var(--color-primary, #22e07a)'
  }
}

export const buildSparklinePoints = (values = [], width = 64, height = 24) => {
  if (!values.length) return ''
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const step = width / (values.length - 1 || 1)

  return values
    .map((value, index) => {
      const x = index * step
      const y = height - ((value - min) / range) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
