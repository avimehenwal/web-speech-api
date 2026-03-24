import { useState, useEffect, useCallback, useRef } from 'react'

const synth = window.speechSynthesis

/**
 * useTTS — encapsulates all Text-to-Speech logic.
 *
 * Returns:
 *  voices, selVoice, setSelVoice,
 *  rate, setRate, pitch, setPitch, volume, setVolume,
 *  status, statusMsg, currentWord,
 *  speak, pauseSpeech, resumeSpeech, stopSpeech,
 *  supported
 */
export function useTTS() {
  const supported = 'speechSynthesis' in window

  const [voices, setVoices]       = useState([])
  const [selVoice, setSelVoice]   = useState(0)
  const [rate, setRate]           = useState(1.0)
  const [pitch, setPitch]         = useState(1.0)
  const [volume, setVolume]       = useState(1.0)
  const [status, setStatus]       = useState('idle')   // idle | speaking | paused | done | error
  const [statusMsg, setStatusMsg] = useState('Ready — enter text and press Speak.')
  const [currentWord, setCurrentWord] = useState('')

  // Load available voices (Chrome fires onvoiceschanged asynchronously)
  useEffect(() => {
    if (!supported) return
    function load() {
      const v = synth.getVoices()
      if (v.length) setVoices(v)
    }
    load()
    speechSynthesis.onvoiceschanged = load
    return () => { speechSynthesis.onvoiceschanged = null }
  }, [supported])

  const speak = useCallback((text) => {
    if (!supported) return
    const t = text.trim()
    if (!t) { setStatusMsg('⚠ Please enter some text first.'); return }

    synth.cancel()
    const utt = new SpeechSynthesisUtterance(t)
    if (voices[selVoice]) utt.voice = voices[selVoice]
    utt.rate   = rate
    utt.pitch  = pitch
    utt.volume = volume

    utt.onstart    = () => { setStatus('speaking'); setStatusMsg('Speaking…') }
    utt.onpause    = () => { setStatus('paused');   setStatusMsg('Paused.') }
    utt.onresume   = () => { setStatus('speaking'); setStatusMsg('Resumed…') }
    utt.onend      = () => { setStatus('done');     setStatusMsg('Finished.'); setCurrentWord('') }
    utt.onerror    = (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return
      setStatus('error')
      setStatusMsg(`Error: ${e.error}`)
    }
    utt.onboundary = (e) => {
      if (e.name !== 'word') return
      const w = t.substr(e.charIndex, e.charLength || 0).replace(/\W/g, '')
      if (w) setCurrentWord(w)
    }

    synth.speak(utt)
  }, [supported, voices, selVoice, rate, pitch, volume])

  const pauseSpeech  = useCallback(() => synth.pause(), [])
  const resumeSpeech = useCallback(() => synth.resume(), [])
  const stopSpeech   = useCallback(() => {
    synth.cancel()
    setStatus('idle')
    setStatusMsg('Stopped.')
    setCurrentWord('')
  }, [])

  return {
    supported,
    voices, selVoice, setSelVoice,
    rate, setRate,
    pitch, setPitch,
    volume, setVolume,
    status, statusMsg, currentWord,
    speak, pauseSpeech, resumeSpeech, stopSpeech,
  }
}
