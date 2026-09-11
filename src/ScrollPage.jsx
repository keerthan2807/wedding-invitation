import { useEffect, useRef, useState, useCallback } from 'react'
import './scroll.css'

/* ── Flower corner decoration ───────────────────────────────────── */
// corners: array of 1–2 strings from 'tl','tr','bl','br'
// Each card gets a unique combo so they don't all look the same
function FlowerDecor({ corners = ['tr', 'bl'] }) {
  return (
    <>
      {corners.map(corner => (
        <img
          key={corner}
          src="/flower.png"
          className={`sp-flower sp-flower--${corner}`}
          aria-hidden="true"
          draggable="false"
        />
      ))}
    </>
  )
}

/* ── Countdown ─────────────────────────────────────────────────── */
const WEDDING_DATE = new Date('2026-11-13T12:10:00+05:30')
function useCountdown() {
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
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id)
  }, [])
  return t
}

/* ── Blessings ─────────────────────────────────────────────────── */
const BKEY = 'cn_blessings'
const getB = () => { try { return parseInt(localStorage.getItem(BKEY) || '47', 10) } catch { return 47 } }
const setB = n => { try { localStorage.setItem(BKEY, String(n)) } catch {} }

/* ── Heart burst ───────────────────────────────────────────────── */
const HC = ['#c99a45', '#e9b99d', '#6f1d2b', '#e7c878', '#f0dfc0']
function burstHearts() {
  const W = window.innerWidth, H = window.innerHeight
  const SYMBOLS = ['♥', '❤', '♡', '✦', '♥', '♥']
  const COUNT = 52
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span')
    el.textContent = SYMBOLS[i % SYMBOLS.length]
    el.className = 'sp-heart-burst'
    // Start from random positions across the entire screen
    const sx = W * (0.05 + Math.random() * 0.9)
    const sy = H * (0.3 + Math.random() * 0.6)   // lower 70% of screen
    const tx = (Math.random() - 0.5) * 220
    const ty = -(80 + Math.random() * 260)         // always float upward
    const dur = 1.4 + Math.random() * 0.9
    const delay = Math.random() * 0.7              // stagger the shower
    el.style.cssText = `left:${sx}px;top:${sy}px;font-size:${12 + Math.random() * 22}px;color:${HC[i % HC.length]};--tx:${tx}px;--ty:${ty}px;animation-duration:${dur}s;animation-delay:${delay}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 200)
  }
}

/* ── Sparkle burst at a position (for arrival at each stop) ────── */
function spawnSparkles(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className = 'sp-sparkle-burst'
    const a = (i / count) * 2 * Math.PI + Math.random() * 0.4
    const d = 18 + Math.random() * 38
    el.style.cssText = `left:${x}px;top:${y}px;--tx:${Math.cos(a) * d}px;--ty:${Math.sin(a) * d}px;animation-duration:${0.7 + Math.random() * 0.4}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1200)
  }
}

/* ── Floating ambient petal ────────────────────────────────────── */
function AmbientPetals() {
  const petals = Array.from({ length: 14 }, (_, i) => ({
    left: `${5 + ((i * 17) % 90)}%`,
    delay: `${(i * 0.7) % 7}s`,
    dur: `${8 + (i % 5)}s`,
    size: `${4 + (i % 4)}px`,
  }))
  return (
    <div className="sp-petals" aria-hidden="true">
      {petals.map((p, i) => (
        <i key={i} className="sp-petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, width: p.size }} />
      ))}
    </div>
  )
}

