// ── LIVE ENGINE ──────────────────────────────────────────────────────────
// PWA registration, install/update UX, connectivity state, refresh scheduler,
// live ticker/breaking-bar wiring, and the GDELT live news-map layer.
// Loads after app.js and uses its globals (WORLD_NEWS, BREAKING, newsMap, …).

// ── SERVICE WORKER REGISTRATION + UPDATE PILL ────────────────────────────

(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (location.protocol !== 'https:' && !isLocal) return;

  navigator.serviceWorker.register('./sw.js').then(function (reg) {
    // Check for a newer deploy every 30 minutes while the app stays open
    setInterval(function () { reg.update().catch(function(){}); }, 30 * 60000);

    function watchInstalling(worker) {
      if (!worker) return;
      worker.addEventListener('statechange', function () {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdatePill(reg);
        }
      });
    }
    if (reg.waiting && navigator.serviceWorker.controller) showUpdatePill(reg);
    watchInstalling(reg.installing);
    reg.addEventListener('updatefound', function () { watchInstalling(reg.installing); });
  }).catch(function(){});

  var reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
})();

function showUpdatePill(reg) {
  var pill = document.getElementById('update-pill');
  if (!pill) return;
  pill.hidden = false;
  pill.onclick = function () {
    pill.textContent = 'UPDATING…';
    if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
  };
}

// ── INSTALL PROMPT ────────────────────────────────────────────────────────

(function installPrompt() {
  var deferredPrompt = null;
  var btn = document.getElementById('install-btn');
  if (!btn) return;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    btn.hidden = false;
  });

  btn.addEventListener('click', function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      btn.hidden = true;
    });
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    btn.hidden = true;
  });
})();

// ── CONNECTIVITY STATE ────────────────────────────────────────────────────

function syncConnectivity() {
  var online = navigator.onLine !== false;
  var banner = document.getElementById('offline-banner');
  if (banner) banner.hidden = online;
  var seg = document.getElementById('sb-conn');
  if (seg) {
    seg.innerHTML = online
      ? '<span class="s-dot live"></span><span style="color:var(--green)">LIVE + CURATED</span>'
      : '<span class="s-dot" style="background:var(--yellow)"></span><span style="color:var(--yellow)">OFFLINE — CACHED</span>';
  }
  document.body.classList.toggle('is-offline', !online);
}

window.addEventListener('online', function () { syncConnectivity(); runDueRefreshes(true); });
window.addEventListener('offline', syncConnectivity);
syncConnectivity();

// ── DATA-AGE STATUS SEGMENT ───────────────────────────────────────────────

function markDataRefreshed() {
  var el = document.getElementById('sb-data-age');
  if (!el) return;
  var now = new Date();
  el.textContent = 'DATA: '
    + String(now.getUTCHours()).padStart(2, '0') + ':'
    + String(now.getUTCMinutes()).padStart(2, '0') + ' UTC';
}

document.addEventListener('sentinel:newsupdated', markDataRefreshed);
document.addEventListener('sentinel:dataupdated', markDataRefreshed);

// ── REFRESH SCHEDULER ─────────────────────────────────────────────────────
// Visibility-aware: nothing refreshes while the tab is hidden; on return (or
// reconnect) anything past due refreshes immediately.

var REFRESH_TASKS = [
  { every: 5 * 60000, last: Date.now(), run: function () { refreshWorldNews(); } },
  { every: 5 * 60000, last: Date.now(), run: function () { refreshSeismic(); } },
  { every: 10 * 60000, last: Date.now(), run: function () { if (liveNewsEnabled) refreshGdeltLayer(); } },
];

function runDueRefreshes(force) {
  if (document.hidden) return;
  var now = Date.now();
  REFRESH_TASKS.forEach(function (task) {
    if (force || now - task.last >= task.every) {
      task.last = now;
      try { task.run(); } catch (e) {}
    }
  });
}

setInterval(function () { runDueRefreshes(false); }, 30000);
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) runDueRefreshes(false);
});

// ── LIVE TICKER + BREAKING BAR ────────────────────────────────────────────
// When real headlines arrive, replace the curated ticker/breaking content.
// The curated arrays remain the offline/pre-fetch fallback.

function rebuildTicker(items) {
  var inner = document.querySelector('.ticker-inner');
  if (!inner || !items.length) return;
  var half = items.slice(0, 12).map(function (item) {
    return '<span>' + escapeHtml(item.src.toUpperCase() + ': ' + item.title) + ' ◆ </span>';
  }).join('');
  // Ticker animation requires the content doubled — always write both halves.
  inner.innerHTML = half + half;
}

