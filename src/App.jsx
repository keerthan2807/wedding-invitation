import { useEffect, useMemo, useRef, useState } from 'react'
import './film.css'
import SplashCursor from './components/SplashCursor'
import SideParticleFlow from './components/SideParticleFlow'
import ScrollPage from './ScrollPage'

/*
  Story order:
  0  opening   – sacred OM / title card
  1  groom     – groom entrance + name + family lineage on same page
  2  bride     – bride entrance + name + family lineage on same page
  3  union     – "We Are Getting Married" convergence scene
  4  ceremony  – wedding details
  5  reception – reception details
  6  countdown – live countdown to the big day
  7  finale    – full couple + closing credits
*/
const scenes = [
  { key: 'opening',    duration: 5000 },
  { key: 'groomtease', duration: 4500 },
  { key: 'groom',      duration: 6500 },
  { key: 'bride',      duration: 6500 },
  { key: 'quote',      duration: 6000 },
  { key: 'union',      duration: 6000 },
  { key: 'ceremony',   duration: 6000 },
  { key: 'recepquote', duration: 4000 },
  { key: 'reception',  duration: 5500 },
  { key: 'finale',     duration: 10000 },
]

/* ── Decorative helpers ──────────────────────────────────────────── */
const petalData = Array.from({ length: 18 }, (_, i) => ({
  left: `${4 + ((i * 19) % 92)}%`,
  delay: `${(i % 9) * 0.45}s`,
  duration: `${5 + (i % 4)}s`,
  '--rotate': `${(i * 37) % 360}deg`,
}))

const glitterData = Array.from({ length: 22 }, (_, i) => ({
  left: `${3 + ((i * 23) % 94)}%`,
  delay: `${(i % 11) * 0.6}s`,
  duration: `${6 + (i % 5)}s`,
}))

function Petals() {
  return (
    <div className="petal-field" aria-hidden="true">
      {petalData.map((p, i) => <i key={i} style={p} />)}
    </div>
  )
}

function GlitterRain() {
  return (
    <div className="glitter-rain" aria-hidden="true">
      {glitterData.map((g, i) => <i key={i} style={g}>✦</i>)}
    </div>
  )
}

function Lamps() {
  return (
    <div className="lamp-row" aria-hidden="true">
      <span className="lamp-star">✦</span>
      <b className="lamp-diya">◒</b>
      <span className="lamp-star">✦</span>
      <b className="lamp-diya">◒</b>
      <span className="lamp-star">✦</span>
    </div>
  )
}

function OmMark({ className = '' }) {
  return (
    <div className={`om-mark ${className}`} aria-label="Om symbol">
      <div className="om-mark-ring om-mark-ring--outer" />
      <div className="om-mark-ring om-mark-ring--inner" />
      <span className="om-mark-glyph">ॐ</span>
    </div>
  )
}

/* Rotating mandala ornament */
function Mandala({ className = '' }) {
  return (
    <div className={`mandala-wrap ${className}`} aria-hidden="true">
      <div className="mandala-ring mandala-ring--1" />
      <div className="mandala-ring mandala-ring--2" />
      <div className="mandala-ring mandala-ring--3" />
      <span className="mandala-star">✦</span>
    </div>
  )
}

/* Gold ornamental divider */
function GoldRule() {
  return (
    <div className="gold-rule" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  )
}

/* Countdown — live to 13 Nov 2026 12:10 IST */
const WEDDING_DATE = new Date('2026-11-13T12:10:00+05:30')
function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const calc = () => {
      const diff = WEDDING_DATE - Date.now()
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = n => String(n).padStart(2, '0')
  return (
    <div className="countdown-row">
      {[{ v: pad(t.d), l: 'Days' }, { v: pad(t.h), l: 'Hours' }, { v: pad(t.m), l: 'Min' }, { v: pad(t.s), l: 'Sec' }].map(({ v, l }) => (
        <div key={l} className="countdown-block">
          <span className="countdown-num">{v}</span>
          <span className="countdown-label">{l}</span>
        </div>
      ))}
    </div>
  )
}

