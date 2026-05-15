/**
 * Rule-based academic text cleanup (production formatting, no external AI API).
 */

const MULTISPACE = /[ \t]{2,}/g
const MULTIBLANK = /\n{3,}/g

export function cleanupAcademicText(raw) {
  if (!raw) return ''
  let s = raw.replace(/\r\n/g, '\n')

  s = s.replace(/\t/g, '  ')
  s = s.replace(MULTISPACE, ' ')
  s = s.replace(/ +\n/g, '\n')
  s = s.replace(/\n +/g, '\n')
  s = s.replace(MULTIBLANK, '\n\n')

  s = s.replace(/(^|\n)(#{1,6}\s+[^\n]+)/g, (_, pre, heading) => {
    const inner = heading.replace(/^(#{1,6}\s+)(.+)$/, (_, hashes, text) => {
      const t = text.trim()
      if (t.length < 4 || /^[A-Z0-9]/.test(t)) return `${hashes}${t}`
      return `${hashes}${t.charAt(0).toUpperCase()}${t.slice(1)}`
    })
    return pre + inner
  })

  s = s.replace(/([.!?])([A-Za-z])/g, '$1 $2')
  s = s.replace(/([a-z])([A-Z])/g, (m, a, b) => {
    if (/^(Mc|Mac|La|Le|De|Van|von|IEEE|APA|DSGE|GDP|PDF|URL)$/i.test(a + b)) return m
    return `${a} ${b}`
  })

  return s.trimEnd() + (s.endsWith('\n') ? '' : '')
}
