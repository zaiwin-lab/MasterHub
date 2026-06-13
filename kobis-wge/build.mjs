// Builds a single self-contained dist/index.html (CSS + JS inlined).
// Usage: bun build.mjs   (or: npm run build, which calls bun)
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
mkdirSync('dist', { recursive: true });
execSync('bun build js/app.js --outfile dist/_bundle.js', { stdio: 'inherit' });
const css = readFileSync('css/styles.css','utf8') + '\n' + readFileSync('css/preview.css','utf8');
const bundle = readFileSync('dist/_bundle.js','utf8');
const tpl = readFileSync('index.html','utf8')
  .replace('<link rel="stylesheet" href="css/styles.css" />\n  <link rel="stylesheet" href="css/preview.css" />', `<style>\n${css}\n</style>`)
  .replace('<script src="config.js"></script>', `<script>window.KOBIS_CONFIG={supabaseUrl:"",supabaseAnonKey:""};</script>`)
  .replace('<script type="module" src="js/app.js"></script>', `<script type="module">\n${bundle}\n</script>`);
writeFileSync('dist/index.html', tpl);
import { rmSync } from 'fs'; rmSync('dist/_bundle.js');
console.log('dist/index.html written:', tpl.length, 'bytes');
