# Twigwind CSS Framework [![](https://data.jsdelivr.com/v1/package/npm/twigwind/badge)](https://www.jsdelivr.com/package/npm/twigwind)
A utility-first CSS framework that's tiny, JS-powered, and designed for rapid prototyping.

---

## Features

- **Utility-first CSS framework** - Build directly in your HTML
- **Dynamic CSS generators** - JavaScript-powered utility generation
- **Position utilities** - Complete positioning system with inset, z-index, and directional controls
- **Animation utilities** - Built-in keyframe animations (spin, pulse, bounce, fade, slide effects)
- **Linear gradient utilities** - Dynamic gradient generation with directional and angle-based gradients
- **Background utilities** - Image backgrounds with automatic sizing and positioning
- **Responsive and hover-friendly classes** - sm:, md:, lg: prefixes and hover: states
- **Build system** - Optional build-time CSS generation with file watching
- **Universal module support** - Works with both CommonJS and browser globals
- **Runtime CSS generation** - Extreme flexibility with dynamic styling

---

![Twigwind Logo](https://raw.githubusercontent.com/helloadhavan/twigwind/refs/heads/main/twigwind.svg)

---

## New Features Added

### Position Utilities
Complete positioning system with:
- Position types: `absolute`, `relative`, `fixed`, `sticky`, `static`
- Directional positioning: `top-*`, `bottom-*`, `left-*`, `right-*`
- Inset utilities: `inset-*`, `inset-x-*`, `inset-y-*`
- Z-index management: `z-*` (0-100 range)

### Animation Utilities
17 built-in keyframe animations with dynamic syntax:
- **Rotation**: `spin`, `wiggle`
- **Scaling**: `pulse`, `ping`, `zoomIn`, `zoomOut`, `heartbeat`, `rubberBand`
- **Movement**: `bounce`, `shake`
- **Fade effects**: `fadeIn`, `fadeOut`, `flash`
- **Slide effects**: `slideUp`, `slideDown`, `slideLeft`, `slideRight`

**Syntax**: `animate-(keyframe)-(duration)-(direction)`
- Duration: number + `ms` or `s` (e.g., `500ms`, `2s`)
- Direction: `infinite`, `normal`, `reverse`, `alternate`, `alternate-reverse`

### Linear Gradient Utilities
Dynamic gradient generation:
- Directional: `gradient-to-r-red-blue`, `gradient-to-br-purple-pink`
- Angle-based: `gradient-45deg-green-yellow`, `gradient-135deg-blue-cyan`
- Multi-color: `gradient-to-b-blue-cyan-lightBlue`
- Hover effects: `hover:gradient-to-r-orange-red`

### Background Utilities
- **Background images**: `image-url-[URL]` with automatic sizing and positioning
- **Background clip**: `clip-border`, `clip-padding`, `clip-content`

---

## Quick Start

### Option 1: Runtime Usage (Browser)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Twigwind App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Twigwind CSS (optional base styles) -->
  <link rel="stylesheet" href="src/css.css">
</head>
<body>

  <!-- Hero Section -->
  <section class="relative h-400 bg-blue">
    <div class="absolute inset-0 flex:row-center-center">
      <div class="text-center color-white">
        <h1 class="size-xl color-white animate-fadeIn-1s-normal">Welcome to Twigwind</h1>
        <p class="mt-10 color-white animate-slideUp-800ms-normal">Build beautiful interfaces rapidly</p>
        <button class="p-12 bg-white color-purple hover:bg-lightBlue transition:all_0.3s_ease mt-20 border-radius-8px">
          Get Started
        </button>
      </div>
    </div>
  </section>

  <!-- Feature Cards -->
  <section class="p-40 bg-sand">
    <div class="grid:3,1,20px">
      <div class="bg-white p-20 shadow-lg border-radius-8px">
        <h3 class="color-indigo mb-10">Utility-First</h3>
        <p class="color-blueGrey">Build directly in your HTML with utility classes</p>
      </div>
      <div class="bg-white p-20 shadow-lg border-radius-8px">
        <h3 class="color-purple mb-10">JS-Powered</h3>
        <p class="color-blueGrey">Dynamic CSS generation with JavaScript</p>
      </div>
      <div class="bg-white p-20 shadow-lg border-radius-8px">
        <h3 class="color-green mb-10">Lightweight</h3>
        <p class="color-blueGrey">Tiny footprint, maximum flexibility</p>
      </div>
    </div>
  </section>

  <!-- Twigwind JS -->
  <script src="src/css.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[class]").forEach(el => Twigwind.twApply(el));
      Twigwind.twInject();
    });
  </script>

</body>
</html>
```

### Option 2: Build-time Usage (Node.js)
```bash
# Install dependencies
npm -g install twigwind

