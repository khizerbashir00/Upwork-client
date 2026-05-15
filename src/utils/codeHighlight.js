/**
 * Prism.js syntax highlighting for academic code blocks (export + preview).
 */

import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-latex'

const LANG_ALIASES = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  'c++': 'cpp',
  csharp: 'csharp',
  shell: 'bash',
  sh: 'bash',
  md: 'markdown',
  tex: 'latex',
  math: 'latex',
  katex: 'latex',
}

export function resolvePrismLanguage(lang) {
  const key = (lang || '').toLowerCase().trim()
  const id = LANG_ALIASES[key] || key
  if (id && Prism.languages[id]) return id
  return 'javascript'
}

export function highlightCodeSource(code, lang) {
  const id = resolvePrismLanguage(lang)
  const grammar = Prism.languages[id]
  if (!grammar) return escapeHtml(code)
  try {
    return Prism.highlight(code, grammar, id)
  } catch {
    return escapeHtml(code)
  }
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function buildHighlightedPreHtml(code, lang) {
  const id = resolvePrismLanguage(lang)
  const inner = highlightCodeSource(code, lang)
  return `<pre class="acad-pre language-${id}"><code class="language-${id}">${inner}</code></pre>`
}
