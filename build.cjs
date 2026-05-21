#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

let chokidar;
try {
  chokidar = require("chokidar");
} catch (err) {
  // chokidar is only needed for --watch mode; loaded lazily below
}

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (err) {
  console.error("✖ jsdom is required but not installed. Run: npm install jsdom");
  process.exit(1);
}

// Import Twigwind
let tw;
try {
  const { Twigwind } = require("./src/css.js");
  tw = Twigwind();
} catch (err) {
  console.error(`✖ Failed to load Twigwind engine: ${err.message || err}`);
  process.exit(1);
}

try {
  const { main } = require("./extension.js");
  if (typeof main === 'function') {
    main(tw);
  }
} catch (err) {
  // extension.js is optional — warn but continue
  console.warn(`⚠ Could not load extension.js: ${err.message || err}`);
}

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


const inputDir = path.resolve(process.cwd(), flags.input || ".");
const outputDir = path.resolve(process.cwd(), flags.output || "dist");
const minify = !!flags.minify;
const watch = !!flags.watch;
const verbose = !!flags.verbose;

/* ----------------------------------------
 * UTILITIES
 * -------------------------------------- */

// Validate input directory exists
if (!fs.existsSync(inputDir)) {
  console.error(`✖ Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

try {
  fs.mkdirSync(outputDir, { recursive: true });
} catch (err) {
  console.error(`✖ Could not create output directory "${outputDir}": ${err.message || err}`);
  process.exit(1);
}

function getHTMLFiles(dir) {
  const out = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const full = path.join(dir, item);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (!item.startsWith(".") && !item.includes("node_modules")) {
            out.push(...getHTMLFiles(full));
          }
        } else if (item.endsWith(".html")) {
          out.push(full);
        }
      } catch (statErr) {
        console.warn(`⚠ Could not stat "${full}": ${statErr.message}. Skipping.`);
      }
    }
  } catch (readErr) {
    console.error(`✖ Could not read directory "${dir}": ${readErr.message}`);
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
  try {
    const dom = new JSDOM(html);
    const nodes = [...dom.window.document.querySelectorAll("[class]")];
    const set = new Set();
    nodes.forEach(el => {
      // className may be an SVGAnimatedString for SVG elements
      const classStr = typeof el.className === 'string' ? el.className : el.getAttribute('class') || '';
      classStr.split(/\s+/).filter(Boolean).forEach(c => set.add(c));
    });
    return [...set];
  } catch (err) {
    console.error(`✖ Failed to parse HTML for class extraction: ${err.message || err}`);
    return [];
  }
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
    errors: 0,
  };

  let htmlFiles;
  try {
    htmlFiles = getHTMLFiles(path.resolve(inputDir));
  } catch (err) {
    log.error(`Failed to scan for HTML files: ${err.message || err}`);
    return;
  }

  if (!htmlFiles.length) {
    log.warn("No HTML files found in input directory.");
    return;
  }

  // Compile @keyframes from config animations before processing any HTML
  try {
    tw.compileAnimations();
  } catch (err) {
    log.warn(`Could not compile animations: ${err.message || err}`);
  }

  for (const file of htmlFiles) {
    try {
      let html;
      try {
        html = fs.readFileSync(file, "utf8");
      } catch (readErr) {
        log.error(`Could not read "${file}": ${readErr.message}. Skipping.`);
        stats.errors++;
        continue;
      }

      const classes = extractClasses(html);
      if (classes.length === 0 && verbose) {
        log.info(`No classes found in ${path.relative(inputDir, file)}`);
      }

      const start = performance.now();
      tw.twApply(classes);
      const end = performance.now();

      let css = tw.getCSS();
      if (minify) {
        css = css.replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "").trim();
      }

      const rel = path.relative(path.resolve(inputDir), file);
      const outFile = path.join(outputDir, rel.replace(/\.html$/, ".css"));

      try {
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, css);
      } catch (writeErr) {
        log.error(`Could not write "${outFile}": ${writeErr.message}`);
        stats.errors++;
        continue;
      }

      const lines = css.split("\n").filter(l => l.trim()).length;

      stats.files++;
      stats.classes += classes.length;
      stats.cssLines += lines;
      stats.time += (end - start);

      if (verbose) {
        log.ok(`${rel} → ${path.relative(process.cwd(), outFile)} (${lines} lines)`);
      }

      tw.reset();
    } catch (fileErr) {
      log.error(`Unexpected error processing "${file}": ${fileErr.message || fileErr}`);
      stats.errors++;
    }
  }

  /* ----------------------------------------
   * SUMMARY OUTPUT
   * -------------------------------------- */

  log.title("Twigwind build");

  log.info(`Input      ${inputDir}`);
  log.info(`Output     ${outputDir}`);
  log.info(`HTML files ${stats.files}`);
  log.info(`Classes    ${stats.classes}`);
  log.info(`Time       ${stats.time.toFixed(2)} ms`);

  if (stats.errors > 0) {
    log.error(`${stats.errors} file(s) had errors during build.`);
  }

  if (tw.getErrors().length) {
    log.warn(`${tw.getErrors().length} Twigwind warnings found`);
    if (verbose) {
      tw.getErrors().forEach(w => log.warn(w));
    }
  }

  if (stats.errors === 0) {
    log.ok("Build completed successfully");
  } else {
    log.warn("Build completed with errors");
  }
}

/* ----------------------------------------
 * RUN / WATCH
 * -------------------------------------- */

try {
  build();
} catch (err) {
  log.error(`Build failed: ${err.message || err}`);
  if (verbose && err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
}

if (watch) {
  if (!chokidar) {
    log.error("--watch requires chokidar. Install it with: npm install chokidar");
    process.exit(1);
  }

  const root = path.resolve(inputDir);
  const cssSrc = path.resolve(__dirname, "src", "css.js");

  log.info(`👀 Watching ${root}`);
  log.info(`👀 Watching ${cssSrc}`);

  const watcher = chokidar.watch([root, cssSrc], { ignoreInitial: true });

  watcher.on("error", (err) => {
    log.error(`Watcher error: ${err.message || err}`);
  });

  watcher.on("all", (event, file) => {
    if (file.endsWith(".html") || file.endsWith("css.js")) {
      log.info(`🔄 ${event}: ${file}`);
      try {
        build();
      } catch (err) {
        log.error(`Rebuild failed: ${err.message || err}`);
      }
    }
  });
}
