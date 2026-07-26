# SENTINEL // OSINT Global Monitor

An installable **PWA** intelligence dashboard with live camera streams, a live breaking news bar and ticker, a major news events map with a live GDELT layer, and a military/naval asset map. No build tools, no backend required.

---

## Project Structure

```
OSI-Map/
├── index.html            ← HTML shell
├── manifest.webmanifest  ← PWA manifest (install metadata)
├── sw.js                 ← Service worker (offline + caching)
├── data/
│   ├── curated/          ← human-reviewed records and review deadlines
│   └── generated/        ← validated, same-origin source snapshots
├── schemas/              ← published dataset contract
├── scripts/              ← refresh, validation, and review-report tools
├── test/                 ← Node test suite for normalization and guardrails
├── assets/
│   └── icons/            ← PWA icons (favicon.svg + generated PNGs)
├── css/
│   └── app.css           ← Application styles
├── js/
│   ├── app.js            ← Application logic and curated datasets
│   └── live.js           ← Live engine: refresh scheduler, PWA UX, GDELT layer
└── README.md
```

The app remains static-host friendly, but the HTML, CSS, and JavaScript are now split into maintainable files.

---

## Automated Data Refresh

The dashboard has two deliberately separate data lanes:

1. **Automated structured data** — USGS earthquakes, GDACS disaster alerts, BBC/Al Jazeera RSS headlines, CelesTrak catalog data, and optionally ReliefWeb reports. These are normalized into `data/generated/*.json`, validated, committed, and deployed automatically.
2. **Curated assessments** — conflict narratives, casualty figures, fleet estimates, nuclear inventories, and other interpretive records. Automation never rewrites these. `data/curated/dashboard.json` assigns a review deadline, and overdue records are added to the `data-review` GitHub issue.

The scheduled workflow runs every six hours, which exceeds the daily-refresh requirement. It also supports manual dispatch. If a source fails, the refresh:

- preserves the last-known-good records;
- retains the original `dataAsOf` value;
- records the failed `checkedAt` result in `health.json`;
- displays the source as degraded instead of making old data appear newly updated.

Run the pipeline locally:

```bash
npm run refresh
npm run check
```

ReliefWeb requires a pre-approved app name for API access. After approval, add it as the repository Actions variable `RELIEFWEB_APPNAME`. Until then, only the humanitarian dataset is marked degraded; the other feeds continue to publish.

### Published dataset contract

Every generated dataset contains:

- `schemaVersion`, `dataset`, and `status`;
- separate `generatedAt` and `dataAsOf` timestamps;
- an HTTPS source name and URL;
- stable, unique record IDs;
- normalized `items`.

The UI shows the age and health of the published snapshot and the number of curated records awaiting review. Runtime browser feeds may be newer, but they do not overwrite the persisted provenance timestamps.

---

## PWA

SENTINEL installs as an app (Chrome/Edge: **⬇ INSTALL** button in the header; iOS Safari: Share → *Add to Home Screen*) and works offline.

| Concern | Strategy (see `sw.js`) |
|---|---|
| App shell (HTML/CSS/JS/icons) | Precached; network-first with cache fallback |
| CDN libraries + fonts | Stale-while-revalidate |
| Map tiles (CartoDB) | Cache-first, capped at ~250 entries |
| Data APIs (USGS, CelesTrak, RSS proxies, GDELT) | Network-first, last-known-good fallback when offline |
| Live HLS video | Never cached — passthrough only |

Update flow: a new deploy triggers a pulsing **⟳ UPDATE** pill in the header; clicking it activates the new service worker and reloads. When connectivity drops, an amber **OFFLINE** banner appears and the status bar switches to `OFFLINE — CACHED`.

**Deploy note:** bump `CACHE_VERSION` in `sw.js` whenever shell assets change.

---

## Live Data

`js/live.js` runs a visibility-aware scheduler (paused while the tab is hidden, catch-up on return/reconnect):

