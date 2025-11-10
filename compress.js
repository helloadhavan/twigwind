const fs = require("fs");
const path = require("path");

function build() {
  const distDir = "./dist";
  if (!fs.existsSync(distDir)) {
    console.log("Error: dist/ directory does not exist.");
    process.exit(1);
  }
  
  const files = fs.readdirSync(distDir).filter(f => f.endsWith(".css"));
    for (const file of files) {
        console.log(`🔨 Compressing ${file}...`);
        const filePath = path.join(distDir, file);
        let oldcss = fs.readFileSync(filePath, "utf8");

        // Simple compression: remove comments and whitespace
        css = oldcss.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove comments
        css = css.replace(/\s+/g, ' '); // Collapse whitespace
        css = css.replace(/\s*([{}:;,])\s*/g, '$1'); // Remove space around symbols
        css = css.trim();

        fs.writeFileSync(filePath, css);
        console.log(`✅ ${file} compressed removed ${css.length - oldcss.length} bytes`);

    }

  console.log("🎉 Compression complete!\n");
}
build();