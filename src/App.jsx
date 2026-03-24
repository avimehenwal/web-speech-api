import { useState } from "react";
import CodeSnippet from "./components/CodeSnippet";
import SRPanel from "./components/SRPanel";
import TTSPanel from "./components/TTSPanel";
import { SupportBadge } from "./components/UI";

const ttsSupported = "speechSynthesis" in window;

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

const TABS = [
  { id: "tts", label: "🔊  Text to Speech" },
  { id: "sr", label: "🎤  Speech Recognition" },
];

export default function App() {
  const [tab, setTab] = useState("tts");
  const [simulateSrUnsupported, setSimulateSrUnsupported] = useState(false);
  const srSupported = !simulateSrUnsupported && !!getSpeechRecognition();

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "52px 20px 100px",
        animation: "fadeUp .5s ease both",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: ".68rem",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          Web Speech API Demo
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 9vw, 4.4rem)",
            lineHeight: 0.92,
            letterSpacing: "-.04em",
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          SPEECH
          <br />
          <span style={{ color: "var(--accent)" }}>API</span> LAB
        </h1>

        <p
          style={{
            fontSize: ".82rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          Text-to-Speech &amp; Speech Recognition — powered by React hooks.
          <br />
          Structured to grow: add features without touching existing code.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SupportBadge ok={ttsSupported} label="SpeechSynthesis API" />
          <SupportBadge ok={srSupported} label="SpeechRecognition API" />
        </div>
      </header>

      {/* ── Tab bar ────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 4,
          marginBottom: 24,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: ".74rem",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: 8,
              padding: "11px 16px",
              cursor: "pointer",
              background: tab === t.id ? "var(--card)" : "transparent",
              color: tab === t.id ? "var(--text)" : "var(--muted)",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,.5)" : "none",
              transition: "all .2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Panel card ─────────────────────────────────────── */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 32,
          marginBottom: 20,
        }}
      >
        {tab === "tts" ? (
          <TTSPanel />
        ) : (
          <SRPanel
            simulateUnsupported={simulateSrUnsupported}
            onSimulateUnsupportedChange={setSimulateSrUnsupported}
          />
        )}
      </div>

      {/* ── Code snippet ───────────────────────────────────── */}
      <CodeSnippet activeTab={tab} />

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: 48,
          textAlign: "center",
          fontSize: ".68rem",
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Built with React 18 · Vite · Web Speech API
      </footer>
    </div>
  );
}
