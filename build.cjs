#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { JSDOM } = require("jsdom");
const { performance } = require("perf_hooks");

// Import Twigwind
const { Twigwind } = require("./src/css.js");
const tw = Twigwind();

/* ----------------------------------------
 * CLI FLAGS
 * -------------------------------------- */

const args = process.argv.slice(2);
const flags = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  // long flags
  if (arg.startsWith("--")) {
    const raw = arg.slice(2);

    // --key=value
    if (raw.includes("=")) {
      const [key, value] = raw.split("=");
      flags[key] = value === "false" ? false : value;
      continue;
    }

    // --v alias
    if (raw === "v") {
      flags.verbose = true;
      continue;
    }

    const next = args[i + 1];
    if (next && !next.startsWith("-")) {
      flags[raw] = next;
      i++;
    } else {
      flags[raw] = true;
    }
    continue;
  }

  // short flags
  if (arg === "-v") {
    flags.verbose = true;
  }
}



const inputDir = flags.input || process.cwd();
const outputDir = flags.output || path.join(process.cwd(), "dist");
const minify = !!flags.minify;
const watch = !!flags.watch;
const verbose = !!flags.verbose;

/* ----------------------------------------
 * UTILITIES
 * -------------------------------------- */

fs.mkdirSync(outputDir, { recursive: true });

function getHTMLFiles(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!item.startsWith(".") && !item.includes("node_modules")) {
        out.push(...getHTMLFiles(full));
      }
    } else if (item.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const color = {
  reset: "\x1b[0m",
  bold: s => `\x1b[1m${s}`,
  gray: s => `\x1b[90m${s}\x1b[0m`,
  blue: s => `\x1b[34m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`
  
};

const log = {
  title: s => console.log(`\n${color.cyan(color.bold(s))}`),
  info: s => console.log(color.gray(s)),
  ok: s => console.log(color.green(`✔ ${s}`)),
  warn: s => console.warn(color.yellow(`⚠ ${s}`)),
  error: s => console.error(color.red(`✖ ${s}`))
};


function extractClasses(html) {
  const dom = new JSDOM(html);
  const nodes = [...dom.window.document.querySelectorAll("[class]")];
  const set = new Set();
  nodes.forEach(el =>
    el.className.split(/\s+/).filter(Boolean).forEach(c => set.add(c))
  );
  return [...set];
}

/* ----------------------------------------
 * BUILD
 * -------------------------------------- */

function build() {
  const stats = {
    files: 0,
    classes: 0,
    rules: 0,
    cssLines: 0,
    time: 0,
  };

  const htmlFiles = getHTMLFiles(path.resolve(inputDir));

  if (!htmlFiles.length) {
    console.log("⚠️  No HTML files found");
    return;
  }

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const classes = extractClasses(html);

    const start = performance.now();
    tw.twApply(classes);
    const end = performance.now();

    let css = tw.getCSS();
    if (minify) {
      css = css.replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "").trim();
    }

    const rel = path.relative(path.resolve(inputDir), file);
    const outFile = path.join(outputDir, rel.replace(/\.html$/, ".css"));

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, css);

    const lines = css.split("\n").filter(l => l.trim()).length;

    stats.files++;
    stats.classes += classes.length;
    stats.cssLines += lines;
    stats.time += (end - start);

    if (verbose) {
      console.log(`✅ ${rel} → ${path.relative(process.cwd(), outFile)} (${lines} lines)`);
    }

    tw.reset();
  }

  /* ----------------------------------------
   * SUMMARY OUTPUT
   * -------------------------------------- */

  console.log(`✔ Twigwind build successful`)
log.title("Twigwind build");

log.info(`Input      ${inputDir}`);
log.info(`Output     ${outputDir}`);
log.info(`HTML files ${stats.files}`);
log.info(`Classes    ${stats.classes}`);
log.info(`Time  ${stats.time} ms`);
if (tw.getErrors().length) {
  log.warn(`${tw.getErrors().length} warnings found`);
  if (verbose) {
    tw.getErrors().forEach(w => log.warn(w));
  }
}

log.ok("Build completed");
}

/* ----------------------------------------
 * RUN / WATCH
 * -------------------------------------- */

build();

if (watch) {
  const root = path.resolve(inputDir);
  const cssSrc = path.resolve(__dirname, "src", "css.js");

  console.log(`👀 Watching ${root}`);
  console.log(`👀 Watching ${cssSrc}`);

  chokidar.watch([root, cssSrc], { ignoreInitial: true })
    .on("all", (_, file) => {
      if (file.endsWith(".html") || file.endsWith("css.js")) {
        console.log(`🔄 Changed: ${file}`);
        build();
      }
    });
}
