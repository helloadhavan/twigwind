const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { JSDOM } = require("jsdom");

const { Twigwind } = require("./src/css.js");

// __dirname is available in CommonJS by default
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
const outputDir = flags.output || path.join(process.cwd(), "dist");;
const minify = !!flags.minify;
const watch = !!flags.watch;
const model = !!flags.model;


fs.mkdirSync(path.dirname(outputCSS), { recursive: true });

function getHTMLFiles(dir) {
  const out = [];
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const full = path.join(dir, item);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (!item.startsWith('.') && !item.includes('cache')) {
            continue;
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

function resetTwigwind() {
  // Reset internal state - these are private to the IIFE, so we can't directly access them
  // The framework will handle internal state management
}

function build() {
  resetTwigwind();

  const htmlFiles = getHTMLFiles(path.resolve(__dirname, inputDir));
  const all = new Set();

  console.log(`🔍 Scanning HTML files in: ${path.resolve(__dirname, inputDir)}`);
  console.log(`📁 Found ${htmlFiles.length} HTML files`);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    extractClasses(html).forEach(c => {all.add(c)
      Twigwind.applyUtilityClass(c);
    });
    const outputCSS = path.resolve(outputDir, file.replace(inputDir, "").replace(/\.html$/, ".css"));
    fs.writeFileSync(outputCSS, css);
    console.log(`🎨 Processing ${all.size} unique CSS classes`);
    let css = Twigwind.getCSS();
    const om = Twigwind.Object_Model();

    if (model) {
      const omPath = path.resolve(__dirname, outputDir, "twigwind-object-model.json");
      fs.writeFileSync(omPath, JSON.stringify(om, null, 2));
      console.log(`📄 Object model saved to: ${omPath}`);
    }

    if (minify) {
      css = css.replace(/\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "").trim();
      console.log(`🗜️  CSS minified`);
    }

    
    console.log(`📊 Generated ${css.split('\n').length} lines of CSS`);
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
