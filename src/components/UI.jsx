import React from 'react'

// ── SupportBadge ──────────────────────────────────────────────────────────────
export function SupportBadge({ ok, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 14px', borderRadius: 6,
      fontSize: '.72rem', letterSpacing: '.06em',
      background: ok ? 'rgba(74,222,128,.08)' : 'rgba(248,113,113,.08)',
      border: `1px solid ${ok ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)'}`,
      color: ok ? 'var(--green)' : 'var(--red)',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: ok ? 'var(--green)' : 'var(--red)',
        animation: 'pulse 1.8s ease-in-out infinite',
      }} />
      {label}
    </div>
  )
}

// ── Slider ────────────────────────────────────────────────────────────────────
export function Slider({ label, min, max, step, value, onChange, format, accentColor }) {
  const pct = ((value - min) / (max - min)) * 100
  const color = accentColor || 'var(--accent)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{
          fontSize: '.65rem', letterSpacing: '.14em',
          textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          {label}
        </label>
        <span style={{ fontSize: '.8rem', color, fontWeight: 500 }}>
          {format(value)}
        </span>
      </div>
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', height: 3, left: 0, right: 0, borderRadius: 2,
          background: `linear-gradient(to right, ${color} ${pct}%, var(--border) ${pct}%)`,
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ position: 'absolute', width: '100%' }}
        />
      </div>
    </div>
  )
}

// ── WaveBars ──────────────────────────────────────────────────────────────────
export function WaveBars({ active, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          width: 3,
          borderRadius: 2,
          background: color || 'var(--accent)',
          minHeight: 4, maxHeight: 22,
          animation: active ? `waveAnim ${0.6 + i * 0.1}s ease-in-out infinite alternate` : 'none',
          animationDelay: `${i * 0.1}s`,
          height: active ? undefined : 4,
          opacity: active ? 1 : 0.25,
          transition: 'opacity .3s',
        }} />
      ))}
    </div>
  )
}

// ── StatusBar ─────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  idle: 'var(--muted)', speaking: 'var(--accent)',
  paused: 'var(--yellow)', done: 'var(--green)', error: 'var(--red)',
}
const STATUS_ICONS = {
  idle: '◎', speaking: '▶', paused: '⏸', done: '✓', error: '✕',
}

export function StatusBar({ status, message }) {
  const color = STATUS_COLORS[status] || 'var(--muted)'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 16px', borderRadius: 8,
      fontSize: '.75rem', letterSpacing: '.05em',
      border: `1px solid ${color}40`,
      background: `${color}0d`,
      color, transition: 'all .3s',
    }}>
      <span>{STATUS_ICONS[status] || '◎'}</span>
      {message}
    </div>
  )
}

// ── FieldLabel ────────────────────────────────────────────────────────────────
export function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      fontSize: '.65rem', letterSpacing: '.14em',
      textTransform: 'uppercase', color: 'var(--muted)',
      display: 'block', marginBottom: 8,
    }}>
      {children}
    </label>
  )
}

// ── StyledSelect ──────────────────────────────────────────────────────────────
export function StyledSelect({ value, onChange, disabled, children, id }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        color: 'var(--text)',
        fontFamily: 'var(--font-mono)',
        fontSize: '.82rem',
        padding: '10px 12px',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </select>
  )
}

// ── Btn ───────────────────────────────────────────────────────────────────────
export function Btn({ onClick, disabled, bg, color, border, animation, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '.72rem', letterSpacing: '.1em',
        textTransform: 'uppercase',
        border: border || 'none', borderRadius: 8,
        padding: '11px 18px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        background: bg, color,
        transition: 'opacity .2s, transform .1s',
        animation,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(.96)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}
