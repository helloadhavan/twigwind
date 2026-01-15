const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { JSDOM } = require("jsdom");

// Import Twigwind
const { Twigwind } = require("./src/css.js");

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
  let per = 0;
  const htmlFiles = getHTMLFiles(path.resolve(inputDir));
  console.log(`🔍 Scanning HTML files in: ${path.resolve(inputDir)}`);
  console.log(`📁 Found ${htmlFiles.length} HTML files`);

  if (htmlFiles.length === 0) {
    console.log(`⚠️  No HTML files found in ${path.resolve(inputDir)}`);
    return;
  }

  for (const file of htmlFiles) { 
    console.log(`\n🔄 Processing: ${path.relative(process.cwd(), file)}`);
    
    const html = fs.readFileSync(file, "utf8");
    const classes = extractClasses(html);
    
    console.log(`🎨 Found ${classes.length} CSS classes in this file`);

    const start = performance.now();
    Twigwind.twApply(classes);
    const end = performance.now();
    const duration = end - start;
      
    if (duration >= 1) {
      console.log(rgbColor(3, 173, 252) + `✓ Processing completed in ${duration.toFixed(2)} ms` + `\x1b[0m`);
    } else {
      console.log(rgbColor(3, 173, 252) + `✓ Processing completed in ${(duration * 1000).toFixed(2)} μs` + `\x1b[0m`);
    }
    per = per + duration;

    let css = Twigwind.getCSS();
    
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
    Twigwind.reset();
  }

  if (model) {
    console.log(`\n📄 Generating object model...`);
    const allClasses = new Set();
    
    for (const file of htmlFiles) {
      const html = fs.readFileSync(file, "utf8");
      extractClasses(html).forEach(cls => {
        allClasses.add(cls);
        try {
          Twigwind.applyUtilityClass(cls);
        } catch (error) {
          console.warn(`⚠️  Warning: Could not process class "${cls}" for object model: ${error.message}`);
        }
      });
    }
    
    const om = Twigwind.Object_Model();
    const omPath = path.join(outputDir, "twigwind-object-model.json");
    fs.writeFileSync(omPath, JSON.stringify(om, null, 2));
    console.log(`📄 Object model saved to: ${path.relative(process.cwd(), omPath)}`);
    console.log(`🔍 Total unique classes processed: ${allClasses.size}`);
  }

  console.log(`${rgbColor(3, 173, 252)}\n🎉 Build completed successfully in ${per.toFixed(2)} ms!\x1b[0m`);
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