/* ── SVG decorative ornaments ──────────────────────────────────── */
function FloralBloom({ className = '' }) {
  return (
    <svg className={`sp-floral-bloom ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <ellipse key={i} cx="40" cy="40" rx="6" ry="14"
          stroke="#c99a45" strokeWidth="0.8" fill="rgba(201,154,69,.07)"
          opacity={i % 2 === 0 ? '.45' : '.3'}
          transform={`rotate(${deg} 40 40) translate(0,-12)`} />
      ))}
      <circle cx="40" cy="40" r="5" stroke="#c99a45" strokeWidth="1"
        fill="rgba(201,154,69,.18)" opacity=".7" />
      <circle cx="40" cy="40" r="2" fill="#c99a45" opacity=".5" />
    </svg>
  )
}

function LeafBranch({ flip = false, className = '' }) {
  return (
    <svg className={`sp-leaf-branch ${className}`} viewBox="0 0 60 100" fill="none" aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M30,100 Q30,55 30,10" stroke="#c99a45" strokeWidth="1.2" opacity=".35" />
      <path d="M30,80 Q14,68 8,52" stroke="#c99a45" strokeWidth="1" opacity=".3" />
      <path d="M30,60 Q46,46 50,30" stroke="#c99a45" strokeWidth="1" opacity=".3" />
      <path d="M30,40 Q16,30 12,16" stroke="#c99a45" strokeWidth="1" opacity=".25" />
      <ellipse cx="8" cy="50" rx="7" ry="4" fill="rgba(201,154,69,.1)" stroke="#c99a45" strokeWidth=".7" transform="rotate(-35 8 50)" opacity=".5" />
      <ellipse cx="50" cy="28" rx="7" ry="4" fill="rgba(201,154,69,.1)" stroke="#c99a45" strokeWidth=".7" transform="rotate(35 50 28)" opacity=".5" />
      <ellipse cx="12" cy="14" rx="5" ry="3" fill="rgba(233,185,157,.1)" stroke="#e9b99d" strokeWidth=".6" transform="rotate(-25 12 14)" opacity=".4" />
    </svg>
  )
}

function ArchGateway() {
  return (
    <svg className="sp-arch-icon" viewBox="0 0 240 100" fill="none" aria-hidden="true">
      <path d="M20,100 Q20,20 120,20 Q220,20 220,100"
        stroke="#c99a45" strokeWidth="1.5" fill="none" strokeDasharray="5 4" opacity=".55" />
      <path d="M20,100 L20,90" stroke="#c99a45" strokeWidth="1.5" opacity=".5" />
      <path d="M220,100 L220,90" stroke="#c99a45" strokeWidth="1.5" opacity=".5" />
      <circle cx="120" cy="20" r="5" fill="rgba(201,154,69,.25)" stroke="#c99a45" strokeWidth="1.2" />
      <circle cx="120" cy="20" r="2" fill="#c99a45" opacity=".6" />
      <path d="M80,100 Q80,55 120,45 Q160,55 160,100"
        stroke="#c99a45" strokeWidth="0.8" fill="none" opacity=".25" strokeDasharray="3 4" />
      <path d="M100,20 Q90,12 82,8" stroke="#c99a45" strokeWidth=".8" opacity=".3" />
      <path d="M140,20 Q150,12 158,8" stroke="#c99a45" strokeWidth=".8" opacity=".3" />
    </svg>
  )
}

function LanternSvg() {
  return (
    <svg className="sp-lantern-icon" viewBox="0 0 60 90" fill="none" aria-hidden="true">
      <line x1="30" y1="6" x2="30" y2="0" stroke="#c99a45" strokeWidth="1.2" opacity=".5" />
      <ellipse cx="30" cy="14" rx="14" ry="6" stroke="#c99a45" strokeWidth="1" fill="rgba(201,154,69,.08)" opacity=".6" />
      <path d="M16,14 Q8,42 16,70 Q30,80 44,70 Q52,42 44,14"
        stroke="#c99a45" strokeWidth="1.2" fill="rgba(201,154,69,.06)" opacity=".65" />
      <ellipse cx="30" cy="70" rx="14" ry="6" stroke="#c99a45" strokeWidth="1" fill="rgba(201,154,69,.08)" opacity=".55" />
      <ellipse cx="30" cy="42" rx="7" ry="10" stroke="#e9b99d" strokeWidth=".8" fill="rgba(233,185,157,.06)" opacity=".45" />
      <circle cx="30" cy="42" r="3" fill="rgba(231,200,120,.25)" stroke="#e7c878" strokeWidth=".6" opacity=".5" />
      <path d="M8,32 Q4,28 6,24" stroke="#c99a45" strokeWidth=".7" opacity=".25" />
      <path d="M52,32 Q56,28 54,24" stroke="#c99a45" strokeWidth=".7" opacity=".25" />
    </svg>
  )
}

function MapPin() {
  return (
    <svg className="sp-map-pin" viewBox="0 0 28 36" fill="none" aria-hidden="true">
      <path d="M14,2 C8,2 3,7 3,13 C3,21 14,34 14,34 C14,34 25,21 25,13 C25,7 20,2 14,2 Z"
        stroke="#c99a45" strokeWidth="1.3" fill="rgba(201,154,69,.12)" />
      <circle cx="14" cy="13" r="4" stroke="#c99a45" strokeWidth="1" fill="rgba(201,154,69,.2)" />
      <circle cx="14" cy="13" r="1.5" fill="#c99a45" opacity=".7" />
    </svg>
  )
}

function HennaMandala() {
  return (
    <svg className="sp-henna-mandala" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="42" stroke="#c99a45" strokeWidth=".8" opacity=".3" strokeDasharray="3 4" />
      <circle cx="50" cy="50" r="32" stroke="#c99a45" strokeWidth=".7" opacity=".25" />
      <circle cx="50" cy="50" r="18" stroke="#e9b99d" strokeWidth=".8" opacity=".3" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 50)`}>
          <path d="M50,8 Q54,18 50,28" stroke="#c99a45" strokeWidth=".9" fill="none" opacity=".4" />
          <ellipse cx="50" cy="8" rx="3" ry="4.5" fill="rgba(201,154,69,.12)" stroke="#c99a45" strokeWidth=".7" opacity=".5" />
        </g>
      ))}
      <circle cx="50" cy="50" r="5" fill="rgba(201,154,69,.2)" stroke="#c99a45" strokeWidth=".8" />
      <circle cx="50" cy="50" r="2" fill="#c99a45" opacity=".5" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────
   ORGANIC PATH BUILDER
   Generates a single continuous hand-drawn path across the full
   journey height. Each segment has a distinct character so the
   path feels alive and unpredictable.
   ───────────────────────────────────────────────────────────────── */