/* Scene-dot progress bar */
function SceneDots({ count, active }) {
  return (
    <div className="scene-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`scene-dot${i === active ? ' scene-dot--active' : ''}`} />
      ))}
    </div>
  )
}

/* ── Individual scenes ───────────────────────────────────────────── */
function SceneOpening() {
  return (
    <div className="s-opening">
      <Mandala className="opening-mandala" />
      <OmMark className="opening-om" />
      <div className="opening-content">
        <p className="opening-eyebrow">An Auspicious Celebration</p>
        <div className="opening-title opening-couple-icons" aria-label="Groom and Bride">
          {/* Groom silhouette — sherwani/kurta with dupatta drape */}
          <svg className="opening-icon opening-icon--groom" viewBox="0 0 56 90" fill="none" aria-hidden="true">
            {/* Head */}
            <circle cx="28" cy="11" r="8" fill="var(--light-gold)" opacity=".85" />
            {/* Sehra — groom headpiece strings */}
            <line x1="20" y1="17" x2="17" y2="28" stroke="var(--light-gold)" strokeWidth="0.8" opacity=".5" />
            <line x1="24" y1="19" x2="22" y2="30" stroke="var(--light-gold)" strokeWidth="0.8" opacity=".5" />
            <line x1="28" y1="19" x2="28" y2="31" stroke="var(--light-gold)" strokeWidth="0.8" opacity=".5" />
            <line x1="32" y1="19" x2="34" y2="30" stroke="var(--light-gold)" strokeWidth="0.8" opacity=".5" />
            <line x1="36" y1="17" x2="39" y2="28" stroke="var(--light-gold)" strokeWidth="0.8" opacity=".5" />
            {/* Neck */}
            <rect x="25" y="19" width="6" height="5" rx="2" fill="var(--light-gold)" opacity=".75" />
            {/* Sherwani body */}
            <path d="M14,24 Q10,30 10,42 L14,75 L42,75 L46,42 Q46,30 42,24 Q35,20 28,20 Q21,20 14,24 Z"
              fill="var(--light-gold)" opacity=".72" />
            {/* Sherwani collar V */}
            <path d="M22,24 L28,34 L34,24" stroke="var(--deep-maroon)" strokeWidth="1" fill="none" opacity=".5" />
            {/* Button line */}
            <line x1="28" y1="34" x2="28" y2="60" stroke="var(--deep-maroon)" strokeWidth="0.8" strokeDasharray="2 3" opacity=".4" />
            {/* Dupatta sash diagonal */}
            <path d="M14,28 Q20,38 18,52" stroke="var(--light-gold)" strokeWidth="2.5" opacity=".35" strokeLinecap="round" />
            {/* Arms */}
            <path d="M14,30 Q6,40 8,52" stroke="var(--light-gold)" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />
            <path d="M42,30 Q50,40 48,52" stroke="var(--light-gold)" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />
            {/* Dhoti legs */}
            <path d="M14,75 Q16,88 22,90 L28,78 L34,90 Q40,88 42,75 Z" fill="var(--light-gold)" opacity=".65" />
          </svg>

          {/* Heart */}
          <em className="opening-couple-heart" aria-hidden="true">♥</em>

          {/* Bride silhouette — saree with pallu drape */}
          <svg className="opening-icon opening-icon--bride" viewBox="0 0 56 90" fill="none" aria-hidden="true">
            {/* Head */}
            <circle cx="28" cy="10" r="8" fill="var(--peach)" opacity=".88" />
            {/* Maang tikka */}
            <line x1="28" y1="2" x2="28" y2="8" stroke="var(--light-gold)" strokeWidth="0.9" opacity=".7" />
            <circle cx="28" cy="1.5" r="1.5" fill="var(--light-gold)" opacity=".8" />
            {/* Hair bun suggestion */}
            <ellipse cx="28" cy="8" rx="8" ry="4" fill="var(--maroon)" opacity=".4" />
            {/* Neck + necklace */}
            <rect x="25" y="18" width="6" height="5" rx="2" fill="var(--peach)" opacity=".75" />
            <path d="M22,23 Q28,28 34,23" stroke="var(--light-gold)" strokeWidth="0.9" fill="none" opacity=".6" />
            {/* Saree blouse & body */}
            <path d="M16,23 Q12,30 12,44 L16,76 L40,76 L44,44 Q44,30 40,23 Q34,19 28,19 Q22,19 16,23 Z"
              fill="var(--peach)" opacity=".72" />
            {/* Pallu drape — diagonal sash */}
            <path d="M40,24 Q32,38 28,56 Q26,64 30,74" stroke="var(--light-gold)" strokeWidth="3" opacity=".38" strokeLinecap="round" fill="none" />
            {/* Arms */}
            <path d="M16,30 Q8,40 10,52" stroke="var(--peach)" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />
            <path d="M40,30 Q48,40 46,52" stroke="var(--peach)" strokeWidth="5" strokeLinecap="round" opacity=".7" fill="none" />
            {/* Bangles suggestion */}
            <circle cx="9.5" cy="50" r="2.5" stroke="var(--light-gold)" strokeWidth="0.8" fill="none" opacity=".5" />
            <circle cx="46.5" cy="50" r="2.5" stroke="var(--light-gold)" strokeWidth="0.8" fill="none" opacity=".5" />
            {/* Saree skirt flare */}
            <path d="M16,76 Q10,84 14,90 L42,90 Q46,84 40,76 Z" fill="var(--peach)" opacity=".62" />
          </svg>
        </div>
        <GoldRule />
        <p className="opening-sub">A story is about to unfold&nbsp;…</p>
      </div>
    </div>
  )
}

