const fs = require('fs');
const path = require('path');

const assetsJs = path.resolve(__dirname, '../assets/js/main.js');
const outCssDir = path.resolve(__dirname, '../assets/css');
const outCss = path.join(outCssDir, 'style.css');

if (!fs.existsSync(assetsJs)) {
  console.error('assets/js/main.js not found; build may have failed.');
  process.exit(1);
}

const js = fs.readFileSync(assetsJs, 'utf8');

// Try to find the first template literal assigned to .textContent for style tag
const match = js.match(/\.textContent\s*=\s*`([\s\S]*?)`/);

if (!match) {
  console.warn('No inlined CSS found in main.js.');
  process.exit(0);
}

const css = match[1];

if (!fs.existsSync(outCssDir)) fs.mkdirSync(outCssDir, { recursive: true });
fs.writeFileSync(outCss, css, 'utf8');
console.log('Wrote', path.relative(process.cwd(), outCss));
