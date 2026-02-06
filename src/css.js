const Twigwind = (() => {
  const css = {}; // stores generated CSS rules
  const used = new Set();       // tracks generated CSS
  const processedElements = new WeakSet(); 
  const twigom = new Object();
  const util = {};
  // Initialize configuration variables
  let colors = {};
  let space = {};
  let sizes = {};
  let breakpoints = {};
  let components = {};
  let errors = [];
  let functions = [];

  const raise = (error) => {
    errors.push(error);
  };
  
  // Load configuration based on environment
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    // Browser environment - use inline configuration
    colors = {
        red: [[26, 0, 0], [71, 0, 0], [117, 0, 0], [163, 0, 0], [209, 0, 0], [255, 0, 0], [255, 63, 63], [255, 127, 127], [255, 191, 191], [255, 255, 255]],
        orange: [[26, 13, 0], [71, 35, 0], [117, 58, 0], [163, 81, 0], [209, 104, 0], [255, 127, 0], [255, 159, 63], [255, 191, 127], [255, 223, 191], [255, 255, 255]],
        amber: [[25, 17, 0], [70, 48, 0], [115, 79, 0], [161, 110, 0], [206, 141, 0], [252, 173, 0], [252, 193, 63], [253, 214, 127], [254, 234, 191], [255, 255, 255]],
        yellow: [[26, 26, 0], [71, 71, 0], [117, 117, 0], [163, 163, 0], [209, 209, 0], [255, 255, 0], [255, 255, 63], [255, 255, 127], [255, 255, 191], [255, 255, 255]],
        lime: [[13, 26, 0], [35, 71, 0], [58, 117, 0], [81, 163, 0], [104, 209, 0], [127, 255, 0], [159, 255, 63], [191, 255, 127], [223, 255, 191], [255, 255, 255]],
        green: [[0, 26, 0], [0, 71, 0], [0, 117, 0], [0, 163, 0], [0, 209, 0], [0, 255, 0], [63, 255, 63], [127, 255, 127], [191, 255, 191], [255, 255, 255]],
        spring: [[0, 26, 13], [0, 71, 35], [0, 117, 58], [0, 163, 81], [0, 209, 104], [0, 255, 127], [63, 255, 159], [127, 255, 191], [191, 255, 223], [255, 255, 255]],
        cyan: [[0, 26, 26], [0, 71, 71], [0, 117, 117], [0, 163, 163], [0, 209, 209], [0, 255, 255], [63, 255, 255], [127, 255, 255], [191, 255, 255], [255, 255, 255]],
        sky: [[0, 17, 25], [0, 48, 70], [0, 79, 115], [0, 110, 161], [0, 141, 206], [0, 172, 252], [63, 192, 252], [127, 213, 253], [191, 234, 254], [255, 255, 255]],
        blue: [[0, 0, 26], [0, 0, 71], [0, 0, 117], [0, 0, 163], [0, 0, 209], [0, 0, 255], [63, 63, 255], [127, 127, 255], [191, 191, 255], [255, 255, 255]],
        indigo: [[8, 0, 13], [21, 0, 36], [34, 0, 59], [48, 0, 83], [61, 0, 106], [75, 0, 130], [120, 63, 161], [165, 127, 192], [210, 191, 223], [255, 255, 255]],
        violet: [[15, 0, 21], [41, 0, 59], [68, 0, 97], [94, 0, 135], [121, 0, 173], [148, 0, 211], [174, 63, 222], [201, 127, 233], [228, 191, 244], [255, 255, 255]],
        grey: [[1, 1, 1], [2, 2, 2], [4, 4, 4], [6, 6, 6], [8, 8, 8], [10, 10, 10], [71, 71, 71], [132, 132, 132], [193, 193, 193], [255, 255, 255]]
    };

    space = {
      p: "padding", pl: "padding-left", pr: "padding-right",
      pt: "padding-top", pb: "padding-bottom",
      m: "margin", ml: "margin-left", mr: "margin-right",
      mt: "margin-top", mb: "margin-bottom"
    };

    sizes = { sm: "40px", md: "80px", lg: "160px", xl: "320px", xxl: "640px"};
    breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
    components = {};

  } else if (typeof module !== 'undefined' && module.exports) {
      try {
        const path = require('path');
        const js = require(path.join(__dirname, '../twigwind.config.js'));
        colors = js.colors || {};
        space = js.space || {};
        sizes = js.sizes || {};
        breakpoints = js.breakpoints || {};
        components = js.components || {};
      } catch (error) {
        raise(`Could not load twigwind.config.js, check twigwind.config.js path.`);
        process.exit(1);}
      }
    

  const escapeClass = (cls) =>
    cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

  const parsePrefix = (cls) => {
    let hover = false;
    let dark = false;
    let media = "";
    let pure = cls;
    const parts = cls.split(":");

    if (parts.length > 1) {
      const prefix = parts[0];
      if (prefix === "hover") {
        hover = true; pure = parts.slice(1).join(":");
      } else if (prefix === "dark") {
        dark = true; pure = parts.slice(1).join(":");
      } else if (breakpoints[prefix]) {
        media = `@media (min-width: ${breakpoints[prefix]}px){`;
        pure = parts.slice(1).join(":");
      }
    }
    return { hover, dark, media, pure };
  };

  const pushCSS = (cls, block, hover, media, dark = false, cname) => {
    const safe = escapeClass(cls);
    let selector = cname ? `.${escapeClass(cname)}` : `.${safe}`;
    if (hover) selector += ":hover";
    if (dark) selector = `.dark ${selector}`;

    const rule = media
      ? `${media}\n${selector} { ${block} }\n}`
      : `${block}`;

    if (!css[selector]) css[selector] = [];
    css[selector].push(rule);
  };


  // ========== Utility Generators ==========

  /**
   * Convert RGB array to CSS color value
   * @param {Array|string} color - RGB array [r,g,b] or color name/hex
   * @returns {string} CSS color value
   */
    const formatColor = (color) => {
      // RGB array
      if (Array.isArray(color) && color.length >= 3) {
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      }

      if (typeof color !== 'string') return color;

      const value = color.trim();

      // rgb / rgba with dash-separated values
      const match = value.match(/^(rgb|rgba)\(([^)]+)\)$/i);
      if (match && match[2].includes('-')) {
        const fn = match[1].toLowerCase();
        const parts = match[2].split('-').map(v => v.trim());
        return `${fn}(${parts.join(', ')})`;
      }

      // hex (already valid) → leave it alone
      return value;
    };


  /**
   * Generate color utilities (background-color, color)
   * Supports both basic colors (red, blue) and numbered variants (red-5, blue-3)
   */
  const twColor = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    let prop, name;
    
    if (pure.startsWith("bg-")) {
      prop = "background-color";
      name = pure.slice(3);
    } else if (pure.startsWith("color-")) {
      prop = "color";
      name = pure.slice(6);
    } else return;
    
    // Check for numbered color variants (e.g., "cyan-5", "red-3")
    const colorMatch = name.match(/^([a-zA-Z]+)-?(\d+)?$/);
    if (colorMatch) {
      const [, colorName, colorIndex] = colorMatch;
      const colorArray = colors[colorName];
      
      if (Array.isArray(colorArray)) {
        let colorValue;
        if (colorIndex !== undefined) {
          const index = parseInt(colorIndex);
          if (index >= 0 && index < colorArray.length) {
            colorValue = formatColor(colorArray[index]);
          } else {
            // Fallback to middle value if index out of range
            const midIndex = Math.floor(colorArray.length / 2);
            colorValue = formatColor(colorArray[midIndex]);
          }
        } else {
          const midIndex = Math.floor(colorArray.length / 2);
          colorValue = formatColor(colorArray[midIndex]);
        }
        pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, cname);
      } else {
        // Fallback for non-array colors or unknown colors
        const colorValue = formatColor(colors[name] || name);
        pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, cname);
      }
    } else {
      // Fallback for non-matching patterns
      const colorValue = formatColor(colors[name] || name);
      pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, cname);
    }
  };

  const twSpacing = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/);
    if (!match) return;
    const [, key, amount, unit] = match;
    const prop = space[key];
    if (!prop) return;
    pushCSS(cls, `${prop}: ${amount}${unit || "px"};`, hover, media, dark, cname);
  };

  const twSize = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Handle percentage values like w-100%, h-50%, etc.
    let match = pure.match(/^(max|min)?-?(w|h)-(\d+%|\d+(?:px|rem|em|%)?)$/);
    if (match) {
      const prefix = match[1] ? `${match[1]}-` : "";
      const dim = match[2] === "w" ? "width" : "height";
      let val = match[3];
      
      // If no unit specified and not percentage, default to px
      if (/^\d+$/.test(val)) {
        val += "px";
      }
      
      return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, cname);
    }
    
    // Handle viewport units like w-100vw, h-100vh
    match = pure.match(/^(max|min)?-?(w|h)-(\d+(?:vw|vh|vmin|vmax))$/);
    if (match) {
      const prefix = match[1] ? `${match[1]}-` : "";
      const dim = match[2] === "w" ? "width" : "height";
      const val = match[3];
      return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, cname);
    }
    
    // Handle special viewport cases like h-100vh, w-100vw
    match = pure.match(/^(max|min)?-?(w|h)-(\d+)(vh|vw|vmin|vmax)$/);
    if (match) {
      const prefix = match[1] ? `${match[1]}-` : "";
      const dim = match[2] === "w" ? "width" : "height";
      const val = match[3] + match[4];
      return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, cname);
    }
    
    // size-sm support
    match = pure.match(/^size-(\w+)$/);
    if (match && sizes[match[1]]) {
      const size = sizes[match[1]];
      return pushCSS(cls, `font-size: ${size};`, hover, media, dark, cname);
    }
  };

  const twGrid = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^grid:(\d+),(\d+)(?:,([0-9a-zA-Z%]+))?$/);
    if (!match) return;
    const [, cols, rows, gap = "0"] = match;
    const rules = `
      display: grid;
      grid-template-columns: repeat(${cols}, 1fr);
      grid-template-rows: repeat(${rows}, auto);
      gap: ${gap};
    `;
    pushCSS(cls, rules, hover, media, dark, cname);
  };

  const twflex = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^flex(?::(row|col))?(?:-(center|right|left))?(?:-(center|right|left))?$/);
    if (!match) return;
    const [, dir, main, cross] = match;
    const map = { center: "center", left: "flex-start", right: "flex-end" };
    const flexDir = dir === "col" ? "column" : dir;
    let rules = "display:flex;";
    if (flexDir) rules += `flex-direction:${flexDir};`;
    if (main) rules += `justify-content:${map[main]};`;
    if (cross) rules += `align-items:${map[cross]};`;
    pushCSS(cls, rules, hover, media, dark, cname);
  };


  const twBorder = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^border(?:-(t|b|l|r))?-((?:\d+)|(?:.+))$/);
    if (!match) return;
    const [, side, val] = match;
    let prop, value;
    if (/^\d+$/.test(val)) {
      prop = side ? `border-${side}` : "border";
      value = `${val}px solid`;
    } else {
      prop = side ? `border-${side}-color` : "border-color";
      value = colors[val] || val;
    }
    pushCSS(cls, `${prop}: ${value};`, hover, media, dark, cname);
  };

  const twBorderRadius = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^border-radius(?:-(.+))?$/);
    if (!match) return;
    const radius = match[1] || "0";
    pushCSS(cls, `border-radius: ${radius};`, hover, media, dark, cname);
  };

  const twTransform = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^transform:(rotate|scale|skew|translate)-(.+)$/);
    if (!match) return;
    const [, type, value] = match;
    let rule = "transform:";
    if (type === "rotate") rule += `rotate(${value}${/deg$/.test(value) ? "" : "deg"});`;
    else if (type === "scale") rule += `scale(${value});`;
    else if (type === "skew") rule += `skew(${value}${/deg$/.test(value) ? "" : "deg"});`;
    else if (type === "translate") {
      const parts = value.split(",");
      rule += parts.length === 2
        ? `translate(${parts[0].trim()}, ${parts[1].trim()});`
        : `translate(${value});`;
    }
    pushCSS(cls, rule, hover, media, dark, cname);
  };

  /**
   */
  const twLinearGradient = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, dark, media, pure } = parsePrefix(cls);
    if (!pure.startsWith("gradient:")) return;

    const parts = pure.replace("gradient:", "").split("|");
    if (parts.length < 3) return;

    const type = parts.shift();       // linear | radial
    const direction = parts.shift();  // to-r | 45deg | circle | etc

    const dirMap = {
      "to-r": "to right",
      "to-l": "to left",
      "to-t": "to top",
      "to-b": "to bottom",
      "to-tr": "to top right",
      "to-tl": "to top left",
      "to-br": "to bottom right",
      "to-bl": "to bottom left"
    };

    const resolveColor = (token) => {
      // Always normalize functional colors
      if (token.startsWith("rgb") || token.startsWith("rgba")) {
        return formatColor(token);
      }

      const m = token.match(/^([a-zA-Z]+)-?(\d+)?$/);
      if (!m) return formatColor(token);

      const [, name, idx] = m;
      const arr = colors[name];

      if (!Array.isArray(arr)) {
        return formatColor(colors[name] || name);
      }

      const i = idx ? parseInt(idx) : Math.floor(arr.length / 2);
      return formatColor(arr[i] ?? arr[Math.floor(arr.length / 2)]);
    };


    const stops = parts.map(p => {
      const [colorToken, stop] = p.split("@");
      const color = resolveColor(colorToken);
      return stop ? `${color} ${stop}` : color;
    });

    if (stops.length < 2) return;

    const dir = dirMap[direction] || direction;

    pushCSS(
      cls,
      `background-image: ${type}-gradient(${dir}, ${stops.join(", ")});`,
      hover,
      media,
      dark,
      cname
    );
  };

  const twshadow = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const map = {
      sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)",
      lg: "0 10px 15px rgba(0,0,0,0.15)", xl: "0 20px 25px rgba(0,0,0,0.2)",
      "2xl": "0 25px 50px rgba(0,0,0,0.25)"
    };
    const match = pure.match(/^shadow(?:-(.+))?$/);
    const text = pure.match(/^text-shadow(?:-(.+))?$/);
    if (!match && !text) return;
    let val = match ? match[1] : text[1];
    if (!val) pushCSS(cls, `box-shadow: ${map.sm};`, hover, media, dark, cname);
    else if (map[val]) pushCSS(cls, `box-shadow: ${map[val]};`, hover, media, dark, cname);
    else if (text) pushCSS(cls, `text-shadow: ${val};`, hover, media, dark, cname);
    else pushCSS(cls, `box-shadow: ${val.replace(/_/g, " ")};`, hover, media, dark, cname);
  };

  const twPosition = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Position types: fixed, absolute, relative, static, sticky
    if (['fixed', 'absolute', 'relative', 'static', 'sticky'].includes(pure)) {
      return pushCSS(cls, `position: ${pure};`, hover, media, dark, cname);
    }
    
    // Position values: top-10, right-20, bottom-5, left-15
    const match = pure.match(/^(top|right|bottom|left)-(\d+)(px|rem|em|%)?$/);
    if (match) {
      const [, side, amount, unit] = match;
      return pushCSS(cls, `${side}: ${amount}${unit || "px"};`, hover, media, dark, cname);
    }
    
    // Z-index: z-10, z-50, z-999
    const zMatch = pure.match(/^z-(\d+)$/);
    if (zMatch) {
      return pushCSS(cls, `z-index: ${zMatch[1]};`, hover, media, dark, cname);
    }
  };

  const twText = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Text alignment
    if (['text-left', 'text-center', 'text-right', 'text-justify'].includes(pure)) {
      const align = pure.replace('text-', '');
      return pushCSS(cls, `text-align: ${align};`, hover, media, dark, cname);
    }
  };

  const twTypography = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const sizes = { sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem", xxl: "1.5rem" };
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^font-(size|weight|family|style|variant)-(.+)$/);
    if (!match) return;
    let [, prop, val] = match;
    
    if (prop === "size") {
      // Handle predefined sizes
      if (sizes[val]) {
        return pushCSS(cls, `font-size: ${sizes[val]};`, hover, media, dark, cname);
      }
      // Handle custom rem/px/em values like font-size-3rem, font-size-24px
      if (val.match(/^\d+(\.\d+)?(rem|px|em|%)$/)) {
        return pushCSS(cls, `font-size: ${val};`, hover, media, dark, cname);
      }
    }
    
    if (prop === "family") {
      // Handle font-family specially - replace dashes with spaces and add quotes if needed
      val = val.replace(/-/g, " ");
      if (!val.includes('"') && !val.includes("'") && val !== 'serif' && val !== 'sans-serif' && val !== 'monospace') {
        val = `"${val}"`;
      }
    }
    
    pushCSS(cls, `font-${prop}: ${val};`, hover, media, dark, cname);
  };

  const twImage = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^image-url-(.+)$/);
    if (!match) return;
    
    // Handle URL properly - replace underscores with spaces and decode if needed
    let url = match[1];
    // Replace underscores with spaces for URLs that need spaces
    url = url.replace(/_/g, " ");
    
    // Add additional CSS properties for better background image handling
    const rules = `
      background-image: url('${url}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    `;
    
    pushCSS(cls, rules, hover, media);
  };

  const twFilter = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Handle backdrop filters
    const backdropMatch = pure.match(/^backdrop-filter:(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
    if (backdropMatch) {
      const [, filter, value] = backdropMatch;
      let filterValue = value;
      
      // Add units for specific filters
      if (filter === 'blur' && !value.includes('px')) {
        filterValue = `${value}px`;
      } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (filter === 'hue-rotate' && !value.includes('deg')) {
        filterValue = `${value}deg`;
      }
      
      return pushCSS(cls, `backdrop-filter: ${filter}(${filterValue});`, hover, media, dark, cname);
    }
    
    // Handle regular filters
    const filterMatch = pure.match(/^filter:(blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
    if (filterMatch) {
      const [, filter, value] = filterMatch;
      let filterValue = value;
      
      // Handle drop-shadow specially (format: x-y-blur-color)
      if (filter === 'drop-shadow') {
        const shadowParts = value.split('-');
        if (shadowParts.length >= 3) {
          const x = shadowParts[0] + 'px';
          const y = shadowParts[1] + 'px';
          const blur = shadowParts[2] + 'px';
          const color = shadowParts[3] || 'rgba(0,0,0,0.5)';
          filterValue = `${x} ${y} ${blur} ${color}`;
        }
      }
      // Add units for specific filters
      else if (filter === 'blur' && !value.includes('px')) {
        filterValue = `${value}px`;
      } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (filter === 'hue-rotate' && !value.includes('deg')) {
        filterValue = `${value}deg`;
      }
      
      return pushCSS(cls, `filter: ${filter}(${filterValue});`, hover, media, dark, cname);
    }
    
    // Handle background filters (legacy support for bg-filter)
    const bgFilterMatch = pure.match(/^bg-filter:(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
    if (bgFilterMatch) {
      const [, filter, value] = bgFilterMatch;
      let filterValue = value;
      
      // Add units for specific filters
      if (filter === 'blur' && !value.includes('px')) {
        filterValue = `${value}px`;
      } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
        filterValue = `${value}%`;
      } else if (filter === 'hue-rotate' && !value.includes('deg')) {
        filterValue = `${value}deg`;
      }
      
      return pushCSS(cls, `backdrop-filter: ${filter}(${filterValue});`, hover, media, dark, cname);
    }
  };

  const twLayout = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Max width
    const maxWMatch = pure.match(/^max-w-(\d+)(px|rem|em|%)?$/);
    if (maxWMatch) {
      const [, amount, unit] = maxWMatch;
      return pushCSS(cls, `max-width: ${amount}${unit || "px"};`, hover, media, dark, cname);
    }
    
    // Margin auto
    if (pure === 'mx-auto') {
      return pushCSS(cls, `margin-left: auto; margin-right: auto;`, hover, media, dark, cname);
    }
    if (pure === 'my-auto') {
      return pushCSS(cls, `margin-top: auto; margin-bottom: auto;`, hover, media, dark, cname);
    }
    
    // Gap for flexbox/grid
    const gapMatch = pure.match(/^gap-(\d+)(px|rem|em|%)?$/);
    if (gapMatch) {
      const [, amount, unit] = gapMatch;
      return pushCSS(cls, `gap: ${amount}${unit || "px"};`, hover, media, dark, cname);
    }
  };

  const twTransition = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    // Handle transition:all_300ms syntax
    const colonMatch = pure.match(/^transition:(.+)_(\d+)ms$/);
    if (colonMatch) {
      const [, property, duration] = colonMatch;
      const prop = property === 'all' ? 'all' : property.replace('-', '-');
      return pushCSS(cls, `transition: ${prop} ${duration}ms ease;`, hover, media, dark, cname);
    }
    
    // Handle transition-property-duration syntax
    const dashMatch = pure.match(/^transition-(.+)-(\d+)ms$/);
    if (dashMatch) {
      const [, property, duration] = dashMatch;
      const prop = property === 'all' ? 'all' : property.replace('-', '-');
      return pushCSS(cls, `transition: ${prop} ${duration}ms ease;`, hover, media, dark, cname);
    }
  };

  const twOpacity = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    
    const match = pure.match(/^opacity-(\d+)$/);
    if (match) {
      const opacity = parseInt(match[1]) / 100;
      return pushCSS(cls, `opacity: ${opacity};`, hover, media, dark, cname);
    }
  };

  const twAnimation = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    const match = pure.match(/^animate-([a-zA-Z0-9_-]+)-(\d+)(ms|s)-(infinite|normal|reverse|alternate|alternate-reverse)$/);
    if (match) {
      const [_, animation, duration, unit, iteration] = match;
      if (!unit) unit = "s";
      if (!iteration) iteration = "infinite";
      if (!duration) duration = "1";
      return pushCSS(cls, `animation: ${animation} ${duration}${unit} ${iteration};`, hover, media, dark, cname);
    }
  }

  const addfunction = (f, regex) => {
    functions.push([ f, regex ]);
  }

  const applyUtilityClass = (cls, cname, element_name='unknown') => {
    const { pure } = parsePrefix(cls);

    if (pure.startsWith("bg-") || pure.startsWith("color-")) twColor(cls, cname);
    else if (pure.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/)) twSpacing(cls, cname);
    else if (pure.match(/^(w|h)-(\d+)(px|rem|em|%)?$/) || pure.startsWith("size-")) twSize(cls, cname);
    else if (pure.startsWith("flex")) twflex(cls, cname);
    else if (pure.startsWith("grid:")) twGrid(cls, cname);
    else if (pure.startsWith("border-radius")) twBorderRadius(cls, cname);
    else if (pure.startsWith("border")) twBorder(cls, cname);
    else if (pure.startsWith("transform:")) twTransform(cls, cname);
    else if (pure.startsWith("shadow")) twshadow(cls, cname);
    else if (pure.startsWith("gradient:")) twLinearGradient(cls, cname);
    else if (['fixed', 'absolute', 'relative', 'static', 'sticky'].includes(pure) ||
             pure.match(/^(top|right|bottom|left)-(\d+)/) ||
             pure.match(/^z-(\d+)$/)) twPosition(cls, cname);
    else if (pure.startsWith("text-")) twText(cls, cname);
    else if (pure.startsWith("font-")) twTypography(cls, cname);
    else if (pure.startsWith("animate-")) twAnimation(cls, cname);
    else if (pure.match(/^max-w-/) || pure === 'mx-auto' || pure === 'my-auto' || pure.match(/^gap-/)) twLayout(cls, cname);
    else if (pure.startsWith("transition-")) twTransition(cls, cname);
    else if (pure.startsWith("opacity-")) twOpacity(cls, cname);
    else if (pure.startsWith("image-url-")) twImage(cls, cname);
    else if (pure.startsWith("filter") || pure.startsWith("bg-filter") || pure.startsWith("backdrop-filter")) twFilter(cls, cname);
    else if (functions.length > 0) {
      for (const [func, pattern] of functions) {
        if (pure.test(pattern)) {
          func(cls, cname);
          return;
        }
      }
    }
    else {
      if (!util[cls]) {
      const errorMsg = `Twigwind: Error compiling "${cls}" in element "${element_name || cname || 'unknown'}" - utility not recognized.`;
      raise(errorMsg);
      }
    }
  };

  const twApply = (el) => {
    const isDOM = typeof HTMLElement !== 'undefined';

    if (isDOM && processedElements.has(el)) return;

    const classes = isDOM ? el.classList : el;

    classes.forEach(cls => {
      if (components && components[cls]) {
        components[cls].forEach(c => applyUtilityClass(c, cls, el?.tagName));
      } else {
        applyUtilityClass(cls, null, el?.tagName);
      }
    });

    if (isDOM) processedElements.add(el);
  };

  const twInject = () => {
    let final = "";

    for (const [selector, rules] of Object.entries(css)) {
      for (const rule of rules) {
        if (rule.trim().startsWith("@media")) {
          final += rule + "\n";
        } else {
          final += `${selector} {\n${rule}\n}\n`;
        }
      }
    }

    const style = document.createElement("style");
    style.textContent = final;
    document.head.appendChild(style);
  };

  return {
    twColor, twSpacing, twSize, twflex, twGrid, twBorder, twBorderRadius,
    twTransform, twLinearGradient, twshadow, twPosition, twText, twTypography, twLayout,
    twTransition, twOpacity, twFilter, twApply, twInject, applyUtilityClass,
    getCSS: () => {let out = ""; for (const [selector, rules] of Object.entries(css)) {out += `${selector} {\n${rules.join("\n")}\n}\n`;}return out;},
    reset: () => {for (const key in css) delete css[key]; used.clear();}, Object_Model: () => twigom, raise, getErrors: () => errors, addfunction
  }});

if (typeof window !== 'undefined') window.Twigwind = Twigwind;
if (typeof module !== 'undefined' && module.exports) module.exports = { Twigwind };