- **World news RSS** (BBC / NYT / Al Jazeera via CORS proxy chain) — every 5 min. Live headlines rebuild the header ticker and replace the breaking-bar rotation with real, timestamped items linking to sources. Curated arrays remain the pre-fetch/offline fallback.
- **Published headline snapshot** (BBC World / Al Jazeera) — refreshed by GitHub Actions every 6 hours and served same-origin when browser-side RSS or its proxy chain is unavailable.
- **USGS seismic** — every 5 min.
- **GDELT GEO 2.0 live layer** — "● LIVE 24H" toggle on the news map; geolocated conflict/military media coverage from the past 24h, refreshed every 10 min while enabled.
- **Freshness chips** — every curated item renders a relative-age chip (`3H AGO`, `102D AGO`) and an explicit `STALE` marker after 14 days, so live and curated data can never be confused.
- The **defense spending counter** computes the current US fiscal year at runtime (budget lookup table in `js/app.js`) instead of hardcoding one.

---

## Features

| Feature              | How                                                         |
|----------------------|-------------------------------------------------------------|
| Installable PWA      | `manifest.webmanifest` + `sw.js`; works offline             |
| Breaking news bar    | Sticky top bar; live RSS headlines, cycles every 5 seconds  |
| Live header ticker   | Rebuilt from live world-news headlines (doubled spans)      |
| Live news map layer  | GDELT GEO 2.0, past-24h geolocated coverage, 10-min refresh |
| Freshness chips      | Relative-age + STALE badges on all curated content          |
| Alert attribution    | Breaking alerts show source and freshness metadata inline   |
| Live cameras         | YouTube embeds via `<iframe>` inside a CSS grid             |
| News map             | Leaflet.js markers on a CartoDB dark tile layer             |
| Military map         | Leaflet.js layer groups (bases, fleets, hotspots)           |
| Situation feed       | Curated OSINT snapshots rendered with source tags           |
| Mobile panel toggles | Left and right sidebars can be expanded on small screens    |
| Fonts                | Google Fonts CDN (Orbitron, Share Tech Mono, Rajdhani)      |
| Map tiles            | CartoDB dark_all via unpkg/cdnjs                            |
| Mobile responsive    | Sidebars stack vertically, 2-col camera grid, scroll tabs   |
| No server needed     | Pure client-side HTML/CSS/JS                                |

---

## Layout (Desktop)

```
┌────────────────────────────────────────────────────────────┐
│  ⚡ BREAKING NEWS BAR (sticky, cycles every 5s)             │
├──────────────┬─────────────────────────────┬───────────────┤
│  LEFT (262px)│  Header: SENTINEL logo +    │ RIGHT (262px) │
│              │  scrolling ticker + clock   │               │
│  Naval Assets│  ─────────────────────────  │  Situation    │
│  Carrier list│  Tab Bar                    │  Feed         │
│  Fleet list  │  CAMERAS│NEWS MAP│WORLD MAP │  ──────────── │
│  Sources     │  USA│FLEETS│HOTSPOTS        │  Camera       │
│              │  ─────────────────────────  │  Directory    │
│              │  Content area               │               │
│              │  ─────────────────────────  │               │
│              │  Status Bar                 │               │
└──────────────┴─────────────────────────────┴───────────────┘
```

The CSS grid controlling this is:
```css
#main { display: grid; grid-template-columns: 262px 1fr 262px; }
```

**Do not change** the `262px` values without also adjusting sidebar content padding.

---

## Mobile Layout

On screens ≤ 768px:
- Breaking news bar stays at the very top (sticky)
- Sidebars stack vertically and can be expanded with mobile panel buttons
- Tab bar scrolls horizontally
- Camera grid shows 2 columns

---

## CSS Variables (Color System)

```css
:root {
  --bg:      #030a0f;   /* Page background */
  --surface: #050f18;   /* Header, tab bar, status bar */
  --panel:   #06111c;   /* Sidebar backgrounds */
  --border:  #0d3348;   /* All dividers and borders */
  --accent:  #00d4ff;   /* Primary cyan — links, active states, titles */
  --red:     #ff4d00;   /* Alerts, conflict, high-alert status */
  --green:   #00ff88;   /* Live indicators, camera directory */
  --yellow:  #ffcc00;   /* Warnings, political events */
  --purple:  #cc44ff;   /* Security category, grid options */
  --orange:  #ff8800;   /* Overseas bases, disaster events */
  --text:    #b0cedd;   /* Body text */
  --dim:     #2e5265;   /* Muted / placeholder text */
  --dim2:    #4a7a8e;   /* Secondary labels */
}
```

