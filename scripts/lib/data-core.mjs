import { readFile } from 'node:fs/promises';

export const DATASET_NAMES = [
  'disasters',
  'earthquakes',
  'headlines',
  'humanitarian',
  'satellites'
];

export function isIsoDate(value) {
  return typeof value === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
    && !Number.isNaN(Date.parse(value));
}

export function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateDataset(data, expectedName) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['dataset must be an object'];
  if (data.schemaVersion !== 1) errors.push('schemaVersion must equal 1');
  if (data.dataset !== expectedName) errors.push(`dataset must equal ${expectedName}`);
  if (!isIsoDate(data.generatedAt)) errors.push('generatedAt must be an ISO UTC timestamp');
  if (!isIsoDate(data.dataAsOf)) errors.push('dataAsOf must be an ISO UTC timestamp');
  if (!['ok', 'degraded', 'stale'].includes(data.status)) errors.push('status is invalid');
  if (!data.source || typeof data.source.name !== 'string' || !data.source.name.trim()) {
    errors.push('source.name is required');
  }
  if (!data.source || !isHttpsUrl(data.source.url)) errors.push('source.url must use HTTPS');
  if (!Array.isArray(data.items)) errors.push('items must be an array');
  if (Array.isArray(data.items)) {
    const ids = new Set();
    for (const [index, item] of data.items.entries()) {
      if (!item || typeof item !== 'object') {
        errors.push(`items[${index}] must be an object`);
        continue;
      }
      if (typeof item.id !== 'string' || !item.id.trim()) errors.push(`items[${index}].id is required`);
      else if (ids.has(item.id)) errors.push(`duplicate item id: ${item.id}`);
      else ids.add(item.id);
      if (item.url !== undefined && !isHttpsUrl(item.url)) errors.push(`items[${index}].url must use HTTPS`);
      if (item.publishedAt !== undefined && !isIsoDate(item.publishedAt)) {
        errors.push(`items[${index}].publishedAt must be an ISO UTC timestamp`);
      }
      if (item.lat !== undefined && (!Number.isFinite(item.lat) || item.lat < -90 || item.lat > 90)) {
        errors.push(`items[${index}].lat is out of range`);
      }
      if (item.lng !== undefined && (!Number.isFinite(item.lng) || item.lng < -180 || item.lng > 180)) {
        errors.push(`items[${index}].lng is out of range`);
      }
    }
  }
  return errors;
}

export function assertSafeCount(nextItems, previousItems, name) {
  if (!Array.isArray(previousItems) || previousItems.length < 5) return;
  if (nextItems.length < Math.floor(previousItems.length * 0.25)) {
    throw new Error(`${name} record count collapsed from ${previousItems.length} to ${nextItems.length}`);
  }
}

export function dedupeItemsById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const id = item?.id;
    if (typeof id !== 'string' || !id.trim()) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

export function normalizeUsqFeature(feature) {
  const coordinates = feature?.geometry?.coordinates || [];
  const properties = feature?.properties || {};
  return {
    id: String(feature?.id || ''),
    title: String(properties.title || properties.place || 'Earthquake'),
    magnitude: Number(properties.mag),
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0]),
    depthKm: Number(coordinates[2]),
    publishedAt: new Date(Number(properties.updated || properties.time)).toISOString(),
    alert: properties.alert || null,
    url: String(properties.url || '')
  };
}

export function normalizeReliefweb(item) {
  const fields = item?.fields || {};
  const sources = Array.isArray(fields.source) ? fields.source.map((source) => source.name).filter(Boolean) : [];
  return {
    id: `reliefweb-${item.id}`,
    title: String(fields.title || 'Humanitarian report'),
    source: sources.join(' / ') || 'ReliefWeb',
    countries: Array.isArray(fields.country) ? fields.country.map((country) => country.name).filter(Boolean) : [],
    publishedAt: new Date(fields.date?.original || fields.date?.created).toISOString(),
    url: String(fields.url_alias || fields.url || item.href || '')
  };
}

export function normalizeGdacs(feature) {
  const properties = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates || [];
  const rawId = properties.eventid || properties.eventId || feature?.id;
  const eventType = properties.eventtype || properties.eventType || 'EVENT';
  const date = properties.fromdate || properties.fromDate || properties.datemodified || properties.datetime;
  return {
    id: `gdacs-${String(eventType).toLowerCase()}-${rawId}`,
    title: String(properties.name || properties.eventname || `${eventType} alert`),
    category: String(eventType),
    alertLevel: String(properties.alertlevel || properties.alertLevel || 'unknown').toLowerCase(),
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0]),
    publishedAt: new Date(date).toISOString(),
    url: String(properties.url?.report || properties.url || `https://www.gdacs.org/report.aspx?eventid=${rawId}&eventtype=${eventType}`)
  };
}
