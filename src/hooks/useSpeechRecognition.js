import { useState, useRef, useCallback } from 'react'

const SR = window.SpeechRecognition || window.webkitSpeechRecognition

/**
 * useSpeechRecognition — encapsulates all Speech Recognition logic.
 *
 * Returns:
 *  supported, listening,
 *  transcript, interim,
 *  lang, setLang,
 *  continuous, setContinuous,
 *  confidence,
 *  statusMsg,
 *  startListening, stopListening, clearTranscript
 */
export function useSpeechRecognition() {
  const supported = !!SR

  const [listening, setListening]     = useState(false)
  const [transcript, setTranscript]   = useState('')
  const [interim, setInterim]         = useState('')
  const [lang, setLang]               = useState('en-US')
  const [continuous, setContinuous]   = useState(true)
  const [confidence, setConfidence]   = useState(null)
  const [statusMsg, setStatusMsg]     = useState('Press the mic button to start listening.')

  const recogRef = useRef(null)

  const startListening = useCallback(() => {
    if (!supported) return
    const r = new SR()
    r.lang            = lang
    r.continuous      = continuous
    r.interimResults  = true
    r.maxAlternatives = 1

    r.onstart = () => {
      setListening(true)
      setStatusMsg('Listening…')
      setInterim('')
    }

    r.onresult = (e) => {
      let finalChunk = ''
      let interimChunk = ''
      let lastConfidence = null

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) {
          finalChunk += result[0].transcript
          lastConfidence = result[0].confidence
        } else {
          interimChunk += result[0].transcript
        }
      }

      if (finalChunk) {
        setTranscript((prev) => prev + finalChunk + ' ')
        if (lastConfidence !== null) setConfidence(Math.round(lastConfidence * 100))
      }
      setInterim(interimChunk)
    }

    r.onerror = (e) => {
      // 'aborted' fires when we call stop() manually — not a real error
      if (e.error === 'aborted') return
      setStatusMsg(`Error: ${e.error}`)
      setListening(false)
    }

    r.onend = () => {
      setListening(false)
      setInterim('')
      setStatusMsg('Stopped. Press mic to listen again.')
    }

    recogRef.current = r
    r.start()
  }, [supported, lang, continuous])

  const stopListening = useCallback(() => {
    recogRef.current?.stop()
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterim('')
    setConfidence(null)
  }, [])

  return {
    supported,
    listening,
    transcript, interim,
    lang, setLang,
    continuous, setContinuous,
    confidence,
    statusMsg,
    startListening, stopListening, clearTranscript,
  }
}
