const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { JSDOM } = require("jsdom");
const logs = {opened: "", saved: "", files: [], preformance: [], success: true};
// Import Twigwind
const { Twigwind } = require("./src/css.js");const { log } = require("console");
;
const tw = Twigwind(); 

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].replace(/^--/, "");
    const next = args[i + 1];
    if (next && !next.startsWith("--")) {
      flags[key] = next;
      i++;
    } else {
      flags[key] = true;
    }
  }
}

const inputDir = flags.input || process.cwd();
const outputDir = flags.output || path.join(process.cwd(), "dist");
const minify = !!flags.minify;
const watch = !!flags.watch;
const model = !!flags.Object_Model;

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

function rgbColor(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`;
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
          // Recursively scan subdirectories (skip hidden and cache directories)
          if (!item.startsWith('.') && !item.includes('cache') && !item.includes('node_modules')) {
            out.push(...getHTMLFiles(full));
          }
        } else if (item.endsWith(".html")) {
          out.push(full);
        }
      } catch (err) {
        console.warn(`Warning: Could not access ${full}: ${err.message}`);
        continue;
      }
    }
  } catch (err) {
    console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
  }
  return out;
}

function extractClasses(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const nodes = [...document.querySelectorAll("[class]")];
  const set = new Set();

  for (const el of nodes) {
    el.className.split(/\s+/)
      .filter(Boolean)
      .forEach(c => set.add(c));
  }
  return [...set];
}

function build() {
  try {
    let per = 0;
    let num = 0;
    logs.opened = inputDir;
    logs.saved = outputDir;
    const htmlFiles = getHTMLFiles(path.resolve(inputDir));
    console.log(`🔍 Scanning HTML files in: ${path.resolve(inputDir)}`);
    console.log(`📁 Found ${htmlFiles.length} HTML files`);

    if (htmlFiles.length === 0) {
      console.log(`⚠️  No HTML files found in ${path.resolve(inputDir)}`);
      return;
    }

    for (const file of htmlFiles) { 
      const html = fs.readFileSync(file, "utf8");
      const classes = extractClasses(html);
      num = num + classes.length;
      const start = performance.now();
      tw.twApply(classes);
      const end = performance.now();
      const duration = end - start;
      per = per + duration;

      let css = tw.getCSS();
      
      if (minify) {
        css = css.replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "").trim();
        console.log(`🗜️  CSS minified`);
      }
      
      const relativePath = path.relative(path.resolve(inputDir), file);
      const outputCSS = path.join(outputDir, relativePath.replace(/\.html$/, ".css"));
      
      fs.mkdirSync(path.dirname(outputCSS), { recursive: true });
      
      fs.writeFileSync(outputCSS, css);
      console.log(`✅ Generated: ${path.relative(process.cwd(), outputCSS)}`);
      console.log(`📊 CSS contains ${css.split('\n').filter(line => line.trim()).length} lines`);
      tw.reset();
    }

    console.log(`${rgbColor(0, 255, 13)}Twigwind build completed successfully!\x1b[0m`);
    console.log(`📂 input directory: ${logs.opened}`);
    console.log(`💾 output directory: ${logs.saved}`);
  } catch (error) {
    console.error(`❌ Build failed: ${error.message}`);
  }
}

build();

if (watch) {
  const root = path.resolve(__dirname, inputDir);
  const srcPath = path.resolve(__dirname, "src", "css.js");

  console.log(`👀 Watching for changes in: ${root}`);
  console.log(`👀 Watching framework file: ${srcPath}`);

  chokidar.watch([root, srcPath], { ignoreInitial: true })
    .on("all", (event, filePath) => {
      if (filePath.endsWith(".html") || filePath.endsWith("css.js")) {
        console.log(`🔄 File changed: ${filePath}`);
        build();
      }
    });
}