function mergeBreaking(items) {
  var live = items.slice(0, 8).map(function (item) {
    return {
      text: item.title,
      src: 'LIVE · ' + item.src,
      updated: item.date,
      link: item.link
    };
  });
  if (!live.length) return;
  BREAKING = live;
  breakingIdx = 0;
  cycleBraking();
}

document.addEventListener('sentinel:newsupdated', function () {
  var items = WORLD_NEWS.items || [];
  if (!items.length) return;
  rebuildTicker(items);
  mergeBreaking(items);
});

// ── GDELT LIVE NEWS MAP LAYER ─────────────────────────────────────────────
// Geolocated conflict/security coverage from the past 24h, rendered as its own
// Leaflet layer so it never mixes with the curated dossier markers.

var liveNewsEnabled = false;
var gdeltLayer = null;
var gdeltLastFetch = 0;

var GDELT_URL = 'https://api.gdeltproject.org/api/v2/geo/geo'
  + '?query=' + encodeURIComponent('(conflict OR military OR missile OR airstrike OR war OR troops)')
  + '&format=GeoJSON&timespan=24H&maxpoints=150';

function toggleLiveNews(btn) {
  liveNewsEnabled = !liveNewsEnabled;
  if (btn) btn.classList.toggle('active', liveNewsEnabled);
  if (!newsMap) return;
  if (liveNewsEnabled) {
    if (!gdeltLayer) gdeltLayer = L.layerGroup();
    gdeltLayer.addTo(newsMap);
    // Reuse markers for 10 minutes; refetch when older
    if (Date.now() - gdeltLastFetch > 10 * 60000) refreshGdeltLayer();
  } else if (gdeltLayer) {
    newsMap.removeLayer(gdeltLayer);
  }
}

function sanitizeGdeltArticles(html) {
  // properties.html is GDELT-generated markup; extract only safe links from it
  var out = [];
  try {
    var doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    var links = doc.querySelectorAll('a');
    for (var i = 0; i < links.length && out.length < 3; i++) {
      var href = links[i].getAttribute('href') || '';
      var label = (links[i].textContent || '').trim();
      if (/^https?:\/\//.test(href) && label) out.push({ href: href, label: label });
    }
  } catch (e) {}
  return out;
}

function refreshGdeltLayer() {
  if (!gdeltLayer) gdeltLayer = L.layerGroup();
  var status = document.getElementById('live-news-btn');
  fetchWithTimeout(GDELT_URL, 12000)
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (geo) {
      gdeltLastFetch = Date.now();
      gdeltLayer.clearLayers();
      (geo.features || []).forEach(function (f) {
        if (!f.geometry || f.geometry.type !== 'Point') return;
        var lng = f.geometry.coordinates[0];
        var lat = f.geometry.coordinates[1];
        if (typeof lat !== 'number' || typeof lng !== 'number') return;
        var props = f.properties || {};
        var count = props.count || 1;
        var marker = L.circleMarker([lat, lng], {
          radius: Math.min(4 + Math.log(count + 1) * 2, 12),
          fillColor: '#00ff88',
          color: '#00ff88',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.35
        });
        var articles = sanitizeGdeltArticles(props.html);
        var articleHtml = articles.map(function (a) {
          var label = a.label.length > 70 ? a.label.slice(0, 68) + '…' : a.label;
          return '<div class="popup-live-link"><a href="' + escapeHtml(a.href)
            + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + '</a></div>';
        }).join('');
        marker.bindPopup(
          '<div class="popup-cat" style="color:#00ff88">LIVE 24H · GDELT</div>'
          + '<div class="popup-title">' + escapeHtml(props.name || 'Unknown location') + '</div>'
          + '<div class="popup-body">' + count + ' geolocated media mention' + (count === 1 ? '' : 's') + ' in the past 24h</div>'
          + articleHtml
          + '<div class="popup-meta">SRC: GDELT GEO 2.0 · auto-refreshes every 10 min</div>'
        );
        gdeltLayer.addLayer(marker);
      });
      document.dispatchEvent(new CustomEvent('sentinel:dataupdated'));
      if (status) status.title = 'GDELT layer updated ' + new Date().toUTCString().slice(17, 25) + ' UTC';
    })
    .catch(function () {
      if (status) status.title = 'GDELT live layer unavailable — will retry on next refresh';
    });
}
