#!/usr/bin/env node
/**
 * 🌿 Twigwind CLI
 * A fast, runtime + build-time CSS framework command-line interface.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, "build.js");
const pkgPath = path.join(__dirname, "package.json");
const args = process.argv.slice(2);
const command = args[0] || "help";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[36m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

if (!fs.existsSync(buildPath)) {
  console.error(color.red("❌ build.js not found! Make sure you're in the Twigwind package folder."));
  process.exit(1);
}
switch (command) {
  case "build":
    console.log(color.green("🔨 Twigwind: Building CSS from HTML files..."));
    execSync(`node "${buildPath}"`, { stdio: "inherit" });
    break;

  case "watch":
    console.log(color.yellow("👀 Twigwind: Watching for file changes..."));
    execSync(`node "${buildPath}" --watch`, { stdio: "inherit" });
    break;

  case "version":
  case "-v":
  case "--version":
    console.log(color.blue(`Twigwind v${pkg.version}`));
    break;

  case "help":
  default:
    console.log(`
████████╗██╗    ██╗██╗██████╗ ██╗    ██╗██╗███╗   ██╗██████╗ 
╚══██╔══╝██║    ██║██║██╔══██╗██║    ██║██║████╗  ██║██╔══██╗
   ██║   ██║ █╗ ██║██║██║  ██║██║ █╗ ██║██║██╔██╗ ██║██║  ██║
   ██║   ██║███╗██║██║██║  ██║██║███╗██║██║██║╚██╗██║██║  ██║
   ██║   ╚███╔███╔╝██║██████╔╝╚███╔███╔╝██║██║ ╚████║██████╔╝
   ╚═╝    ╚══╝╚══╝ ╚═╝╚═════╝  ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝ 
Twigwind version ${pkg.version}    
🌿 ${color.green("Twigwind CLI")} — Dynamic + Build-Time CSS Framework

Usage:
  ${color.blue("twigwind build")}     Build CSS from your HTML files
  ${color.blue("twigwind watch")}     Watch for changes and rebuild automatically
  ${color.blue("twigwind version")}   Show CLI version

To learn more, visit: ${color.blue("https://twigwind.github.io/")}`);
    break;
}
