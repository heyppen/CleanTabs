
// in miliseconds
const units: { [key: string]: number } = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' })

export const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.getTime() - d2.getTime()

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units)
    if (Math.abs(elapsed) > units[u] || u == 'second')
      return rtf.format(
        Math.round(elapsed / units[u]),
        u as Intl.RelativeTimeFormatUnit
      )
}


export function NowHuman(): string {
  return new Date().toLocaleString()
}