/* Waypoints are expressed as fractions [0..1] of width and height.
   They will be scaled to actual px once we know the dimensions.
   The path is a series of cubic bezier commands that weave, loop,
   and zig-zag between these anchors. */
const WAYPOINTS_FRAC = [
  // [xFrac, yFrac]
  [0.50, 0.000],  // 0  — start (top centre, just below hero)
  [0.20, 0.022],  // 1
  [0.08, 0.050],  // 2  — left swing
  [0.25, 0.080],  // 3
  [0.55, 0.110],  // 4  — cross centre
  [0.82, 0.140],  // 5  — far right
  [0.72, 0.170],  // 6
  [0.50, 0.195],  // 7  — STOP 0 (countdown) — centre thread
  [0.30, 0.215],  // 8
  [0.12, 0.240],  // 9  — sharp left
  [0.08, 0.265],  // 10 — loop near left edge
  [0.22, 0.285],  // 11
  [0.50, 0.308],  // 12 — cross
  [0.78, 0.332],  // 13 — right swing
  [0.88, 0.355],  // 14
  [0.72, 0.375],  // 15 — STOP 1 (bride mehndi)
  [0.55, 0.395],  // 16
  [0.35, 0.415],  // 17
  [0.18, 0.435],  // 18 — small left hook
  [0.12, 0.455],  // 19
  [0.28, 0.475],  // 20 — STOP 2 (groom mehndi)
  [0.50, 0.495],  // 21 — centre crossing
  [0.70, 0.515],  // 22
  [0.85, 0.535],  // 23 — right arch
  [0.90, 0.560],  // 24
  [0.80, 0.582],  // 25
  [0.60, 0.600],  // 26
  [0.50, 0.618],  // 27 — STOP 3 (wedding) — centre
  [0.38, 0.636],  // 28
  [0.20, 0.655],  // 29 — left sweep
  [0.10, 0.672],  // 30
  [0.08, 0.692],  // 31 — tight left turn
  [0.22, 0.710],  // 32
  [0.45, 0.728],  // 33
  [0.68, 0.745],  // 34 — STOP 4 (reception) right lean
  [0.82, 0.762],  // 35
  [0.88, 0.780],  // 36
  [0.75, 0.798],  // 37
  [0.55, 0.815],  // 38
  [0.35, 0.830],  // 39 — STOP 5 (gallery)
  [0.22, 0.845],  // 40
  [0.30, 0.862],  // 41
  [0.50, 0.878],  // 42 — centre pull
  [0.68, 0.892],  // 43
  [0.72, 0.908],  // 44
  [0.60, 0.924],  // 45
  [0.50, 0.940],  // 46 — STOP 6 (blessings) — final stop
  [0.50, 1.000],  // 47 — path ends
]

