# Twigwind CSS Framework
[![npm](https://img.shields.io/badge/npm-red?logo=npm&logoColor=black)](https://www.npmjs.com/package/twigwind) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) [![](https://data.jsdelivr.com/v1/package/npm/twigwind/badge)](https://www.jsdelivr.com/package/npm/twigwind) ![GitHub stars](https://img.shields.io/github/stars/helloadhavan/twigwind?style=flat-square)

[![Twigwind Logo](https://raw.githubusercontent.com/helloadhavan/twigwind/refs/heads/main/twigwind.svg)](https://adhavan.zipyoda.com)

Twigwind is a small experiment in creating a utility-first CSS framework. The idea began while experimenting with the `document.querySelectorAll()` function. Many CSS frameworks, such as Tailwind, rely on statically generated CSS files with thousands of pre-built classes, later optimized through a purge process. Twigwind takes a different approach, envisioning a compiler-like engine that processes an HTML file and dynamically generates classes to support just-in-time (JIT) compilation and custom class support.

This project is in its early stages, being only a few months old, and is intended to explore new ideas and learnings in lightweight CSS frameworks.

## Who Is It For?
Twigwind might be interesting for:

- Anyone exploring alternative approaches to CSS frameworks
- Developers interested in just-in-time (JIT) class generation
- Those curious about integrating JavaScript with CSS utility frameworks
[Visit the Twigwind Website](https://twigwind.github.io) to see it in action or to contribute to its development.

## How to install it

for mannual installation clone this repo or run:
```bash
git clone https://github.com/helloadhavan/twigwind.git
```
If you want to play with this framework put this line `<script src="https://cdn.jsdelivr.net/npm/twigwind@4.0.3/src/css.min.js"></script>` into the head of the document and insert
```html
<script>
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[class]").forEach(el => Twigwind.twApply(el));
  Twigwind.twInject();
});
</script>
```

For CLI and build-time support install the offical npm package
```bash
npm install -g twigwind
```
---
If you liked this framework please star the repo

For the code, documentation, and detailed examples, refer to the [Twigwind website](https://twigwind.github.io).
 
