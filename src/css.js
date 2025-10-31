/// Simple Twigwind-like Framework
const Twigwind = (() => {
  const css = [];
  const used = new Set();

  const colors = {
    amber: "#ffc107", aqua: "#00ffff", blue: "#2196F3", lightBlue: "#87CEEB",
    brown: "#795548", cyan: "#00bcd4", blueGrey: "#607d8b", green: "#4CAF50",
    lightGreen: "#8bc34a", indigo: "#3f51b5", khaki: "#f0e68c", lime: "#cddc39",
    orange: "#ff9800", deepOrange: "#ff5722", pink: "#e91e63", purple: "#9c27b0",
    deepPurple: "#673ab7", red: "#f44336", sand: "#fdf5e6", teal: "#009688",
    yellow: "#ffeb3b", white: "#fff", black: "#000"
  };

  const space = {
    p: "padding", pl: "padding-left", pr: "padding-right",
    pt: "padding-top", pb: "padding-bottom",
    m: "margin", ml: "margin-left", mr: "margin-right",
    mt: "margin-top", mb: "margin-bottom"
  };

  const sizes = { sm: "40px", md: "80px", lg: "160px", xl: "320px", xxl: "640px" };
  const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

  // --- Helpers ---
  const escapeClass = (cls) =>
    cls.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");

  const parsePrefix = (cls) => {
    let hover = false;
    let media = "";
    let pure = cls;

    const parts = cls.split(":");
    if (parts.length > 1) {
      const potentialPrefix = parts[0];
      if (potentialPrefix === "hover") {
        hover = true;
        pure = parts.slice(1).join(":");
      } else if (breakpoints[potentialPrefix]) {
        media = `@media (min-width: ${breakpoints[potentialPrefix]}px){`;
        pure = parts.slice(1).join(":");
      } else {
        // no prefix, pure = cls
        pure = cls;
      }
    } else {
      pure = cls;
    }

    return { hover, media, pure };
  };

  const pushCSS = (cls, rule, hover, media) => {
    const safe = escapeClass(cls);
    const selector = hover ? `.${safe}:hover` : `.${safe}`;
    const block = `${selector} { ${rule} }`;
    css.push(media ? `${media}${block}}` : block);
  };

  // --- Features ---
  const twColor = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    let prop, name;

    if (pure.startsWith("bg-")) { prop = "background-color"; name = pure.slice(3); }
    else if (pure.startsWith("color-")) { prop = "color"; name = pure.slice(6); }
    else return;

    const value = colors[name] || name;
    pushCSS(cls, `${prop}: ${value};`, hover, media);
  };

  const twSpacing = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/);
    if (!match) return;

    const [, key, amount, unit] = match;
    const prop = space[key];
    if (!prop) return;

    pushCSS(cls, `${prop}: ${amount}${unit || "px"};`, hover, media);
  };

  const twSize = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);

    // w-100 / h-50% support
    let match = pure.match(/^(w|h)-(\d+)(px|rem|em|%)?$/);
    if (match) {
      const dim = match[1] === "w" ? "width" : "height";
      const val = match[2] + (match[3] || "px");
      return pushCSS(cls, `${dim}: ${val};`, hover, media);
    }

    // size-sm support
    match = pure.match(/^size-(\w+)$/);
    if (match && sizes[match[1]]) {
      const size = sizes[match[1]];
      return pushCSS(cls, `width: ${size}; height: ${size};`, hover, media);
    }
  };

  const twGrid = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);

    const match = pure.match(/^grid:(\d+),(\d+)(?:,([0-9a-zA-Z%]+))?$/);
    if (!match) return;

    const [, cols, rows, gap = "0"] = match;

    const rules = `
      display: grid;
      grid-template-columns: repeat(${cols}, 1fr);
      grid-template-rows: repeat(${rows}, auto);
      gap: ${gap};
    `;

    pushCSS(cls, rules, hover, media);
  };

  const twflex = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^flex(?::(row|col))?(?:-(center|right|left))?(?:-(center|right|left))?$/);
    if (!match) return;

    const [, dir, main, cross] = match;
    const map = { center: "center", left: "flex-start", right: "flex-end" };

    let rules = "display:flex;";
    if (dir) rules += `flex-direction:${dir};`;
    if (main) rules += `justify-content:${map[main]};`;
    if (cross) rules += `align-items:${map[cross]};`;

    pushCSS(cls, rules, hover, media);
  };
  
  const twBorder = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^border(?:-(t|b|l|r))?-((?:\d+)|(?:.+))$/);
    if (!match) return;

    const [, side, val] = match;
    let prop, value;

    if (/^\d+$/.test(val)) {
      // width
      prop = side ? `border-${side}` : "border";
      value = `${val}px solid`;
    } else {
      // color
      prop = side ? `border-${side}-color` : "border-color";
      value = colors[val] || val;
    }

    pushCSS(cls, `${prop}: ${value};`, hover, media);
  };

  const twBorderRadius = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^border-radius(?:-(.+))?$/);
    if (!match) return;

    const radius = match[1] || "0";
    pushCSS(cls, `border-radius: ${radius};`, hover, media);
  };

  const twTransform = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
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

    pushCSS(cls, rule, hover, media);
  };

  const twLinearGradient = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^gradient-(?:(to-[a-z]+|\d+deg)-)(.+)$/);
    if (!match) return;

    const [, direction, colorString] = match;
    
    const colorParts = colorString.split('-');
    if (colorParts.length < 2) return;
  
    const gradientColors = colorParts.map(colorName => colors[colorName] || colorName).join(', ');
    let gradientDirection = direction;
    if (direction.startsWith('to-')) {
      const dirMap = {
        'to-r': 'to right',
        'to-l': 'to left',
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-tr': 'to top right',
        'to-tl': 'to top left',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left'
      };
      gradientDirection = dirMap[direction] || 'to right';
    }
    
    pushCSS(cls, `background-image: linear-gradient(${gradientDirection}, ${gradientColors});`, hover, media);
  };


  const twtransition = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const rule = `transition: ${pure.slice(11).replace(/_/g, " ")}`;
    pushCSS(cls, rule, hover, media);
  };

  const twshadow = (cls) => {
  if (used.has(cls)) return;
  used.add(cls);

  const { hover, media, pure } = parsePrefix(cls);

  // Preset map
  const map = {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.15)",
    xl: "0 20px 25px rgba(0,0,0,0.2)",
    "2xl": "0 25px 50px rgba(0,0,0,0.25)"
  };

  // Match: shadow, shadow-md, shadow-<custom>
  const match = pure.match(/^shadow(?:-(.+))?$/);
  const text = pure.match(/^text-shadow(?:-(.+))?$/);
  if (!match && !text) return;

  let val = match[1]; // may be undefined, preset key, or custom value

  if (!val) {
    // default = sm
    pushCSS(cls, `box-shadow: ${map.sm};`, hover, media);
  } else if (map[val]) {
    // preset
    pushCSS(cls, `box-shadow: ${map[val]};`, hover, media);
  } else if (text) {
    // text-shadow
    pushCSS(cls, `text-shadow: ${text[1]};`, hover, media);
  } else {
    // arbitrary value (use underscores for spaces in class)
    const custom = val.replace(/_/g, " ");
    pushCSS(cls, `box-shadow: ${custom};`, hover, media);
  }

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

  const twPosition = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);

    // Position types: absolute, relative, fixed, sticky, static
    const positionMatch = pure.match(/^(absolute|relative|fixed|sticky|static)$/);
    if (positionMatch) {
      return pushCSS(cls, `position: ${positionMatch[1]};`, hover, media);
    }

    // Position values: top-10, bottom-5, left-0, right-auto, inset-4
    const valueMatch = pure.match(/^(top|bottom|left|right|inset)-(.+)$/);
    if (valueMatch) {
      const [, direction, value] = valueMatch;
      
      if (direction === "inset") {
        // inset-4 = top, right, bottom, left all set to 4px
        const val = value === "auto" ? "auto" : `${value}${/^\d+$/.test(value) ? "px" : ""}`;
        return pushCSS(cls, `top: ${val}; right: ${val}; bottom: ${val}; left: ${val};`, hover, media);
      } else {
        // top-10, left-0, etc.
        const val = value === "auto" ? "auto" : `${value}${/^\d+$/.test(value) ? "px" : ""}`;
        return pushCSS(cls, `${direction}: ${val};`, hover, media);
      }
    }

    // Z-index: z-0, z-10, z-20, z-50, z-auto
    const zMatch = pure.match(/^z-(.+)$/);
    if (zMatch) {
      const value = zMatch[1] === "auto" ? "auto" : zMatch[1];
      return pushCSS(cls, `z-index: ${value};`, hover, media);
    }
  };

  const twAnimation = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);
    const { hover, media, pure } = parsePrefix(cls);
    // Example: animate-bounce, animate-spin, animate-pulse
    const match = pure.match(/^animate-(.*?)-(\d+)(ms|s)-(infinite|normal|reverse|alternate|alternate-reverse)$/);
    if (!match) return;
    var [, type, duration, unit, iteration] = match;
    if (!iteration) iteration = "infinite";
    if (!unit) unit = "ms";
    if (!duration) duration = "1000";
    let rule = `animation: ${type} ${duration}${unit} ${iteration};`;
    pushCSS(cls, rule, hover, media);
  }


  // --- Apply classes ---
  const twApply = (el) => {
    el.classList.forEach(cls => {
      const { pure } = parsePrefix(cls);
      if (pure.startsWith("bg-") || pure.startsWith("color-")) {
        twColor(cls);
      } else if (pure.match(/^([pm][lrtb]?)-(\d+)(px|rem|em|%)?$/)) {
        twSpacing(cls);
      } else if (pure.match(/^(w|h)-(\d+)(px|rem|em|%)?$/) || pure.startsWith("size-")) {
        twSize(cls);
      } else if (pure.startsWith("flex")) {
        twflex(cls);
      } else if (pure.startsWith("grid:")) {
        twGrid(cls);
      } else if (pure.startsWith("border-radius")) {
        twBorderRadius(cls);
      } else if (pure.startsWith("border")) {
        twBorder(cls);
      } else if (pure.startsWith("transform:")) {
        twTransform(cls);
      } else if (pure.startsWith("transition:")) {
        twtransition(cls);
      } else if (pure.startsWith("shadow")) {
        twshadow(cls);
      } else if (pure.match(/^(absolute|relative|fixed|sticky|static)$/) ||
                 pure.match(/^(top|bottom|left|right|inset)-(.+)$/) ||
                 pure.match(/^z-(.+)$/)) {
        twPosition(cls);
      }
      else if (pure.startsWith("animate-")) {
        twAnimation(cls);
      } else if (pure.startsWith("gradient-")) {
        twLinearGradient(cls);
      }
      else if (pure.startsWith("image-url-")) {
        twImage(cls);
      }
    });
  };

  const twInject = () => {
    const style = document.createElement("style");
    style.textContent = css.join("\n");
    document.head.appendChild(style);
  };

  return { 
  twColor, twSpacing, twSize, twflex, twGrid, twBorder, twBorderRadius,
  twTransform, twLinearGradient, twImage, twtransition, twshadow,
  twPosition, twAnimation, twApply, twInject,
  getCSS: () => css.join("\n") // ✅ clean accessor
};
})();
export { Twigwind };
// In browser, call Twigwind.twInject() after applying classes to inject CSS