import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { DATASET_NAMES, readJson, validateDataset } from './lib/data-core.mjs';

const root = process.cwd();
const generatedDir = path.join(root, 'data', 'generated');
const present = new Set((await readdir(generatedDir)).filter((name) => name.endsWith('.json')));
const failures = [];

for (const name of DATASET_NAMES) {
  const file = `${name}.json`;
  if (!present.has(file)) {
    failures.push(`${file}: missing`);
    continue;
  }
  const data = await readJson(path.join(generatedDir, file));
  for (const error of validateDataset(data, name)) failures.push(`${file}: ${error}`);
}

const health = await readJson(path.join(generatedDir, 'health.json'));
if (!health || health.schemaVersion !== 1 || !Array.isArray(health.sources)) {
  failures.push('health.json: invalid health manifest');
} else {
  const names = new Set();
  for (const source of health.sources) {
    if (!source.id || names.has(source.id)) failures.push(`health.json: duplicate or missing source id ${source.id || ''}`);
    names.add(source.id);
    if (!['ok', 'degraded', 'stale'].includes(source.status)) failures.push(`health.json: invalid status for ${source.id}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${DATASET_NAMES.length} datasets and health manifest.`);
}