/* ── Groom tease — cinematic silhouette card before groom reveal ── */
function SceneGroomTease() {
  return (
    <div className="s-tease s-groom-tease">
      <div className="tease-bg" />
      <Mandala className="tease-mandala" />
      <div className="tease-content">
        <span className="tease-label">Coming Next</span>
        <div className="tease-silhouette" aria-hidden="true">
          <div className="tease-sil-figure" />
          <div className="tease-sil-glow" />
        </div>
        <p className="tease-verse">
          "Behind every great love story<br />
          stands a man who chose to begin it."
        </p>
        <div className="tease-reveal-hint">
          <span className="tease-dot" /><span className="tease-dot" /><span className="tease-dot" />
        </div>
      </div>
    </div>
  )
}

function SceneGroom() {
  return (
    <div className="s-solo s-groom-solo">
      <div className="solo-bg-wash solo-bg-wash--groom" />
      <div className="solo-figure-wrap">
        <img className="solo-figure" src="/Groom.png" alt="Chethan Kumar" />
        <div className="solo-figure-glow solo-figure-glow--groom" />
      </div>
      <div className="solo-copy solo-copy--groom">
        <span className="eyebrow">The Groom</span>
        <h1>Chethan</h1>
        <GoldRule />
        <p className="solo-lineage">
          S/o Smt. Yashoda &amp; Sri Kishor Bangera
        </p>
        <p className="solo-parents">
          Beeri, Mangalore
        </p>
      </div>
    </div>
  )
}

function SceneBride() {
  return (
    <div className="s-solo s-bride-solo">
      <div className="solo-bg-wash solo-bg-wash--bride" />
      <div className="solo-figure-wrap">
        <img className="solo-figure" src="/Bride.png" alt="Nivedita" />
        <div className="solo-figure-glow solo-figure-glow--bride" />
      </div>
      <div className="solo-copy solo-copy--bride">
        <span className="eyebrow">The Bride</span>
        <h1>Niveditha</h1>
        <GoldRule />
        <p className="solo-lineage">
          D/o Smt. Vinoda &amp; Sri Devadas Kulal
        </p>
        <p className="solo-parents">
          Akasha Bhavana, Mangaluru
        </p>
      </div>
    </div>
  )
}

