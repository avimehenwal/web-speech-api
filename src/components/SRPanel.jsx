import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { Btn, FieldLabel, StyledSelect, WaveBars } from "./UI";

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "de-DE", label: "German" },
  { code: "fr-FR", label: "French" },
  { code: "es-ES", label: "Spanish" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "ja-JP", label: "Japanese" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "ko-KR", label: "Korean" },
  { code: "ar-SA", label: "Arabic" },
  { code: "hi-IN", label: "Hindi" },
];

export default function SRPanel() {
  const {
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
  } = useSpeechRecognition();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Not supported warning */}
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
          <strong>Not supported.</strong> SpeechRecognition requires Chrome,
          Edge, or Safari. Firefox does not support this API yet.
        </div>
      )}

      {/* Language + Continuous */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          alignItems: "end",
        }}
      >
        <div>
          <FieldLabel htmlFor="sr-lang">Recognition language</FieldLabel>
          <StyledSelect
            id="sr-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={listening || !supported}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </StyledSelect>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: ".72rem",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: continuous ? "var(--accent2)" : "var(--muted)",
            cursor: listening || !supported ? "not-allowed" : "pointer",
            paddingBottom: 10,
            whiteSpace: "nowrap",
            opacity: listening || !supported ? 0.5 : 1,
          }}
        >
          <input
            type="checkbox"
            checked={continuous}
            onChange={(e) => setContinuous(e.target.checked)}
            disabled={listening || !supported}
            style={{ accentColor: "var(--accent2)", width: 14, height: 14 }}
          />
          Continuous
        </label>
      </div>

      {/* Mic button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: "4px 0",
        }}
      >
        <WaveBars active={listening} color="var(--accent2)" />

        <button
          onClick={listening ? stopListening : startListening}
          disabled={!supported}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "none",
            cursor: supported ? "pointer" : "not-allowed",
            background: listening ? "var(--accent2)" : "var(--card)",
            color: listening ? "#000" : "var(--accent2)",
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .3s",
            animation: listening ? "micGlow 1.4s ease-in-out infinite" : "none",
            opacity: supported ? 1 : 0.35,
            border: `2px solid ${listening ? "var(--accent2)" : "var(--border)"}`,
          }}
          title={listening ? "Stop listening" : "Start listening"}
        >
          {listening ? "⏹" : "🎤"}
        </button>

        <WaveBars active={listening} color="var(--accent2)" />
      </div>

      {/* Confidence */}
      {confidence !== null && (
        <div
          style={{
            textAlign: "center",
            fontSize: ".72rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color:
              confidence > 80
                ? "var(--green)"
                : confidence > 60
                  ? "var(--yellow)"
                  : "var(--red)",
          }}
        >
          Last confidence: {confidence}%
        </div>
      )}

      {/* Transcript */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <FieldLabel>Transcript</FieldLabel>
          <Btn
            onClick={clearTranscript}
            disabled={!transcript && !interim}
            bg="transparent"
            color="var(--muted)"
            border="1px solid var(--border)"
          >
            Clear
          </Btn>
        </div>
        <div
          style={{
            minHeight: 130,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "14px 16px",
            fontSize: ".88rem",
            lineHeight: 1.75,
            color: "var(--text)",
            overflowY: "auto",
            maxHeight: 220,
            fontFamily: "var(--font-mono)",
          }}
        >
          {transcript ? (
            <span>{transcript}</span>
          ) : (
            !interim && (
              <span style={{ color: "var(--muted)" }}>
                {supported
                  ? "Your spoken words will appear here…"
                  : "API not available in this browser."}
              </span>
            )
          )}
          {/* Interim results shown in muted italic */}
          {interim && (
            <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
              {interim}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 16px",
          borderRadius: 8,
          fontSize: ".75rem",
          letterSpacing: ".05em",
          border: `1px solid ${listening ? "var(--accent2)" : "var(--border)"}40`,
          background: listening ? "rgba(34,211,238,.06)" : "transparent",
          color: listening ? "var(--accent2)" : "var(--muted)",
          transition: "all .3s",
        }}
      >
        <span>{listening ? "●" : "◎"}</span>
        statusMsg = {statusMsg}
      </div>
    </div>
  );
}
