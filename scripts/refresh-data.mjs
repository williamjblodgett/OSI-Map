import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import {
  DATASET_NAMES,
  assertSafeCount,
  dedupeItemsById,
  normalizeGdacs,
  normalizeReliefweb,
  normalizeUsqFeature,
  readJson,
  validateDataset
} from './lib/data-core.mjs';

const root = process.cwd();
const outputDir = path.join(root, 'data', 'generated');
const curatedPath = path.join(root, 'data', 'curated', 'dashboard.json');
const now = new Date();
const generatedAt = now.toISOString();
await mkdir(outputDir, { recursive: true });

const SOURCES = {
  earthquakes: {
    name: 'USGS Earthquake Hazards Program',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
  },
  disasters: {
    name: 'Global Disaster Alert and Coordination System (GDACS)',
    url: gdacsUrl(now)
  },
  humanitarian: {
    name: 'ReliefWeb',
    url: reliefwebUrl(40, false)
  },
  headlines: {
    name: 'BBC World / Al Jazeera RSS',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
  },
  satellites: {
    name: 'CelesTrak',
    url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=JSON'
  }
};

function reliefwebUrl(limit, headlinesOnly) {
  const appname = process.env.RELIEFWEB_APPNAME || 'APPROVAL_REQUIRED';
  const filter = headlinesOnly ? '&filter[field]=headline' : '';
  return `https://api.reliefweb.int/v2/reports?appname=${encodeURIComponent(appname)}&limit=${limit}&preset=latest${filter}&fields[include][]=title&fields[include][]=url_alias&fields[include][]=date.original&fields[include][]=date.created&fields[include][]=source.name&fields[include][]=country.name`;
}

function gdacsUrl(date) {
  const to = date.toISOString().slice(0, 10);
  const from = new Date(date.getTime() - 7 * 86400000).toISOString().slice(0, 10);
  return `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;VO;DR;WF&fromdate=${from}&todate=${to}&alertlevel=red;orange;green`;
}

async function fetchJson(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': 'SENTINEL-OSI-Map/5.0' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/rss+xml, application/xml, text/xml', 'user-agent': 'SENTINEL-OSI-Map/5.0' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function parseRss(xml, sourceName) {
  return [...String(xml).matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match, index) => {
    const block = match[0];
    const field = (name) => decodeXml(block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1]).trim();
    const title = field('title');
    const url = field('link');
    const publishedAt = new Date(field('pubDate')).toISOString();
    return {
      id: `rss-${sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${createHash('sha256').update(url || `${title}-${index}`).digest('hex').slice(0, 20)}`,
      title,
      source: sourceName,
      countries: [],
      publishedAt,
      url
    };
  }).filter(validPublishedItem);
}

async function publishDataset(name, loader) {
  const target = path.join(outputDir, `${name}.json`);
  const previous = await readJson(target);
  let items;
  let dataAsOf = generatedAt;
  let status = 'ok';
  let error = null;
  try {
    items = await loader();
    assertSafeCount(items, previous?.items, name);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught);
    items = previous?.items || [];
    dataAsOf = previous?.dataAsOf || generatedAt;
    status = previous ? 'degraded' : 'stale';
  }
  const dataset = {
    schemaVersion: 1,
    dataset: name,
    generatedAt,
    dataAsOf,
    status,
    source: { name: SOURCES[name].name, url: SOURCES[name].url },
    items
  };
  const errors = validateDataset(dataset, name);
  if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
  await writeFile(target, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
  return {
    id: name,
    name: SOURCES[name].name,
    status,
    checkedAt: generatedAt,
    dataAsOf,
    recordCount: items.length,
    url: SOURCES[name].url,
    error
  };
}

const health = [];

health.push(await publishDataset('earthquakes', async () => {
  const data = await fetchJson(SOURCES.earthquakes.url);
  return (data.features || []).map(normalizeUsqFeature).filter(validGeoItem);
}));

health.push(await publishDataset('disasters', async () => {
  const data = await fetchJson(SOURCES.disasters.url);
  return (data.features || []).map(normalizeGdacs).filter(validGeoItem).slice(0, 100);
}));

health.push(await publishDataset('humanitarian', async () => {
  if (!process.env.RELIEFWEB_APPNAME) {
    throw new Error('RELIEFWEB_APPNAME is not configured; ReliefWeb requires pre-approval');
  }
  const data = await fetchJson(SOURCES.humanitarian.url);
  return (data.data || []).map(normalizeReliefweb).filter(validPublishedItem);
}));

health.push(await publishDataset('headlines', async () => {
  const feeds = [
    ['BBC World', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
    ['Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml']
  ];
  const results = await Promise.all(feeds.map(async ([name, url]) => parseRss(await fetchText(url), name)));
  const newestFirst = results.flat().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  return dedupeItemsById(newestFirst).slice(0, 40);
}));

health.push(await publishDataset('satellites', async () => {
  const data = await fetchJson(SOURCES.satellites.url);
  return (Array.isArray(data) ? data : []).map((item) => ({
    id: `norad-${item.NORAD_CAT_ID}`,
    title: String(item.OBJECT_NAME || item.OBJECT_ID || 'Catalog object'),
    catalogId: Number(item.NORAD_CAT_ID),
    objectId: item.OBJECT_ID || null,
    publishedAt: new Date(item.EPOCH).toISOString(),
    url: `https://celestrak.org/satcat/table-satcat.php?CATNR=${item.NORAD_CAT_ID}`
  })).filter(validPublishedItem);
}));

const curated = await readJson(curatedPath, { records: [] });
const reviewItems = (curated.records || []).filter((record) => {
  return record.reviewAfter && Date.parse(record.reviewAfter) <= now.getTime();
}).map((record) => ({
  id: record.id,
  title: record.title,
  reason: 'Review deadline has passed; retain as curated reference until a human verifies it.',
  reviewAfter: record.reviewAfter,
  sources: record.sources || []
}));

await writeFile(path.join(outputDir, 'health.json'), `${JSON.stringify({
  schemaVersion: 1,
  generatedAt,
  overall: health.every((entry) => entry.status === 'ok') ? 'ok' : 'degraded',
  sources: health
}, null, 2)}\n`, 'utf8');

await writeFile(path.join(outputDir, 'review-queue.json'), `${JSON.stringify({
  schemaVersion: 1,
  generatedAt,
  count: reviewItems.length,
  items: reviewItems
}, null, 2)}\n`, 'utf8');

console.log(`Refreshed ${DATASET_NAMES.length} datasets; ${reviewItems.length} curated records require review.`);

function validGeoItem(item) {
  return item.id && item.title && Number.isFinite(item.lat) && Number.isFinite(item.lng)
    && item.lat >= -90 && item.lat <= 90 && item.lng >= -180 && item.lng <= 180
    && item.url.startsWith('https://') && !Number.isNaN(Date.parse(item.publishedAt));
}

function validPublishedItem(item) {
  return item.id && item.title && item.url.startsWith('https://')
    && !Number.isNaN(Date.parse(item.publishedAt));
}
