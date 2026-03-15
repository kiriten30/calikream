# 🏋️ Hero Section Design Plan
## Premium Calisthenics Training Website

> **Status:** Design / Planning Phase — No code yet  
> **Project:** Calisthenics Progression Website  
> **Section:** Hero (Landing View)  
> **Assets:** 5 extracted frames from `planchevideo.mp4` showing tuck → full planche progression

---

## Table of Contents
1. [Visual Concept](#1-visual-concept)
2. [Hero Layout Architecture](#2-hero-layout-architecture)
3. [Scroll Animation Behavior](#3-scroll-animation-behavior)
4. [UI Component Design](#4-ui-component-design)
5. [Motion Design Details](#5-motion-design-details)
6. [Technical Architecture](#6-technical-architecture)
7. [Asset Reference](#7-asset-reference)
8. [Summary Table](#8-summary-table)

---

## 1. Visual Concept

### Theme
**"Master Gravity"** — A cinematic, scroll-driven hero that makes the user *feel* the progression from tuck planche to full planche as they scroll. The athlete is the centerpiece — large, bold, and commanding — against a clean, airy white canvas.

### Mood
Minimal luxury meets athletic power. Think **Apple product page** meets **Nike Training**. The whitespace breathes, the typography is bold, and the animation is silky smooth.

### Color Palette

| Role | Color Value | Usage |
|------|-------------|-------|
| Background | `#FFFFFF` → `#F5F5F5` | Main canvas (subtle gradient) |
| Primary Accent | `#FF6B2C` | CTAs, highlights, active states, glow |
| Secondary | `#1A1A1A` | Headlines, body text |
| Tertiary | `#2D2D2D` | Subtext, card borders |
| Glass Panel Fill | `rgba(255,255,255,0.6)` | Translucent info cards |
| Glass Panel Blur | `backdrop-filter: blur(20px)` | Applied to all glass components |
| Glow Color | `#FF6B2C` at 15–30% opacity | Radial glow behind athlete |

---

## 2. Hero Layout Architecture

### Container Structure
The hero occupies a **tall pinned scroll container (~500vh)**. The viewport locks in place while the user scrolls through the animation sequence. Once the sequence completes, the page unpins and continues scrolling.

### Visual Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│  [ Navigation Bar — transparent, glass on scroll ]       │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │      HEADLINE: "MASTER THE PLANCHE"               │   │
│  │      Subtext: "Scroll to see the progression"    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│             ┌──────────────────────┐                    │
│             │                      │                    │
│  [Glass     │    ATHLETE CANVAS    │   [Glass           │
│   Panel L]  │    (frame sequence)  │    Panel R]        │
│             │                      │                    │
│             └──────────────────────┘                    │
│                                                         │
│  ┌────────────────────────┐                             │
│  │ Stage Label (animated) │                             │
│  └────────────────────────┘                             │
│                                                         │
│         ↓  Scroll Indicator (pulsing arrow + text)  ↓   │
│              "Scroll to progress"                       │
│                                                         │
│  ○ ○ ○ ○ ○  ← Stage progress dots (right edge)          │
└─────────────────────────────────────────────────────────┘
```

### Layer Stack (Bottom to Top)

| Z-Index | Layer | Description |
|---------|-------|-------------|
| 0 | Background | White base + faint radial warm gradient |
| 1 | Background parallax | Subtle dot/grid texture, moves at 0.3x scroll speed |
| 2 | Glow layer | Orange radial glow `<div>` behind athlete, scroll-reactive |
| 3 | Athlete canvas | Main HTML5 `<canvas>` — frame blending renders here |
| 4 | Text layer | Headline, subtext, stage labels (fade in/out with scroll) |
| 5 | Glass UI layer | Info panels, stage progress dots |
| 6 | Navigation | Top bar (fixed) |

---

## 3. Scroll Animation Behavior

### 3.1 Overview
The hero is a **pinned scroll sequence**. The page height is set to ~500vh. As the user scrolls, a normalized progress value (`0.0` → `1.0`) drives the entire animation — frame transitions, text changes, glow intensity, and UI states.

### 3.2 Scroll Progression Story

| Scroll % | Frame Active | Visual State | Text / UI Event |
|-----------|--------------|-------------|-----------------|
| **0–5%** | frame1 | Athlete in full tuck position | Headline **"Master the Planche"** fades in. Scroll indicator pulsing. |
| **5–15%** | frame1 → frame2 | Smooth transition begins | Headline fades out. Stage card appears: *"Tuck Planche"* |
| **15–35%** | frame2 → frame3 | Legs beginning to extend | Text slides in: *"Build the foundation. Control every muscle."* |
| **35–55%** | frame3 → frame4 | Approaching full extension | Text: *"Extend beyond limits."* Glow begins to intensify. |
| **55–80%** | frame4 → frame5 | Near full planche | Stage card updates. Glow at peak. Parallax background shift visible. |
| **80–95%** | frame5 | Full planche — held position | **"Full Planche. Pure Control."** fades in. CTA button appears. |
| **95–100%** | frame5 | Hero unpins | Section scrolls up naturally into next content. |

### 3.3 Frame Transition Mechanics

Frame blending creates infinite smoothness between just 5 images:

- The 5 frames are mapped to 5 equally spaced scroll positions
- **Between two adjacent keyframes:** both are drawn on canvas simultaneously
  - Earlier frame: `opacity = 1 - blendRatio`
  - Later frame: `opacity = blendRatio`
  - `blendRatio` goes from `0.0 → 1.0` over the scroll range between those frames
- Example: at 50% between frame2 and frame3 → frame2 at 50% alpha, frame3 at 50% alpha
- This simulates **visual interpolation** — the eye perceives a smooth transition

**No snapping. No discrete jumps. Fully continuous.**

### 3.4 Scroll Smoothing

To prevent jerky behavior from fast scroll input:
- Raw scroll position is stored as a **target value**
- A `requestAnimationFrame` loop runs continuously, **lerping** the *current* progress toward the *target*
- Lerp factor: ~`0.08–0.12` (slower = silkier, but adds slight lag)
- Result: even rapid scrolling produces a smooth, cinematic animation

---

## 4. UI Component Design

### 4.1 Hero Headline
- **Font:** Inter Black / Helvetica Neue Bold (800–900 weight)
- **Size:** 72–96px desktop, 40–56px mobile
- **Color:** Deep charcoal `#1A1A1A`
- **Letter spacing:** `-0.02em`
- **Text:** `"MASTER THE PLANCHE"`
- **Animation:** Fades in on page load (`opacity 0→1, translateY -20px→0`), fades out as scroll begins

### 4.2 Scroll Sub-Prompt
- Positioned below headline
- **Text:** *"Scroll to see the progression →"*
- Size: 16–18px, color: `#FF6B2C`
- Fades out at ~8% scroll progress

### 4.3 Stage Labels (Scroll-Driven Text)
- Appear/disappear tied to scroll position
- Size: 20–24px uppercase, tracked, charcoal
- One label per stage:
  - Stage 1: *"Tuck Planche — Where it begins"*
  - Stage 2: *"Advanced Tuck — Building raw strength"*
  - Stage 3: *"Partial Extension — Breaking barriers"*
  - Stage 4: *"Full Planche — Pure mastery"*
- Transition: fade + slide in from below (`translateY 15px→0`), fade + slide out upward when leaving

### 4.4 Glassmorphism Info Panels
- **Shape:** Rounded rectangle, `border-radius: 20px`
- **Size:** ~200×120px
- **Background:** `rgba(255, 255, 255, 0.6)`
- **Blur:** `backdrop-filter: blur(20px) saturate(1.2)`
- **Border:** `1px solid rgba(255, 255, 255, 0.5)` (inner-glow feel)
- **Shadow:** `0 8px 32px rgba(0, 0, 0, 0.08)`
- **Content (Left panel):** Stage name, current phase
- **Content (Right panel):** Difficulty stars (★★★☆☆), muscles targeted
- **Animation:** Slide in from edges, opacity 0→1, tied to each scroll phase
- **Float micro-anim:** Gentle vertical oscillation `±3px` over 4s loop

### 4.5 Stage Progress Dots
- **Position:** Right edge of viewport, vertical center
- 5 dots representing the 5 frame stages
- **Inactive:** Small (~6px), outline only, charcoal
- **Active:** Larger (~10px), filled solid orange `#FF6B2C`, subtle glow
- **Transition:** Scale + color transition as scroll moves between stages

### 4.6 Scroll Indicator
- **Position:** Bottom center of viewport
- **Element:** Downward chevron `↓` or animated arrow
- **Color:** Orange `#FF6B2C`
- **Animation:** Bouncing pulse (scale 1→1.15 loop)
- **Behavior:** Fades to `opacity 0` after 10% scroll progress

### 4.7 CTA Button
- **Appears at:** ~85% scroll progress
- **Style:** Solid orange pill button
  - Background: `#FF6B2C`
  - Text: `#FFFFFF`, 16px, semi-bold
  - Border radius: `50px` (full pill)
  - Padding: `16px 40px`
- **Text:** *"Start Your Journey"*
- **Glow:** Soft orange box-shadow `0 8px 30px rgba(255, 107, 44, 0.4)`
- **Entry animation:** Scale `0.9→1.0` + opacity `0→1`, subtle elastic bounce

---

## 5. Motion Design Details

### 5.1 Orange Glow Behind Athlete
- Implemented as a `<div>` positioned behind the canvas
- CSS: `background: radial-gradient(circle, rgba(255,107,44,X) 0%, transparent 70%)`
- `X` (opacity) is **scroll-reactive**: ranges from `0.05` at scroll 0% to `0.25` at scroll 100%
- Radius also grows slightly as scroll advances (simulates energy/power increasing)

### 5.2 Parallax Depth Layers
- **Background texture** (subtle dot pattern): moves at `0.3x` of scroll speed
- **Glow layer**: moves at `0.7x` scroll speed
- **Athlete canvas**: pinned at `1x` (stationary in viewport while sequence runs)
- **Text layers**: slight `0.9x` Y-parallax for depth perception

### 5.3 Micro-Animations
| Element | Animation | Trigger |
|---------|-----------|---------|
| Glass panels | Gentle float (Y ±3px, 4s loop) | Always on |
| Athlete at full planche | Subtle scale pulse (1.0→1.02→1.0) | On reaching frame5 |
| CTA button | Entrance bounce (scale 0.9→1.0) | On scroll ~85% |
| Stage progress dots | Scale + color transition | Per stage |
| Scroll indicator | Bounce pulse | On load, fades on scroll |

### 5.4 Easing & Smoothing Summary
- **Frame interpolation:** Linear alpha blending (no easing — scroll position is the easing)
- **Scroll lerp:** Exponential smoothing factor `~0.08` via `rAF` loop
- **CSS animations:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out) for UI element entries
- **CTA entrance:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (elastic overshoot)

---

## 6. Technical Architecture

### 6.1 Chosen Approach: **HTML5 Canvas + GSAP ScrollTrigger**

**Decision rationale:**

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| CSS-only scroll | Native, simple | No frame blending, limited control | ❌ Too limited |
| Video scrub + `currentTime` | Smooth video playback | Codec stutters, no opacity control, mobile issues | ❌ Unreliable |
| Lottie animation | Great for vectors | Not for photo-realistic frames | ❌ Wrong use case |
| **Canvas + GSAP** | Pixel-perfect blending, full control, buttery scroll | Slightly more setup | ✅ **Best choice** |
| Three.js / WebGL | Maximum visual effects | Overkill for 2D frame sequence | ❌ Unnecessary complexity |

### 6.2 Animation Engine Data Flow

```
User Scrolls
     │
     ▼
GSAP ScrollTrigger
[pins section, emits progress: 0.0 → 1.0]
     │
     ▼
Scroll Target Store
[raw progress stored as targetProgress]
     │
     ▼  (lerp at 0.08 factor per rAF tick)
rAF Loop
[currentProgress lerps toward targetProgress]
     │
     ├──► Frame Interpolation Engine
     │    [maps progress to → framePair + blendAlpha]
     │    [e.g., progress 0.4 → frame2, frame3, alpha 0.5]
     │              │
     │              ▼
     │         HTML5 Canvas
     │    [ctx.drawImage(frame2, alpha 0.5)]
     │    [ctx.drawImage(frame3, alpha 0.5)]
     │
     ├──► GSAP Timelines (text, UI)
     │    [stage labels, glass panel state, CTA]
     │
     └──► CSS Custom Properties
          [--glow-opacity, --bg-offset, etc.]
          [updated per rAF for GPU-composited effects]
```

### 6.3 Frame Preloading Strategy

All 5 PNG frames must be fully loaded and decoded before animation starts:
1. Create `new Image()` objects for all 5 frames simultaneously
2. Use `Promise.all()` to wait for all `onload` events
3. Call `img.decode()` for non-blocking GPU decode
4. Show a minimal loading state (thin orange progress bar at top) until all frames ready
5. Then remove loader and begin scroll sequence

### 6.4 Canvas Setup

- Single `<canvas>` element sized to `100vw × 100vh`
- On window resize: update canvas dimensions and redraw
- Context: `canvas.getContext('2d')` — no `willReadFrequently` (write-only for GPU compositing)
- The canvas fits the athlete image maintaining aspect ratio (`object-fit: contain` logic in JS)

### 6.5 Performance Optimizations

| Technique | Benefit |
|-----------|---------|
| All frames preloaded | No decode lag during animation |
| rAF-only canvas updates | Synced to display refresh (60/120fps) |
| CSS `will-change: transform, opacity` on UI elements | GPU layer promotion |
| `transform` / `opacity` only for animations | No layout reflows |
| Single canvas element | No DOM manipulation per frame |
| Scroll event → target only | No heavy work in scroll handler |

---

## 7. Asset Reference

| File | Role | Used At |
|------|------|---------|
| `frames/frame1.png` | Tuck planche start position | Scroll 0–20% |
| `frames/frame2.png` | Early progression | Scroll 20–40% |
| `frames/frame3.png` | Mid progression | Scroll 40–60% |
| `frames/frame4.png` | Advanced progression | Scroll 60–80% |
| `frames/frame5.png` | Full planche end position | Scroll 80–100% |
| `tuckplanche.png` | Reference / alternate use | Optional thumbnail |
| `fullplanche.png` | Reference / alternate use | Optional thumbnail |
| `planchevideo.mp4` | Source video (already extracted) | Not used in hero |

---

## 8. Summary Table

| Aspect | Decision |
|--------|----------|
| **Visual style** | Premium minimal — white + orange + charcoal + glassmorphism |
| **Hero pinned height** | ~500vh scroll container |
| **Animation type** | 5-frame canvas cross-fade, scroll-driven |
| **Frame blending** | Canvas `globalAlpha` dual-draw between adjacent frames |
| **Scroll engine** | GSAP ScrollTrigger (pinning + normalized progress) |
| **Smoothing method** | Lerped `currentProgress` via `requestAnimationFrame` |
| **UI components** | Glass cards, stage labels, scroll dots, scroll indicator, CTA |
| **Glow effect** | Scroll-reactive radial orange gradient behind canvas |
| **Parallax** | 3 layers at 0.3x / 0.7x / 1x scroll speeds |
| **Performance** | Preloaded frames, GPU canvas, transform-only animations |
| **Fonts** | Inter Black (headlines), Inter Regular (body) |
| **Primary CTA** | *"Start Your Journey"* — orange pill button, appears at 85% |

---

*Document created: March 2026*  
*Next phase: Implementation — HTML, CSS, JavaScript with GSAP + Canvas API*