function SceneUnion() {
  return (
    <div className="s-union">
      <Petals />
      <div className="union-bg-glow" />
      <Mandala className="union-mandala" />
      <div className="union-figures">
        <img className="union-couple" src="/Bride-Groom.png" alt="Chethan & Nivedita" />
        <div className="union-heart-wrap">
          <span className="union-heart">♥</span>
          <div className="union-heart-ring" />
        </div>
      </div>
      <div className="union-copy">
        <p className="union-eyebrow">Two souls. One destiny.</p>
        <h1 className="union-title">We Are Getting<br /><em>Married</em></h1>
        <GoldRule />
        <p className="union-date">Chethan <em>♥</em> Niveditha</p>
      </div>
    </div>
  )
}

/* ── Paths Cross — cinematic interlude between bride & union ── */
function SceneQuote() {
  return (
    <div className="s-paths">
      {/* Left half — his world */}
      <div className="paths-half paths-half--his" aria-hidden="true">
        <div className="paths-half-bg paths-half-bg--his" />
        <div className="paths-sil paths-sil--his">
          <div className="paths-sil-body" />
          <div className="paths-sil-head" />
          <div className="paths-sil-glow" />
        </div>
      </div>
      {/* Right half — her world */}
      <div className="paths-half paths-half--hers" aria-hidden="true">
        <div className="paths-half-bg paths-half-bg--hers" />
        <div className="paths-sil paths-sil--hers">
          <div className="paths-sil-body paths-sil-body--hers" />
          <div className="paths-sil-head" />
          <div className="paths-sil-glow paths-sil-glow--hers" />
        </div>
      </div>
      {/* Gold divider line that splits and dissolves */}
      <div className="paths-divider" aria-hidden="true">
        <div className="paths-divider-line" />
        <div className="paths-divider-star">✦</div>
      </div>
      {/* Story copy — centred over both halves */}
      <div className="paths-copy">
        <p className="paths-line paths-line--1">Two lives.</p>
        <p className="paths-line paths-line--2">Two families. Two dreams.</p>
        <div className="paths-rule" aria-hidden="true" />
        <p className="paths-line paths-line--3">
          He grew up chasing sunrises in Mangalore.<br />
          She grew up filling every room with grace.
        </p>
        <p className="paths-line paths-line--4">
          Neither knew the other existed —<br />
          until the stars decided otherwise.
        </p>
        <div className="paths-rule" aria-hidden="true" />
        <p className="paths-line paths-line--5">And now&nbsp;…&nbsp;their paths become one.</p>
      </div>
      <Petals />
    </div>
  )
}

function SceneCeremony() {
  return (
    <div className="s-details s-ceremony">
      <div className="details-bg-wash" />
      <Mandala className="details-mandala" />
      <div className="details-content">
        <span className="eyebrow">The Wedding Ceremony</span>
        <h1>Friday, 13<sup>th</sup> November 2026</h1>
        <GoldRule />
        <h2 className="venue-name">Sri Durga Dhyana Mandir</h2>
        <p className="venue-address">
          Sri Durga Parameshwari Temple,<br />
          Devipura, Talapady, Mangalore
        </p>
        <div className="muhurtham-badge">
          <span>Abhijith Muhurtham</span>
          <b>12:10 Noon</b>
        </div>
      </div>
    </div>
  )
}

