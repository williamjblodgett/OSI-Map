import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertSafeCount,
  dedupeItemsById,
  normalizeGdacs,
  normalizeReliefweb,
  normalizeUsqFeature,
  validateDataset
} from '../scripts/lib/data-core.mjs';

test('valid dataset passes validation', () => {
  const data = {
    schemaVersion: 1,
    dataset: 'headlines',
    generatedAt: '2026-07-26T12:00:00.000Z',
    dataAsOf: '2026-07-26T12:00:00.000Z',
    status: 'ok',
    source: { name: 'Example', url: 'https://example.com/feed' },
    items: [{ id: 'one', title: 'Title', url: 'https://example.com/one' }]
  };
  assert.deepEqual(validateDataset(data, 'headlines'), []);
});

test('validator rejects duplicate ids and unsafe URLs', () => {
  const data = {
    schemaVersion: 1,
    dataset: 'headlines',
    generatedAt: '2026-07-26T12:00:00.000Z',
    dataAsOf: '2026-07-26T12:00:00.000Z',
    status: 'ok',
    source: { name: 'Example', url: 'http://example.com/feed' },
    items: [
      { id: 'one', url: 'http://example.com/one' },
      { id: 'one', url: 'https://example.com/two' }
    ]
  };
  assert.ok(validateDataset(data, 'headlines').length >= 3);
});

test('record-count guard rejects a collapsed feed', () => {
  assert.throws(() => assertSafeCount([1], [1, 2, 3, 4, 5, 6, 7, 8], 'test'), /collapsed/);
});

test('feed deduplication keeps the first item for each deterministic id', () => {
  const newest = { id: 'rss-bbc-duplicate', title: 'Newest copy' };
  const older = { id: 'rss-bbc-duplicate', title: 'Older copy' };
  const unique = { id: 'rss-bbc-unique', title: 'Unique item' };

  assert.deepEqual(dedupeItemsById([newest, older, unique]), [newest, unique]);
});

test('USGS normalization preserves provenance fields', () => {
  const item = normalizeUsqFeature({
    id: 'us1',
    properties: { title: 'M 4.5', mag: 4.5, updated: 1785067200000, url: 'https://earthquake.usgs.gov/a' },
    geometry: { coordinates: [20, 10, 5] }
  });
  assert.equal(item.id, 'us1');
  assert.equal(item.lat, 10);
  assert.equal(item.lng, 20);
});

test('ReliefWeb normalization records publisher and country', () => {
  const item = normalizeReliefweb({
    id: 42,
    fields: {
      title: 'Situation report',
      url_alias: 'https://reliefweb.int/report/42',
      date: { original: '2026-07-26T00:00:00Z' },
      source: [{ name: 'UN OCHA' }],
      country: [{ name: 'Sudan' }]
    }
  });
  assert.equal(item.source, 'UN OCHA');
  assert.deepEqual(item.countries, ['Sudan']);
});

test('GDACS normalization rejects no coordinate assumptions', () => {
  const item = normalizeGdacs({
    properties: { eventid: 1, eventtype: 'TC', name: 'Cyclone', fromdate: '2026-07-26T00:00:00Z' },
    geometry: { coordinates: [120, 15] }
  });
  assert.equal(item.id, 'gdacs-tc-1');
  assert.equal(item.lat, 15);
});
