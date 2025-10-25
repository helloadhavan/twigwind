# Twigwind CSS Framework

A dark-first, utility CSS framework that's tiny, JS-powered, and designed for rapid prototyping.

---

## Features

- **Utility-first CSS framework** - Build directly in your HTML
- **Dynamic CSS generators** - JavaScript-powered utility generation
- **Position utilities** - Complete positioning system with inset, z-index, and directional controls
- **Animation utilities** - 17 built-in keyframe animations (spin, pulse, bounce, fade, slide effects)
- **Linear gradient utilities** - Dynamic gradient generation with directional and angle-based gradients
- **Background utilities** - Image backgrounds, background-clip properties
- **Responsive and hover-friendly classes** - sm:, md:, lg: prefixes and hover: states
- **Google Fonts & Icons integration** - Easy integration with premium typography and iconography
- **Comprehensive documentation** - 12 organized documentation pages
- **Syntax highlighting** - Built-in Highlight.js integration with multiple themes
- **Built with JavaScript** - Extreme flexibility and runtime CSS generation

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

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Twigwind App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Google Fonts (optional) -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Google Icons (optional) -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
  <!-- Twigwind CSS -->
  <link rel="stylesheet" href="css.css">
</head>
<body>

  <!-- Hero Section with image as Background -->
  <section class="relative h-420 image-url-https://images.unsplash.com/photo-1506905925346-21bda4d32df4"">
    <div class="absolute inset-0 flex:row-center-center">
      <div class="text-center color-white">
        <h1 class="size-xxl color-white animate-fadeIn-1s-normal">Welcome to Twigwind</h1>
        <p class="mt-10 color-white animate-slideUp-800ms-normal">Build beautiful interfaces rapidly</p>
        <button class="p-12 bg-white color-purple hover:bg-lightBlue animate-pulse-2s-infinite mt-20">
          Get Started
        </button>
      </div>
    </div>
  </section>

  <!-- Feature Cards -->
  <section class="p-40">
    <div class="grid:3,1,20px">
      <div class="bg-white p-20 shadow-lg animate-fadeIn-600ms-normal">
        <h3 class="color-indigo mb-10">Utility-First</h3>
        <p class="color-blueGrey">Build directly in your HTML with utility classes</p>
      </div>
      <div class="bg-white p-20 shadow-lg animate-fadeIn-800ms-normal">
        <h3 class="color-purple mb-10">JS-Powered</h3>
        <p class="color-blueGrey">Dynamic CSS generation with JavaScript</p>
      </div>
      <div class="bg-white p-20 shadow-lg animate-fadeIn-1s-normal">
        <h3 class="color-green mb-10">Lightweight</h3>
        <p class="color-blueGrey">Tiny footprint, maximum flexibility</p>
      </div>
    </div>
  </section>

  <!-- Twigwind JS -->
  <script src="css.js"></script>

</body>
</html>
```

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

## Documentation

Visit our comprehensive documentation with 12 organized sections:

1. **Getting Started** - Installation and basic usage
2. **Colors** - Color system and arbitrary values
3. **Typography** - Text styling and font utilities
4. **Layout** - Flexbox and grid systems
5. **Spacing** - Margin and padding utilities
6. **Sizing** - Width, height, and size utilities
7. **Position** - Positioning and z-index utilities
8. **Animations** - Built-in animation utilities
9. **Gradients** - Linear gradient utilities
10. **Backgrounds** - Background utilities and images
11. **Responsive** - Responsive design utilities
12. **Gradients & Backgrounds** - Advanced background techniques

---

## Framework Comparison

| Feature / Framework            | W3.CSS | Tailwind | Bootstrap | Twigwind |
|--------------------------------|--------|----------|-----------|----------|
| **Ease of Learning**           | ✔️      | ❌       | ⭐        | ✔️       |
| **Utility-First Approach**     | ❌      | ⭐       | ❌        | ⭐       |
| **Customization / Flexibility**| ✔️      | ⭐       | ✔️        | ⭐       |
| **Responsive Design**          | ✔️      | ⭐       | ⭐        | ⭐       |
| **Animation System**           | ❌      | ✔️       | ✔️        | ⭐       |
| **Gradient Utilities**         | ❌      | ✔️       | ❌        | ⭐       |
| **Position Utilities**         | ✔️      | ⭐       | ✔️        | ⭐       |
| **File Size / Lightweight**    | ⭐      | ✔️       | ❌        | ⭐       |
| **Dynamic/JS Integration**     | ❌      | ✔️       | ✔️        | ⭐       |
| **Rapid Prototyping**          | ✔️      | ⭐       | ⭐        | ⭐       |

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
├── css.css              # Base styles and animations
├── css.js               # Dynamic utility generator
├── hljs.js              # Syntax highlighting loader
├── test.html            # Comprehensive demo page
├── README.md
├── twigwind.svg         # The twigwind logo  
├── version.txt          # The version file (newest is 3.12)  
└── hljs_styles/         # Syntax highlighting themes
    ├── atom.css
    ├── defalt.css
    ├── jetbrains.css
    └── vscode.css
```

---

## Contributing

Twigwind is designed to be simple, lightweight, and powerful. Contributions are welcome! Please ensure any new features maintain the framework's core principles of simplicity and utility-first design.

---

## License

Custom License - feel free to use Twigwind in your projects!
