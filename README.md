# 🎙 Speech API Lab

A **Text-to-Speech** and **Speech Recognition** demo built with **React 18 + Vite**, using the browser-native [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). No backend, no external AI service — everything runs locally in your browser.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Text-to-Speech** | Voice picker, rate / pitch / volume sliders, play / pause / resume / stop, live word-boundary highlighting |
| **Speech Recognition** | Continuous or single-shot mode, 12 language options, interim + final transcript, confidence score |
| **React hooks** | `useTTS` and `useSpeechRecognition` — clean, reusable, easy to extend |
| **No build-time API calls** | 100% client-side Web Speech API |

---

## 🖥 Browser support

| Feature | Chrome | Edge | Safari | Firefox |
|---|---|---|---|---|
| Text-to-Speech (`SpeechSynthesis`) | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition (`SpeechRecognition`) | ✅ | ✅ | ✅ | ❌ |

> **Tip:** For the best experience, use **Chrome** or **Edge** — they support both APIs and expose the most voices.

---

## 🚀 Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or newer** (run `node -v` to check)
- **npm** (comes with Node) or **pnpm** / **yarn**

### Steps

```bash
# 1. Enter the project folder
cd speech-api-lab

# 2. Install dependencies  (~30 seconds)
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

> The page auto-reloads whenever you edit a source file.

### Other commands

```bash
npm run build    # Production build → ./dist/
npm run preview  # Serve the production build locally
```

---

## 📁 Project structure

```
speech-api-lab/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # App shell, tab navigation
    ├── index.css               # Global CSS variables & animations
    ├── hooks/
    │   ├── useTTS.js           # ← All Text-to-Speech logic
    │   └── useSpeechRecognition.js  # ← All Speech Recognition logic
    └── components/
        ├── UI.jsx              # Shared primitives (Slider, Btn, StatusBar…)
        ├── TTSPanel.jsx        # Text-to-Speech tab
        ├── SRPanel.jsx         # Speech Recognition tab
        └── CodeSnippet.jsx     # Collapsible code viewer
```

---

## 🔧 Extending the app

### Add a new TTS feature (e.g. highlight full sentences)

Edit **`src/hooks/useTTS.js`** — the `onboundary` handler fires for both `"word"` and `"sentence"` boundary events:

```js
utt.onboundary = (e) => {
  if (e.name === 'sentence') setCurrentSentence(text.substr(e.charIndex, e.charLength))
}
```

### Add more Speech Recognition languages

Edit the `LANGUAGES` array in **`src/components/SRPanel.jsx`**:

```js
{ code: 'ru-RU', label: 'Russian' },
{ code: 'nl-NL', label: 'Dutch' },
```

### Pipe SR transcript into TTS

In **`src/App.jsx`**, lift the transcript state up and pass it as the initial text prop to `<TTSPanel>`.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `vite` | Dev server & bundler |
| `@vitejs/plugin-react` | JSX transform for Vite |

Zero runtime dependencies beyond React itself.

---

## 📄 License

MIT — free to use, modify, and distribute.
