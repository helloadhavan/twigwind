const Twigwind = (() => {
  const css = [];
  const used = new Set();

  const colors = {
    amber: "#ffc107", aqua: "#00ffff", blue: "#2196F3", lightBlue: "#87CEEB",
    brown: "#795548", cyan: "#00bcd4", blueGrey: "#607d8b", green: "#4CAF50",
    lightGreen: "#8bc34a", indigo: "#3f51b5", khaki: "#f0e68c", lime: "#cddc39",
    orange: "#ff9800", deepOrange: "#ff5722", pink: "#e91e63", purple: "#9c27b0",
    deepPurple: "#673ab7", red: "#f44336", sand: "#fdf5e6", teal: "#009688",
    yellow: "#ffeb3b", white: "#fff", black: "#000000ff",
    lightGray: "#f5f5f5", gray: "#9e9e9e", darkGray: "#424242"
  };

  const space = {
    p: "padding", pl: "padding-left", pr: "padding-right",
    pt: "padding-top", pb: "padding-bottom",
    m: "margin", ml: "margin-left", mr: "margin-right",
    mt: "margin-top", mb: "margin-bottom"
  };

  const sizes = { sm: "40px", md: "80px", lg: "160px", xl: "320px", xxl: "640px" };
  const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

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

  const pushCSS = (cls, rule, hover, media, dark = false, cname) => {
    const safe = escapeClass(cls);
    let selector = cname || `.${safe}`;
    if (hover) selector += ":hover";
    if (dark) selector = `.dark ${selector}`;
    const block = `${selector} { ${rule} }`;
    css.push(media ? `${media}${block}}` : block);
  };

  // ========== Utility Generators ==========

  const twColor = (cls, cname) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, dark, media, pure } = parsePrefix(cls);
    let prop, name;
    if (pure.startsWith("bg-")) { prop = "background-color"; name = pure.slice(3); }
    else if (pure.startsWith("color-")) { prop = "color"; name = pure.slice(6); }
    else return;
    const value = colors[name] || name;
    pushCSS(cls, `${prop}: ${value};`, hover, media, dark, cname);
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
    let match = pure.match(/^(w|h)-(\d+)(px|rem|em|%)?$/);
    if (match) {
      const dim = match[1] === "w" ? "width" : "height";
      const val = match[2] + (match[3] || "px");
      return pushCSS(cls, `${dim}: ${val};`, hover, media, dark, cname);
    }
    // size-sm support
    match = pure.match(/^size-(\w+)$/);
    if (match && sizes[match[1]]) {
      const size = sizes[match[1]];
      return pushCSS(cls, `font-size: ${size};`, hover, media, dark);
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

  const twLinearGradient = (cls, cname) => {
  if (used.has(cls)) return;
  used.add(cls);
  const { hover, dark, media, pure } = parsePrefix(cls);
  const match = pure.match(/^gradient-(to-[a-z]+|\d+deg)-(.+)$/);
  if (!match) return;
  const [, direction, colorsRaw] = match;
  const colorParts = colorsRaw.split("-");
  if (colorParts.length < 2) return;
  const gradientColors = colorParts
    .map(c => colors[c] || c)
    .join(", ");
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
  const directionCSS = dirMap[direction] || direction;
  pushCSS(cls, `background-image: linear-gradient(${directionCSS}, ${gradientColors});`, hover, media, dark, cname);
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
    
    // Font sizes
    const sizeMatch = pure.match(/^text-(\w+)$/);
    if (sizeMatch && sizes[sizeMatch[1]]) {
      return pushCSS(cls, `font-size: ${sizes[sizeMatch[1]]};`, hover, media, dark, cname);
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
    
    const match = pure.match(/^transition-(.+)-(\d+)ms$/);
    if (match) {
      const [, property, duration] = match;
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

  const TagHandler = () => {
    let twigcss = "";
    document.querySelectorAll("twigwind").forEach(twig => {
      twigcss += twig.textContent + "\n";
    });
    const matches = [...twigcss.matchAll(/([a-zA-Z0-9_\-#\.]+):[ \t]*\{([^}]*)\}/gs)];

    for (const match of matches) {
      const cname = `.${match[1].trim()}`;  // e.g. ".button" or ".card"
      const classBlock = match[2].trim(); // e.g. "bg-blue; p-10"
      const classes = classBlock.split(";").map(c => c.trim()).filter(Boolean);
      for (const cls of classes) {
        applyUtilityClass(cls, cname);
      }
    }
  };

  const applyUtilityClass = (cls, cname) => {
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
    else if (pure.startsWith("gradient-")) twLinearGradient(cls, cname);
    else if (['fixed', 'absolute', 'relative', 'static', 'sticky'].includes(pure) ||
             pure.match(/^(top|right|bottom|left)-(\d+)/) ||
             pure.match(/^z-(\d+)$/)) twPosition(cls, cname);
    else if (pure.startsWith("text-") || pure.startsWith("font-")) twText(cls, cname);
    else if (pure.match(/^max-w-/) || pure === 'mx-auto' || pure === 'my-auto' || pure.match(/^gap-/)) twLayout(cls, cname);
    else if (pure.startsWith("transition-")) twTransition(cls, cname);
    else if (pure.startsWith("opacity-")) twOpacity(cls, cname);
  };


  // --- Generic apply() and inject() ---
  const twApply = (el) => {
    TagHandler();
    el.classList.forEach(cls => {
      applyUtilityClass(cls);
    });
  };

  const twInject = () => {
    const merged = {};
    for (const line of css) {
      const [selector, body] = line.split(/\s*\{\s*/);
      if (!selector || !body) continue;
      const cleanSelector = selector.trim();
      const cleanBody = body.replace(/\}\s*$/, "").trim();
      merged[cleanSelector] = (merged[cleanSelector] || "") + cleanBody + ";";
    }

    const final = Object.entries(merged)
      .map(([sel, body]) => `${sel} { ${body} }`)
      .join("\n");

    const style = document.createElement("style");
    style.textContent = final;
    document.head.appendChild(style);
};


  return {
    twColor, twSpacing, twSize, twflex, twGrid, twBorder, twBorderRadius,
    twTransform, twLinearGradient, twshadow, twPosition, twText, twLayout,
    twTransition, twOpacity, TagHandler, twApply, twInject, applyUtilityClass,
    getCSS: () => css.join("\n")
  };
})();

if (typeof window !== 'undefined') window.Twigwind = Twigwind;
if (typeof module !== 'undefined' && module.exports) module.exports = { Twigwind };