import path from 'node:path';
import { readJson } from './lib/data-core.mjs';

const queue = await readJson(path.join(process.cwd(), 'data', 'generated', 'review-queue.json'), {
  generatedAt: new Date().toISOString(),
  items: []
});

console.log('<!-- sentinel-data-review -->');
console.log('# SENTINEL data review queue');
console.log('');
console.log(`Generated: ${queue.generatedAt}`);
console.log('');
console.log('Automated feed snapshots continue to publish after validation. The records below are interpretive, disputed, or sensitive enough to require human review.');
console.log('');
if (!queue.items.length) {
  console.log('No curated records currently require review.');
} else {
  for (const item of queue.items) {
    console.log(`## ${item.title}`);
    console.log('');
    console.log(`- Record: \`${item.id}\``);
    console.log(`- Review deadline: ${item.reviewAfter}`);
    console.log(`- Reason: ${item.reason}`);
    for (const source of item.sources || []) console.log(`- Source: ${source}`);
    console.log('');
  }
}
