import re

color = """.w3-amber,.w3-hover-amber:hover{color:#000!important;background-color:#ffc107!important}
.w3-aqua,.w3-hover-aqua:hover{color:#000!important;background-color:#00ffff!important}
.w3-blue,.w3-hover-blue:hover{color:#fff!important;background-color:#2196F3!important}
.w3-light-blue,.w3-hover-light-blue:hover{color:#000!important;background-color:#87CEEB!important}
.w3-brown,.w3-hover-brown:hover{color:#fff!important;background-color:#795548!important}
.w3-cyan,.w3-hover-cyan:hover{color:#000!important;background-color:#00bcd4!important}
.w3-blue-grey,.w3-hover-blue-grey:hover,.w3-blue-gray,.w3-hover-blue-gray:hover{color:#fff!important;background-color:#607d8b!important}
.w3-green,.w3-hover-green:hover{color:#fff!important;background-color:#4CAF50!important}
.w3-light-green,.w3-hover-light-green:hover{color:#000!important;background-color:#8bc34a!important}
.w3-indigo,.w3-hover-indigo:hover{color:#fff!important;background-color:#3f51b5!important}
.w3-khaki,.w3-hover-khaki:hover{color:#000!important;background-color:#f0e68c!important}
.w3-lime,.w3-hover-lime:hover{color:#000!important;background-color:#cddc39!important}
.w3-orange,.w3-hover-orange:hover{color:#000!important;background-color:#ff9800!important}
.w3-deep-orange,.w3-hover-deep-orange:hover{color:#fff!important;background-color:#ff5722!important}
.w3-pink,.w3-hover-pink:hover{color:#fff!important;background-color:#e91e63!important}
.w3-purple,.w3-hover-purple:hover{color:#fff!important;background-color:#9c27b0!important}
.w3-deep-purple,.w3-hover-deep-purple:hover{color:#fff!important;background-color:#673ab7!important}
.w3-red,.w3-hover-red:hover{color:#fff!important;background-color:#f44336!important}
.w3-sand,.w3-hover-sand:hover{color:#000!important;background-color:#fdf5e6!important}
.w3-teal,.w3-hover-teal:hover{color:#fff!important;background-color:#009688!important}
.w3-yellow,.w3-hover-yellow:hover{color:#000!important;background-color:#ffeb3b!important}
.w3-white,.w3-hover-white:hover{color:#000!important;background-color:#fff!important}
.w3-black,.w3-hover-black:hover{color:#fff!important;background-color:#000!important}
.w3-grey,.w3-hover-grey:hover,.w3-gray,.w3-hover-gray:hover{color:#000!important;background-color:#9e9e9e!important}
.w3-light-grey,.w3-hover-light-grey:hover,.w3-light-gray,.w3-hover-light-gray:hover{color:#000!important;background-color:#f1f1f1!important}
.w3-dark-grey,.w3-hover-dark-grey:hover,.w3-dark-gray,.w3-hover-dark-gray:hover{color:#fff!important;background-color:#616161!important}
.w3-asphalt,.w3-hover-asphalt:hover{color:#fff!important;background-color:#343a40!important}
.w3-crimson,.w3-hover-crimson:hover{color:#fff!important;background-color:#a20025!important}
.w3-cobalt,w3-hover-cobalt:hover{color:#fff!important;background-color:#0050ef!important}
.w3-emerald,.w3-hover-emerald:hover{color:#fff!important;background-color:#008a00!important}
.w3-olive,.w3-hover-olive:hover{color:#fff!important;background-color:#6d8764!important}
.w3-paper,.w3-hover-paper:hover{color:#000!important;background-color:#f8f9fa!important}
.w3-sienna,.w3-hover-sienna:hover{color:#fff!important;background-color:#a0522d!important}
.w3-taupe,.w3-hover-taupe:hover{color:#fff!important;background-color:#87794e!important}
.w3-danger{color:#fff!important;background-color:#dd0000!important}
.w3-note{color:#000!important;background-color:#fff599!important}
.w3-info{color:#fff!important;background-color:#0a6fc2!important}
.w3-warning{color:#000!important;background-color:#ffb305!important}
.w3-success{color:#fff!important;background-color:#008a00!important}"""
def func():
    # Match class names and background hex
    matches = re.findall(r'\.w3-([a-z-]+).*?background-color:#([0-9a-fA-F]{3,6})', color)

    # Build JS object string
    js_obj = "{\n"
    for name, hexcode in matches:
        js_obj += f'  "{name}": "#{hexcode}",\n'
    js_obj = js_obj.rstrip(",\n") + "\n}"  # remove last comma and close

    print(js_obj)
