const Twigwind = (() => {
  const css = {}; 
  const used = new Set();       
  const processedElements = new WeakSet();
  const twigom = new Object();
  const util = {};
  
  let colors = {};
  let space = {};
  let sizes = {};
  let breakpoints = {};
  let components = {};
  let errors = [];
  let display = {};
  let font_sizes = {};
  let variables = {};
  let animations = {};
  let animationCSS = "";
  let rules = [];

  /**
   * Log an error and optionally return a fallback value.
   * When used inline (e.g. as a default in `||`), pass a fallback so the
   * expression evaluates to something safe instead of `undefined`.
   * @param {string} error  - human-readable error message
   * @param {*} [fallback]  - value to return (defaults to `undefined`)
   * @returns {*} the fallback value
   */
  const raise = (error, fallback) => {
    errors.push(error);
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[Twigwind] ${error}`);
    }
    return fallback;
  };
  
  
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    
    colors = {
      "red": [[26, 0, 0], [71, 0, 0], [117, 0, 0], [163, 0, 0], [209, 0, 0], [255, 0, 0], [255, 63, 63], [255, 127, 127], [255, 191, 191], [255, 255, 255]], 
      "crimson": [[22, 2, 6], [61, 5, 16], [101, 9, 27], [140, 12, 38], [180, 16, 49], [220, 20, 60], [228, 78, 108], [237, 137, 157], [246, 196, 206], [255, 255, 255]], 
      "orange": [[26, 16, 0], [71, 45, 0], [117, 75, 0], [163, 105, 0], [209, 135, 0], [255, 165, 0], [255, 187, 63], [255, 210, 127], [255, 232, 191], [255, 255, 255]], 
      "gold": [[26, 22, 0], [71, 60, 0], [117, 99, 0], [163, 137, 0], [209, 176, 0], [255, 215, 0], [255, 225, 63], [255, 235, 127], [255, 245, 191], [255, 255, 255]], 
      "yellow": [[26, 26, 0], [71, 71, 0], [117, 117, 0], [163, 163, 0], [209, 209, 0], [255, 255, 0], [255, 255, 63], [255, 255, 127], [255, 255, 191], [255, 255, 255]], 
      "yellow_green": [[15, 20, 5], [42, 57, 14], [70, 94, 23], [98, 131, 32], [126, 168, 41], [154, 205, 50], [179, 217, 101], [204, 230, 152], [229, 242, 203], [255, 255, 255]], 
      "lime": [[0, 26, 0], [0, 71, 0], [0, 117, 0], [0, 163, 0], [0, 209, 0], [0, 255, 0], [63, 255, 63], [127, 255, 127], [191, 255, 191], [255, 255, 255]], 
      "spring_green": [[0, 26, 13], [0, 71, 35], [0, 117, 58], [0, 163, 81], [0, 209, 104], [0, 255, 127], [63, 255, 159], [127, 255, 191], [191, 255, 223], [255, 255, 255]], 
      "forest_green": [[3, 14, 3], [9, 39, 9], [15, 64, 15], [21, 89, 21], [27, 114, 27], [34, 139, 34], [89, 168, 89], [144, 197, 144], [199, 226, 199], [255, 255, 255]], 
      "cyan": [[0, 26, 26], [0, 71, 71], [0, 117, 117], [0, 163, 163], [0, 209, 209], [0, 255, 255], [63, 255, 255], [127, 255, 255], [191, 255, 255], [255, 255, 255]], 
      "deep_sky": [[0, 19, 26], [0, 53, 71], [0, 87, 117], [0, 122, 163], [0, 156, 209], [0, 191, 255], [63, 207, 255], [127, 223, 255], [191, 239, 255], [255, 255, 255]], 
      "dodger": [[3, 14, 26], [8, 40, 71], [13, 66, 117], [19, 92, 163], [24, 118, 209], [30, 144, 255], [86, 171, 255], [142, 199, 255], [198, 227, 255], [255, 255, 255]], 
      "blue": [[0, 0, 26], [0, 0, 71], [0, 0, 117], [0, 0, 163], [0, 0, 209], [0, 0, 255], [63, 63, 255], [127, 127, 255], [191, 191, 255], [255, 255, 255]], 
      "navy": [[0, 0, 13], [0, 0, 36], [0, 0, 59], [0, 0, 82], [0, 0, 105], [0, 0, 128], [63, 63, 159], [127, 127, 191], [191, 191, 223], [255, 255, 255]], 
      "blue_violet": [[14, 4, 23], [38, 11, 63], [63, 19, 104], [88, 27, 144], [113, 35, 185], [138, 43, 226], [167, 96, 233], [196, 149, 240], [225, 202, 247], [255, 255, 255]], 
      "purple": [[13, 0, 13], [36, 0, 36], [59, 0, 59], [82, 0, 82], [105, 0, 105], [128, 0, 128], [159, 63, 159], [191, 127, 191], [223, 191, 223], [255, 255, 255]], 
      "magenta": [[26, 0, 26], [71, 0, 71], [117, 0, 117], [163, 0, 163], [209, 0, 209], [255, 0, 255], [255, 63, 255], [255, 127, 255], [255, 191, 255], [255, 255, 255]], 
      "pink": [[26, 10, 18], [71, 29, 50], [117, 48, 82], [163, 67, 115], [209, 86, 147], [255, 105, 180], [255, 142, 198], [255, 180, 217], [255, 217, 236], [255, 255, 255]], 
      "deep_pink": [[26, 2, 15], [71, 5, 41], [117, 9, 67], [163, 12, 94], [209, 16, 120], [255, 20, 147], [255, 78, 174], [255, 137, 201], [255, 196, 228], [255, 255, 255]],
      "grey": [[13, 13, 13], [36, 36, 36], [59, 59, 59], [82, 82, 82], [105, 105, 105], [128, 128, 128], [159, 159, 159], [191, 191, 191], [223, 223, 223], [255, 255, 255]],
    };

    space = {
      p: "padding", pl: "padding-left", pr: "padding-right",
      pt: "padding-top", pb: "padding-bottom",
      m: "margin", ml: "margin-left", mr: "margin-right",
      mt: "margin-top", mb: "margin-bottom"
    };

    sizes = { sm: "40px", md: "80px", lg: "160px", xl: "320px", xxl: "640px"};
    breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
    display = {
      'block': "block",
      'inline': "inline",
      'hidden': "none",
      "inline-block": "inline-block",
      "inline-flex": "inline-flex",
      "inline-grid": "inline-grid"
    };

    font_sizes = { sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem", xxl: "1.5rem" };
    components = {};
    animations = {};
    variables = {};
    animations = {};
  } else if (typeof module !== 'undefined' && module.exports) {
      try {
        const path = require('path');
        const configPath = path.join(__dirname, '../twigwind.config.js');
        const js = require(configPath);
        if (!js || typeof js !== 'object') {
          raise(`twigwind.config.js does not export a valid configuration object (got ${typeof js}).`);
        } else {
          colors = js.colors || {};
          space = js.space || {};
          sizes = js.sizes || {};
          breakpoints = js.breakpoints || {};
          components = js.components || {};
          variables = js.variables || {};
          display = js.display || {};
          font_sizes = js.font_sizes || {};
          animations = js.animations || {};
        }
      } catch (error) {
        raise(`Could not load twigwind.config.js: ${error.message || error}. Falling back to empty configuration.`);
        
      }
    }
  
  const htmlColors = [
    "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", 
    "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", 
    "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", 
    "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", 
    "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", 
    "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", 
    "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", 
    "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", 
    "DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", 
    "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", 
    "Gray", "Green", "GreenYellow", "HoneyDew", "HotPink", 
    "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", 
    "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", 
    "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink", 
    "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", 
    "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", 
    "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", 
    "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", 
    "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", 
    "Navy", "OldLace", "Olive", "OliveDrab", "Orange", 
    "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", 
    "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", 
    "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", 
    "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", 
    "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", 
    "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", 
    "Tan", "Teal", "Thistle", "Tomato", "Turquoise", 
    "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen",
    "black", "white", "silver", "gray", "maroon", "red", "purple", "fuchsia",
];

  const overflows =  ["visible", "hidden", "scroll", "auto"];

    
  const escapeClass = (cls) => {
    if (typeof cls !== 'string') {
      raise(`escapeClass: expected a string, got ${typeof cls}.`);
      return '';
    }
    return cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
  };

  /**
   * 
   * @param {string} cls 
   * @returns {object} { hover, dark, media, focus, pure }
   */
  /**
   * @param {string} cls
   * @returns {object} { hover, dark, media, focus, pure }
   */
  const parsePrefix = (cls) => {
    if (typeof cls !== 'string' || cls.length === 0) {
      raise(`parsePrefix received invalid class: "${cls}"`);
      return { hover: false, dark: false, media: "", focus: false, pure: "" };
    }

    let hover = false;
    let dark = false;
    let media = "";
    let pure = cls;
    let focus = false;
    const parts = cls.split(":");

    if (parts.length > 1) {
      const prefix = parts[0];
      if (prefix === "hover") {
        hover = true; pure = parts.slice(1).join(":");
      } else if (prefix === "focus") {
        focus = true; pure = parts.slice(1).join(":");
      } else if (prefix === "dark") {
        dark = true; pure = parts.slice(1).join(":");
      } else if (breakpoints[prefix]) {
        media = `@media (min-width: ${breakpoints[prefix]}px){`;
        pure = parts.slice(1).join(":");
      }
    }

    
    const vars = pure.match(/@([a-zA-Z0-9 _-]+)/g);
    if (vars) {
      for (const v of vars) {
        const varName = v.replace('@', '');
        const resolved = variables[varName];
        if (resolved === undefined || resolved === null) {
          raise(`Variable not found: "${v}" in class "${cls}". The variable will be removed.`);
          pure = pure.replace(new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        } else {
          pure = pure.replace(new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(resolved));
        }
      }
    }

    return { hover, dark, media, focus, pure };
  };

  const pushCSS = (cls, block, hover, media, dark = false, focus = false, cname) => {
    if (typeof cls !== 'string' || cls.length === 0) {
      raise(`pushCSS: invalid class name (${typeof cls}).`);
      return;
    }
    if (typeof block !== 'string' || block.trim().length === 0) {
      raise(`pushCSS: empty or invalid CSS block for class "${cls}".`);
      return;
    }

    try {
      const safe = escapeClass(cls);
      let selector = cname ? `.${escapeClass(cname)}` : `.${safe}`;
      if (hover) selector += ":hover";
      if (focus) selector += ":focus";
      if (dark) selector = `.dark ${selector}`;

      const rule = media
        ? `${media}\n${selector} { ${block} }\n}`
        : `${block}`;

      if (!css[selector]) css[selector] = [];
      css[selector].push(rule);
    } catch (err) {
      raise(`pushCSS: failed to generate rule for "${cls}": ${err.message || err}`);
    }
  };


  

  /**
   * Convert RGB array to CSS color value
   * @param {Array|string} color - RGB array [r,g,b] or color name/hex
   * @returns {string} CSS color value
   */
    const formatColor = (color) => {
      if (color === undefined || color === null) {
        raise(`formatColor received null/undefined color value.`);
        return 'inherit';
      }

      
      if (Array.isArray(color)) {
        if (color.length < 3) {
          raise(`formatColor received an RGB array with fewer than 3 values: [${color.join(', ')}].`);
          return 'inherit';
        }
        for (let i = 0; i < 3; i++) {
          if (typeof color[i] !== 'number' || color[i] < 0 || color[i] > 255) {
            raise(`formatColor RGB value out of range at index ${i}: ${color[i]} (expected 0-255).`);
          }
        }
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      }

      if (typeof color !== 'string') {
        raise(`formatColor received unsupported type: ${typeof color}. Returning 'inherit'.`);
        return 'inherit';
      }

      const value = color.trim();
      if (value.length === 0) {
        raise(`formatColor received an empty string.`);
        return 'inherit';
      }

      
      const match = value.match(/^(rgb|rgba)\(([^)]+)\)$/i);
      if (match && match[2].includes('-')) {
        const fn = match[1].toLowerCase();
        const parts = match[2].split('-').map(v => v.trim());
        return `${fn}(${parts.join(', ')})`;
      }

      
      if (value.startsWith('#')) return value;

      
      return value;
    };


  /**
   * Generate color utilities (background-color, color)
   * Supports both basic colors (red, blue) and numbered variants (red-5, blue-3)
   */
  const twColor = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, focus, pure } = parsePrefix(cls);
    let prop, name;
    
    if (pure.startsWith("bg-")) {
      prop = "background-color";
      name = pure.slice(3);
    } else if (pure.startsWith("color-")) {
      prop = "color";
      name = pure.slice(6);
    } else {
      raise(`Invalid color class: "${cls}" — expected "bg-*" or "color-*" prefix.`);
      return;
    }

    if (!name || name.length === 0) {
      raise(`Empty color name in class "${cls}".`);
      return;
    }
    
    
    const colorMatch = name.match(/^([a-zA-Z][a-zA-Z_]*)-?(\d+)?$/);
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
            raise(`Color index ${index} out of range for "${colorName}" (0-${colorArray.length - 1}). Falling back to middle value.`);
            const midIndex = Math.floor(colorArray.length / 2);
            colorValue = formatColor(colorArray[midIndex]);
          }
        } else {
          const midIndex = Math.floor(colorArray.length / 2);
          colorValue = formatColor(colorArray[midIndex]);
        }
        pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, focus, cname);
      } else {
        
        const colorValue = formatColor(colors[name] || name);
        pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, focus, cname);
      }
    } else {
      
      const colorValue = formatColor(colors[name] || name);
      pushCSS(cls, `${prop}: ${colorValue};`, hover, media, dark, focus, cname);
    }
  };

  const twSpacing = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/);
      if (!match) {
        raise(`twSpacing: "${cls}" does not match spacing pattern (e.g. "p-10", "mt-20px").`);
        return;
      }
      const [, key, amount, unit] = match;
      const prop = space[key];
      if (!prop) {
        raise(`twSpacing: unknown spacing key "${key}" in class "${cls}". Valid keys: ${Object.keys(space).join(', ')}.`);
        return;
      }
      pushCSS(cls, `${prop}: ${amount}${unit || "px"};`, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twSpacing: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twSize = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      
      let match = pure.match(/^(max|min)?-?(w|h)-(\d+%|\d+(?:px|rem|em|%)?)$/);
      if (match) {
        const prefix = match[1] ? `${match[1]}-` : "";
        const dim = match[2] === "w" ? "width" : "height";
        let val = match[3];
        
        
        if (/^\d+$/.test(val)) {
          val += "px";
        }
        
        return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, focus, cname);
      }
      
      
      match = pure.match(/^(max|min)?-?(w|h)-(\d+(?:vw|vh|vmin|vmax))$/);
      if (match) {
        const prefix = match[1] ? `${match[1]}-` : "";
        const dim = match[2] === "w" ? "width" : "height";
        const val = match[3];
        return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, focus, cname);
      }
      
      
      match = pure.match(/^(max|min)?-?(w|h)-(\d+)(vh|vw|vmin|vmax)$/);
      if (match) {
        const prefix = match[1] ? `${match[1]}-` : "";
        const dim = match[2] === "w" ? "width" : "height";
        const val = match[3] + match[4];
        return pushCSS(cls, `${prefix}${dim}: ${val};`, hover, media, dark, focus, cname);
      }
      
      
      match = pure.match(/^size-(\w+)$/);
      if (match) {
        if (sizes[match[1]]) {
          const size = sizes[match[1]];
          return pushCSS(cls, `font-size: ${size};`, hover, media, dark, focus, cname);
        }
        raise(`twSize: unknown size key "${match[1]}" in class "${cls}". Valid keys: ${Object.keys(sizes).join(', ')}.`);
        return;
      }

      raise(`twSize: "${cls}" did not match any size pattern.`);
    } catch (err) {
      raise(`twSize: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twGrid = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^grid:(\d+),(\d+)(?:,([0-9a-zA-Z%]+))?$/);
      if (!match) {
        raise(`twGrid: "${cls}" does not match grid pattern (e.g. "grid:3,2" or "grid:3,2,10px").`);
        return;
      }
      const [, cols, rows, gap = "0"] = match;
      const colCount = parseInt(cols);
      const rowCount = parseInt(rows);
      if (colCount <= 0 || rowCount <= 0) {
        raise(`twGrid: columns (${cols}) and rows (${rows}) must be positive integers in class "${cls}".`);
        return;
      }
      const rules = `
        display: grid;
        grid-template-columns: repeat(${colCount}, 1fr);
        grid-template-rows: repeat(${rowCount}, auto);
        gap: ${gap};
      `;
      pushCSS(cls, rules, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twGrid: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twflex = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^flex(?::(row|col))?(?:-(center|right|left))?(?:-(center|right|left))?$/);
      if (!match) {
        raise(`twflex: "${cls}" does not match flex pattern (e.g. "flex", "flex:col-center-left").`);
        return;
      }
      const [, dir, main, cross] = match;
      const map = { center: "center", left: "flex-start", right: "flex-end" };
      const flexDir = dir === "col" ? "column" : dir;
      let rules = "display:flex;";
      if (flexDir) rules += `flex-direction:${flexDir};`;
      if (main) rules += `justify-content:${map[main]};`;
      if (cross) rules += `align-items:${map[cross]};`;
      pushCSS(cls, rules, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twflex: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };


  const twBorder = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^border(?:-(t|b|l|r))?-((?:\d+)|(?:.+))$/);
      if (!match) {
        raise(`twBorder: "${cls}" does not match border pattern (e.g. "border-2", "border-t-red").`);
        return;
      }
      const [, side, val] = match;
      let prop, value;
      if (/^\d+$/.test(val)) {
        prop = side ? `border-${side}` : "border";
        value = `${val}px solid`;
      } else {
        prop = side ? `border-${side}-color` : "border-color";
        const colorVal = colors[val];
        
        if (Array.isArray(colorVal)) {
          const midIndex = Math.floor(colorVal.length / 2);
          value = formatColor(colorVal[midIndex]);
        } else {
          value = colorVal || val;
        }
      }
      pushCSS(cls, `${prop}: ${value};`, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twBorder: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twBorderRadius = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^border-radius(?:-(.+))?$/);
      if (!match) {
        raise(`twBorderRadius: "${cls}" does not match border-radius pattern.`);
        return;
      }
      const radius = match[1] || "0";
      pushCSS(cls, `border-radius: ${radius};`, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twBorderRadius: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twTransform = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^transform:(rotate|scale|skew|translate)-(.+)$/);
      if (!match) {
        raise(`twTransform: "${cls}" does not match transform pattern (e.g. "transform:rotate-45", "transform:scale-1.5").`);
        return;
      }
      const [, type, value] = match;
      let rule = "transform:";
      if (type === "rotate") {
        rule += `rotate(${value}${/deg$/.test(value) ? "" : "deg"});`;
      } else if (type === "scale") {
        if (isNaN(parseFloat(value))) {
          raise(`twTransform: scale value "${value}" is not numeric in class "${cls}".`);
          return;
        }
        rule += `scale(${value});`;
      } else if (type === "skew") {
        rule += `skew(${value}${/deg$/.test(value) ? "" : "deg"});`;
      } else if (type === "translate") {
        const parts = value.split(",");
        rule += parts.length === 2
          ? `translate(${parts[0].trim()}, ${parts[1].trim()});`
          : `translate(${value});`;
      }
      pushCSS(cls, rule, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twTransform: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  /**
   */
  const twLinearGradient = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);

    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      if (!pure.startsWith("gradient:")) {
        raise(`twLinearGradient: "${cls}" does not start with "gradient:" prefix.`);
        return;
      }

      const parts = pure.replace("gradient:", "").split("|");
      if (parts.length < 3) {
        raise(`twLinearGradient: "${cls}" requires at least type, direction, and 2 color stops (separated by "|").`);
        return;
      }

      const type = parts.shift();       
      const direction = parts.shift();  

      if (type !== 'linear' && type !== 'radial') {
        raise(`twLinearGradient: unknown gradient type "${type}" in class "${cls}". Use "linear" or "radial".`);
        return;
      }

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
        if (!token || token.trim().length === 0) {
          raise(`twLinearGradient: empty color token in class "${cls}".`);
          return 'transparent';
        }

        
        if (token.startsWith("rgb") || token.startsWith("rgba")) {
          return formatColor(token);
        }

        const m = token.match(/^([a-zA-Z][a-zA-Z_]*)-?(\d+)?$/);
        if (!m) return formatColor(token);

        const [, name, idx] = m;
        const arr = colors[name];

        if (!Array.isArray(arr)) {
          return formatColor(colors[name] || name);
        }

        const i = idx ? parseInt(idx) : Math.floor(arr.length / 2);
        if (idx && (i < 0 || i >= arr.length)) {
          raise(`twLinearGradient: color index ${i} out of range for "${name}" (0-${arr.length - 1}) in class "${cls}".`);
        }
        return formatColor(arr[i] ?? arr[Math.floor(arr.length / 2)]);
      };


      const stops = parts.map(p => {
        const [colorToken, stop] = p.split("@");
        const color = resolveColor(colorToken);
        return stop ? `${color} ${stop}` : color;
      });

      if (stops.length < 2) {
        raise(`twLinearGradient: "${cls}" needs at least 2 color stops, got ${stops.length}.`);
        return;
      }

      const dir = dirMap[direction] || direction;

      pushCSS(
        cls,
        `background-image: ${type}-gradient(${dir}, ${stops.join(", ")});`,
        hover,
        media,
        dark,
        focus,
        cname
      );
    } catch (err) {
      raise(`twLinearGradient: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twshadow = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const map = {
        sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.15)", xl: "0 20px 25px rgba(0,0,0,0.2)",
        "2xl": "0 25px 50px rgba(0,0,0,0.25)"
      };
      const match = pure.match(/^shadow(?:-(.+))?$/);
      const text = pure.match(/^text-shadow(?:-(.+))?$/);
      if (!match && !text) {
        raise(`twshadow: "${cls}" does not match shadow pattern.`);
        return;
      }
      let val = match ? match[1] : text[1];
      if (!val) pushCSS(cls, `box-shadow: ${map.sm};`, hover, media, dark, focus, cname);
      else if (map[val]) pushCSS(cls, `box-shadow: ${map[val]};`, hover, media, dark, focus, cname);
      else if (text) pushCSS(cls, `text-shadow: ${val};`, hover, media, dark, focus, cname);
      else pushCSS(cls, `box-shadow: ${val.replace(/_/g, " ")};`, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twshadow: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twPosition = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      
      if (['fixed', 'absolute', 'relative', 'static', 'sticky'].includes(pure)) {
        return pushCSS(cls, `position: ${pure};`, hover, media, dark, focus, cname);
      }
      
      
      const match = pure.match(/^(top|right|bottom|left)-(\d+)(px|rem|em|%)?$/);
      if (match) {
        const [, side, amount, unit] = match;
        return pushCSS(cls, `${side}: ${amount}${unit || "px"};`, hover, media, dark, focus, cname);
      }
      
      
      const zMatch = pure.match(/^z-(\d+)$/);
      if (zMatch) {
        return pushCSS(cls, `z-index: ${zMatch[1]};`, hover, media, dark, focus, cname);
      }

      raise(`twPosition: "${cls}" did not match any position/z-index pattern.`);
    } catch (err) {
      raise(`twPosition: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twText = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      
      if (['text-left', 'text-center', 'text-right', 'text-justify'].includes(pure)) {
        const align = pure.replace('text-', '');
        return pushCSS(cls, `text-align: ${align};`, hover, media, dark, focus, cname);
      }

      raise(`twText: "${cls}" did not match any text alignment pattern. Valid: text-left, text-center, text-right, text-justify.`);
    } catch (err) {
      raise(`twText: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twTypography = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      const match = pure.match(/^font-(size|weight|family|style|variant)[-:](.+)$/);
      if (!match) {
        raise(`twTypography: "${cls}" does not match font pattern (e.g. "font-size-lg", "font-family-Arial").`);
        return;
      }
      let [, prop, val] = match;
      
      if (prop === "weight") {
        
        const validWeights = ['normal', 'bold', 'bolder', 'lighter', 'inherit'];
        if (!validWeights.includes(val) && !/^\d{1,3}$/.test(val) && !/^[1-9]00$/.test(val)) {
          raise(`twTypography: font-weight "${val}" in class "${cls}" may not be valid. Expected numeric (100-900) or keyword.`);
        }
      }

      if (prop === "size") {
        
        if (font_sizes[val]) {
          return pushCSS(cls, `font-size: ${font_sizes[val]};`, hover, media, dark, focus, cname);
        }
        
        if (val.match(/^\d+(\.\d+)?(rem|px|em|%)$/)) {
          return pushCSS(cls, `font-size: ${val};`, hover, media, dark, focus, cname);
        }
        raise(`twTypography: unknown font-size "${val}" in class "${cls}". Valid keys: ${Object.keys(font_sizes).join(', ')}, or use a value with units (e.g. 16px, 1.5rem).`);
        return;
      }
      
      if (prop === "family") {
        
        val = val.replace(/_/g, " ");
        
        const genericFamilies = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'math', 'emoji', 'fangsong'];
        
        if (val.includes(',')) {
          
          val = val.split(',').map(f => {
            f = f.trim();
            if (genericFamilies.includes(f)) return f;
            if (f.startsWith('"') || f.startsWith("'")) return f;
            return `"${f}"`;
          }).join(', ');
        } else if (!genericFamilies.includes(val) && !val.startsWith('"') && !val.startsWith("'")) {
          val = `"${val}"`;
        }
      }
      
      pushCSS(cls, `font-${prop}: ${val};`, hover, media, dark, focus, cname);
    } catch (err) {
      raise(`twTypography: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twImage = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^image-url-(.+)$/);
      if (!match) {
        raise(`twImage: "${cls}" does not match "image-url-*" format.`);
        return;
      }
      
      
      let url = match[1];
      if (!url || url.trim().length === 0) {
        raise(`twImage: empty URL in class "${cls}".`);
        return;
      }
      
      url = url.replace(/_/g, " ");
      
      
      const rules = `
        background-image: url('${url}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      `;
      
      pushCSS(cls, rules, hover, media, false, focus, cname);
    } catch (err) {
      raise(`twImage: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twFilter = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);

      /** Validate that a numeric filter value is actually numeric */
      const validateFilterNum = (filter, value) => {
        const numericFilters = ['blur', 'brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia', 'hue-rotate'];
        if (numericFilters.includes(filter)) {
          const raw = value.replace(/(px|%|deg)$/, '');
          if (isNaN(parseFloat(raw))) {
            raise(`twFilter: filter "${filter}" value "${value}" is not numeric in class "${cls}".`);
          }
        }
      };
      
      
      const backdropMatch = pure.match(/^backdrop-filter:(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
      if (backdropMatch) {
        const [, filter, value] = backdropMatch;
        validateFilterNum(filter, value);
        let filterValue = value;
        
        
        if (filter === 'blur' && !value.includes('px')) {
          filterValue = `${value}px`;
        } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
          filterValue = `${value}%`;
        } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
          filterValue = `${value}%`;
        } else if (filter === 'hue-rotate' && !value.includes('deg')) {
          filterValue = `${value}deg`;
        }
        
        return pushCSS(cls, `backdrop-filter: ${filter}(${filterValue});`, hover, media, dark, focus, cname);
      }
      
      
      const filterMatch = pure.match(/^filter:(blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
      if (filterMatch) {
        const [, filter, value] = filterMatch;
        let filterValue = value;
        
        
        if (filter === 'drop-shadow') {
          const shadowParts = value.split('-');
          if (shadowParts.length < 3) {
            raise(`twFilter: drop-shadow requires at least x-y-blur values in class "${cls}".`);
            return;
          }
          const x = shadowParts[0] + 'px';
          const y = shadowParts[1] + 'px';
          const blur = shadowParts[2] + 'px';
          const color = shadowParts[3] || 'rgba(0,0,0,0.5)';
          filterValue = `${x} ${y} ${blur} ${color}`;
        }
        
        else {
          validateFilterNum(filter, value);
          if (filter === 'blur' && !value.includes('px')) {
            filterValue = `${value}px`;
          } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
            filterValue = `${value}%`;
          } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
            filterValue = `${value}%`;
          } else if (filter === 'hue-rotate' && !value.includes('deg')) {
            filterValue = `${value}deg`;
          }
        }
        
        return pushCSS(cls, `filter: ${filter}(${filterValue});`, hover, media, dark, focus, cname);
      }
      
      
      const bgFilterMatch = pure.match(/^bg-filter:(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-(.+)$/);
      if (bgFilterMatch) {
        const [, filter, value] = bgFilterMatch;
        validateFilterNum(filter, value);
        let filterValue = value;
        
        
        if (filter === 'blur' && !value.includes('px')) {
          filterValue = `${value}px`;
        } else if (['brightness', 'contrast', 'saturate'].includes(filter) && !value.includes('%')) {
          filterValue = `${value}%`;
        } else if (['grayscale', 'invert', 'sepia'].includes(filter) && !value.includes('%')) {
          filterValue = `${value}%`;
        } else if (filter === 'hue-rotate' && !value.includes('deg')) {
          filterValue = `${value}deg`;
        }
        
        return pushCSS(cls, `backdrop-filter: ${filter}(${filterValue});`, hover, media, dark, focus, cname);
      }

      raise(`twFilter: "${cls}" did not match any filter pattern.`);
    } catch (err) {
      raise(`twFilter: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twLayout = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      
      const maxWMatch = pure.match(/^max-w-(\d+)(px|rem|em|%)?$/);
      if (maxWMatch) {
        const [, amount, unit] = maxWMatch;
        return pushCSS(cls, `max-width: ${amount}${unit || "px"};`, hover, media, dark, focus, cname);
      }
      
      
      if (pure === 'mx-auto') {
        return pushCSS(cls, `margin-left: auto; margin-right: auto;`, hover, media, dark, focus, cname);
      }
      if (pure === 'my-auto') {
        return pushCSS(cls, `margin-top: auto; margin-bottom: auto;`, hover, media, dark, focus, cname);
      }
      
      
      const gapMatch = pure.match(/^gap-(\d+)(px|rem|em|%)?$/);
      if (gapMatch) {
        const [, amount, unit] = gapMatch;
        return pushCSS(cls, `gap: ${amount}${unit || "px"};`, hover, media, dark, focus, cname);
      }

      raise(`twLayout: "${cls}" did not match any layout pattern (max-w-*, mx-auto, my-auto, gap-*).`);
    } catch (err) {
      raise(`twLayout: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twTransition = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      
      const colonMatch = pure.match(/^transition:(.+)_(\d+)ms$/);
      if (colonMatch) {
        const [, property, duration] = colonMatch;
        const prop = property === 'all' ? 'all' : property.replace('-', '-');
        return pushCSS(cls, `transition: ${prop} ${duration}ms ease;`, hover, media, dark, focus, cname);
      }
      
      
      const dashMatch = pure.match(/^transition-(.+)-(\d+)ms$/);
      if (dashMatch) {
        const [, property, duration] = dashMatch;
        const prop = property === 'all' ? 'all' : property.replace('-', '-');
        return pushCSS(cls, `transition: ${prop} ${duration}ms ease;`, hover, media, dark, focus, cname);
      }

      raise(`twTransition: "${cls}" does not match transition pattern (e.g. "transition:all_300ms" or "transition-opacity-200ms").`);
    } catch (err) {
      raise(`twTransition: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twOpacity = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      const match = pure.match(/^opacity-(\d+)$/);
      if (match) {
        const val = parseInt(match[1]);
        if (val < 0 || val > 100) {
          raise(`twOpacity: opacity value ${val} out of range (0-100) in class "${cls}". Clamping.`);
        }
        const opacity = Math.max(0, Math.min(1, val / 100));
        return pushCSS(cls, `opacity: ${opacity};`, hover, media, dark, focus, cname);
      }

      raise(`twOpacity: "${cls}" does not match opacity pattern (e.g. "opacity-50", "opacity-100").`);
    } catch (err) {
      raise(`twOpacity: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twAnimation = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^animate-([a-zA-Z0-9_-]+)-(\d+)(ms|s)-(infinite|normal|reverse|alternate|alternate-reverse)$/);
      if (match) {
        let [_, animation, duration, unit, iteration] = match;
        if (!unit) unit = "s";
        if (!iteration) iteration = "infinite";
        if (!duration) duration = "1";
        return pushCSS(cls, `animation: ${animation} ${duration}${unit} ${iteration};`, hover, media, dark, focus, cname);
      }

      raise(`twAnimation: "${cls}" does not match animation pattern (e.g. "animate-fade-300ms-infinite").`);
    } catch (err) {
      raise(`twAnimation: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  /**
   * Compile all animations from the `animations` config into @keyframes CSS.
   *
   * Expected config format:
   *   animations: {
   *     "fade-in": {
   *       "0%":   { opacity: "0" },
   *       "100%": { opacity: "1" }
   *     },
   *     "slide-up": {
   *       "from": { transform: "translateY(100%)", opacity: "0" },
   *       "to":   { transform: "translateY(0)", opacity: "1" }
   *     }
   *   }
   *
   * Produces:
   *   @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
   *   @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { ... } }
   */
  const compileAnimations = () => {
    animationCSS = "";

    if (!animations || typeof animations !== 'object') {
      return animationCSS;
    }

    const names = Object.keys(animations);
    if (names.length === 0) return animationCSS;

    for (const name of names) {
      const keyframes = animations[name];
      if (!keyframes || typeof keyframes !== 'object') {
        raise(`compileAnimations: animation "${name}" is not a valid keyframes object. Skipping.`);
        continue;
      }

      let rule = `@keyframes ${name} {\n`;

      for (const [stop, props] of Object.entries(keyframes)) {
        if (!props || typeof props !== 'object') {
          raise(`compileAnimations: keyframe stop "${stop}" in animation "${name}" is not an object. Skipping.`);
          continue;
        }

        rule += `  ${stop} {\n`;
        for (const [prop, val] of Object.entries(props)) {
          // Convert camelCase to kebab-case (e.g. backgroundColor -> background-color)
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          rule += `    ${cssProp}: ${val};\n`;
        }
        rule += `  }\n`;
      }

      rule += `}\n`;
      animationCSS += rule;
    }

    return animationCSS;
  };

  const twTextDecoration = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^text-decoration-(underline|overline|line-through|none)$/);
      if (match) {
        const decoration = match[1];
        return pushCSS(cls, `text-decoration: ${decoration};`, hover, media, dark, focus, cname);
      }

      raise(`twTextDecoration: "${cls}" does not match text-decoration pattern. Valid: underline, overline, line-through, none.`);
    } catch (err) {
      raise(`twTextDecoration: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twOverflow = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      const match = pure.match(/^overflow(?:-(x|y))?-(visible|hidden|scroll|auto)$/);
      if (match) {
        const axis = match[1];
        const value = match[2];
        if (axis) {
          return pushCSS(cls, `overflow-${axis}: ${value};`, hover, media, dark, focus, cname);
        }
        return pushCSS(cls, `overflow: ${value};`, hover, media, dark, focus, cname);
      }

      raise(`twOverflow: "${cls}" does not match overflow pattern. Valid: overflow-auto, overflow-hidden, overflow-visible, overflow-scroll, overflow-x-*, overflow-y-*.`);
    } catch (err) {
      raise(`twOverflow: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  const twDisplay = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    try {
      const { hover, dark, media, focus, pure } = parsePrefix(cls);
      
      if (display[pure]) {
        pushCSS(cls, `display:${display[pure]};`, hover, media, dark, focus, cname);
      } else {
        raise(`twDisplay: "${cls}" is not a recognized display value. Valid: ${Object.keys(display).join(', ')}.`);
      }
    } catch (err) {
      raise(`twDisplay: unexpected error processing "${cls}": ${err.message || err}`);
    }
  };

  
  rules = [
      { test: (p) => p.startsWith("bg-") || p.startsWith("color-"), run: twColor },
      { test: (p) => /^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/.test(p), run: twSpacing },
      { test: (p) => /^(max|min)?-?(w|h)-(\d+%|\d+(?:px|rem|em|%)?)$/.test(p) || p.startsWith("size-"), run: twSize },
      { test: (p) => p.startsWith("flex"), run: twflex },
      { test: (p) => p.startsWith("grid:"), run: twGrid },
      { test: (p) => p.startsWith("border-radius"), run: twBorderRadius },
      { test: (p) => p.startsWith("border"), run: twBorder },
      { test: (p) => p.startsWith("transform:"), run: twTransform },
      { test: (p) => p.startsWith("shadow"), run: twshadow },
      { test: (p) => p.startsWith("gradient:"), run: twLinearGradient },
      { test: (p) =>
          ["fixed","absolute","relative","static","sticky"].includes(p) ||
          /^(top|right|bottom|left)-/.test(p) ||
          /^z-\d+$/.test(p),
        run: twPosition
      },
      { test: (p) => p.startsWith("text-"), run: twText },
      { test: (p) => p.startsWith("font-") || /^font-(size|weight|family|style|variant):/.test(p), run: twTypography },
      { test: (p) => p.startsWith("animate-"), run: twAnimation },
      { test: (p) =>
          p === "mx-auto" ||
          p === "my-auto" ||
          /^gap-/.test(p),
        run: twLayout
      },
      { test: (p) => p.startsWith("transition-") || p.startsWith("transition:"), run: twTransition },
      { test: (p) => p.startsWith("opacity-"), run: twOpacity },
      { test: (p) => p.startsWith("image-url-"), run: twImage },
      { test: (p) => p.startsWith("filter") || p.startsWith("bg-filter") || p.startsWith("backdrop-filter"), run: twFilter },
      { test: (p) => p.startsWith("text-decoration-"), run: twTextDecoration },
      { test: (p) => p.startsWith("overflow"), run: twOverflow },
      { test: (p) => display[p], run: twDisplay }
  ];

  const addfunction = (test, run) => {
    if (typeof test !== 'function') {
      raise(`addfunction: "test" must be a function, got ${typeof test}.`);
      return;
    }
    if (typeof run !== 'function') {
      raise(`addfunction: "run" must be a function, got ${typeof run}.`);
      return;
    }
    rules.push({ test, run });
  };

  function applyUtilityClass(cls, cname, element_name = "unknown") {
    if (typeof cls !== 'string' || cls.trim().length === 0) {
      raise(`applyUtilityClass: received invalid class value (${typeof cls}).`);
      return;
    }

    try {
      const { pure } = parsePrefix(cls);

      if (!pure || pure.trim().length === 0) {
        raise(`Twigwind: class "${cls}" resolved to an empty utility after prefix parsing.`);
        return;
      }

      for (const rule of rules) {
        if (rule.test(pure)) {
          rule.run(cls, cname);
          return;
        }
      }

      if (!util[cls]) {
        raise(`Twigwind: Error compiling "${cls}" in element <${element_name}> — utility not recognized. Check spelling or register a custom rule with addfunction().`);
      }
    } catch (err) {
      raise(`Twigwind: Unexpected error processing class "${cls}" in element <${element_name}>: ${err.message || err}`);
    }
  }

  const twApply = (el) => {
    if (!el) {
      raise(`twApply: received null/undefined element.`);
      return;
    }

    const isDOM = typeof HTMLElement !== 'undefined';

    if (isDOM && !(el instanceof HTMLElement)) {
      
      if (!el || typeof el.forEach !== 'function') {
        raise(`twApply: expected an HTMLElement or iterable of class names, got ${typeof el}.`);
        return;
      }
    }

    if (isDOM && processedElements.has(el)) return;

    const classes = isDOM ? el.classList : el;

    if (!classes || typeof classes.forEach !== 'function') {
      raise(`twApply: could not iterate classes on the provided element.`);
      return;
    }

    classes.forEach(cls => {
      try {
        if (components && components[cls]) {
          if (!Array.isArray(components[cls])) {
            raise(`twApply: component "${cls}" is not an array. Skipping.`);
            return;
          }
          components[cls].forEach(c => applyUtilityClass(c, cls, el?.tagName));
        } else {
          applyUtilityClass(cls, null, el?.tagName);
        }
      } catch (err) {
        raise(`twApply: error processing class "${cls}": ${err.message || err}`);
      }
    });

    if (isDOM) processedElements.add(el);
  };

  const twInject = () => {
    if (typeof document === 'undefined' || !document.head) {
      raise(`twInject: no document/head available — cannot inject styles. Are you running in a non-browser environment?`);
      return;
    }

    try {
      let final = "";

      // Prepend compiled @keyframes animations
      if (animationCSS) {
        final += animationCSS + "\n";
      }

      for (const [selector, rules] of Object.entries(css)) {
        if (!Array.isArray(rules)) {
          raise(`twInject: rules for selector "${selector}" is not an array. Skipping.`);
          continue;
        }
        for (const rule of rules) {
          if (typeof rule !== 'string') {
            raise(`twInject: non-string rule encountered for selector "${selector}". Skipping.`);
            continue;
          }
          if (rule.trim().startsWith("@media")) {
            final += rule + "\n";
          } else {
            final += `${selector} {\n${rule}\n}\n`;
          }
        }
      }

      const style = document.createElement("style");
      style.setAttribute("data-twigwind", "true");
      style.textContent = final;
      document.head.appendChild(style);
    } catch (err) {
      raise(`twInject: failed to inject styles: ${err.message || err}`);
    }
  };

  return {
    twColor, twSpacing, twSize, twflex, twGrid, twBorder, twBorderRadius,
    twTransform, twLinearGradient, twshadow, twPosition, twText, twTypography, twLayout,
    twTransition, twOpacity, twFilter, twApply, twInject, applyUtilityClass, twDisplay,
    compileAnimations,
    getCSS: () => {
      try {
        let out = "";

        // Prepend compiled @keyframes animations
        if (animationCSS) {
          out += animationCSS + "\n";
        }

        for (const [selector, rules] of Object.entries(css)) {
          if (!Array.isArray(rules)) continue;
          out += `${selector} {\n${rules.join("\n")}\n}\n`;
        }
        return out;
      } catch (err) {
        raise(`getCSS: failed to generate CSS output: ${err.message || err}`);
        return "";
      }
    },
    reset: () => { for (const key in css) delete css[key]; used.clear(); errors.length = 0; animationCSS = ""; },
    Object_Model: () => twigom,
    raise,
    getErrors: () => [...errors],
    hasErrors: () => errors.length > 0,
    addfunction
  }});

if (typeof window !== 'undefined') window.Twigwind = Twigwind;
if (typeof module !== 'undefined' && module.exports) module.exports = { Twigwind };