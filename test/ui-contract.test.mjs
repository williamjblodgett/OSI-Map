import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../css/app.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('focus controls and compact trust strip are present', () => {
  for (const id of ['trust-strip', 'focus-bar', 'left-panel-btn', 'right-panel-btn', 'density-switch', 'panel-scrim']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('mobile intel layout is single-column', () => {
  const mobileBlock = css.slice(css.lastIndexOf('@media (max-width: 768px)'));
  assert.match(mobileBlock, /\.intel-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr;/);
});

test('adaptive dashboard cards enforce a readable minimum width', () => {
  assert.match(css, /repeat\(auto-fit,\s*minmax\(min\(100%,\s*340px\),\s*1fr\)\)/);
});

test('density and drawer controls expose callable behavior', () => {
  assert.match(app, /function setDensity\(mode\)/);
  assert.match(app, /function toggleIntelCard\(button\)/);
  assert.match(app, /function closePanels\(\)/);
});
