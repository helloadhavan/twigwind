#!/usr/bin/env node
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// __dirname is available in CommonJS by default
const args = process.argv.slice(2);

// Simple flag parser
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

const validCommands = ["build", "help", "version"];
const cmd = args[0] || "help";
const input = flags.input || ".";
const output = flags.output || "./dist";
const watch = flags.watch ? "--watch" : "";
const minify = flags.minify ? "--minify" : "";
const compress = flags.compress ? "--compress" : "";
const Object_Model = flags.s ? "--Object_Model" : "";
const verbose = flags.verbose ? "--verbose" : "";
const buildScript = path.join(__dirname, "build.cjs");

// Validate that the build script exists
if (!fs.existsSync(buildScript)) {
  console.error(`❌ Build script not found at: ${buildScript}`);
  console.error("   Ensure the package is installed correctly.");
  process.exit(1);
}

const command = `node ${buildScript} --input ${input} --output ${output} ${watch} ${minify} ${compress} ${Object_Model} ${verbose}`.trim();

console.log(`\n🌿 Twigwind running: ${command}\n`);
console.log(`
████████╗██╗    ██╗██╗ ██████╗ ██╗    ██╗██╗███╗   ██╗██████╗
╚══██╔══╝██║    ██║██║██╔════╝ ██║    ██║██║████╗  ██║██╔══██╗
   ██║   ██║ █╗ ██║██║██║  ███╗██║ █╗ ██║██║██╔██╗ ██║██║  ██║
   ██║   ██║███╗██║██║██║   ██║██║███╗██║██║██║╚██╗██║██║  ██║
   ██║   ╚███╔███╔╝██║╚██████╔╝╚███╔███╔╝██║██║ ╚████║██████╔╝
   ╚═╝    ╚══╝╚══╝ ╚═╝ ╚═════╝  ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝
by Adhavan Yuvaraj...
`);

if (cmd === "help") {
  console.log(`Usage: twigwind [command] [options]

Commands:
  build         Build the CSS from HTML files
  help          Show this help message
  version       Show version information

Options:
  --input       Input directory (default: src)
  --output      Output directory (default: dist)
  --minify      Minify the output CSS
  --watch       Watch for file changes and rebuild automatically
  -s            Generate Object Model

Example:
  twigwind build --input my-html --output my-css --minify --watch

visit https://twigwind.github.io for more information.
`);
  process.exit(0);
}

if (cmd === "version") {
  try {
    const json = require('./package.json');
    console.log(`Twigwind version ${json.version || 'unknown'}
dependencies:
${Object.keys(json.dependencies || {}).map(dep => `  ${dep}: ${json.dependencies[dep]}`).join("\n") || "  (none)"}`);
  } catch (err) {
    console.error(`❌ Could not read package.json: ${err.message || err}`);
  }
  process.exit(0);
}

// Handle unknown commands
if (!validCommands.includes(cmd)) {
  console.error(`❌ Unknown command: "${cmd}"`);
  console.error(`   Valid commands: ${validCommands.join(", ")}`);
  console.error(`   Run "twigwind help" for usage information.`);
  process.exit(1);
}

exec(command, { cwd: process.cwd(), timeout: 120000 }, (err, stdout, stderr) => {
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  if (err) {
    if (err.killed) {
      console.error("❌ Build process was killed (timeout or signal).");
    } else if (err.code === 'ENOENT') {
      console.error("❌ Node.js executable not found. Ensure Node.js is in your PATH.");
    } else {
      console.error("❌ Build process failed");
      console.error(`   Exit code: ${err.code || 'unknown'}`);
      if (verbose && err.stack) {
        console.error(err.stack);
      }
    }
    process.exit(err.code || 1);
  }
});