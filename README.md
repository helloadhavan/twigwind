# Twigwind CSS Framework

Rapidly build modern websites without ever leaving your HTML.

---

## Features

- Utility-first CSS framework
- Dynamic CSS generators
- Responsive and hover-friendly classes
- Built with JavaScript for extreme flexibility

---

![Twigwind Logo](https://raw.githubusercontent.com/helloadhavan/twigwind/refs/heads/main/twigwind.png)

---

## Example Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Twigwind Test</title>
  <script src="css.js"></script> <!-- Your simplified framework -->
</head>
<body style="font-family: sans-serif; line-height: 1.5;">

  <h1 class="color-blue bg-yellow p-2">
    Blue text on yellow background
  </h1>

  <p class="color-white bg-red p-2">
    White text on red background
  </p>

  <div class="bg-blue color-white p-4 m-2">
    This div has padding 1rem and margin 0.5rem
  </div>

  <button class="bg-green color-white p-2 hover:bg-dark-grey">
    Hover me!
  </button>

  <div class="bg-lightBlue p-2 sm:bg-blue md:bg-red lg:bg-green xl:bg-purple">
    Background changes color depending on screen width
  </div>

  <div class="color-white bg-indigo p-4 m-2 hover:bg-pink sm:bg-teal md:p-6">
    White text, indigo background, hover pink, responsive padding
  </div>

  <div style="display: flex; margin-top: 2rem;">
    <div style="width: 160px; background-color: #f1f1f1; padding: 0.5rem;">
      <a href="#colors" style="display:block; margin-bottom:0.5rem;">Colors</a>
      <a href="#spacing" style="display:block; margin-bottom:0.5rem;">Spacing</a>
      <a href="#hover" style="display:block; margin-bottom:0.5rem;">Hover</a>
      <a href="#breakpoints" style="display:block; margin-bottom:0.5rem;">Breakpoints</a>
      <a href="#combined" style="display:block;">Combined</a>
    </div>
    <div style="flex: 1; padding-left: 1rem;">
      <h2 id="colors">Colors</h2>
      <p>Use <code>color-*</code> and <code>bg-*</code> classes to style text and background.</p>

      <h2 id="spacing">Spacing</h2>
      <p>Use <code>p-*</code> and <code>m-*</code> classes for padding and margin.</p>

      <h2 id="hover">Hover</h2>
      <p>Use <code>hover:bg-*</code> or <code>hover:color-*</code> for hover effects.</p>

      <h2 id="breakpoints">Breakpoints</h2>
      <p>Use <code>sm:</code>, <code>md:</code>, <code>lg:</code>, <code>xl:</code> prefixes for responsive styles.</p>

      <h2 id="combined">Combined Classes</h2>
      <p>Mix colors, spacing, hover, and breakpoints for flexible styling.</p>
    </div>
  </div>

  <script>
    // Apply Twigwind automatically
    document.querySelectorAll("[class]").forEach(el => Twigwind.twApply(el));
    Twigwind.twInject();
  </script>
</body>
</html>
