// Cohesive palette (blue / teal / indigo family) — not rainbow
export const palette = {
  primary: '#3b82f6', // blue-500
  secondary: '#06b6d4', // cyan-500
  tertiary: '#8b5cf6', // violet-500
  quaternary: '#14b8a6', // teal-500
  quinary: '#6366f1', // indigo-500
  senary: '#0ea5e9', // sky-500
  positive: '#10b981', // emerald-500
  negative: '#ef4444', // red-500
  gridDark: 'rgba(255, 255, 255, 0.08)',
  gridLight: 'rgba(0, 0, 0, 0.08)',
  textDark: 'rgba(255, 255, 255, 0.75)',
  textLight: 'rgba(0, 0, 0, 0.75)'
}

export const seriesColors = [
  palette.primary,
  palette.secondary,
  palette.tertiary,
  palette.quaternary,
  palette.quinary,
  palette.senary
]

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'k'
  return n.toLocaleString()
}

export function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (Math.abs(n) >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'k'
  return '$' + n.toFixed(2)
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}
