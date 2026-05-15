import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Hero from '../components/Hero'
import InputPanel from '../components/InputPanel'
import Navbar from '../components/Navbar'
import OutputPanel from '../components/OutputPanel'
import Toast from '../components/Toast'
import {
  CATEGORIES,
  applyKatexToOutput,
  buildAcademicArticle,
  buildAcademicPlain,
  convert,
  preprocessAcademicDocument,
} from '../utils/conversionEngine'
import { INITIAL_DEMO, SAMPLES } from '../utils/samples'
import { exportOutputAsPdf, exportOutputAsWord } from '../utils/exportOutput'

function useSyncedScroll(inputEl, outputEl) {
  useEffect(() => {
    if (!inputEl || !outputEl) return

    let syncSource = null
    let releaseTimer = null
    let rafId = null

    function syncScroll(from, to) {
      if (syncSource && syncSource !== from) return
      syncSource = from

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const fromMax = from.scrollHeight - from.clientHeight
        const toMax = to.scrollHeight - to.clientHeight
        if (fromMax <= 0 || toMax <= 0) {
          syncSource = null
          return
        }
        const ratio = from.scrollTop / fromMax
        to.scrollTop = ratio * toMax
      })

      clearTimeout(releaseTimer)
      releaseTimer = window.setTimeout(() => {
        syncSource = null
      }, 120)
    }

    const onInputScroll = () => syncScroll(inputEl, outputEl)
    const onOutputScroll = () => syncScroll(outputEl, inputEl)

    inputEl.addEventListener('scroll', onInputScroll, { passive: true })
    outputEl.addEventListener('scroll', onOutputScroll, { passive: true })

    return () => {
      inputEl.removeEventListener('scroll', onInputScroll)
      outputEl.removeEventListener('scroll', onOutputScroll)
      clearTimeout(releaseTimer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [inputEl, outputEl])
}

export default function HomePage() {
  const [inputText, setInputText] = useState(INITIAL_DEMO)
  const [rawForOutput, setRawForOutput] = useState(INITIAL_DEMO)
  const [activeCategories, setActiveCategories] = useState(
    () => new Set(Object.keys(CATEGORIES)),
  )
  const [toast, setToast] = useState({ message: 'Done', visible: false, accent: '#4ee5a8' })
  const [scrollPorts, setScrollPorts] = useState({ input: null, output: null })

  const inputRef = useRef(null)
  const outputInnerRef = useRef(null)
  const inputTextRef = useRef(INITIAL_DEMO)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    inputTextRef.current = inputText
  }, [inputText])

  useEffect(() => {
    const id = window.setTimeout(() => setRawForOutput(inputText), 80)
    return () => clearTimeout(id)
  }, [inputText])

  const pipeline = useMemo(() => {
    const raw = rawForOutput
    if (!raw.trim()) {
      return {
        empty: true,
        result: null,
        articleHtml: '',
        lastPlain: '',
        diffRows: [],
        diffRuleCount: 0,
        diffEmptyMessage: 'Nothing converted yet.',
      }
    }

    const processed = preprocessAcademicDocument(raw)
    const result = convert(processed, activeCategories, { preprocessed: true })
    const articleHtml = buildAcademicArticle(processed, activeCategories, {
      preprocessed: true,
    })
    const lastPlain = `${buildAcademicPlain(processed, activeCategories)}\n\n${result.plain}`
    const sorted = [...result.stats.values()].sort((a, b) => b.count - a.count)

    return {
      empty: false,
      result,
      articleHtml,
      lastPlain,
      diffRows: sorted,
      diffRuleCount: result.stats.size,
      diffEmptyMessage:
        result.stats.size === 0 ? 'No symbols matched any active category.' : '',
    }
  }, [rawForOutput, activeCategories])

  useEffect(() => {
    if (pipeline.empty || !outputInnerRef.current) return
    const root = outputInnerRef.current
    requestAnimationFrame(() => {
      applyKatexToOutput(root)
      window.setTimeout(() => applyKatexToOutput(root), 40)
    })
  }, [pipeline.articleHtml, pipeline.empty])

  const showToast = useCallback((message, accent = '#4ee5a8') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, accent, visible: true })
    toastTimerRef.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 2200)
  }, [])

  const bumpPipeline = useCallback(() => {
    setRawForOutput(inputTextRef.current)
  }, [])

  const handleToggleCategory = useCallback(
    (key) => {
      setActiveCategories((prev) => {
        const n = new Set(prev)
        if (n.has(key)) n.delete(key)
        else n.add(key)
        return n
      })
      bumpPipeline()
    },
    [bumpPipeline],
  )

  const handleAllOn = useCallback(() => {
    setActiveCategories(new Set(Object.keys(CATEGORIES)))
    bumpPipeline()
  }, [bumpPipeline])

  const handleAllOff = useCallback(() => {
    setActiveCategories(new Set())
    bumpPipeline()
  }, [bumpPipeline])

  const handleClear = useCallback(() => {
    setInputText('')
    setRawForOutput('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const handleSample = useCallback((key) => {
    const sample = SAMPLES[key] || ''
    setInputText(sample)
    setRawForOutput(sample)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const handleConvert = useCallback(() => {
    bumpPipeline()
    showToast('Converted ✓')
  }, [bumpPipeline, showToast])

  const lastPlainRef = useRef('')
  useEffect(() => {
    lastPlainRef.current = pipeline.lastPlain
  }, [pipeline.lastPlain])

  const handleCopy = useCallback(async () => {
    const lastPlain = lastPlainRef.current
    if (!lastPlain) {
      showToast('Nothing to copy', '#fb7185')
      return
    }
    try {
      await navigator.clipboard.writeText(lastPlain)
      showToast('Copied to clipboard')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = lastPlain
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      showToast('Copied to clipboard')
    }
  }, [showToast])

  const handleExportPdf = useCallback(async () => {
    const el = outputInnerRef.current
    if (!el || pipeline.empty) {
      showToast('Nothing to export', '#fb7185')
      return
    }
    try {
      await exportOutputAsPdf(el)
      showToast('Downloaded glyph-output.pdf')
    } catch {
      showToast('PDF export failed', '#fb7185')
    }
  }, [pipeline.empty, showToast])

  const handleExportWord = useCallback(() => {
    const el = outputInnerRef.current
    if (!el || pipeline.empty) {
      showToast('Nothing to export', '#fb7185')
      return
    }
    try {
      exportOutputAsWord(el)
      showToast('Downloaded glyph-output.docx')
    } catch {
      showToast('Word export failed', '#fb7185')
    }
  }, [pipeline.empty, showToast])

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleConvert()
      }
    },
    [handleConvert],
  )

  const handleInputRef = useCallback((el) => {
    inputRef.current = el
    setScrollPorts((p) => ({ ...p, input: el }))
  }, [])

  const handleOutputRef = useCallback((el) => {
    setScrollPorts((p) => ({ ...p, output: el }))
  }, [])

  useSyncedScroll(scrollPorts.input, scrollPorts.output)

  const charCountText = `${rawForOutput.length.toLocaleString()} chars`
  const convBadgeText = pipeline.empty ? '0 converted' : `${pipeline.result.total} converted`

  return (
    <>
      <Navbar />
      <Hero />

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputPanel
            ref={handleInputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onClear={handleClear}
            onKeyDown={handleKeyDown}
            charCountText={charCountText}
            onConvert={handleConvert}
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
            onAllOn={handleAllOn}
            onAllOff={handleAllOff}
            onSample={handleSample}
          />
          <OutputPanel
            ref={handleOutputRef}
            innerRef={outputInnerRef}
            isEmpty={pipeline.empty}
            articleHtml={pipeline.articleHtml}
            convBadgeText={convBadgeText}
            diffRows={pipeline.diffRows}
            diffRuleCount={pipeline.diffRuleCount}
            diffEmptyMessage={pipeline.diffEmptyMessage}
            onCopy={handleCopy}
            onExportPdf={handleExportPdf}
            onExportWord={handleExportWord}
          />
        </div>

        <p className="mt-12 text-center text-xs text-white/30 font-mono tracking-wider">
          © Bibcit — Glyph · intelligent symbol engine
        </p>
      </main>

      <Toast message={toast.message} visible={toast.visible} accent={toast.accent} />
    </>
  )
}
