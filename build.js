#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const chokidar = require("chokidar");
const { Twigwind } = require("./src/css.js");

// 💡 1️⃣ Define a reusable build function
function build() {
  const distDir = "./dist";
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log("📁 Created dist/");
  }

  const files = fs.readdirSync(".").filter(f => f.endsWith(".html"));
  for (const file of files) {
    console.log(`🔨 Building ${file}...`);

    const html = fs.readFileSync(file, "utf8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    document.querySelectorAll("[class]").forEach(el => {
      Twigwind.twApply(el);
    });

    const cssOutput = Twigwind.getCSS();
    const cssFile = path.join(distDir, path.basename(file, ".html") + ".css");

    fs.writeFileSync(cssFile, cssOutput);
    console.log(`✅ ${cssFile} written`);
  }

  console.log("🎉 Build complete!\n");
}

console.log(`
████████╗██╗    ██╗██╗██████╗ ██╗    ██╗██╗███╗   ██╗██████╗ 
╚══██╔══╝██║    ██║██║██╔══██╗██║    ██║██║████╗  ██║██╔══██╗
   ██║   ██║ █╗ ██║██║██║  ██║██║ █╗ ██║██║██╔██╗ ██║██║  ██║
   ██║   ██║███╗██║██║██║  ██║██║███╗██║██║██║╚██╗██║██║  ██║
   ██║   ╚███╔███╔╝██║██████╔╝╚███╔███╔╝██║██║ ╚████║██████╔╝
   ╚═╝    ╚══╝╚══╝ ╚═╝╚═════╝  ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝   
  `)
// 💡 2️⃣ Run once immediately
build();

// 💡 3️⃣ Add optional watcher mode
if (process.argv.includes("--watch")) {
  console.log("👀 Watching for HTML changes...");
  const watcher = chokidar.watch(".", {
    ignored: /dist|node_modules/,
    persistent: true,
  });

  watcher.on("change", (file) => {
    if (file.endsWith(".html")) {
      console.log(`♻️ Rebuilding due to ${file}...`);
      build();
    }
  });
}