twigwind build --input [input folder] --output [output folder]
twigwind help # for more info   
```

The build system will:
- Scan all `.html` files in your project
- Extract Twigwind classes and generate optimized CSS
- Output CSS files to the `dist/` directory
- Watch for changes and rebuild automatically

---

## Core Utilities

### Colors
```html
<!-- Predefined colors -->
<div class="bg-blue color-white">Blue background</div>
<div class="bg-red color-white">Red background</div>

<!-- Arbitrary colors -->
<div class="bg-#ff6b35 color-white">Custom hex</div>
<div class="bg-rgb(60,180,75) color-white">Custom RGB</div>
```

### Layout & Positioning
```html
<!-- Flexbox -->
<div class="flex:row-center-center">Centered content</div>
<div class="flex:col-left-top">Column layout</div>

<!-- Grid -->
<div class="grid:3,2,16px">Grid with 3 columns, 2 rows, 16px gap</div>

<!-- Positioning -->
<div class="absolute top-10 right-10 z-50">Positioned element</div>
<div class="relative inset-0">Full coverage</div>
```

### Animations
```html
<!-- Twigwind animation syntax: animate-(keyframe)-(duration)-(direction) -->
<div class="animate-spin-1s-infinite">Spinning element</div>
<div class="animate-bounce-500ms-infinite">Bouncing element</div>
<div class="animate-fadeIn-800ms-normal">Fading in</div>
<div class="animate-slideUp-600ms-normal">Sliding up</div>

<!-- Hover animations -->
<div class="hover:animate-pulse-2s-infinite">Hover to pulse</div>
<div class="hover:animate-shake-300ms-normal">Hover to shake</div>

<!-- Complex animations -->
<div class="animate-heartbeat-1s-alternate">Heartbeat effect</div>
<div class="animate-rubberBand-800ms-normal">Rubber band effect</div>
```

### Gradients
```html
<!-- Linear gradients -->
<div class="gradient-to-r-blue-purple">Left to right gradient</div>
<div class="gradient-45deg-red-yellow">45-degree gradient</div>
<div class="gradient-to-b-blue-cyan-white">Three-color gradient</div>
```

### Backgrounds
```html
<!-- Background images -->
<div class="image-url-https://example.com/image.jpg">Background image</div>

<!-- Background clip -->
<div class="gradient-to-r-red-blue clip-content">Clipped to content</div>
```

---

## Installation

### NPM Package
```bash
npm install twigwind
```

### CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/helloadhavan/twigwind/src/css.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/helloadhavan/twigwind/src/css.js"></script>
```

### Manual Download
Download the latest release from GitHub and include the files in your project:
- `src/css.css` - Base styles and animations
- `src/css.js` - Dynamic utility generator

---

## Framework Comparison

| Feature / Framework            | W3.CSS | Tailwind | Bootstrap | Twigwind |
|--------------------------------|--------|----------|-----------|----------|
| **Ease of Learning**           | ✔️      | ❌       | ⭐        | ✔️      |
| **Utility-First Approach**     | ❌      | ⭐       | ❌        | ⭐      |
| **Customization / Flexibility**| ✔️      | ⭐       | ✔️        | ⭐      |
| **Responsive Design**          | ✔️      | ⭐       | ⭐        | ⭐      |
| **Animation System**           | ❌      | ✔️       | ✔️        | ⭐      |
| **Gradient Utilities**         | ❌      | ✔️       | ❌        | ⭐      |
| **Position Utilities**         | ✔️      | ⭐       | ✔️        | ⭐      |
| **File Size / Lightweight**    | ⭐      | ✔️       | ❌        | ⭐      |
| **Dynamic/JS Integration**     | ❌      | ✔️       | ✔️        | ⭐      |
| **Rapid Prototyping**          | ✔️      | ⭐       | ⭐        | ⭐      |

**Legend:**  
⭐ = Excellent | ✔️ = Good | ❌ = Poor

**Notes:**  
- **W3.CSS** is lightweight and easy to learn but lacks modern utility features.  
- **Tailwind** is highly flexible and utility-first, but requires build tools and has a steeper learning curve.  
- **Bootstrap** has a huge ecosystem and prebuilt components, but is heavier and less flexible.  
- **Twigwind** combines lightweight, utility-first design with easy JS integration, built-in animations, gradients, and positioning utilities - ideal for fast prototyping and flexible customization without build tools.

---

## File Structure

```
twigwind/
├── src/
│   ├── css.css          # Base styles and animations
│   └── css.js           # Dynamic utility generator
├── build.js             # Build system
├── package.json         # NPM package configuration
├── test.html            # Comprehensive demo page
├── hljs.js              # Syntax highlighting loader
├── README.md
├── LICENSE.txt
├── logo.png             # Twigwind logo
├── twigwind.png         # Twigwind banner
└── version.txt          # Version file
```

---
