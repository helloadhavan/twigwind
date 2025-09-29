// Simple Twigwind-like Framework
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
    let hover = false, media = "", pure = cls;
    const bpMatch = cls.match(/^(\w+):(.+)$/);
    if (bpMatch) {
      const prefix = bpMatch[1];
      pure = bpMatch[2];
      if (prefix === "hover") hover = true;
      else if (breakpoints[prefix]) media = `@media (min-width: ${breakpoints[prefix]}px){`;
    }
    return { hover, media, pure };
  };

  const pushCSS = (cls, rule, hover, media) => {
    const safe = escapeClass(cls);
    css.push(
      `${media}.${hover ? "hover\\:" + safe + ":hover" : safe} { ${rule} }${media ? "}" : ""}`
    );
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
    const match = pure.match(/^size-(\w+)$/);
    if (!match) return;

    const size = sizes[match[1]];
    if (!size) return;

    pushCSS(cls, `width: ${size}; height: ${size};`, hover, media);
  };

  const twflex = (cls) => {
    if (used.has(cls)) return;
    used.add(cls);

    const { hover, media, pure } = parsePrefix(cls);
    const match = pure.match(/^flex(?::(row|col))?(?:-(center|right|left))?(?:-(center|right|left))?$/);
    if (!match) return;

    const [, dir, main, cross] = match; // groups

    let rules = ["display: flex;"];
    if (dir === "row") rules.push("flex-direction: row;");
    if (dir === "col") rules.push("flex-direction: column;");

    // main axis → justify-content
    if (main) {
      const map = { center: "center", left: "flex-start", right: "flex-end" };
      rules.push(`justify-content: ${map[main]};`);
    }

    // cross axis → align-items
    if (cross) {
      const map = { center: "center", left: "flex-start", right: "flex-end" };
      rules.push(`align-items: ${map[cross]};`);
    }

    const safeClass = pure.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
    const selector = hover ? `.hover\\:${safeClass}:hover` : `.${safeClass}`;

    const block = `${selector} { ${rules.join(" ")} }`;

    css.push(media ? `${media}${block}}` : block);
};

  const twApply = (el) => {
    el.classList.forEach(cls => {
      if (/^(hover:)?(bg-|color-)/.test(cls)) twColor(cls);
      else if (/^(hover:)?[pm]/.test(cls)) twSpacing(cls);
      else if (/^(hover:)?size-/.test(cls)) twSize(cls);
      else if (/^flex(?::(row|col))?(?:-(center|right|left))?(?:-(center|right|left))?$/.test(cls)) twSize(cls);
    });
  };

  const twInject = () => {
    const style = document.createElement("style");
    style.textContent = css.join("\n");
    document.head.appendChild(style);
  };

  return { twColor, twSpacing, twSize, twflex, twApply, twInject};
})();

// Run on load
document.querySelectorAll("[class]").forEach(el => Twigwind.twApply(el));
Twigwind.twInject();