/* Build a smooth cubic bezier through the waypoints */
function buildOrganicPath(w, h) {
  const pts = WAYPOINTS_FRAC.map(([xf, yf]) => [xf * w, yf * h])
  if (pts.length < 2) return ''

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const next = pts[i + 1] || curr
    const prevPrev = pts[i - 2] || prev

    // Control points: pull tangent from prev→curr direction and curr→next direction
    const alpha = 0.38
    const cp1x = prev[0] + (curr[0] - prevPrev[0]) * alpha
    const cp1y = prev[1] + (curr[1] - prevPrev[1]) * alpha
    const cp2x = curr[0] - (next[0] - prev[0]) * alpha
    const cp2y = curr[1] - (next[1] - prev[1]) * alpha

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${curr[0].toFixed(1)},${curr[1].toFixed(1)}`
  }
  return d
}

/* Fractional y positions of each destination stop along the path.
   These match the approximate yFrac values of the anchor points near each stop. */
const STOP_Y_FRACS = [0.195, 0.375, 0.475, 0.618, 0.762, 0.878]

/* ─────────────────────────────────────────────────────────────────
   SCROLL PAGE
   ───────────────────────────────────────────────────────────────── */
export default function ScrollPage({ replay, audioRef, muted, setMuted }) {
  const t = useCountdown()
  const pad = n => String(n).padStart(2, '0')
  const [blessings, setBlessings] = useState(getB)
  const [scrollPct, setScrollPct] = useState(0)

  const pageRef         = useRef(null)
  const journeyRef      = useRef(null)
  const pathRef         = useRef(null)        // the reveal <path> element
  const dotRef          = useRef(null)        // the travelling golden dot inner
  const dotGlowRef      = useRef(null)        // glow wrapper (positioned by JS)
  const pathLenRef      = useRef(0)
  const arrivedRef      = useRef(new Set())   // which stops have fired sparkles

  // Smooth-following state — all refs so rAF loop reads fresh values
  const targetDrawnRef  = useRef(0)           // where scroll says we should be
  const displayedDrawnRef = useRef(0)         // where the dot/path currently is
  const rafRef          = useRef(null)        // rAF handle
  const isScrollingRef  = useRef(false)       // true while scroll events arrive
  const scrollTimerRef  = useRef(null)        // debounce to detect scroll-stop

  /* ── Staggered reveal via IntersectionObserver ── */
  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const groups = root.querySelectorAll('[data-reveal-group]')
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const group = entry.target
        const steps = group.querySelectorAll('[data-step]')
        steps.forEach((el, idx) => {
          setTimeout(() => el.classList.add('sp-revealed'), idx * 160)
        })
        group.classList.add('sp-group-revealed')
        io.unobserve(group)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' })
    groups.forEach(g => io.observe(g))
    return () => io.disconnect()
  }, [])

  /* ── Cinematic focus: highlight the card most centred in the viewport ── */
  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const segs = root.querySelectorAll('[data-reveal-group]')

    const io = new IntersectionObserver(entries => {
      // Build a fresh map of which segments are visible and how centred they are
      entries.forEach(entry => {
        entry.target.dataset.visible = entry.isIntersecting ? '1' : '0'
        entry.target.dataset.ratio   = String(entry.intersectionRatio)
      })
      // Find the segment with the highest intersection ratio (most in view)
      let best = null, bestRatio = -1
      segs.forEach(seg => {
        const r = parseFloat(seg.dataset.ratio || '0')
        if (r > bestRatio) { bestRatio = r; best = seg }
      })
      segs.forEach(seg => {
        const info = seg.querySelector('.sp-info')
        if (!info) return
        if (seg === best && bestRatio > 0.1) {
          info.classList.add('sp-info--focused')
          info.classList.remove('sp-info--unfocused')
        } else {
          info.classList.add('sp-info--unfocused')
          info.classList.remove('sp-info--focused')
        }
      })
    }, {
      root: root,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '-20% 0px -20% 0px',
    })

    segs.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  /* ── Commit a drawn-length value to the DOM ── */
  const commitDrawn = useCallback((drawn) => {
    const len  = pathLenRef.current
    const path = pathRef.current
    const dot  = dotRef.current
    const glow = dotGlowRef.current
    if (!len || !path) return

    // Clamp
    const d = Math.max(0, Math.min(len, drawn))

    // Dotted progressive reveal:
    // strokeDasharray encodes the dot (2px) + gap (10px) repeating pattern.
    // We set it as: "2 10" repeated, with the very last segment being a huge
    // invisible fill so any undrawn tail is hidden.
    // The dashoffset shifts the whole pattern: at 0 the path is fully drawn,
    // at `len` the path is fully hidden — we draw `d` px worth.
    // Technique: set dasharray = "2 10" * N where N covers full length,
    // then dashoffset = (len - d). Dots appear only on the drawn portion.
    path.style.strokeDashoffset = String(len - d)

    // Dot position
    if (dot && glow) {
      try {
        const tipLen = Math.min(d, len - 0.5)
        const pt      = path.getPointAtLength(tipLen)
        const svgRect = path.closest('svg').getBoundingClientRect()
        const jRect   = journeyRef.current.getBoundingClientRect()
        const x = pt.x + (svgRect.left - jRect.left)
        const y = pt.y + (svgRect.top  - jRect.top)
        // dot inner stays at 0,0; wrapper is positioned
        glow.style.transform = `translate(${x - 11}px, ${y - 11}px)`
        dot.style.transform  = `translate(${x - 5}px,  ${y - 5}px)`
        const pct = len > 0 ? d / len : 0
        const vis = pct > 0.004 && pct < 0.997 ? '1' : '0'
        dot.style.opacity  = vis
        glow.style.opacity = vis
      } catch {}
    }
  }, [])

  /* ── rAF loop: lerp displayedDrawn → targetDrawn ── */
  const startRaf = useCallback(() => {
    if (rafRef.current) return   // already running

    const tick = () => {
      const target  = targetDrawnRef.current
      const current = displayedDrawnRef.current
      const len     = pathLenRef.current
      const diff    = target - current

      if (Math.abs(diff) < 0.3) {
        // Close enough — snap and stop loop
        displayedDrawnRef.current = target
        commitDrawn(target)
        rafRef.current = null
        return
      }

      // Cinematic slow follow — identical lerp for forward AND backward.
      // base 0.012 (~1.2% of gap per frame at 60fps)
      // near a stop threshold → 0.007 (extra linger at each destination)
      let lerpFactor = 0.012
      const pctTarget = len > 0 ? target / len : 0
      const nearStop  = STOP_Y_FRACS.some(f => Math.abs(pctTarget - f) < 0.03)
      if (nearStop) lerpFactor = 0.007

      // Cap movement to MAX_PX_PER_FRAME so a fast scroll burst never
      // lets the dot jump ahead visibly — same ceiling applies in both directions
      const MAX_PX_PER_FRAME = len * 0.008   // ≈ 0.8% of total path per frame
      const rawStep = diff * lerpFactor
      const step    = Math.sign(rawStep) * Math.min(Math.abs(rawStep), MAX_PX_PER_FRAME)
      const next = current + step
      displayedDrawnRef.current = next
      commitDrawn(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [commitDrawn])

  /* ── Scroll handler — only updates the target, never the DOM directly ── */
  const handleScroll = useCallback(() => {
    const el = pageRef.current
    if (!el) return
    const scrolled = el.scrollTop
    const total    = el.scrollHeight - el.clientHeight
    const pct      = total > 0 ? Math.min(1, scrolled / total) : 0
    setScrollPct(pct)

    const len = pathLenRef.current
    if (!len) return

    // Target is exactly where scroll says — dot chases via rAF lerp (both directions)
    targetDrawnRef.current = len * pct

    // Mark as scrolling; debounce the stop detection
    isScrollingRef.current = true
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 150)

    // Kick the rAF loop if not already running
    startRaf()

    // Sparkle on forward arrival; re-arm on backward scroll so they fire again
    // when the user scrolls forward past that stop a second time.
    STOP_Y_FRACS.forEach((yFrac, idx) => {
      if (pct >= yFrac * 0.95 && !arrivedRef.current.has(idx)) {
        // Crossed this stop going forward — fire sparkles
        arrivedRef.current.add(idx)
        const nodes = document.querySelectorAll('.sp-node-dot')
        if (nodes[idx]) {
          const r = nodes[idx].getBoundingClientRect()
          spawnSparkles(r.left + r.width / 2, r.top + r.height / 2, 14)
        }
      } else if (pct < yFrac * 0.88 && arrivedRef.current.has(idx)) {
        // Scrolled back well past this stop — re-arm so it fires again on return
        arrivedRef.current.delete(idx)
      }
    })
  }, [startRaf])

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [handleScroll])

  /* Build path + measure length — re-runs on journey resize */
  useEffect(() => {
    const journey = journeyRef.current
    if (!journey) return

    const applyPath = () => {
      if (!pathRef.current) return
      const w = journey.offsetWidth || 340
      const h = journey.scrollHeight || 2400
      const d = buildOrganicPath(w, h)
      pathRef.current.setAttribute('d', d)
      requestAnimationFrame(() => {
        try {
          const svgEl = pathRef.current.closest('svg')
          svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`)
          svgEl.setAttribute('width', w)
          svgEl.setAttribute('height', h)
          const len = pathRef.current.getTotalLength()
          pathLenRef.current = len
          // Build a dotted dasharray that covers the full path length.
          // Pattern: 2px dot, 10px gap, repeating.
          // We need enough repetitions to cover `len` px.
          // Append a huge invisible tail so the undrawn portion stays hidden.
          const DOT = 2, GAP = 10, UNIT = DOT + GAP
          const reps = Math.ceil(len / UNIT) + 2
          const pattern = Array.from({ length: reps }, () => `${DOT} ${GAP}`).join(' ')
          // The tail value ensures no visible stroke leaks past the drawn portion
          pathRef.current.style.strokeDasharray = `${pattern} ${len * 2}`
          // Seed both target and displayed from current scroll so resize
          // doesn't snap the dot back to 0
          const el    = pageRef.current
          const total = el ? el.scrollHeight - el.clientHeight : 0
          const pct   = el && total > 0 ? Math.min(1, el.scrollTop / total) : 0
          const seeded = len * pct
          targetDrawnRef.current    = seeded
          displayedDrawnRef.current = seeded
          // Reset arrivals on resize
          arrivedRef.current = new Set()
          // Commit immediately then let rAF settle
          commitDrawn(seeded)
        } catch {}
      })
    }

    const ro = new ResizeObserver(() => applyPath())
    ro.observe(journey)
    const id = setTimeout(applyPath, 300)
    return () => { ro.disconnect(); clearTimeout(id) }
  }, [commitDrawn])

  const toggleMute = () => {
    setMuted(m => { const n = !m; if (audioRef?.current) audioRef.current.muted = n; return n })
  }

  const handleBless = () => {
    const n = blessings + 1; setBlessings(n); setB(n); burstHearts()
  }

  return (
    <div className="sp-root" ref={pageRef} role="main" aria-label="Wedding journey">

      {/* ── Background artwork — slow-rotating mandala, fixed behind everything ── */}
      <div className="sp-bg-artwork" aria-hidden="true">
        <svg className="sp-bg-mandala" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          {/* Concentric rings */}
          <circle cx="200" cy="200" r="190" stroke="#c99a45" strokeWidth="0.6" opacity=".18" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="162" stroke="#c99a45" strokeWidth="0.5" opacity=".14" />
          <circle cx="200" cy="200" r="134" stroke="#c99a45" strokeWidth="0.7" opacity=".16" strokeDasharray="3 5" />
          <circle cx="200" cy="200" r="108" stroke="#e9b99d" strokeWidth="0.5" opacity=".12" />
          <circle cx="200" cy="200" r="82"  stroke="#c99a45" strokeWidth="0.6" opacity=".18" />
          <circle cx="200" cy="200" r="56"  stroke="#c99a45" strokeWidth="0.5" opacity=".14" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="32"  stroke="#e7c878" strokeWidth="0.6" opacity=".15" />
          <circle cx="200" cy="200" r="14"  stroke="#c99a45" strokeWidth="0.8" opacity=".2" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
            <g key={i} transform={`rotate(${a} 200 200)`}>
              <ellipse cx="200" cy="116" rx="7" ry="18"
                fill="rgba(201,154,69,.05)" stroke="#c99a45" strokeWidth="0.5" opacity=".22" />
            </g>
          ))}
          {[0,45,90,135,180,225,270,315].map((a, i) => (
            <g key={i} transform={`rotate(${a} 200 200)`}>
              <ellipse cx="200" cy="155" rx="5" ry="12"
                fill="rgba(233,185,157,.04)" stroke="#e9b99d" strokeWidth="0.4" opacity=".18" />
            </g>
          ))}
          {[0,90,180,270].map((a, i) => (
            <g key={i} transform={`rotate(${a} 200 200)`}>
              <path d="M200,15 L205,22 L200,29 L195,22 Z" fill="rgba(201,154,69,.12)" stroke="#c99a45" strokeWidth="0.5" opacity=".3" />
              <line x1="200" y1="10" x2="200" y2="35" stroke="#c99a45" strokeWidth="0.4" opacity=".2" />
            </g>
          ))}
          <circle cx="200" cy="200" r="6" fill="rgba(201,154,69,.15)" stroke="#c99a45" strokeWidth="0.7" opacity=".25" />
          <circle cx="200" cy="200" r="2.5" fill="#c99a45" opacity=".2" />
        </svg>
      </div>
      <AmbientPetals />

      {/* ── Scroll progress rail ── */}
      <div className="sp-progress-rail" aria-hidden="true">
        <div className="sp-progress-fill" style={{ height: `${scrollPct * 100}%` }} />
        <div className="sp-progress-gem" style={{ top: `${scrollPct * 100}%` }} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          HERO — full viewport, true centre
          ══════════════════════════════════════════════════════════ */}
      <section className="sp-hero">
        <div className="sp-hero-bloom" aria-hidden="true">
          <FloralBloom className="sp-hero-bloom-svg" />
        </div>
        <div className="sp-hero-inner">
          <img className="sp-hero-img" src="/Bride-Groom.png" alt="Chethan and Niveditha" />
          <p className="sp-hero-eyebrow">You are cordially invited</p>
          <h1 className="sp-hero-names">
            Chethan Kumar
            <span className="sp-hero-amp">♥</span>
            Niveditha
          </h1>
          <p className="sp-hero-date">13 · November · 2026</p>
          <div className="sp-hero-rule" aria-hidden="true">
            <span /><i>✦</i><span />
          </div>
          <div className="sp-hero-actions">
            <button type="button" className="sp-icon-btn" onClick={replay} title="Replay film">↻</button>
            <button type="button" className="sp-icon-btn" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
        <div className="sp-scroll-nudge" aria-hidden="true">
          <svg className="sp-nudge-path" viewBox="0 0 40 60" fill="none">
            <path d="M20,0 Q8,20 20,40 Q32,55 20,60"
              stroke="#c99a45" strokeWidth="1.5" strokeDasharray="3 3" opacity=".6" />
            <circle cx="20" cy="60" r="3" fill="rgba(201,154,69,.4)" stroke="#c99a45" strokeWidth="1" />
          </svg>
          <span className="sp-nudge-text">Swipe down</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          DOODLE JOURNEY — one continuous organic path
          ══════════════════════════════════════════════════════════ */}
      <div className="sp-journey" ref={journeyRef}>

        {/* ── The single organic path SVG — spans full journey height ── */}
        <svg className="sp-path-svg" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <filter id="pathGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Single reveal path — golden dotted, drawn progressively on scroll */}
          <path
            ref={pathRef}
            className="sp-doodle-path"
            filter="url(#pathGlow)"
            d=""
          />
        </svg>

        {/* ── Decorative flourish at the path origin ── */}
        <div className="sp-path-origin" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none" className="sp-origin-svg">
            {/* Outer ring */}
            <circle cx="30" cy="30" r="26" stroke="#c99a45" strokeWidth="0.7" opacity=".45" strokeDasharray="4 5" />
            <circle cx="30" cy="30" r="19" stroke="#c99a45" strokeWidth="0.6" opacity=".3" />
            {/* 8 petals */}
            {[0,45,90,135,180,225,270,315].map((a, i) => (
              <g key={i} transform={`rotate(${a} 30 30)`}>
                <ellipse cx="30" cy="12" rx="3.5" ry="7"
                  fill="rgba(201,154,69,.1)" stroke="#c99a45" strokeWidth="0.5" opacity=".5" />
              </g>
            ))}
            {/* Centre glow dot */}
            <circle cx="30" cy="30" r="4" fill="rgba(231,200,120,.35)" stroke="#e7c878" strokeWidth="0.8" opacity=".8" />
            <circle cx="30" cy="30" r="1.8" fill="#e7c878" opacity=".9" />
            {/* 4 tiny diamond sparks */}
            {[0,90,180,270].map((a, i) => (
              <g key={i} transform={`rotate(${a} 30 30)`}>
                <path d="M30,4 L31.4,6 L30,8 L28.6,6 Z" fill="#c99a45" opacity=".55" />
              </g>
            ))}
          </svg>
        </div>

        {/* ── Travelling golden dot at the path tip (behind cards: z-index 2) ── */}
        <div ref={dotGlowRef} className="sp-dot-glow" aria-hidden="true" />
        <div ref={dotRef}     className="sp-dot-tip"  aria-hidden="true" />

        {/* ════════════════════════════════════════════════════════
            SPACER — gives the path room to breathe before STOP 0
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--spacer sp-seg--spacer-xl" />
        <div className="sp-seg sp-seg--spacer sp-seg--spacer-xl" />

        {/* ════════════════════════════════════════════════════════
            STOP 0 — COUNTDOWN
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--countdown" data-reveal-group>
          <div className="sp-node" aria-hidden="true">
            <div className="sp-node-dot" /><div className="sp-node-ring" />
          </div>
          <LeafBranch className="sp-stop-leaf" data-step />
          <div className="sp-info sp-info--left">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>The sands of time…</p>
            <div className="sp-cd-grid" data-step>
              {[{ v: pad(t.d), l: 'Days' }, { v: pad(t.h), l: 'Hours' }, { v: pad(t.m), l: 'Min' }, { v: pad(t.s), l: 'Sec' }].map(({ v, l }) => (
                <div key={l} className="sp-cd-tile">
                  <span className="sp-cd-n">{v}</span>
                  <span className="sp-cd-l">{l}</span>
                </div>
              ))}
            </div>
            <p className="sp-cd-sub" data-step>until forever begins</p>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 1 — BRIDE'S MEHNDI
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--bride-mehandi" data-reveal-group>
          <div className="sp-node" aria-hidden="true">
            <div className="sp-node-dot" /><div className="sp-node-ring" />
          </div>
          <HennaMandala />
          <div className="sp-info sp-info--right">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>First comes colour…</p>
            <h2 className="sp-dest-title" data-step>Bride's Mehandi</h2>
            <div className="sp-dest-ornament" data-step aria-hidden="true">— ✦ —</div>
            <p className="sp-dest-detail" data-step>
              <span className="sp-detail-label">Where</span>
              Radha krishna Hall, Mangaluru
            </p>
            <p className="sp-dest-detail" data-step>
              <span className="sp-detail-label">When</span>
              Wednesday, 11<sup>th</sup> November 2026
            </p>
            <a className="sp-map-btn" data-step
              href="https://maps.app.goo.gl/qPwzFFh1CaHcMDox8"
              target="_blank" rel="noopener noreferrer">
              <MapPin /> Find on map
            </a>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 2 — GROOM'S MEHNDI
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--groom-mehandi" data-reveal-group>
          <div className="sp-node" aria-hidden="true">
            <div className="sp-node-dot" /><div className="sp-node-ring" />
          </div>
          <LeafBranch flip className="sp-stop-leaf" />
          <div className="sp-info sp-info--left">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>Then, his adornment…</p>
            <h2 className="sp-dest-title" data-step>Groom's Mehandi</h2>
            <div className="sp-dest-ornament" data-step aria-hidden="true">— ✦ —</div>
            <p className="sp-dest-detail" data-step>
              <span className="sp-detail-label">Where</span>
              Beeri Home, Mangaluru
            </p>
            <p className="sp-dest-detail" data-step>
              <span className="sp-detail-label">When</span>
              Thursday, 12<sup>th</sup> November 2026
            </p>
            <a className="sp-map-btn" data-step
              href="https://goo.gl/maps/p8EZNMqXkpUoEqN26"
              target="_blank" rel="noopener noreferrer">
              <MapPin /> Find on map
            </a>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 3 — THE WEDDING
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--wedding sp-seg--center" data-reveal-group>
          <div className="sp-node sp-node--sacred" aria-hidden="true">
            <div className="sp-node-dot" />
            <div className="sp-node-ring" />
            <div className="sp-node-ring sp-node-ring--2" />
          </div>
          <ArchGateway />
          <div className="sp-info sp-info--center">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>The sacred moment arrives</p>
            <h2 className="sp-dest-title sp-dest-title--lg" data-step>The Wedding</h2>
            <p className="sp-muhurtham" data-step>Abhijith Muhurtham · 12:10 Noon</p>
            <p className="sp-dest-detail sp-dest-detail--center" data-step>
              Friday, 13<sup>th</sup> November 2026
            </p>
            <div className="sp-venue-block" data-step>
              <MapPin />
              <div>
                <span className="sp-venue-name">Sri Durga Dhyana Mandir</span>
                <span className="sp-venue-addr">Sri Durga Parameshwari Temple,<br />Devipura, Talapady, Mangalore</span>
              </div>
            </div>
            <a className="sp-map-btn sp-map-btn--center" data-step
              href="https://maps.google.com/?q=Sri+Durga+Dhyana+Mandir+Devipura+Talapady+Mangalore"
              target="_blank" rel="noopener noreferrer">
              <MapPin /> Find on map
            </a>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 4 — RECEPTION
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--reception" data-reveal-group>
          <div className="sp-node" aria-hidden="true">
            <div className="sp-node-dot" /><div className="sp-node-ring" />
          </div>
          <LanternSvg />
          <div className="sp-info sp-info--right">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>As evening falls…</p>
            <h2 className="sp-dest-title" data-step>Reception</h2>
            <div className="sp-dest-ornament" data-step aria-hidden="true">— ✦ —</div>
            <p className="sp-dest-detail" data-step>
              <span className="sp-detail-label">When</span>
              Sunday, 15<sup>th</sup> November · from 7 p.m.
            </p>
            <div className="sp-venue-block" data-step>
              <MapPin />
              <div>
                <span className="sp-venue-name">Kulala Bhavana</span>
                <span className="sp-venue-addr">Near Mangaladevi Temple, Mangaluru</span>
              </div>
            </div>
            <a className="sp-map-btn" data-step
              href="https://maps.google.com/?q=Kulala+Bhavana+Mangaladevi+Temple+Mangaluru"
              target="_blank" rel="noopener noreferrer">
              <MapPin /> Find on map
            </a>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 5 — GALLERY
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--gallery sp-seg--center" data-reveal-group>
          <div className="sp-node" aria-hidden="true">
            <div className="sp-node-dot" /><div className="sp-node-ring" />
          </div>
          <div className="sp-info sp-info--center sp-info--gallery">
            <FlowerDecor corners={['tr']} />
            <p className="sp-info-eyebrow" data-step>A chapter written in glances…</p>
            <p className="sp-gallery-title" data-step>Moments Frozen in Time</p>
            <p className="sp-gallery-sub" data-step>A few stolen glances from their story</p>
            <div className="sp-gallery-scatter" data-step>
              {[
                { cap: 'A glimpse of joy',      tilt: '-5deg', oy: '-10px', delay: 0   },
                { cap: 'Traditions run deep',   tilt: '4deg',  oy: '8px',  delay: 120 },
                { cap: 'Eyes that speak',       tilt: '-2deg', oy: '-6px', delay: 240 },
                { cap: 'Laughter & love',       tilt: '6deg',  oy: '12px', delay: 360 },
                { cap: 'Blessed by the stars',  tilt: '-4deg', oy: '-14px',delay: 480 },
                { cap: 'Forever begins here',   tilt: '2deg',  oy: '4px',  delay: 600 },
              ].map(({ cap, tilt, oy, delay }, i) => (
                <div key={i} className="sp-polaroid" data-step
                  style={{ '--pt': tilt, '--py': oy, transitionDelay: `${delay}ms` }}>
                  <div className="sp-pol-photo"><span className="sp-pol-star">✦</span></div>
                  <p className="sp-pol-cap">{cap}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sp-seg sp-seg--spacer sp-seg--journey-gap" />

        {/* ════════════════════════════════════════════════════════
            STOP 6 (FINAL) — BLESSINGS
            ════════════════════════════════════════════════════════ */}
        <div className="sp-seg sp-seg--blessings sp-seg--center" data-reveal-group>
          <div className="sp-node sp-node--final" aria-hidden="true">
            <div className="sp-node-dot" />
            <div className="sp-node-ring" />
            <div className="sp-node-ring sp-node-ring--2" />
            <div className="sp-node-ring sp-node-ring--3" />
          </div>
          <FloralBloom className="sp-bless-bloom" />
          <div className="sp-bless-inner">
            <p className="sp-bless-tag" data-step>You have reached the heart of this journey</p>
            <h2 className="sp-bless-title" data-step>
              Shower Them<br />with Love
            </h2>
            <p className="sp-bless-sub" data-step>
              Your warmth is the greatest blessing<br />they could ever carry with them.
            </p>
            <button type="button" className="sp-bless-btn" onClick={handleBless} data-step>
              <span className="sp-bless-btn-text">✦ &nbsp;Send Your Blessings&nbsp; ✦</span>
            </button>
            <p className="sp-bless-count" data-step aria-live="polite">
              <span className="sp-bless-num">{blessings}</span>
              <span className="sp-bless-unit"> souls have sent their love</span>
            </p>
            <div className="sp-journey-end" data-step aria-hidden="true">
              <svg viewBox="0 0 120 24" fill="none">
                <path d="M0,12 Q30,4 60,12 Q90,20 120,12" stroke="#c99a45" strokeWidth="1" opacity=".4" />
                <circle cx="60" cy="12" r="3" fill="#c99a45" opacity=".5" />
                <circle cx="20" cy="10" r="1.5" fill="#c99a45" opacity=".3" />
                <circle cx="100" cy="14" r="1.5" fill="#c99a45" opacity=".3" />
              </svg>
              <span className="sp-end-text">Made with ♥ by KK</span>
            </div>
          </div>
        </div>

        {/* End padding */}
        <div className="sp-seg sp-seg--spacer sp-seg--spacer-end" />

      </div>{/* end .sp-journey */}
    </div>
  )
}
