# SENTINEL // OSINT Global Monitor

A single-file intelligence dashboard with live camera streams, a breaking news bar, a major news events map, and a military/naval asset map. No build tools, no dependencies to install, no backend required.

---

## Project Structure

```
OSI-Map/
├── index.html   ← The entire application
└── README.md
```

That's it. The whole app is one self-contained HTML file.

---

## Features

| Feature              | How                                                         |
|----------------------|-------------------------------------------------------------|
| Breaking news bar    | Sticky top bar, cycles 5 urgent items every 5 seconds       |
| Live cameras         | YouTube embeds via `<iframe>` inside a CSS grid             |
| News map             | Leaflet.js markers on a CartoDB dark tile layer             |
| Military map         | Leaflet.js layer groups (bases, fleets, hotspots)           |
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
- Sidebars stack vertically (order: left → center → right)
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

---

## Deployment

### Netlify Drop (fastest)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop `index.html` — live HTTPS URL in seconds

### GitHub Pages
1. Push to GitHub
2. Settings → Pages → source: `main` branch, root `/`

### Any static host
Upload `index.html` to your web root. Works on nginx, Apache, or any file server.

---

## Known Limitations

- **YouTube embedding**: Some streams block iframe embedding. Swap via ✏ CHANGE.
- **Camera changes are session-only**: Edit `CAMS` array for permanent changes.
- **News data is static**: Update `NEWS` array manually or connect a CORS-enabled API.
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
9. **Ticker content must be doubled** — always duplicate new spans in both halves
10. **Breaking news bar** cycles via `setInterval` — do not change the `#breaking-bar` structure
