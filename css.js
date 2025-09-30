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

  const twtransition = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const rule = `transition: ${pure.slice(11).replace(/-/g, " ")}`;
    pushCSS(cls, rule, hover, media);
  };

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
      } else if (pure.startsWith("border")) {
        twBorder(cls);
      } else if (pure.startsWith("transform:")) {
        twTransform(cls);
      } else if (pure.startsWith("transition:")) {
        twtransition(cls);
      }
    });
  };

  const twInject = () => {
    const style = document.createElement("style");
    style.textContent = css.join("\n");
    document.head.appendChild(style);
  };

  return { twColor, twSpacing, twSize, twflex, twGrid, twBorder, twTransform, twtransition, twApply, twInject };
})();

// Run on load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[class]").forEach(el => Twigwind.twApply(el));
  Twigwind.twInject();
});