function SceneReception() {
  return (
    <div className="s-details s-reception">
      <div className="details-bg-wash details-bg-wash--dark" />
      <Petals />
      <div className="details-content details-content--light">
        <span className="eyebrow eyebrow--gold">An Evening of Togetherness</span>
        <h1 className="reception-title">Reception</h1>
        <GoldRule />
        <p className="reception-date">
          Sunday, 15<sup>th</sup> November 2026<br />
          <strong>7:00 p.m. onwards</strong>
        </p>
        <p className="venue-address venue-address--light">
          Kulala Bhavana,<br />
          Near Mangaladevi Temple,<br />
          Mangaluru
        </p>
      </div>
    </div>
  )
}

function SceneRecepQuote() {
  return (
    <div className="s-tease s-recepquote">
      <div className="tease-bg" />
      <Mandala className="tease-mandala" />
      <Petals />
      <div className="tease-content">
        <span className="tease-label">The celebrations don't end here…</span>
        <GoldRule />
        <p className="tease-verse recepquote-verse">
          "When the vows are spoken and the garlands exchanged,<br />
          the real festivity is just beginning."
        </p>
        <GoldRule />
        <p className="tease-verse recepquote-sub">Join us as the story continues…</p>
      </div>
    </div>
  )
}

function SceneFinale() {
  return (
    <div className="s-finale">
      <Petals />
      <div className="finale-glow" />
      <OmMark className="finale-om" />
      <div className="finale-figures">
        <img className="finale-couple" src="/Bride-Groom.png" alt="Chethan & Nivedita" />
      </div>
      <div className="finale-content">
        <span className="eyebrow">Together, Forever</span>
        <h1 className="finale-names">
          Chethan <em>♥</em> Niveditha
        </h1>
        <GoldRule />
        <p className="finale-date">13<sup>th</sup> November 2026</p>
        <div className="finale-credits">
          <span className="credits-label">With Best Compliments From</span>
          <strong className="credits-name">Keerthan Kumar</strong>
          <small className="credits-sub">Relatives &amp; Friends</small>
        </div>
      </div>
    </div>
  )
}

const SCENE_MAP = {
  opening:    SceneOpening,
  groomtease: SceneGroomTease,
  groom:      SceneGroom,
  bride:      SceneBride,
  quote:      SceneQuote,
  union:      SceneUnion,
  ceremony:   SceneCeremony,
  recepquote: SceneRecepQuote,
  reception:  SceneReception,
  finale:     SceneFinale,
}

function FilmScene({ scene, index, activeScene }) {
  const Component = SCENE_MAP[scene]
  const active    = scene === activeScene
  return (
    <section
      className={`film-scene scene-${index + 1}${active ? ' active' : ''}`}
      aria-hidden={!active}
    >
      {Component && <Component />}
    </section>
  )
}

function FilmControls({ onSeek, onReplay, progress, sceneIndex, sceneCount }) {
  return (
    <div className="film-controls">
      <SceneDots count={sceneCount} active={sceneIndex} />
      <div className="film-controls-bar">
        <input
          className="progress-scrubber"
          style={{ '--progress': `${progress}%` }}
          type="range" min="0" max="100" step="0.1" value={progress}
          onChange={e => onSeek(Number(e.target.value))}
          aria-label="Invitation timeline"
        />
        <button type="button" onClick={onReplay} className="replay-btn" aria-label="Replay">↻</button>
      </div>
    </div>
  )
}

