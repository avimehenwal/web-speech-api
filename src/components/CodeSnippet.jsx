import React, { useState } from 'react'

const TTS_CODE = `// src/hooks/useTTS.js — key excerpt
import { useState, useEffect, useCallback } from 'react'

export function useTTS() {
  const [voices, setVoices]   = useState([])
  const [status, setStatus]   = useState('idle')
  const [currentWord, setCurrentWord] = useState('')

  // Load voices (Chrome fires onvoiceschanged async)
  useEffect(() => {
    function load() {
      const v = window.speechSynthesis.getVoices()
      if (v.length) setVoices(v)
    }
    load()
    speechSynthesis.onvoiceschanged = load
  }, [])

  const speak = useCallback((text, voice, rate, pitch, volume) => {
    const utt    = new SpeechSynthesisUtterance(text)
    utt.voice    = voice
    utt.rate     = rate    // 0.1 – 10
    utt.pitch    = pitch   // 0 – 2
    utt.volume   = volume  // 0 – 1

    utt.onstart    = () => setStatus('speaking')
    utt.onend      = () => setStatus('done')
    utt.onboundary = (e) => {
      if (e.name === 'word')
        setCurrentWord(text.substr(e.charIndex, e.charLength))
    }
    window.speechSynthesis.speak(utt)
  }, [])

  return { voices, status, currentWord, speak }
}`

const SR_CODE = `// src/hooks/useSpeechRecognition.js — key excerpt
import { useState, useRef, useCallback } from 'react'
const SR = window.SpeechRecognition || window.webkitSpeechRecognition

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim]       = useState('')
  const [listening, setListening]   = useState(false)
  const recogRef = useRef(null)

  const startListening = useCallback((lang, continuous) => {
    const r = new SR()
    r.lang           = lang         // e.g. 'en-US'
    r.continuous     = continuous   // keep listening after pause
    r.interimResults = true         // show partial results

    r.onresult = (e) => {
      let final = '', interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        e.results[i].isFinal
          ? (final += e.results[i][0].transcript)
          : (interimText += e.results[i][0].transcript)
      }
      if (final) setTranscript(p => p + final + ' ')
      setInterim(interimText)
    }

    r.onend = () => setListening(false)
    recogRef.current = r
    r.start()
    setListening(true)
  }, [])

  const stopListening = () => recogRef.current?.stop()

  return { transcript, interim, listening, startListening, stopListening }
}`

export default function CodeSnippet({ activeTab }) {
  const [open, setOpen] = useState(false)
  const code = activeTab === 'tts' ? TTS_CODE : SR_CODE

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      overflow: 'hidden', marginTop: 8,
    }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '13px 20px', cursor: 'pointer',
          background: open ? 'var(--card)' : 'var(--surface)',
          fontSize: '.68rem', letterSpacing: '.14em', textTransform: 'uppercase',
          color: 'var(--muted)', transition: 'background .2s', userSelect: 'none',
        }}
      >
        <span>How {activeTab === 'tts' ? 'Text-to-Speech' : 'Speech Recognition'} works</span>
        <span style={{
          transform: open ? 'rotate(90deg)' : 'none',
          transition: 'transform .2s', fontSize: '.6rem',
        }}>
          ▶
        </span>
      </div>

      {open && (
        <pre style={{
          background: '#050507', padding: '20px 24px',
          fontSize: '.74rem', lineHeight: 1.85,
          color: '#94a3b8', overflowX: 'auto',
          borderTop: '1px solid var(--border)', margin: 0,
        }}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
