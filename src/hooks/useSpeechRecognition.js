import { useCallback, useEffect, useRef, useState } from "react";

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

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
  const supported = !!SR;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [lang, setLang] = useState("en-US");
  const [continuous, setContinuous] = useState(true);
  const [confidence, setConfidence] = useState(null);
  const [statusMsg, setStatusMsg] = useState(
    supported
      ? "Press the mic button to start listening."
      : "Speech recognition is not supported in this browser.",
  );

  const recogRef = useRef(null);
  const langRef = useRef("en-US");
  const continuousRef = useRef(true);
  const shouldListenRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const hadFatalErrorRef = useRef(false);
  const restartTimerRef = useRef(null);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    continuousRef.current = continuous;
  }, [continuous]);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const detachRecognitionHandlers = useCallback((recognition) => {
    if (!recognition) return;
    recognition.onstart = null;
    recognition.onaudiostart = null;
    recognition.onsoundstart = null;
    recognition.onspeechstart = null;
    recognition.onresult = null;
    recognition.onnomatch = null;
    recognition.onspeechend = null;
    recognition.onsoundend = null;
    recognition.onaudioend = null;
    recognition.onerror = null;
    recognition.onend = null;
  }, []);

  const stopCurrentRecognition = useCallback((mode = "stop") => {
    const recognition = recogRef.current;
    if (!recognition) return;
    try {
      if (mode === "abort") {
        recognition.abort();
      } else {
        recognition.stop();
      }
    } catch {
      // Ignore stop/abort races when the service is already ended.
    }
  }, []);

  const normalizeErrorMessage = useCallback((errorCode) => {
    switch (errorCode) {
      case "no-speech":
        return "No speech detected. Try speaking more clearly.";
      case "audio-capture":
        return "No microphone was found or microphone access failed.";
      case "not-allowed":
        return "Microphone access was denied. Please allow mic permission.";
      case "service-not-allowed":
        return "Speech recognition service is not allowed in this context.";
      case "network":
        return "Network error while contacting the speech service.";
      case "language-not-supported":
        return `Language ${langRef.current} is not supported.`;
      case "bad-grammar":
        return "Recognition failed because of a grammar configuration issue.";
      case "aborted":
        return "Recognition was stopped.";
      default:
        return `Speech recognition error: ${errorCode}`;
    }
  }, []);

  const startRecognitionSession = useCallback(() => {
    if (!supported) return;

    clearRestartTimer();
    hadFatalErrorRef.current = false;

    if (recogRef.current) {
      stopCurrentRecognition("abort");
      detachRecognitionHandlers(recogRef.current);
      recogRef.current = null;
    }

    const recognition = new SR();
    recognition.lang = langRef.current;
    recognition.continuous = continuousRef.current;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatusMsg("Listening...");
      setInterim("");
    };

    recognition.onaudiostart = () => {
      setStatusMsg("Microphone active. Capturing audio...");
    };

    recognition.onsoundstart = () => {
      setStatusMsg("Sound detected...");
    };

    recognition.onspeechstart = () => {
      setStatusMsg("Speech detected...");
    };

    recognition.onresult = (e) => {
      let finalChunk = "";
      let interimChunk = "";
      let lastConfidence = null;

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];

        console.log("Result received:", result);
        console.log("Interim chunk:", interimChunk);

        if (result.isFinal) {
          finalChunk += result[0].transcript;
          lastConfidence = result[0].confidence;
        } else {
          interimChunk += result[0].transcript;
        }
      }

      if (finalChunk) {
        setTranscript((prev) => `${prev}${finalChunk.trim()} `);
        if (lastConfidence !== null)
          setConfidence(Math.round(lastConfidence * 100));
        setStatusMsg("Result received.");
      }

      setInterim(interimChunk);
    };

    recognition.onnomatch = () => {
      setStatusMsg("No confident match found. Please try again.");
    };

    recognition.onspeechend = () => {
      setStatusMsg("Speech ended. Processing...");
    };

    recognition.onsoundend = () => {
      setStatusMsg("Sound ended.");
    };

    recognition.onaudioend = () => {
      setStatusMsg("Audio capture ended.");
    };

    recognition.onerror = (e) => {
      const code = e.error || "unknown";

      if (code === "aborted" && stopRequestedRef.current) {
        return;
      }

      if (
        code === "not-allowed" ||
        code === "service-not-allowed" ||
        code === "audio-capture"
      ) {
        hadFatalErrorRef.current = true;
      }

      setListening(false);
      setInterim("");
      setStatusMsg(normalizeErrorMessage(code));
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");

      if (stopRequestedRef.current) {
        setStatusMsg("Stopped. Press mic to listen again.");
        stopRequestedRef.current = false;
        return;
      }

      if (
        shouldListenRef.current &&
        continuousRef.current &&
        !hadFatalErrorRef.current
      ) {
        setStatusMsg("Connection ended. Restarting...");
        restartTimerRef.current = setTimeout(() => {
          startRecognitionSession();
        }, 250);
        return;
      }

      setStatusMsg("Stopped. Press mic to listen again.");
    };

    recogRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setListening(false);
      setStatusMsg("Could not start recognition. It may already be running.");
    }
  }, [
    supported,
    clearRestartTimer,
    stopCurrentRecognition,
    detachRecognitionHandlers,
    normalizeErrorMessage,
  ]);

  const startListening = useCallback(() => {
    if (!supported) return;
    if (listening) return;

    shouldListenRef.current = true;
    stopRequestedRef.current = false;
    setStatusMsg("Starting recognition...");
    startRecognitionSession();
  }, [supported, listening, startRecognitionSession]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    stopRequestedRef.current = true;
    clearRestartTimer();
    stopCurrentRecognition("stop");
  }, [clearRestartTimer, stopCurrentRecognition]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterim("");
    setConfidence(null);
  }, []);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      stopRequestedRef.current = true;
      clearRestartTimer();
      stopCurrentRecognition("abort");
      detachRecognitionHandlers(recogRef.current);
      recogRef.current = null;
    };
  }, [clearRestartTimer, stopCurrentRecognition, detachRecognitionHandlers]);

  return {
    supported,
    listening,
    transcript,
    interim,
    lang,
    setLang,
    continuous,
    setContinuous,
    confidence,
    statusMsg,
    startListening,
    stopListening,
    clearTranscript,
  };
}
