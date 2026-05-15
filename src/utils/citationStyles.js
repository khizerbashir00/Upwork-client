/**
 * Academic citation formatting: APA, IEEE, Chicago, Harvard.
 */

export const CITATION_STYLES = ['apa', 'ieee', 'chicago', 'harvard']

const STYLE_ALIASES = {
  apa: 'apa',
  ieee: 'ieee',
  chicago: 'chicago',
  harvard: 'harvard',
  harvard1: 'harvard',
}

export function detectCitationStyle(raw) {
  const m = raw.match(/@(?:citation-style|style)\s*:\s*(apa|ieee|chicago|harvard)\b/i)
  if (m) return STYLE_ALIASES[m[1].toLowerCase()] || 'apa'
  if (/\[\d+\]/.test(raw) && /IEEE|Proc\.|Transactions on/i.test(raw)) return 'ieee'
  if (/\([A-Z][a-z]+,?\s+\d{4}[a-z]?\)/.test(raw)) return 'harvard'
  return 'apa'
}

function parseRefLine(line) {
  const t = line.trim()
  if (!t) return null

  const doi = t.match(/\b(10\.\d{4,}\/[^\s]+)/i)?.[1]
  const year = t.match(/\b(19|20)\d{2}[a-z]?\b/)?.[0]
  const authors =
    t.match(/^([^(]+?)(?:\s*\(|,|\.\s+\d{4})/)?.[1]?.trim() ||
    t.split('.')[0]?.trim() ||
    'Unknown'

  return { raw: t, authors, year: year || 'n.d.', doi, title: extractTitle(t) }
}

function extractTitle(t) {
  const quoted = t.match(/"([^"]+)"/)?.[1] || t.match(/'([^']+)'/)?.[1]
  if (quoted) return quoted
  const afterYear = t.match(/\(\d{4}[a-z]?\)\.\s*([^.]+)/)?.[1]
  return afterYear?.trim() || ''
}

function formatApa(ref, index) {
  const a = ref.authors.replace(/\s+and\s+/gi, ', & ').replace(/,([^,])/, ', $1')
  const title = ref.title ? `${ref.title}. ` : ''
  const doi = ref.doi ? `https://doi.org/${ref.doi}` : ''
  return `${a} (${ref.year}). ${title}${doi || ref.raw}`.trim()
}

function formatIeee(ref, index) {
  return `[${index + 1}] ${ref.authors}, "${ref.title || ref.raw}," ${ref.year}.`
}

function formatChicago(ref) {
  const a = ref.authors
  const title = ref.title ? `"${ref.title}." ` : ''
  return `${a}. ${title}(${ref.year}).`
}

function formatHarvard(ref) {
  const a = ref.authors.split(',')[0]?.trim() || ref.authors
  const etal = ref.authors.includes(',') ? ' et al.' : ''
  const title = ref.title ? ` ${ref.title}.` : ''
  return `${a}${etal} (${ref.year}).${title}`
}

const FORMATTERS = {
  apa: formatApa,
  ieee: formatIeee,
  chicago: formatChicago,
  harvard: formatHarvard,
}

export function formatReferenceLine(line, style, index = 0) {
  const ref = parseRefLine(line)
  if (!ref) return line
  const fn = FORMATTERS[style] || FORMATTERS.apa
  return fn(ref, index)
}

export function formatReferencesBlock(lines, style) {
  return lines
    .map((ln, i) => {
      const t = ln.trim()
      if (!t || /^(references|bibliography|works cited)\s*:?\s*$/i.test(t)) return ln
      return formatReferenceLine(t, style, i)
    })
    .join('\n')
}

export function stripCitationStyleDirective(raw) {
  return raw.replace(/^@(?:citation-style|style)\s*:\s*(?:apa|ieee|chicago|harvard)\s*\n?/im, '')
}