/* ── App shell ───────────────────────────────────────────────────── */
export default function App() {
  const [playing, setPlaying]         = useState(false)  // starts AFTER loading screen
  const [sceneIndex, setSceneIndex]   = useState(0)
  const [progress, setProgress]       = useState(0)
  const [sceneOffset, setSceneOffset] = useState(0)
  const [muted, setMuted]             = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)  // overlay dismissed
  const [bufferPct, setBufferPct]     = useState(0)      // 0–100 audio buffer
  const audioRef      = useRef(null)
  const frameRef      = useRef(null)
  // Stable refs so canplay closure always sees latest values without re-running effects
  const reduceMotionRef = useRef(false)
  const reduceMotion    = useMemo(() => {
    const val = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    reduceMotionRef.current = val
    return val
  }, [])

  const currentScene  = scenes[Math.min(sceneIndex, scenes.length - 1)]
  const totalDuration = scenes.reduce((t, s) => t + s.duration, 0)
  const sceneStart    = scenes.slice(0, sceneIndex).reduce((t, s) => t + s.duration, 0)

  /* ── Dismiss loading overlay — shared by both paths ── */
  const dismissRef = useRef(null)
  dismissRef.current = (withMusic) => {
    const audio = audioRef.current
    if (withMusic && !reduceMotionRef.current && audio) {
      audio.play().catch(() => {})
    } else if (!withMusic && audio) {
      audio.muted = true
      setMuted(true)
    }
    setLoadingDone(true)
    setPlaying(true)
  }

  /* ── Audio: download immediately; canplay auto-dismisses on first gesture ── */
  useEffect(() => {
    const audio = new Audio()
    audio.src     = '/love-music.mp3'
    audio.loop    = true
    audio.volume  = 0.34
    audio.preload = 'auto'
    audioRef.current = audio

    // Buffer progress badge
    const onProgress = () => {
      if (!audio.duration || !audio.buffered.length) return
      const end = audio.buffered.end(audio.buffered.length - 1)
      setBufferPct(Math.round((end / audio.duration) * 100))
    }
    audio.addEventListener('progress', onProgress)

    // canplay: enough buffered to play.
    // Register ALL interaction events that fire reliably on iOS Safari.
    // Whichever fires first dismisses the overlay and starts music.
    const onCanPlay = () => {
      let fired = false
      const onTap = () => {
        if (fired) return
        fired = true
        clearTimeout(autoTimer)
        cleanup()
        dismissRef.current(true)
      }
      const cleanup = () => {
        document.removeEventListener('pointerdown', onTap)
        document.removeEventListener('touchstart',  onTap)
        document.removeEventListener('click',       onTap)
      }
      document.addEventListener('pointerdown', onTap, { once: true, passive: true })
      document.addEventListener('touchstart',  onTap, { once: true, passive: true })
      document.addEventListener('click',       onTap, { once: true })

      // Auto-dismiss after 800ms if the user never touches —
      // browser allows play() here because canplay itself is close enough
      // to the load trigger; on desktop this always works.
      // On iOS the tap events above will win first if the user taps.
      const autoTimer = setTimeout(() => {
        if (fired) return
        fired = true
        cleanup()
        dismissRef.current(true)
      }, 800)

      // Save cleanup so "Skip music" can cancel both listeners and the timer
      audio._tapCleanup = () => { cleanup(); clearTimeout(autoTimer) }
    }
    audio.addEventListener('canplay', onCanPlay, { once: true })

    return () => {
      audio.removeEventListener('progress', onProgress)
      audio.removeEventListener('canplay', onCanPlay)
      audio._tapCleanup?.()
      audio.pause()
    }
  }, [])

  // "Skip music" button — cancel the pending tap listener, dismiss without music
  const skipMusic = (e) => {
    e.stopPropagation()
    audioRef.current?._tapCleanup?.()
    audioRef.current && (audioRef.current._tapCleanup = null)
    dismissRef.current(false)
  }

  useEffect(() => {
    if (!playing || !loadingDone || reduceMotion) return undefined
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    const safe      = Math.min(sceneIndex, scenes.length - 1)
    const duration  = scenes[safe].duration
    const startedAt = performance.now()
    const tick = now => {
      const elapsed = sceneOffset + now - startedAt
      setProgress(Math.min(100, (elapsed / duration) * 100))
      if (elapsed >= duration) {
        setSceneIndex(cur => cur < scenes.length - 1 ? cur + 1 : cur)
        setSceneOffset(0)
        setProgress(0)
        if (safe === scenes.length - 1) setPlaying(false)
        frameRef.current = null
        return
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [playing, sceneIndex, sceneOffset, reduceMotion])

  const seek = value => {
    const target = (value / 100) * totalDuration
    let elapsed = 0, targetScene = 0
    for (let i = 0; i < scenes.length; i++) {
      if (target <= elapsed + scenes[i].duration) { targetScene = i; break }
      elapsed += scenes[i].duration
    }
    const offset = target - elapsed
    setSceneIndex(targetScene)
    setSceneOffset(offset)
    setProgress((offset / scenes[targetScene].duration) * 100)
    setPlaying(true)
  }

  const replay = () => {
    setSceneIndex(0); setSceneOffset(0); setProgress(0); setPlaying(true)
    if (audioRef.current) {
      audioRef.current.muted = muted
      audioRef.current?.play().catch(() => {})
    }
  }

  const toggleMute = () => {
    setMuted(m => {
      const next = !m
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }

  const globalProgress = (sceneStart + (progress / 100) * currentScene.duration) / totalDuration * 100

  const showScroll = !playing && sceneIndex === scenes.length - 1

  // Skip button appears once the reception scene (index 8) is reached
  const showSkip = !showScroll  // visible from the very first scene

  const skipToJourney = () => {
    if (frameRef.current) { cancelAnimationFrame(frameRef.current); frameRef.current = null }
    setSceneIndex(scenes.length - 1)
    setSceneOffset(0)
    setProgress(0)
    setPlaying(false)
  }

  return (
    <main className="wedding-film">
      {/* ── Loading screen ── */}
      {!loadingDone && (
        <div className="inv-loading" aria-live="polite" aria-label="Preparing invitation">
          <div className="inv-loading-inner">
            <div className="inv-loading-mandala" aria-hidden="true">
              <div className="inv-loading-ring inv-loading-ring--1" />
              <div className="inv-loading-ring inv-loading-ring--2" />
              <div className="inv-loading-ring inv-loading-ring--3" />
              <span className="inv-loading-om">ॐ</span>
            </div>
            <p className="inv-loading-text">Preparing your invitation…</p>
            <p className="inv-loading-sub">
              Loading music&nbsp;
              {bufferPct > 0 && bufferPct < 100
                ? <span className="inv-loading-buf">{bufferPct}%</span>
                : '…'}
            </p>
            <button
              type="button"
              className="inv-loading-btn"
              onClick={skipMusic}
            >
              Skip music
            </button>
          </div>
        </div>
      )}
      <SideParticleFlow style={{ opacity: 0.35 }} />
      <GlitterRain />
      <SplashCursor />
      {scenes.map((item, index) => (
        <FilmScene key={item.key} scene={item.key} activeScene={currentScene.key} index={index} />
      ))}
      {!showScroll && (
        <FilmControls
          onSeek={seek} onReplay={replay} progress={globalProgress}
          sceneIndex={sceneIndex} sceneCount={scenes.length}
        />
      )}
      {/* Mute button with streaming buffer indicator */}
      {!showScroll && (
        <button
          type="button"
          className="mute-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? '🔇' : '🔊'}
          {bufferPct < 100 && (
            <span className="mute-btn-buffer" aria-hidden="true">{bufferPct}%</span>
          )}
        </button>
      )}
      {/* Skip button — fades in after reception date reveal */}
      {showSkip && (
        <button
          type="button"
          className="skip-btn"
          onClick={skipToJourney}
          aria-label="Skip to the journey"
        >
          <span className="skip-btn-inner">
            <span className="skip-btn-arrow" aria-hidden="true">↓</span>
            Skip to Events
          </span>
        </button>
      )}
      {showScroll && (
        <ScrollPage
          replay={replay}
          audioRef={audioRef}
          muted={muted}
          setMuted={setMuted}
        />
      )}
    </main>
  )
}