---

## Camera System

Cameras are stored in the `CAMS` array:
```javascript
var CAMS = [
  { n: 'Times Square NYC', loc: '🇺🇸 New York', yt: '1-iZDMFP9c0' },
  // n = display name, loc = location label, yt = YouTube video ID
];
```

Camera sets (filter presets):
```javascript
var CAM_SETS = {
  world:   [0, 12, 6, 18, 15, 13],
  usa:     [0, 1, 2, 3, 4, 5],
  europe:  [6, 7, 8, 9, 10, 11],
  asia:    [12, 13, 14, 15, 16, 17],
  mideast: [18, 19, 20, 21, 6, 0],
};
```

Hover any camera cell → click **✏ CHANGE** to swap streams (session-only).

---

## News Map Events

```javascript
var NEWS = [
  {
    cat:   'CONFLICT',   // CONFLICT | POLITICAL | DIPLOMACY | DISASTER | SECURITY | ECONOMIC
    color: '#ff4d00',
    lat:   31.5,
    lng:   34.5,
    title: 'Gaza — Israel-Hamas War',
    body:  'Short summary shown in popup.',
    src:   'Reuters / Al Jazeera'
  },
];
```

Conflict detail modals now expose each event's `src` value so users can inspect the source attribution directly from the UI.

---

## Trust Model

- **Live data**: world-news RSS, GDELT map layer, satellite, seismic, and any explicitly marked live feeds
- **Cached data**: when offline, the service worker serves the last-known-good API responses (status bar shows `OFFLINE — CACHED`)
- **Curated snapshots**: situation feed items summarizing open-source reporting — each carries a relative-age chip and an automatic `STALE` badge after 14 days
- **Reference data**: manually maintained conflict, base, and history datasets

The dashboard is a **live + cached + curated** mix rather than a fully live wire service; the freshness chips make the distinction visible per item.

---

## Deployment

### Netlify Drop (fastest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop `index.html` — live HTTPS URL in seconds

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → source: **GitHub Actions**
3. The normal deploy workflow validates every push; the refresh workflow validates, commits, and deploys source snapshots on schedule.

### Any static host
Upload `index.html` to your web root. Works on nginx, Apache, or any file server.

---

## Known Limitations

- **YouTube embedding**: Some streams block iframe embedding. Swap via ✏ CHANGE.
- **Camera changes are session-only**: Edit `CAMS` array for permanent changes.
- **News map dossiers are curated**: the `NEWS` array is reference data; live geolocated coverage comes from the separate "● LIVE 24H" GDELT layer.
- **Sitrep items are curated**: Treat them as sourced summaries, not confirmed real-time telemetry (they now carry STALE badges when old).
- **CORS proxies are third parties**: RSS liveness depends on allorigins/corsproxy availability; the app degrades to curated fallbacks.
- **ReliefWeb approval**: API access requires a pre-approved `RELIEFWEB_APPNAME`; source health remains degraded until configured.
- **Automated reporting is not confirmation**: RSS and GDELT represent media or humanitarian reporting. GDACS and USGS records can also be revised after initial publication.
- **No authentication**: Public-facing page — do not add sensitive data.

---

## Instructions for AI Assistants

1. **Never change `grid-template-columns: 262px 1fr 262px`** on `#main`
2. **Never remove the duplicate ticker spans** — animation requires 2× content
3. **Never add a `<form>` tag** — use `addEventListener` only
4. **Never use `localStorage` or `sessionStorage`**
5. **Maps lazy-init on first tab click** — do not call map init functions at boot
6. **`invalidateSize()`** must be called after tab switch — wrap in `setTimeout(..., 200)`
7. **`GRID_STATE` always has 6 entries**
8. **Do not change CSS variable names**
9. **Ticker content must be doubled** — always duplicate new spans in both halves (`rebuildTicker()` in `js/live.js` already does this)
10. **Breaking news bar** cycles via `setInterval` — do not change the `#breaking-bar` structure
11. **Bump `CACHE_VERSION` in `sw.js`** whenever `index.html`, `css/app.css`, or `js/*.js` change, and keep `?v=` query params in sync
12. **All PWA paths must stay relative** (`./`) — the site deploys under the `/OSI-Map/` subpath on GitHub Pages
