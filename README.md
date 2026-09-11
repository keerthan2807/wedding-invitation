# 💍 Wedding Invitation v2 — Ultra Premium Edition

Keerthana Hari ❤️ Najunkishor — A cinematic, immersive digital wedding invitation.

## ✨ Premium Features

### ReactBits-Style Components (Hand-Implemented)
- **Aurora** — WebGL GLSL shader aurora background with animated color blending
- **Silk** — WebGL fluid silk texture overlay for section backgrounds  
- **Particles** — Canvas-based interactive particle system with mouse repulsion + connection lines
- **SideParticleFlow** — Continuous side-to-side particle streams (petals, stars, diamonds) flowing across the screen
- **SplashCursor** — WebGL-style fluid cursor with particle splat effect on click
- **BlurText** — Word-by-word blur-fade reveal animation (like ReactBits BlurText)
- **LetterByLetter** — 3D letter flip reveal animation

### 3D Scene (React Three Fiber)
- **6 concentric rotating rings** with gold metallic material + emissive glow
- **12 orbiting light orbs** on animated paths
- **250 volumetric sphere particles** in a dynamic 3D shell
- **35 floating petal instances** rising through the scene
- **Dynamic spot lights** that orbit the mandala
- **Center octahedron gem** with ultra-metallic sheen

### Visual Effects
- WebGL Aurora backgrounds (different colors per section)
- Continuous side particle flow fixed to viewport
- Per-section Silk texture overlays
- Per-section particle layers
- Glassmorphism dark cards with gold borders
- Gold shimmer text animations
- Confetti burst (left+right+center) on RSVP submit
- Ambient music synthesizer (5-note harmonic)
- Animated Ganesh OM symbol
- Floral SVG corner decorations
- Scroll-triggered blur-text reveals

## 🚀 Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## 🏗️ Architecture

```
src/
├── App.jsx                    # Main app, all sections
├── main.jsx                   # Entry point
├── index.css                  # Global styles + CSS animations
└── components/
    ├── Scene3D.jsx            # R3F: Mandala + particles + petals
    ├── Aurora.jsx             # WebGL aurora background shader
    ├── Silk.jsx               # WebGL silk texture shader
    ├── Particles.jsx          # Canvas interactive particle system
    ├── SideParticleFlow.jsx   # Canvas side-to-side particle streams
    ├── SplashCursor.jsx       # Canvas fluid cursor effect
    ├── BlurText.jsx           # Framer Motion blur-reveal text
    ├── CountdownTimer.jsx     # Live countdown to wedding day
    └── Decorative.jsx         # SVG: Gold divider, floral corners, Ganesh
```

## 🎨 Design Language
- **Dark luxury** — Deep charcoal/obsidian base
- **Gold accents** — #c9a84c shimmer throughout
- **Sage green** — Complementary nature tones
- **Cream text** — Warm ivory against dark backgrounds
- **Fonts** — Great Vibes (script) + Cinzel (display) + Cormorant Garamond (body)
