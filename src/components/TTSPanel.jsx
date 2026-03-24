import { useState } from "react";
import { useTTS } from "../hooks/useTTS";
import {
  Btn,
  FieldLabel,
  Slider,
  StatusBar,
  StyledSelect,
  WaveBars,
} from "./UI";

export default function TTSPanel({
  simulateUnsupported,
  onSimulateUnsupportedChange,
}) {
  const [text, setText] = useState(
    "Welcome to the Speech API Lab!\nThis demo uses React hooks to drive the Web Speech API — reactive, clean, and ready to expand with Speech Recognition.",
  );

  const {
    supported,
    voices,
    selVoice,
    setSelVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    status,
    statusMsg,
    currentWord,
    speak,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
  } = useTTS({ simulateUnsupported });

  const speaking = status === "speaking";
  const paused = status === "paused";
  const active = speaking || paused;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {!supported && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 8,
            fontSize: ".8rem",
            lineHeight: 1.65,
            background: "rgba(248,113,113,.08)",
            border: "1px solid rgba(248,113,113,.25)",
            color: "var(--red)",
          }}
        >
          <strong>Not supported.</strong> SpeechSynthesis is unavailable in this
          browser.
        </div>
      )}

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: ".72rem",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: simulateUnsupported ? "var(--yellow)" : "var(--muted)",
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <input
          type="checkbox"
          checked={simulateUnsupported}
          onChange={(e) => onSimulateUnsupportedChange(e.target.checked)}
          style={{ accentColor: "var(--yellow)", width: 14, height: 14 }}
        />
        Simulate Unsupported API
      </label>

      {/* Text input */}
      <div>
        <FieldLabel htmlFor="tts-text">Text to speak</FieldLabel>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!supported}
          rows={5}
          style={{
            width: "100%",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: ".88rem",
            lineHeight: 1.75,
            padding: "12px 14px",
            resize: "vertical",
            outline: "none",
            transition: "border-color .2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Voice selector */}
      <div>
        <FieldLabel htmlFor="voice-sel">Voice</FieldLabel>
        <StyledSelect
          id="voice-sel"
          value={selVoice}
          onChange={(e) => setSelVoice(parseInt(e.target.value))}
          disabled={!supported}
        >
          {voices.length ? (
            voices.map((v, i) => (
              <option key={i} value={i}>
                {v.name} ({v.lang}){v.default ? " ★" : ""}
              </option>
            ))
          ) : (
            <option>Loading voices…</option>
          )}
        </StyledSelect>
      </div>

      {/* Sliders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Slider
          label="Rate"
          min={0.5}
          max={2}
          step={0.05}
          value={rate}
          onChange={setRate}
          format={(v) => v.toFixed(2) + "×"}
        />
        <Slider
          label="Pitch"
          min={0}
          max={2}
          step={0.05}
          value={pitch}
          onChange={setPitch}
          format={(v) => v.toFixed(2)}
        />
        <div style={{ gridColumn: "1 / -1" }}>
          <Slider
            label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={setVolume}
            format={(v) => Math.round(v * 100) + "%"}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn
          onClick={() => speak(text)}
          disabled={active || !supported}
          bg="var(--accent)"
          color="#000"
          animation={speaking ? "glow 1.4s ease-in-out infinite" : undefined}
        >
          {speaking ? "🔊 Speaking…" : "▶  Speak"}
        </Btn>
        <Btn
          onClick={pauseSpeech}
          disabled={!speaking || !supported}
          bg="rgba(250,204,21,.12)"
          color="var(--yellow)"
          border="1px solid rgba(250,204,21,.35)"
        >
          ⏸ Pause
        </Btn>
        <Btn
          onClick={resumeSpeech}
          disabled={!paused || !supported}
          bg="rgba(74,222,128,.1)"
          color="var(--green)"
          border="1px solid rgba(74,222,128,.3)"
        >
          ▷ Resume
        </Btn>
        <Btn
          onClick={stopSpeech}
          disabled={!active || !supported}
          bg="rgba(248,113,113,.1)"
          color="var(--red)"
          border="1px solid rgba(248,113,113,.3)"
        >
          ■ Stop
        </Btn>
      </div>

      {/* Live word display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          minHeight: 52,
          padding: "8px 0",
        }}
      >
        <WaveBars active={speaking} />
        {currentWord && (
          <span
            key={currentWord}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "var(--accent)",
              letterSpacing: "-.03em",
              animation: "wordPop .15s ease",
            }}
          >
            {currentWord}
          </span>
        )}
        <WaveBars active={speaking} />
      </div>

      {/* Status */}
      <StatusBar status={status} message={statusMsg} />
    </div>
  );
}
