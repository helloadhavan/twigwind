// build.js
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { Twigwind } from "./src/css.js";
import chokidar from "chokidar";

// Ensure dist/ exists
const distDir = "./dist";
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log("📁 Directory 'dist/' created");
}

// Find all .html files in current folder
const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));

for (const file of files) {
  console.log(`🔨 Building ${file}...`);

  // Read HTML file
  const html = fs.readFileSync(file, "utf8");

  // Simulate DOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Apply Twigwind classes
  document.querySelectorAll("[class]").forEach(el => {
    Twigwind.twApply(el);
  });

  // Get generated CSS
  const cssOutput = Twigwind.getCSS();

  // Write CSS file (with same name as HTML)
  const cssFile = path.join(distDir, path.basename(file, ".html") + ".css");
  fs.writeFileSync(cssFile, cssOutput);

  console.log(`✅ ${cssFile} written`);
}

console.log("🎉 Build complete!");

const watcher = chokidar.watch(".", {
  ignored: /dist|node_modules/,
  persistent: true,
});

console.log("👀 Watching for HTML changes...");
watcher.on("change", (file) => {
  if (file.endsWith(".html")) {
    console.log(`♻️ Rebuilding due to ${file}...`);
    build(); // your main function
  }
});