js = """let style;
let usedNames = [];
let css = ""

const color = {
  "amber": "#ffc107",
  "aqua": "#00ffff",
  "blue": "#2196F3",
  "lightBlue": "#87CEEB",
  "brown": "#795548",
  "cyan": "#00bcd4",
  "blueGrey": "#607d8b",
  "green": "#4CAF50",
  "lightGreen": "#8bc34a",
  "indigo": "#3f51b5",
  "khaki": "#f0e68c",
  "lime": "#cddc39",
  "orange": "#ff9800",
  "deepOrange": "#ff5722",
  "pink": "#e91e63",
  "purple": "#9c27b0",
  "deepPurple": "#673ab7",
  "red": "#f44336",
  "sand": "#fdf5e6",
  "teal": "#009688",
  "yellow": "#ffeb3b",
  "white": "#fff",
  "black": "#000"
};

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

const space = { 
  p: "padding", pl: "padding-left", pr: "padding-right", 
  pt: "padding-top", pb: "padding-bottom", 
  m: "margin", ml: "margin-left", mr: "margin-right", 
  mt: "margin-top", mb: "margin-bottom"
};

const applyColor = (el) => {
  el.classList.forEach(cls => {
    if (usedNames.includes(cls)) return;
    usedNames.push(cls);

    let prop;
    let value;
    let hover = false;
    let media = "";
    let name;

    // Detect hover/breakpoint prefixes
    const bpMatch = cls.match(/^(\w+):(.+)$/);
    if (bpMatch) {
      const prefix = bpMatch[1];
      cls = bpMatch[2];
      if (prefix === "hover") hover = true;
      else if (breakpoints[prefix]) {
        media = `@media (min-width: ${breakpoints[prefix]}px) {`;
      }
    }

    const hoverMatch = cls.match(/^hover:(.+)$/);
    if (hoverMatch) {
      hover = true;
      cls = hoverMatch[1];
    }

    if (cls.startsWith("bg-")) {
      prop = "background-color";
      name = cls.substring(3);
    } else if (cls.startsWith("color-")) {
      prop = "color";
      name = cls.substring(6);
    } else return;

    if (name.startsWith("#") || name.startsWith("rgb")) {
      value = name;
    } else {
      const camelName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      value = color[camelName];
    }

    const safeClass = cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

    if (hover) {
      if (media) {
        style.textContent += `${media} .hover\\:${safeClass}:hover { ${prop}: ${value}; }\n}`;
      } else {
        style.textContent += `.hover\\:${safeClass}:hover { ${prop}: ${value}; }\n`;
      }
    } else {
      if (media) {
        style.textContent += `${media} .${safeClass} { ${prop}: ${value}; }\n}`;
      } else {
        style.textContent += `.${safeClass} { ${prop}: ${value}; }\n`;
      }
    }
  });
};

const applySpacing = (el) => {
  el.classList.forEach(cls => {
    if (usedNames.includes(cls)) return;
    usedNames.push(cls);

    let hover = false;
    let media = "";

    // Breakpoints & hover
    const bpMatch = cls.match(/^(\w+):(.+)$/);
    if (bpMatch) {
      const prefix = bpMatch[1];
      cls = bpMatch[2];
      if (prefix === "hover") hover = true;
      else if (breakpoints[prefix]) {
        media = `@media (min-width: ${breakpoints[prefix]}px) {`;
      }
    }

    const hoverMatch = cls.match(/^hover:(.+)$/);
    if (hoverMatch) {
      hover = true;
      cls = hoverMatch[1];
    }

    // Match padding/margin
    const match = cls.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/);
    if (!match) return;

    const key = match[1]; // p, pl, m, mt, etc
    const amount = match[2];
    const unit = match[3] || "px";
    const prop = space[key];
    const value = `${amount}${unit}`;

    const safeClass = cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

    if (hover) {
      if (media) {
        style.textContent += `${media} .hover\\:${safeClass}:hover { ${prop}: ${value}; }\n}`;
      } else {
        style.textContent += `.hover\\:${safeClass}:hover { ${prop}: ${value}; }\n`;
      }
    } else {
      if (media) {
        style.textContent += `${media} .${safeClass} { ${prop}: ${value}; }\n}`;
      } else {
        style.textContent += `.${safeClass} { ${prop}: ${value}; }\n`;
      }
    }
  });
};

function load() {
  document.querySelectorAll("[class]").forEach((el) => {
    applyColor(el);
    applySpacing(el);
  });
}

style = document.createElement("style");
document.head.appendChild(style);
load();"""

#print(js.replace("style.textContent +=", "css +="))
import html
print(html.escape("""<!DOCTYPE html>
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
"""))