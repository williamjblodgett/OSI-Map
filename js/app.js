// ── DATA ──────────────────────────────────────────────────────────────────

var BREAKING = [
  { text:"UKRAINE: Russian Tu-22M3 Backfire bombers launch Kh-22 cruise missile salvo — Kyiv layer defense engaged, 8 of 12 intercepted", src:"Curated from Reuters / ISW", updated:"AS OF 2026-03-22" },
  { text:"TAIWAN STRAIT: PLAN conducts unannounced 72-hour naval blockade drill — USS Ronald Reagan CSG repositions", src:"Curated from CSIS / USNI", updated:"AS OF 2026-03-22" },
  { text:"IRAN NUCLEAR: IAEA confirms 60% enrichment at Fordow — breakout timeline now estimated at 12 days per IAEA Board", src:"Curated from IAEA / Reuters", updated:"AS OF 2026-03-22" },
  { text:"RED SEA: Multi-axis Houthi attack — USS Gravely intercepts C-802 + 3 UAVs; MV Galaxy Leader crew still held", src:"Curated from Reuters / USNI", updated:"AS OF 2026-03-22" },
  { text:"NORTH KOREA: Hwasong-18 ICBM launched from mobile TEL — 69-min flight time, 1,000km altitude, fell in Japan EEZ", src:"Curated from KCNA-watch / Reuters", updated:"AS OF 2026-03-22" },
  { text:"CYBER: CISA emergency directive — APT41 campaign targeting power grid SCADA systems in 11 US states", src:"Curated from CISA", updated:"AS OF 2026-03-22" },
  { text:"ARCTIC: Russia activates Northern Fleet — 15 vessels depart Murmansk including Oscar-II SSGN Oryol", src:"Curated from Reuters / Barents Observer", updated:"AS OF 2026-03-22" },
  { text:"SPACE: China destroys own defunct weather satellite — debris field threatens US NRO constellation", src:"Curated from public reporting", updated:"SCENARIO / NEEDS VERIFICATION" }
];

var SITREP_FEED = [
  { time:'04:12 UTC', cls:'flash', text:'⚡ FLASH — KN-23 SRBM launch report from Sunchon; range figures require confirmation.', src:'Curated from Reuters / KCNA-watch', updated:'2026-03-22', confidence:'Unverified operational details' },
  { time:'03:58 UTC', cls:'conflict', text:'🔴 CONFLICT — Zaporizhzhia front exchange reported in open-source battlefield summaries.', src:'ISW / Reuters', updated:'2026-03-22', confidence:'Summary view, not live telemetry' },
  { time:'03:41 UTC', cls:'intel', text:'🟡 INTEL — PLAN surface combatants reported near the Taiwan median line.', src:'CSIS / Taiwan MND', updated:'2026-03-22', confidence:'Curated incident summary' },
  { time:'03:28 UTC', cls:'conflict', text:'🔴 CONFLICT — Red Sea interception reporting references US Navy escort operations.', src:'USNI / Reuters', updated:'2026-03-22', confidence:'Public reporting only' },
  { time:'03:10 UTC', cls:'intel', text:'🟡 INTEL — Murmansk submarine departure references regional naval monitoring coverage.', src:'Barents Observer / Janes', updated:'2026-03-22', confidence:'Needs source refresh' },
  { time:'02:54 UTC', cls:'cleared', text:'✅ CLEARED — Hormuz transit incident resolved; tanker movement resumed.', src:'Lloyd\'s List / Reuters', updated:'2026-03-22', confidence:'Curated shipping summary' },
  { time:'02:33 UTC', cls:'diplomatic', text:'🌐 DIPLOMATIC — NATO Article 4 consultation references regional security reporting.', src:'NATO / Reuters', updated:'2026-03-22', confidence:'Meeting summary' },
  { time:'02:17 UTC', cls:'flash', text:'⚡ FLASH — Alaska ADIZ intercept reporting cited in open-source aviation coverage.', src:'NORAD / Reuters', updated:'2026-03-22', confidence:'Headline summary only' },
  { time:'01:59 UTC', cls:'conflict', text:'🔴 CONFLICT — Kharkiv strike reporting aggregated from open-source incident logs.', src:'Reuters / local reporting', updated:'2026-03-22', confidence:'Battle damage figures may change' },
  { time:'01:42 UTC', cls:'intel', text:'🟡 INTEL — Satellite proximity concern summarized from public space-security commentary.', src:'Secure World Foundation / public reporting', updated:'2026-03-22', confidence:'Analytic summary, not official warning' },
  { time:'01:21 UTC', cls:'intel', text:'🟡 INTEL — IRGCN shadowing activity summarized from regional naval reporting.', src:'Reuters / CENTCOM statements', updated:'2026-03-22', confidence:'Approximate location context' },
  { time:'01:04 UTC', cls:'cleared', text:'✅ STATUS — Carrier location note retained as a curated open-source estimate only.', src:'USNI Fleet Tracker', updated:'2026-03-22', confidence:'Do not treat as precise real-time position' },
  { time:'00:48 UTC', cls:'diplomatic', text:'🌐 DIPLOMATIC — G7 sanctions coordination call reported in wire coverage.', src:'Reuters', updated:'2026-03-22', confidence:'Headline summary' },
  { time:'00:30 UTC', cls:'intel', text:'🟡 INTEL — Fordow monitoring interruption references public nuclear-watch reporting.', src:'IAEA / Reuters', updated:'2026-03-22', confidence:'Curated nuclear monitoring note' }
];

// src: 'hls' = HLS M3U8 live stream (played via HLS.js directly in <video> — no iframe, no X-Frame-Options issues)
// src: 'yt'  = YouTube video ID (manual user custom override only)
var CAMS = [
  // 0 — Al Jazeera English
  { n: 'Al Jazeera English', loc: '🌍 Global / Doha',   src: 'hls', id: 'https://live-hls-web-aje.getmesomejo.com/AJE/index.m3u8',                                                        site: 'https://www.aljazeera.com/live/' },
  // 1 — France 24 EN (official Akamai CDN, CORS-enabled)
  { n: 'France 24 English',  loc: '🇫🇷 Paris',          src: 'hls', id: 'https://static.france24.com/live/F24_EN_HI_HLS/live_web.m3u8',                                                   site: 'https://www.france24.com/en/live-news-stream/' },
  // 2 — DW News (Deutsche Welle official Akamai CDN, CORS-enabled)
  { n: 'DW News',            loc: '🇩🇪 Berlin',          src: 'hls', id: 'https://dwamdstream102.akamaized.net/hls/live/2015529/dwstream102/index.m3u8',                                    site: 'https://www.dw.com/en/media-center/live-tv/s-100825' },
  // 3 — Sky News
  { n: 'Sky News',           loc: '🇬🇧 London',          src: 'hls', id: 'https://skynews-i.akamaihd.net/hls/live/584520/skynewsdef/playlist.m3u8',                                        site: 'https://news.sky.com/watch-sky-news-live' },
  // 4 — Euronews EN
  { n: 'Euronews English',   loc: '🇪🇺 Europe',          src: 'hls', id: 'https://euronews-wrappers-prod.akamaized.net/hls/live/2076273/euronews/en/master.m3u8',                          site: 'https://www.euronews.com/live' },
  // 5 — TRT World
  { n: 'TRT World',          loc: '🇹🇷 Istanbul',        src: 'hls', id: 'https://trtworld.live.trt.com.tr/master.m3u8',                                                                   site: 'https://www.trtworld.com/watch' },
  // 6 — NHK World English (Akamai)
  { n: 'NHK World English',  loc: '🇯🇵 Tokyo',           src: 'hls', id: 'https://nhkworldlive-i.akamaihd.net/hls/live/511929/nhkworld/index.m3u8',                                        site: 'https://www3.nhk.or.jp/nhkworld/en/live/' },
  // 7 — Arirang TV South Korea (Samsung TV Plus CDN)
  { n: 'Arirang TV',         loc: '🇰🇷 Seoul',           src: 'hls', id: 'https://amdlive-ch01-samsungtvplus.akamaized.net/hls/live/2093402/ch01_live_samsungtvplus/master.m3u8',          site: 'https://www.arirang.com/live/' },
  // 8 — CGTN English
  { n: 'CGTN English',       loc: '🇨🇳 Beijing',         src: 'hls', id: 'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8',                                                    site: 'https://www.cgtn.com/live/' },
  // 9 — i24 News English
  { n: 'i24 News English',   loc: '🇮🇱 Tel Aviv',        src: 'hls', id: 'https://bcovlive-a.akamaihd.net/live002/na-northeast-1/6057955885001/playlist.m3u8',                             site: 'https://www.i24news.tv/en/tv/live' },
  // 10 — ABC News Live
  { n: 'ABC News Live',      loc: '🇺🇸 New York',        src: 'hls', id: 'https://abclive2-lh.akamaihd.net/i/abc_live05@590326/master.m3u8',                                              site: 'https://abcnews.go.com/Live' },
  // 11 — Al Jazeera Arabic
  { n: 'Al Jazeera Arabic',  loc: '🌍 Arabic / Doha',    src: 'hls', id: 'https://live-hls-web-aja.getmesomejo.com/AJA/index.m3u8',                                                        site: 'https://www.aljazeera.net/live/' },
];

var CAM_SETS = {
  world:   [0, 1, 2, 6, 7, 9],
  news:    [0, 1, 2, 3, 4, 5],
  asia:    [6, 7, 8, 9, 0, 5],
  us:      [10, 0, 1, 2, 3, 4],
  mideast: [9, 11, 0, 5, 6, 2],
};

var GRID_STATE = [0, 1, 2, 6, 7, 9];

var NEWS = [
  { cat:'CONFLICT',  color:'#ff4d00', lat:48.5, lng:35.0,
    slug:'ukraine',
    title:'Ukraine — Russo-Ukrainian War',
    body:'Heavy fighting across eastern front. Russian forces pushing near Kharkiv and Zaporizhzhia.',
    src:'ISW / Reuters', cas: 12654, casNote:'OHCHR verified civilian deaths; est. military total 150,000+',
    updated:'AS OF 2026-03-22', confidence:'MEDIUM', status:'High-intensity conventional war', risk:'SEVERE', theater:'Eastern and southern Ukraine',
    startDate: 'Feb 24, 2022 (full-scale invasion; conflict since 2014)',
    parties: ['Russia', 'Ukraine (NATO/EU-backed)'],
    battleLines: 'Active front line ~1,200 km from Kharkiv to Kherson. Russia occupies ~18% of Ukrainian territory including Crimea, Donbas, Zaporizhzhia, and Kherson oblasts. Bakhmut–Avdiivka salient heavily contested.',
    keyPoints: [
      'Drone and artillery attrition remain the dominant combat dynamic across the line of contact.',
      'Russian pressure is concentrated on eastern urban approaches and logistics nodes.',
      'Deep-strike exchanges against energy, air-defense, and Black Sea targets continue to shape escalation risk.'
    ],
    watchItems: [
      'Front-line movement around Pokrovsk, Kupiansk, and Zaporizhzhia axes.',
      'Air-defense missile availability and power-grid repair timelines.',
      'Any Russian strategic aviation or Black Sea Fleet posture change.'
    ],
    links: [
      { l:'ISW Daily Update', u:'https://www.understandingwar.org/backgrounder/ukraine-conflict-updates' },
      { l:'LiveUAMap', u:'https://liveuamap.com/' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Russo-Ukrainian_War' },
      { l:'UN OCHA Ukraine', u:'https://www.unocha.org/ukraine' },
      { l:'Reuters Ukraine', u:'https://www.reuters.com/world/europe/ukraine/' },
    ]},
  { cat:'CONFLICT',  color:'#ff4d00', lat:31.5, lng:34.5,
    slug:'gaza',
    title:'Gaza — Israel-Hamas Conflict',
    body:'Ongoing military operations in Gaza Strip. Ceasefire negotiations in Doha.',
    src:'Reuters / Al Jazeera', cas: 46899, casNote:'Gaza Ministry of Health / UNOCHA; ~70% women & children',
    updated:'AS OF 2026-03-22', confidence:'MEDIUM', status:'Urban warfare with extreme civilian harm', risk:'SEVERE', theater:'Gaza Strip / southern Israel / regional spillover',
    startDate: 'Oct 7, 2023',
    parties: ['Israel (IDF)', 'Hamas / Palestinian Islamic Jihad'],
    battleLines: 'IDF ground operations throughout Gaza Strip. Northern Gaza largely destroyed. Rafah crossing contested. Tunnel network targeted. Civilian displacement exceeds 1.7 million.',
    keyPoints: [
      'The conflict combines hostage dynamics, urban combat, and severe access constraints for civilians.',
      'Border crossings, fuel access, and aid inspection tempo drive humanitarian conditions day to day.',
      'Regional escalation risk persists through Lebanon, Red Sea, and direct Iran-Israel signaling.'
    ],
    watchItems: [
      'Ceasefire and hostage-negotiation movement in Doha or Cairo.',
      'Changes to Rafah and Kerem Shalom crossing throughput.',
      'Any shift from Gaza operations toward wider Israel-Lebanon or Iran-linked escalation.'
    ],
    links: [
      { l:'UN OCHA oPt', u:'https://www.unocha.org/occupied-palestinian-territory' },
      { l:'Al Jazeera Live', u:'https://www.aljazeera.com/where/israel/' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/2023_Israel%E2%80%93Hamas_war' },
      { l:'ACLED Gaza', u:'https://acleddata.com/israel-and-occupied-palestinian-territory/' },
      { l:'B\'Tselem', u:'https://www.btselem.org/' },
    ]},
  { cat:'CONFLICT',  color:'#ff4d00', lat:15.5, lng:32.5,
    title:'Sudan — Civil War',
    body:'SAF and RSF forces engaged across Khartoum and Darfur regions.',
    src:'Reuters / BBC', cas: 14000, casNote:'ACLED estimate; Darfur figures incomplete',
    startDate: 'Apr 15, 2023',
    parties: ['Sudan Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    battleLines: 'RSF controls most of Khartoum and Omdurman. SAF holds northeast and Port Sudan. El Fasher in North Darfur besieged — humanitarian access severely restricted.',
    links: [
      { l:'ACLED Sudan', u:'https://acleddata.com/sudan/' },
      { l:'Crisis Group', u:'https://www.crisisgroup.org/africa/horn-africa/sudan' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Sudanese_civil_war_(2023%E2%80%93present)' },
      { l:'UNHCR Sudan', u:'https://www.unhcr.org/countries/sudan' },
    ]},
  { cat:'CONFLICT',  color:'#ff4d00', lat:34.5, lng:69.2,
    title:'Afghanistan — Taliban / ISKP',
    body:'Sporadic fighting in northeastern provinces. Humanitarian situation deteriorating.',
    src:'AP / UN OCHA', cas: 3200, casNote:'UNAMA annual figure; underreported',
    startDate: 'Aug 15, 2021 (Taliban takeover; war since 2001)',
    parties: ['Taliban (ruling authority)', 'ISKP (IS-Khorasan)', 'NRF remnants'],
    battleLines: 'Taliban controls all 34 provinces. ISKP conducts asymmetric bombings in urban centers. No conventional front lines. NRF resistance minimal, largely in Panjshir Valley.',
    links: [
      { l:'UNAMA', u:'https://unama.unmissions.org/' },
      { l:'Long War Journal', u:'https://www.longwarjournal.org/archives/afghanistan' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Taliban_insurgency_(2021%E2%80%93present)' },
      { l:'ReliefWeb', u:'https://reliefweb.int/country/afg' },
    ]},
  { cat:'CONFLICT',  color:'#ff4d00', lat:9.0,  lng:7.5,
    title:'Nigeria — Boko Haram / ISWAP',
    body:'Continued insurgent activity in northeast Nigeria and Lake Chad basin.',
    src:'Reuters / AFP', cas: 4100, casNote:'ACLED 2024 est.; includes displacement deaths',
    startDate: 'Jul 2009 (Boko Haram insurgency)',
    parties: ['Nigerian Armed Forces', 'Boko Haram (JAS)', 'ISWAP', 'MNJTF (multinational)'],
    battleLines: 'ISWAP controls rural northeast Nigeria and Lake Chad islands. Military operations in Sambisa Forest. Civilian towns in Borno State frequently attacked. No fixed front lines.',
    links: [
      { l:'ACLED Nigeria', u:'https://acleddata.com/nigeria/' },
      { l:'Crisis Group', u:'https://www.crisisgroup.org/africa/west-africa/nigeria' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Boko_Haram_insurgency' },
      { l:'UNHCR Nigeria', u:'https://www.unhcr.org/countries/nigeria' },
    ]},
  { cat:'POLITICAL', color:'#ffcc00', lat:25.0, lng:121.5,
    title:'Taiwan Strait Tensions',
    body:'PLA Navy conducting large-scale exercises near median line. US 7th Fleet monitoring.',
    src:'Pentagon / CSIS',
    startDate: 'Ongoing (heightened since Aug 2022 Pelosi visit)',
    parties: ['China (PRC)', 'Taiwan (ROC)', 'USA (7th Fleet)'],
    battleLines: 'No active conflict. PLA exercises routinely cross median line. Taiwan Strait ~180 km wide. US carrier strike groups conducting FONOPS in region.',
    links: [
      { l:'CSIS China Power', u:'https://chinapower.csis.org/taiwan-strait/' },
      { l:'USNI News', u:'https://news.usni.org/category/fleet-tracker' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Taiwan_Strait_crisis' },
    ]},
  { cat:'POLITICAL', color:'#ffcc00', lat:38.0, lng:128.0,
    title:'Korean Peninsula',
    body:'North Korea tests ballistic missiles. US-ROK joint exercises underway.',
    src:'38North / Pentagon',
    startDate: 'Ongoing (armistice since Jul 1953; technically at war)',
    parties: ['North Korea (DPRK)', 'South Korea (ROK)', 'USA'],
    battleLines: 'DMZ — 250 km demilitarized zone along 38th parallel. No active combat. DPRK ICBM and SLBM tests ongoing. US-ROK joint exercises (FREEDOM SHIELD) conducted annually.',
    links: [
      { l:'38North', u:'https://www.38north.org/' },
      { l:'CSIS Korea Chair', u:'https://www.csis.org/programs/korea-chair' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Korean_conflict' },
    ]},
  { cat:'POLITICAL', color:'#ffcc00', lat:55.8, lng:37.6,
    title:'Russia — Moscow',
    body:'Kremlin announces mobilization expansion. Western sanctions escalating.',
    src:'Reuters / TASS',
    startDate: 'Ongoing (Ukraine war since Feb 2022)',
    parties: ['Russia', 'Western Alliance (sanctions/aid)'],
    battleLines: 'No direct NATO-Russia combat. Russia under 14+ sanction packages. Partial mobilization ongoing. Wagner Group/Africa Corps expanding in Sahel.',
    links: [
      { l:'Reuters Russia', u:'https://www.reuters.com/world/europe/russia/' },
      { l:'Kyiv Independent', u:'https://kyivindependent.com/' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Russian_invasion_of_Ukraine' },
    ]},
  { cat:'POLITICAL', color:'#ffcc00', lat:35.7, lng:51.4,
    slug:'iran',
    title:'Iran — Tehran',
    body:'Nuclear negotiations stalled. IRGC conducts regional proxy operations.',
    src:'Reuters / IAEA',
    updated:'AS OF 2026-03-22', confidence:'MEDIUM', status:'Regional escalation and nuclear-threshold crisis', risk:'HIGH', theater:'Iran / Iraq / Syria / Gulf / Red Sea / Levant',
    startDate: 'Ongoing (nuclear tensions since ~2002)',
    parties: ['Iran (IRGC / proxies)', 'USA / Israel / Gulf states'],
    battleLines: 'No direct conventional war. Iran enriching uranium to 60% purity. IRGC proxies active in Iraq, Syria, Yemen (Houthis), Lebanon (Hezbollah), Gaza (Hamas support).',
    keyPoints: [
      'Iran is best tracked as a multi-theater escalation problem, not a single front line.',
      'Nuclear monitoring access, proxy strike tempo, and Gulf shipping threats are the main decision drivers.',
      'A direct Iran-Israel exchange would quickly spill into energy markets, maritime security, and regional bases.'
    ],
    watchItems: [
      'IAEA reporting on stockpile growth and inspection access.',
      'Proxy-linked launches in Iraq, Syria, Yemen, or Lebanon.',
      'IRGCN signaling around Hormuz and commercial shipping.'
    ],
    links: [
      { l:'IAEA Iran Reports', u:'https://www.iaea.org/newscenter/focus/iran' },
      { l:'Crisis Group Iran', u:'https://www.crisisgroup.org/middle-east-north-africa/gulf-and-arabian-peninsula/iran' },
      { l:'Wikipedia', u:'https://en.wikipedia.org/wiki/Iran%E2%80%93United_States_relations' },
    ]},
  { cat:'DIPLOMACY', color:'#00d4ff', lat:48.9, lng:2.3,   title:'NATO Headquarters — Brussels',         body:'Emergency consultations on Baltic security following cable sabotage incidents.',               src:'NATO / Reuters' },
  { cat:'DIPLOMACY', color:'#00d4ff', lat:40.7, lng:-74.0, title:'UN Security Council — New York',       body:'Emergency session called on Middle East situation. Veto standoff continues.',                 src:'UN / Reuters' },
  { cat:'DIPLOMACY', color:'#00d4ff', lat:46.9, lng:7.5,   title:'G7 Summit Talks — Bern',               body:'Western leaders coordinate sanctions and military aid packages.',                            src:'Reuters / AFP' },
  { cat:'DISASTER',  color:'#ff8800', lat:35.7, lng:139.7, title:'Japan — Seismic Activity',              body:'Magnitude 6.2 earthquake off Tohoku coast. Tsunami advisory issued.',                       src:'USGS / JMA' },
  { cat:'DISASTER',  color:'#ff8800', lat:-8.3, lng:115.1, title:'Indonesia — Volcanic Activity',        body:'Mt. Agung elevated alert. Ash plume reaching 4,000m. Aviation warnings issued.',             src:'PVMBG / VAAC' },
  { cat:'DISASTER',  color:'#ff8800', lat:27.7, lng:85.3,  title:'Nepal — Monsoon Flooding',             body:'Severe flooding in Kathmandu Valley. Hundreds displaced, relief operations ongoing.',        src:'ReliefWeb / AP' },
  { cat:'SECURITY',  color:'#cc44ff', lat:51.5, lng:-0.1,  title:'UK — Cyber Threat Elevated',           body:'NCSC raises cyber threat level. State-sponsored attacks on critical infrastructure detected.',src:'NCSC / GCHQ' },
  { cat:'SECURITY',  color:'#cc44ff', lat:38.9, lng:-77.0, title:'US — Homeland Security Alert',         body:'DHS issues infrastructure protection bulletin. Increased monitoring of power grid.',          src:'DHS / CISA' },
  { cat:'ECONOMIC',  color:'#00ff88', lat:1.3,  lng:103.8, title:'Strait of Malacca — Shipping',         body:'Record throughput disrupted by Houthi Red Sea attacks rerouting traffic.',                   src:"Lloyd's / Reuters" },
  { cat:'ECONOMIC',  color:'#00ff88', lat:29.9, lng:32.6,  title:'Suez Canal — Traffic Disruption',      body:'40% reduction in canal traffic as shipping avoids Red Sea routes.',                          src:'SCA / Reuters' },
  { cat:'ECONOMIC',  color:'#00ff88', lat:22.3, lng:114.2, title:'Hong Kong — Financial Markets',        body:'Hang Seng volatile amid US-China trade tensions and tech sector controls.',                  src:'Bloomberg / Reuters' },
];

var TC = {
  HQ: '#ff4d00', Navy: '#00aaff', Marine: '#cc4400',
  Army: '#cc8800', AirForce: '#cc44ff', Classified: '#ff0066', Overseas: '#ff8800'
};

var BASES = [
  { n:'Pentagon (DoD HQ)',        lat:38.87,  lng:-77.06,  t:'HQ',         e:'🔴', d:'Department of Defense Headquarters — 26,000 personnel' },
  { n:'NSA Fort Meade',           lat:39.11,  lng:-76.77,  t:'Classified', e:'⬛', d:'National Security Agency headquarters — SIGINT operations' },
  { n:'CIA Langley',              lat:38.95,  lng:-77.15,  t:'Classified', e:'⬛', d:'Central Intelligence Agency headquarters' },
  { n:'Norfolk Naval Station',    lat:36.94,  lng:-76.30,  t:'Navy',       e:'⚓', d:'Largest naval station in the world — 75 ships, 134 aircraft' },
  { n:'Pearl Harbor',             lat:21.36,  lng:-157.96, t:'Navy',       e:'⚓', d:'INDOPACOM HQ — Pacific Fleet flagship base' },
  { n:'San Diego Naval Base',     lat:32.68,  lng:-117.14, t:'Navy',       e:'⚓', d:'Home of Pacific Fleet surface forces' },
  { n:'Bremerton (Puget Sound)',  lat:47.56,  lng:-122.62, t:'Navy',       e:'⚓', d:'Carrier maintenance and repair facility' },
  { n:'Yokosuka Naval Base',      lat:35.28,  lng:139.67,  t:'Overseas',   e:'🟠', d:'7th Fleet HQ — forward deployed carrier group' },
  { n:'Rota Naval Station',       lat:36.64,  lng:-6.35,   t:'Overseas',   e:'🟠', d:'NSA Rota — US Navy in Spain, 6th Fleet support' },
  { n:'Diego Garcia (BIOT)',      lat:-7.31,  lng:72.42,   t:'Overseas',   e:'🟠', d:'Joint UK-US base — B-2 staging, submarine support' },
  { n:'Camp Lemonnier (Djibouti)',lat:11.55,  lng:43.15,   t:'Overseas',   e:'🟠', d:'CJTF-HOA HQ — drone operations, counter-terrorism' },
  { n:'Al Udeid Air Base',        lat:25.12,  lng:51.31,   t:'Overseas',   e:'🟠', d:'CENTCOM FWD HQ — largest US air base in Middle East' },
  { n:'Ramstein Air Base',        lat:49.44,  lng:7.60,    t:'Overseas',   e:'🟠', d:'USAFE-AFAFRICA HQ — largest US overseas air base' },
  { n:'Kadena Air Base',          lat:26.36,  lng:127.77,  t:'Overseas',   e:'🟠', d:'Largest USAF base in Asia Pacific' },
  { n:'Guam (Andersen AFB)',      lat:13.58,  lng:144.93,  t:'AirForce',   e:'✈', d:'Strategic bomber hub — B-52, B-1 deployments' },
  { n:'Fort Liberty (Bragg)',     lat:35.14,  lng:-79.00,  t:'Army',       e:'🟡', d:'XVIII Airborne Corps HQ — 82nd Airborne' },
  { n:'Fort Campbell',            lat:36.67,  lng:-87.47,  t:'Army',       e:'🟡', d:'101st Airborne Division (Air Assault)' },
  { n:'Fort Wainwright',          lat:64.83,  lng:-147.72, t:'Army',       e:'🟡', d:'US Army Alaska — Arctic warfare operations' },
  { n:'Camp Humphreys',           lat:36.96,  lng:127.04,  t:'Overseas',   e:'🟠', d:'Largest US overseas military base — USFK HQ' },
  { n:'Incirlik Air Base',        lat:37.00,  lng:35.43,   t:'Overseas',   e:'🟠', d:'NATO base in Turkey — nuclear weapons storage site' },
  { n:'RAF Lakenheath',           lat:52.41,  lng:0.56,    t:'Overseas',   e:'🟠', d:'USAF in UK — F-35A wing, NATO nuclear role' },
  { n:'MCAS Kaneohe Bay',         lat:21.45,  lng:-157.77, t:'Marine',     e:'🔴', d:'III Marine Expeditionary Force forward element' },
  { n:'Vandenberg SFB',           lat:34.74,  lng:-120.57, t:'AirForce',   e:'✈', d:'USSF Western Range — ICBM testing, satellite launches' },
  { n:'Cheyenne Mountain',        lat:38.74,  lng:-104.85, t:'Classified', e:'⬛', d:'NORAD/USNORTHCOM alternate command center' },
];

var FLEETS = [
  { n:'2nd Fleet', lat:45,  lng:-40,  d:'North Atlantic — reformed 2018, NATO high north operations' },
  { n:'5th Fleet', lat:26,  lng:56,   d:'Persian Gulf / Arabian Sea / Indian Ocean — Bahrain HQ' },
  { n:'6th Fleet', lat:40,  lng:15,   d:'Mediterranean Sea — Naples HQ, NATO maritime operations' },
  { n:'7th Fleet', lat:18,  lng:130,  d:'W. Pacific — largest forward-deployed fleet, Yokosuka HQ' },
  { n:'3rd Fleet', lat:30,  lng:-130, d:'Eastern Pacific — San Diego HQ, homeland defense' },
  { n:'4th Fleet', lat:15,  lng:-75,  d:'Caribbean and South America — Mayport FL HQ' },
];

var HOTS = [
  { n:'Taiwan Strait',           lat:24,  lng:120, d:'PLA military exercises — highest naval tension zone' },
  { n:'South China Sea',         lat:12,  lng:115, d:'Competing territorial claims — FONOPS ongoing' },
  { n:'Korean Peninsula',        lat:38,  lng:128, d:'North Korean missile threat — US-ROK readiness' },
  { n:'Eastern Ukraine Front',   lat:48,  lng:37,  d:'Active conflict zone — Russo-Ukrainian War' },
  { n:'Baltic Sea',              lat:58,  lng:20,  d:'NATO-Russia tension — submarine activity elevated' },
  { n:'Strait of Hormuz',        lat:26.5,lng:56.5,d:'Iranian threat to oil shipping — IRGCN activity' },
  { n:'Red Sea / Bab el-Mandeb', lat:13,  lng:43,  d:'Houthi anti-ship missiles — USN escort operations' },
  { n:'Black Sea',               lat:43,  lng:34,  d:'Russian naval operations — grain corridor disputes' },
  { n:'Arctic (High North)',     lat:78,  lng:15,  d:'Russian Arctic militarization — NATO monitoring' },
  { n:'Sahel Region',            lat:14,  lng:5,   d:'Jihadist insurgency expansion — French forces withdrawing' },
];

// ── STATE ─────────────────────────────────────────────────────────────────

var currentTab     = 'cameras';
var breakingIdx    = 0;
var modalCell      = -1;
var newsMapInited  = false;
var milMapInited   = false;
var newsMap        = null;
var milMap         = null;
var newsMarkers    = [];
var baseLayer      = null;
var fleetLayer     = null;
var hotLayer       = null;

// ── SATELLITE STATE ────────────────────────────────────────────────────────
var satMap          = null;
var satMapInited    = false;
var satLayer        = null;
var satObjects      = {};
var satFilters      = { ISS:true, CHINA:true, BEIDOU:true, GLONASS:true, MILITARY:true, IRAN_DPRK:true };
var satUpdateTimer  = null;
var satLoadedGroups = 0;
var satTotalGroups  = 0;
var overheadLat     = 38.9;
var overheadLng     = -77.0;
var overheadMode    = false;
var DEFAULT_CURATED_DATE = '2026-03-22';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function newsUpdated(ev) {
  return ev.updated || DEFAULT_CURATED_DATE;
}

function newsConfidence(ev) {
  if (ev.confidence) return ev.confidence;
  if (ev.casNote) return 'Reported figures may be disputed or incomplete';
  return 'Curated open-source summary';
}

function newsCasualtyLabel(ev) {
  if (!ev.cas) return '';
  return 'REPORTED CASUALTIES';
}

function toFiniteNumber(value) {
  var num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

function renderIntelLinks(links, className) {
  return (links || []).map(function(link) {
    return '<a class="' + className + '" href="' + escapeHtml(link.u) + '" target="_blank" rel="noopener noreferrer">'
      + escapeHtml(link.l) + '</a>';
  }).join('');
}

var THEATER_STATUS = [
  {
    city: 'Kyiv',
    level: 'partial',
    summary: 'Power grid under strain after recurring strikes; rail and government networks remain functional.',
    detail: 'Power partial · telecom stable · air defense high use',
    updated: '2026-03-22',
    source: 'Reuters / Ukrenergo / ISW'
  },
  {
    city: 'Gaza',
    level: 'critical',
    summary: 'Medical access, fuel, and civilian movement remain severely constrained across the strip.',
    detail: 'Power critical · telecom intermittent · crossings constrained',
    updated: '2026-03-22',
    source: 'UN OCHA / Reuters'
  },
  {
    city: 'Tehran',
    level: 'stable',
    summary: 'Domestic infrastructure stable, but regional proxy posture and shipping risk keep the theater elevated.',
    detail: 'Power stable · telecom stable · Hormuz risk elevated',
    updated: '2026-03-22',
    source: 'Reuters / Crisis Group / IAEA'
  },
  {
    city: 'Taipei',
    level: 'stable',
    summary: 'Civil infrastructure normal; readiness focus remains maritime and air warning rather than internal disruption.',
    detail: 'Power stable · telecom stable · PLA pressure monitored',
    updated: '2026-03-22',
    source: 'Taiwan MND / Reuters / CSIS'
  },
  {
    city: 'Seoul',
    level: 'stable',
    summary: 'Metro systems and telecom remain normal while missile-warning and drill posture stay elevated.',
    detail: 'Power stable · telecom stable · missile alert posture raised',
    updated: '2026-03-22',
    source: 'Reuters / ROK MND'
  }
];

var SOURCE_RELIABILITY = [
  {
    name: 'Reuters',
    state: 'live',
    summary: 'Primary wire service for conflict headlines and sanctions reporting.',
    updated: 'Daily refresh',
    note: 'Fast but still requires theater-specific corroboration.'
  },
  {
    name: 'ISW',
    state: 'curated',
    summary: 'High-value Ukraine and Russia campaign analysis.',
    updated: 'Daily',
    note: 'Analytic product, not raw live telemetry.'
  },
  {
    name: 'USGS',
    state: 'live',
    summary: 'Stable public feed for seismic and geological incidents.',
    updated: 'Minutes',
    note: 'Best live environmental source in the dashboard.'
  },
  {
    name: 'CelesTrak',
    state: 'live',
    summary: 'Reliable orbital element source for satellite tracking.',
    updated: 'Hours',
    note: 'Suitable for catalog-level situational awareness.'
  },
  {
    name: 'NOAA SWPC',
    state: 'stale',
    summary: 'Live browser parsing removed from this card due to fragile multi-endpoint behavior.',
    updated: 'Manual only',
    note: 'Keep as linked reference, not required runtime data.'
  },
  {
    name: 'Weather',
    state: 'reference',
    summary: 'General weather overlays moved out of core dashboard flow.',
    updated: 'On demand',
    note: 'Use external map links when atmospheric context is needed.'
  }
];

function intelPillClass(level) {
  var normalized = String(level || '').toLowerCase();
  if (normalized === 'critical') return 'critical';
  if (normalized === 'degraded') return 'degraded';
  if (normalized === 'partial') return 'partial';
  if (normalized === 'stable') return 'stable';
  if (normalized === 'live') return 'live';
  if (normalized === 'curated') return 'curated';
  if (normalized === 'reference') return 'reference';
  if (normalized === 'stale') return 'stale';
  return 'reference';
}

function conflictChipClass(level) {
  var normalized = String(level || '').toLowerCase();
  if (normalized === 'severe') return 'severe';
  if (normalized === 'high') return 'high';
  if (normalized === 'moderate' || normalized === 'medium') return 'mod';
  return 'quiet';
}

function syncMobilePanelButtons() {
  var leftBtn = document.querySelector('.mobile-panel-btn[onclick="togglePanel(\'left\')"]');
  var rightBtn = document.querySelector('.mobile-panel-btn[onclick="togglePanel(\'right\')"]');
  if (leftBtn) leftBtn.classList.toggle('active', document.body.classList.contains('left-panel-open'));
  if (rightBtn) rightBtn.classList.toggle('active', document.body.classList.contains('right-panel-open'));
}

function togglePanel(side) {
  document.body.classList.toggle(side + '-panel-open');
  syncMobilePanelButtons();
}

var SAT_SOURCES = [
  // ISS / crewed stations
  { key:'ISS',      color:'#00ff88', radius:7, max:5,
    url:'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle' },
  // Chinese military / intelligence / recon satellites (cataloged by CelesTrak)
  { key:'CHINA',    color:'#ff2200', radius:5, max:80,
    url:'https://celestrak.org/NORAD/elements/gp.php?GROUP=chinese&FORMAT=tle' },
  // Chinese BeiDou navigation constellation
  { key:'BEIDOU',   color:'#ff8800', radius:4, max:55,
    url:'https://celestrak.org/NORAD/elements/gp.php?GROUP=beidou&FORMAT=tle' },
  // Russian GLONASS navigation constellation (use glo-ops, not glonass-ops)
  { key:'GLONASS',  color:'#ffcc00', radius:4, max:30,
    url:'https://celestrak.org/NORAD/elements/gp.php?GROUP=glo-ops&FORMAT=tle' },
  // Miscellaneous military (US, RUS, other nations)
  { key:'MILITARY', color:'#ff9900', radius:5, max:80,
    url:'https://celestrak.org/NORAD/elements/gp.php?GROUP=military&FORMAT=tle' },
  // Iran & DPRK active satellites (fetched individually by NORAD ID)
  // Iran: Noor-2(51954), Noor-3(57962), Khayyam(53370)
  // DPRK: KMS-4(41332), Malligyong-1/Chollima-1(58400)
  { key:'IRAN_DPRK', color:'#cc44ff', radius:6, max:20,
    noradIds:[51954, 57962, 53370, 41332, 58400] },
];

// ── HISTORY STATE ────────────────────────────────────────────────────────
var histMap       = null;
var histMapInited = false;
var histLayer     = null;
var histYear      = 1944;
var histCatFilter = 'ALL';
var HIST_WINDOW   = 20;  // ±years shown on map around selected year

// ── BREAKING NEWS ─────────────────────────────────────────────────────────

function cycleBraking() {
  var item = BREAKING[breakingIdx];
  document.getElementById('breaking-text').innerHTML =
    '<span>' + escapeHtml(item.text) + '</span>' +
    '<span class="breaking-detail">[' + escapeHtml(item.src + ' · ' + item.updated) + ']</span>';
  breakingIdx = (breakingIdx + 1) % BREAKING.length;
}
cycleBraking();
setInterval(cycleBraking, 5000);

function renderSituationFeed() {
  var feed = document.getElementById('situation-feed');
  if (!feed) return;
  feed.innerHTML = SITREP_FEED.map(function(item) {
    return '<div class="feed-item ' + escapeHtml(item.cls) + '">' +
      '<div class="feed-main"><span class="feed-time">[' + escapeHtml(item.time) + ']</span>' + escapeHtml(item.text) + '</div>' +
      '<div class="feed-meta">SOURCE: ' + escapeHtml(item.src) + ' · UPDATED: ' + escapeHtml(item.updated) + ' · ' + escapeHtml(item.confidence) + '</div>' +
    '</div>';
  }).join('');
}

renderSituationFeed();
syncMobilePanelButtons();

function renderConflictTab(slug) {
  var item = NEWS.find(function(entry) { return entry.slug === slug; });
  var container = document.getElementById('conflict-pane-' + slug);
  if (!item || !container) return;

  var parties = (item.parties || []).map(function(party) {
    return '<span class="conflict-party">' + escapeHtml(party) + '</span>';
  }).join('');
  var keyPoints = (item.keyPoints || []).map(function(point) {
    return '<div class="conflict-list-item">' + escapeHtml(point) + '</div>';
  }).join('');
  var watchItems = (item.watchItems || []).map(function(point) {
    return '<div class="conflict-list-item">' + escapeHtml(point) + '</div>';
  }).join('');
  var casualtyValue = item.cas ? item.cas.toLocaleString() : 'VARIES';
  var casualtyMeta = item.casNote ? escapeHtml(item.casNote) : 'No stable single-source casualty total.';

  container.innerHTML = ''
    + '<div class="conflict-hero">'
    +   '<div class="conflict-overline">ACTIVE CONFLICT DOSSIER</div>'
    +   '<div class="conflict-title-row">'
    +     '<div>'
    +       '<h2 class="conflict-title">' + escapeHtml(item.title) + '</h2>'
    +       '<div class="conflict-summary">' + escapeHtml(item.body) + '</div>'
    +     '</div>'
    +     '<div class="conflict-badges">'
    +       '<span class="conflict-chip ' + conflictChipClass(item.risk) + '">' + escapeHtml(item.risk || 'WATCH') + '</span>'
    +       '<span class="conflict-chip mod">' + escapeHtml(item.status || 'ACTIVE') + '</span>'
    +       '<span class="conflict-chip quiet">' + escapeHtml(newsConfidence(item)) + ' CONF.</span>'
    +     '</div>'
    +   '</div>'
    +   '<div class="conflict-kpis">'
    +     '<div class="conflict-kpi"><div class="conflict-kpi-label">THEATER</div><div class="conflict-kpi-value">' + escapeHtml(item.theater || 'Regional') + '</div></div>'
    +     '<div class="conflict-kpi"><div class="conflict-kpi-label">START DATE</div><div class="conflict-kpi-value">' + escapeHtml(item.startDate || 'Ongoing') + '</div></div>'
    +     '<div class="conflict-kpi"><div class="conflict-kpi-label">SOURCE BASE</div><div class="conflict-kpi-value">' + escapeHtml(item.src || 'Curated') + '</div></div>'
    +     '<div class="conflict-kpi"><div class="conflict-kpi-label">' + escapeHtml(newsCasualtyLabel(item) || 'REPORTED IMPACT') + '</div><div class="conflict-kpi-value">' + casualtyValue + '</div></div>'
    +   '</div>'
    + '</div>'
    + '<div class="conflict-grid">'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">BATTLE LINES</h3>'
    +     '<div class="conflict-card-copy">' + escapeHtml(item.battleLines || item.body || 'No battle-line summary yet.') + '</div>'
    +     '<div class="conflict-meta-line">UPDATED: ' + escapeHtml(newsUpdated(item)) + '</div>'
    +   '</section>'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">PRIMARY ACTORS</h3>'
    +     '<div class="conflict-party-list">' + parties + '</div>'
    +     '<div class="conflict-meta-line">CASUALTY NOTE: ' + casualtyMeta + '</div>'
    +   '</section>'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">KEY POINTS</h3>'
    +     '<div class="conflict-list">' + keyPoints + '</div>'
    +   '</section>'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">WATCH LIST</h3>'
    +     '<div class="conflict-list">' + watchItems + '</div>'
    +   '</section>'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">SOURCES</h3>'
    +     '<div class="conflict-link-list">' + renderIntelLinks(item.links || [], 'conflict-link') + '</div>'
    +   '</section>'
    +   '<section class="conflict-card">'
    +     '<h3 class="conflict-card-title">ANALYST NOTE</h3>'
    +     '<div class="conflict-card-copy">This tab is curated from open reporting, not a live battlefield feed. Use it as an operational context page and validate key claims against the linked source set before treating any movement or casualty figure as current.</div>'
    +   '</section>'
    + '</div>';
}

function renderConflictTabs() {
  ['ukraine', 'gaza', 'iran'].forEach(renderConflictTab);
}

renderConflictTabs();

// ── CLOCK ─────────────────────────────────────────────────────────────────

function updateClock() {
  var now  = new Date();
  var hh   = String(now.getUTCHours()).padStart(2,'0');
  var mm   = String(now.getUTCMinutes()).padStart(2,'0');
  var ss   = String(now.getUTCSeconds()).padStart(2,'0');
  var time = hh + ':' + mm + ':' + ss;
  var days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var dateStr = days[now.getUTCDay()] + ' ' +
                String(now.getUTCDate()).padStart(2,'0') + ' ' +
                months[now.getUTCMonth()] + ' ' +
                now.getUTCFullYear() + ' UTC';
  document.getElementById('clock-time').textContent = time;
  document.getElementById('clock-date').textContent = dateStr;
  document.getElementById('status-utc').textContent = time + ' UTC';
}
updateClock();
setInterval(updateClock, 1000);

// ── TAB SWITCHING ─────────────────────────────────────────────────────────

function setTab(mode) {
  currentTab = mode;
  document.querySelectorAll('.tab-pane').forEach(function(p){ p.classList.remove('active'); });
  var pane = document.getElementById('tab-' + mode);
  if (pane) pane.classList.add('active');

  // Nav sidebar highlight
  document.querySelectorAll('.nav-item').forEach(function(item){ item.classList.remove('active'); });
  var navItem = document.getElementById('nav-' + mode);
  if (navItem) navItem.classList.add('active');

  document.getElementById('status-tab').textContent = mode.toUpperCase();

  if (window.innerWidth <= 768) {
    document.body.classList.remove('left-panel-open');
    document.body.classList.remove('right-panel-open');
    syncMobilePanelButtons();
  }

  if (mode === 'newsmap' && !newsMapInited) { setTimeout(initNewsMap, 100); }
  if ((mode === 'worldmap' || mode === 'usa' || mode === 'fleets' || mode === 'hotspots') && !milMapInited) { setTimeout(initMilMap, 100); }
  if (mode === 'satellites' && !satMapInited) { setTimeout(initSatMap, 100); }
  if (mode === 'history'    && !histMapInited) { setTimeout(initHistMap, 100); }

  if (milMapInited && (mode === 'worldmap' || mode === 'usa' || mode === 'fleets' || mode === 'hotspots')) {
    setTimeout(function(){ placeMilMap(mode); }, 50);
  }

  // Satellite timer: only run when tab is active
  if (mode === 'satellites') {
    if (satMapInited && !satUpdateTimer) satUpdateTimer = setInterval(updateSatPositions, 30000);
  } else {
    if (satUpdateTimer) { clearInterval(satUpdateTimer); satUpdateTimer = null; }
  }

  setTimeout(function(){
    if (newsMap && mode === 'newsmap') newsMap.invalidateSize();
    if (milMap && (mode === 'worldmap'||mode==='usa'||mode==='fleets'||mode==='hotspots')) milMap.invalidateSize();
    if (satMap && mode === 'satellites') satMap.invalidateSize();
    if (histMap && mode === 'history') histMap.invalidateSize();
  }, 200);
}

function toggleNav() {
  var expanded = document.body.classList.toggle('nav-expanded');
  document.getElementById('nav-toggle').textContent = expanded ? '✕' : '☰';
  setTimeout(function(){
    if (newsMap) newsMap.invalidateSize();
    if (milMap)  milMap.invalidateSize();
    if (satMap)  satMap.invalidateSize();
  }, 250);
}

// ── NEWS MAP ──────────────────────────────────────────────────────────────

function initNewsMap() {
  if (newsMapInited) return;
  newsMapInited = true;

  newsMap = L.map('news-map', {
    center: [20, 10],
    zoom: 2,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(newsMap);

  NEWS.forEach(function(ev, i) {
    var marker = L.circleMarker([ev.lat, ev.lng], {
      radius: 9,
      fillColor: ev.color,
      color: ev.color,
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.7
    });
    var casHtml = ev.cas
      ? '<div class="popup-cas"><span class="popup-cas-icon">☠</span> ' + newsCasualtyLabel(ev) + ': <strong>' +
        ev.cas.toLocaleString() + '+</strong><span class="popup-cas-note"> ' + (ev.casNote||'') + '</span></div>'
      : '';
    var metaHtml = '<div class="popup-meta">SRC: ' + escapeHtml(ev.src || 'Open-source compilation') + '<br>UPDATED: ' + escapeHtml(newsUpdated(ev)) + ' · ' + escapeHtml(newsConfidence(ev)) + '</div>';
    var detailBtn = (ev.links && ev.links.length)
      ? '<div style="margin-top:8px;"><button onclick="openConflictModal(' + i + ')" ' +
        'style="font-family:\'Share Tech Mono\',monospace;font-size:11px;color:' + ev.color + ';' +
        'background:none;border:1px solid ' + ev.color + ';border-radius:3px;padding:3px 10px;cursor:pointer;' +
        'transition:background 0.15s;" onmouseover="this.style.background=\'' + ev.color + '\';this.style.color=\'#000\';" ' +
        'onmouseout="this.style.background=\'none\';this.style.color=\'' + ev.color + '\';">DETAILS ▶</button></div>'
      : '';
    marker.bindPopup(
      '<div class="popup-cat" style="color:'+ev.color+'">'+ev.cat+'</div>' +
      '<div class="popup-title">'+ev.title+'</div>' +
      '<div class="popup-body">'+ev.body+'</div>' +
      casHtml +
      metaHtml +
      detailBtn
    );
    marker._newscat = ev.cat;
    marker.addTo(newsMap);
    newsMarkers.push(marker);
  });

  newsMap.invalidateSize();
}

function filterNews(cat, btn) {
  document.querySelectorAll('#news-filter-bar .mf-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  newsMarkers.forEach(function(m){
    if (cat === 'ALL' || m._newscat === cat) {
      if (!newsMap.hasLayer(m)) m.addTo(newsMap);
    } else {
      if (newsMap.hasLayer(m)) newsMap.removeLayer(m);
    }
  });
}

// ── MILITARY MAP ──────────────────────────────────────────────────────────

var milMapEl = null;

function initMilMap() {
  if (milMapInited) return;
  milMapInited = true;

  // Move the map element into the worldmap tab
  milMapEl = document.getElementById('mil-map');
  var worldWrap = document.querySelector('#tab-worldmap .map-wrap');
  worldWrap.insertBefore(milMapEl, worldWrap.querySelector('.map-legend'));

  milMap = L.map('mil-map', {
    center: [20, 10],
    zoom: 2,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(milMap);

  // Bases layer
  baseLayer = L.layerGroup();
  BASES.forEach(function(b){
    var col = TC[b.t] || '#ffffff';
    var marker = L.circleMarker([b.lat, b.lng], {
      radius: 7,
      fillColor: col,
      color: col,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });
    marker.bindPopup(
      '<div class="popup-title">'+b.e+' '+b.n+'</div>' +
      '<div class="popup-cat" style="color:'+col+'">'+b.t+'</div>' +
      '<div class="popup-body">'+b.d+'</div>'
    );
    marker.addTo(baseLayer);
  });

  // Fleets layer
  fleetLayer = L.layerGroup();
  FLEETS.forEach(function(f){
    var marker = L.circleMarker([f.lat, f.lng], {
      radius: 18,
      fillColor: '#00aaff',
      color: '#00aaff',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.15,
      dashArray: '5,5'
    });
    var label = L.marker([f.lat, f.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="font-family:Share Tech Mono,monospace;font-size:10px;color:#00aaff;text-shadow:0 0 6px #000;white-space:nowrap;transform:translateX(-50%);padding-top:22px;">'+f.n+'</div>',
        iconSize: [0,0]
      })
    });
    marker.bindPopup('<div class="popup-title">'+f.n+'</div><div class="popup-body">'+f.d+'</div>');
    marker.addTo(fleetLayer);
    label.addTo(fleetLayer);
  });

  // Hotspots layer
  hotLayer = L.layerGroup();
  HOTS.forEach(function(h){
    var marker = L.circleMarker([h.lat, h.lng], {
      radius: 22,
      fillColor: '#ff4d00',
      color: '#ff4d00',
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.12,
      dashArray: '4,4'
    });
    var label = L.marker([h.lat, h.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="font-family:Share Tech Mono,monospace;font-size:9px;color:#ff4d00;text-shadow:0 0 6px #000;white-space:nowrap;transform:translateX(-50%);padding-top:26px;">'+h.n+'</div>',
        iconSize: [0,0]
      })
    });
    marker.bindPopup('<div class="popup-title" style="color:#ff4d00">'+h.n+'</div><div class="popup-body">'+h.d+'</div>');
    marker.addTo(hotLayer);
    label.addTo(hotLayer);
  });

  // Default: show all
  baseLayer.addTo(milMap);
  fleetLayer.addTo(milMap);
  hotLayer.addTo(milMap);

  milMap.invalidateSize();
}

function placeMilMap(mode) {
  if (!milMapEl) return;
  var targets = {
    worldmap: '#tab-worldmap .map-wrap',
    usa:      '#tab-usa .map-wrap',
    fleets:   '#tab-fleets .map-wrap',
    hotspots: '#tab-hotspots .map-wrap'
  };
  var wrap = document.querySelector(targets[mode]);
  if (!wrap) return;
  if (!wrap.contains(milMapEl)) {
    wrap.insertBefore(milMapEl, wrap.firstChild);
  }

  // Adjust layers and zoom
  if (mode === 'worldmap') {
    baseLayer.addTo(milMap); fleetLayer.addTo(milMap); hotLayer.addTo(milMap);
    milMap.setView([20, 10], 2);
  } else if (mode === 'usa') {
    baseLayer.addTo(milMap);
    if (milMap.hasLayer(fleetLayer)) milMap.removeLayer(fleetLayer);
    if (milMap.hasLayer(hotLayer)) milMap.removeLayer(hotLayer);
    milMap.setView([38, -97], 4);
  } else if (mode === 'fleets') {
    if (milMap.hasLayer(baseLayer)) milMap.removeLayer(baseLayer);
    fleetLayer.addTo(milMap);
    if (milMap.hasLayer(hotLayer)) milMap.removeLayer(hotLayer);
    milMap.setView([20, 10], 2);
  } else if (mode === 'hotspots') {
    if (milMap.hasLayer(baseLayer)) milMap.removeLayer(baseLayer);
    if (milMap.hasLayer(fleetLayer)) milMap.removeLayer(fleetLayer);
    hotLayer.addTo(milMap);
    milMap.setView([20, 10], 2);
  }

  setTimeout(function(){ milMap.invalidateSize(); }, 200);
}

// ── CAMERA GRID ───────────────────────────────────────────────────────────

function camSrc(cam) {
  // For HLS sources, return the M3U8 URL (used by HLS.js, not as iframe src)
  if (cam.src === 'hls') return cam.id;
  // YouTube video ID (manual custom override)
  return 'https://www.youtube.com/embed/' + cam.id +
         '?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0';
}

// Kept for manual YouTube entry (updateCell / confirmCamChange)
function ytSrc(id) { return camSrc({ src: 'yt', id: id }); }

function checkVideoAvailability(cam, cellIdx) {
  var fb = document.getElementById('fb-' + cellIdx);
  if (!fb) return;
  fb.style.display = 'none'; // HLS.js fatal error handler will show fallback if stream fails
}

function renderGrid(indices) {
  GRID_STATE = indices.slice(0, 6);
  var grid = document.getElementById('cam-grid');
  if (!grid) return;
  grid.innerHTML = '';
  GRID_STATE.forEach(function(idx, cellIdx) {
    var cam = CAMS[idx];
    var cell = document.createElement('div');
    cell.className = 'cam-cell';
    var mediaEl = cam.src === 'hls'
      ? '<video id="cam-video-' + cellIdx + '" autoplay muted playsinline controls></video>'
      : '<iframe src="' + camSrc(cam) + '" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    cell.innerHTML =
      '<div class="cam-header">' +
        '<span class="cam-loc">' + cam.loc + '</span>' +
        '<button class="cam-change-btn" onclick="openModal(' + cellIdx + ')">✏ CHANGE</button>' +
      '</div>' +
      '<div class="cam-frame-wrap">' +
        '<div class="cam-fallback" id="fb-' + cellIdx + '">' +
          '<span class="cam-fallback-text">STREAM UNAVAILABLE</span>' +
          '<a class="cam-fallback-link" href="' + (cam.site || '#') + '" target="_blank" rel="noopener">▶ WATCH ON SITE</a>' +
        '</div>' +
        mediaEl +
      '</div>' +
      '<div class="cam-name">' + cam.n + '</div>';
    grid.appendChild(cell);
    checkVideoAvailability(cam, cellIdx);
  });
  initHlsCells();
}

function initHlsCells() {
  if (typeof Hls === 'undefined') return;
  GRID_STATE.forEach(function(idx, cellIdx) {
    var cam = CAMS[idx];
    if (!cam || cam.src !== 'hls') return;
    var video = document.getElementById('cam-video-' + cellIdx);
    if (!video) return;
    var url = cam.id;
    if (Hls.isSupported()) {
      var hls = new Hls({ autoStartLoad: true, startLevel: -1, maxBufferLength: 10 });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function(event, data) {
        if (data.fatal) {
          var fb = document.getElementById('fb-' + cellIdx);
          if (fb) fb.style.display = 'flex';
          if (video) video.style.display = 'none';
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url; // Safari native HLS
    } else {
      var fb = document.getElementById('fb-' + cellIdx);
      if (fb) fb.style.display = 'flex';
      if (video) video.style.display = 'none';
    }
  });
}

function attachHls(video, url, cellIdx) {
  if (typeof Hls === 'undefined') return;
  if (Hls.isSupported()) {
    var hls = new Hls({ autoStartLoad: true, startLevel: -1, maxBufferLength: 10 });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, function(event, data) {
      if (data.fatal) {
        var fb = document.getElementById('fb-' + cellIdx);
        if (fb) fb.style.display = 'flex';
        if (video) video.style.display = 'none';
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  }
}

function setCamSet(setKey, btn) {
  document.querySelectorAll('.cam-filter-bar .filter-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderGrid(CAM_SETS[setKey] || CAM_SETS.world);
}

// Initial render
renderGrid(GRID_STATE);

// ── CAMERA MODAL ──────────────────────────────────────────────────────────

function openModal(cellIdx) {
  modalCell = cellIdx;
  document.getElementById('cam-url-input').value = '';
  buildPresetGrid();
  document.getElementById('cam-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('cam-modal').style.display = 'none';
  modalCell = -1;
}

function extractVideoId(input) {
  input = input.trim();
  // Try URL patterns
  var m = input.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // Try direct 11-char ID
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  return null;
}

function confirmCamChange() {
  var input = document.getElementById('cam-url-input').value;
  var vid = extractVideoId(input);
  if (!vid) { alert('Invalid YouTube URL or video ID.'); return; }
  updateCell(modalCell, vid, input || vid, input || vid);
  closeModal();
}

function updateCell(cellIdx, ytId, name, loc) {
  GRID_STATE[cellIdx] = -1; // custom
  // Update iframe in grid
  var cells = document.querySelectorAll('.cam-cell');
  if (cells[cellIdx]) {
    var iframe = cells[cellIdx].querySelector('iframe');
    if (iframe) iframe.src = ytSrc(ytId);
    var locEl = cells[cellIdx].querySelector('.cam-loc');
    if (locEl) locEl.textContent = loc || name || ytId;
    var nameEl = cells[cellIdx].querySelector('.cam-name');
    if (nameEl) nameEl.textContent = name || ytId;
  }
  closeModal();
}

function selectPreset(camIdx) {
  if (modalCell < 0) return;
  var cam = CAMS[camIdx];
  GRID_STATE[modalCell] = camIdx;
  var cells = document.querySelectorAll('.cam-cell');
  if (cells[modalCell]) {
    var wrap = cells[modalCell].querySelector('.cam-frame-wrap');
    if (wrap) {
      var old = wrap.querySelector('iframe, video');
      if (old) old.remove();
      if (cam.src === 'hls') {
        var vid = document.createElement('video');
        vid.id = 'cam-video-' + modalCell;
        vid.autoplay = true; vid.muted = true; vid.controls = true;
        vid.setAttribute('playsinline', '');
        wrap.appendChild(vid);
        attachHls(vid, cam.id, modalCell);
      } else {
        var fr = document.createElement('iframe');
        fr.src = camSrc(cam);
        fr.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
        fr.allowFullscreen = true;
        fr.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        wrap.appendChild(fr);
      }
      // reset fallback
      var fb = document.getElementById('fb-' + modalCell);
      if (fb) { fb.style.display = 'none'; var lnk = fb.querySelector('.cam-fallback-link'); if (lnk) lnk.href = cam.site || '#'; }
    }
    var locEl = cells[modalCell].querySelector('.cam-loc');
    if (locEl) locEl.textContent = cam.loc;
    var nameEl = cells[modalCell].querySelector('.cam-name');
    if (nameEl) nameEl.textContent = cam.n;
  }
  closeModal();
}

function buildPresetGrid() {
  var pg = document.getElementById('preset-grid');
  pg.innerHTML = '';
  CAMS.forEach(function(cam, i){
    var item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML =
      '<div class="preset-item-name">' + cam.n + '</div>' +
      '<div class="preset-item-loc">' + cam.loc + '</div>';
    item.onclick = function(){ selectPreset(i); };
    pg.appendChild(item);
  });
}

// Close modal on background click
document.getElementById('cam-modal').addEventListener('click', function(e){
  if (e.target === this) closeModal();
});

// ── CONFLICT DETAIL MODAL ─────────────────────────────────────────────────

function openConflictModal(newsIdx) {
  var ev = NEWS[newsIdx];
  if (!ev) return;
  document.getElementById('cm-cat-badge').textContent = ev.cat;
  document.getElementById('cm-cat-badge').style.color = ev.color;
  document.getElementById('cm-cat-badge').style.borderColor = ev.color;
  document.getElementById('cm-title-text').textContent = ev.title;
  document.getElementById('cm-date').textContent = ev.startDate || 'Unknown';
  document.getElementById('cm-source').textContent = (ev.src || 'Open-source compilation') + ' · ' + newsUpdated(ev);
  var partiesRow = document.getElementById('cm-parties-row');
  if (ev.parties && ev.parties.length) {
    document.getElementById('cm-parties').textContent = ev.parties.join(' vs. ');
    partiesRow.style.display = 'flex';
  } else { partiesRow.style.display = 'none'; }
  var blWrap = document.getElementById('cm-bl-wrap');
  if (ev.battleLines) {
    document.getElementById('cm-battlelines').textContent = ev.battleLines;
    blWrap.style.display = 'block';
  } else { blWrap.style.display = 'none'; }
  document.getElementById('cm-status').textContent = ev.body;
  document.getElementById('cm-status').title = newsConfidence(ev);
  var casWrap = document.getElementById('cm-cas-wrap');
  if (ev.cas) {
    document.getElementById('cm-cas').textContent = ev.cas.toLocaleString() + '+';
    document.getElementById('cm-casnote').textContent = ' — ' + (ev.casNote || newsConfidence(ev));
    casWrap.style.display = 'block';
  } else { casWrap.style.display = 'none'; }
  var linksEl = document.getElementById('cm-links');
  linksEl.innerHTML = '';
  if (ev.links && ev.links.length) {
    ev.links.forEach(function(lk) {
      var a = document.createElement('a');
      a.className = 'cm-link-btn';
      a.textContent = lk.l;
      a.href = lk.u;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      linksEl.appendChild(a);
    });
  }
  document.getElementById('conflict-modal').style.display = 'flex';
}

function closeConflictModal() {
  document.getElementById('conflict-modal').style.display = 'none';
}

document.getElementById('conflict-modal').addEventListener('click', function(e){
  if (e.target === this) closeConflictModal();
});

// ── CASUALTY SUMMARY ──────────────────────────────────────────────────────

function buildCasSummary() {
  var el = document.getElementById('cas-summary');
  if (!el) return;
  var conflicts = NEWS.filter(function(e){ return e.cas; });
  var total = conflicts.reduce(function(s,e){ return s + e.cas; }, 0);
  var html = '';
  conflicts.forEach(function(e){
    var short = e.title.replace(/ — .+/, '');
    var newsIdx = NEWS.indexOf(e);
    var hasDetail = !!(e.links && e.links.length);
    html += '<div class="cas-row' + (hasDetail ? ' has-detail' : '') + '"' +
      (hasDetail ? ' onclick="openConflictModal(' + newsIdx + ')" title="Click for details"' : '') + '>' +
      '<span class="cas-conflict">' + short + (hasDetail ? ' ▶' : '') + '</span>' +
      '<span class="cas-count" title="' + escapeHtml(newsConfidence(e)) + '">' + e.cas.toLocaleString() + '+</span>' +
    '</div>';
  });
  html += '<div class="cas-total-row">' +
    '<span class="cas-total-label">☠ TOTAL REPORTED MIN.</span>' +
    '<span class="cas-total-count">' + total.toLocaleString() + '+</span>' +
  '</div>';
  el.innerHTML = html;
}

// ── CAMERA DIRECTORY ──────────────────────────────────────────────────────

function buildCamDirectory() {
  var dir = document.getElementById('cam-directory');
  dir.innerHTML = '';
  CAMS.forEach(function(cam, i){
    var item = document.createElement('div');
    item.className = 'cam-dir-item';
    item.innerHTML =
      '<span class="cam-dir-dot"></span>' +
      '<span class="cam-dir-name">' + cam.n + '</span>' +
      '<span class="cam-dir-loc">' + cam.loc + '</span>';
    item.onclick = (function(theCam, theIdx){
      return function(){
        GRID_STATE[0] = theIdx;
        var cells = document.querySelectorAll('.cam-cell');
        if (cells[0]) {
          var wrap = cells[0].querySelector('.cam-frame-wrap');
          if (wrap) {
            var old = wrap.querySelector('iframe, video');
            if (old) old.remove();
            if (theCam.src === 'hls') {
              var vid = document.createElement('video');
              vid.id = 'cam-video-0';
              vid.autoplay = true; vid.muted = true; vid.controls = true;
              vid.setAttribute('playsinline', '');
              wrap.appendChild(vid);
              attachHls(vid, theCam.id, 0);
            } else {
              var fr = document.createElement('iframe');
              fr.src = camSrc(theCam);
              fr.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
              fr.allowFullscreen = true;
              fr.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
              wrap.appendChild(fr);
            }
            var fb = document.getElementById('fb-0');
            if (fb) { fb.style.display = 'none'; var lnk = fb.querySelector('.cam-fallback-link'); if (lnk) lnk.href = theCam.site || '#'; }
          }
          var locEl = cells[0].querySelector('.cam-loc');
          if (locEl) locEl.textContent = theCam.loc;
          var nameEl = cells[0].querySelector('.cam-name');
          if (nameEl) nameEl.textContent = theCam.n;
        }
        if (currentTab !== 'cameras') setTab('cameras');
      };
    })(cam, i);
    dir.appendChild(item);
  });
}
buildCamDirectory();
buildCasSummary();

// ── ASSET SELECT ──────────────────────────────────────────────────────────

function selectAsset(el) {
  document.querySelectorAll('.asset-item').forEach(function(a){ a.classList.remove('selected'); });
  el.classList.add('selected');
}

// ── SATELLITE TRACKING ────────────────────────────────────────────────────

function initSatMap() {
  if (satMapInited) return;
  satMapInited = true;
  satMap = L.map('sat-map', { center:[20,0], zoom:2, zoomControl:true, attributionControl:false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains:'abcd', maxZoom:19 }).addTo(satMap);
  satLayer = L.layerGroup().addTo(satMap);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos){
      overheadLat = pos.coords.latitude; overheadLng = pos.coords.longitude;
      var inp = document.getElementById('sat-loc-input');
      if (inp) inp.value = overheadLat.toFixed(2) + ',' + overheadLng.toFixed(2);
    }, function(){});
  }
  satTotalGroups = SAT_SOURCES.length; satLoadedGroups = 0;
  document.getElementById('sat-loading').textContent = 'Loading TLE data (0/' + satTotalGroups + ')...';
  SAT_SOURCES.forEach(function(src){ loadSatGroup(src); });
  satMap.invalidateSize();
}

function addSatMarker(source, obj) {
  var pos = getSatPos(obj.satrec);
  if (!pos) return;
  var marker = L.circleMarker([pos.lat, pos.lng], {
    radius: source.radius, fillColor: source.color, color: source.color,
    weight: 1, opacity: 0.9, fillOpacity: 0.75
  });
  var altLabel = pos.alt < 2000 ? 'LEO' : (pos.alt < 35000 ? 'MEO' : 'GEO');
  var vel = Math.sqrt(398600.4418 / (6371 + pos.alt)).toFixed(2);
  marker.bindPopup(
    '<div class="popup-cat" style="color:' + source.color + '">[' + source.key + ']</div>' +
    '<div class="popup-title">' + obj.name + '</div>' +
    '<div class="popup-body" style="font-family:\'Share Tech Mono\',monospace;font-size:11px;line-height:1.7;">' +
      'NORAD ID: ' + (obj.satrec.satnum || '?') + '<br>' +
      'ALTITUDE: ' + pos.alt + ' km (' + altLabel + ')<br>' +
      'VELOCITY: ~' + vel + ' km/s<br>' +
      'LAT: ' + pos.lat.toFixed(1) + '\xb0 | LNG: ' + pos.lng.toFixed(1) + '\xb0' +
    '</div>'
  );
  marker.addTo(satLayer);
  satObjects[source.key].push({ name:obj.name, satrec:obj.satrec, marker:marker, color:source.color, key:source.key, radius:source.radius });
}

function onGroupLoaded() {
  satLoadedGroups++;
  var total = Object.keys(satObjects).reduce(function(n,k){ return n + satObjects[k].length; }, 0);
  document.getElementById('sat-loading').textContent = 'Loaded ' + satLoadedGroups + '/' + satTotalGroups + ' groups';
  document.getElementById('sat-count').textContent = total + ' satellites tracked';
  if (satLoadedGroups === satTotalGroups) {
    document.getElementById('sat-loading').textContent = 'TLE data current';
    updateSatPositions();
    if (currentTab === 'satellites' && !satUpdateTimer) satUpdateTimer = setInterval(updateSatPositions, 30000);
  }
}

function processTLE(text, source) {
  satObjects[source.key] = satObjects[source.key] || [];
  parseTLE(text, source.max || 200).forEach(function(obj){ addSatMarker(source, obj); });
}

// Proxy chain: direct → allorigins → corsproxy
function fetchTLEWithProxies(url, source, onOk, onFail) {
  var proxies = [
    function(u){ return u; },  // direct (CelesTrak enables CORS)
    function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
    function(u){ return 'https://corsproxy.io/?url=' + encodeURIComponent(u); },
  ];
  function tryProxy(idx) {
    if (idx >= proxies.length) { onFail(); return; }
    fetch(proxies[idx](url))
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(onOk)
      .catch(function(){ tryProxy(idx + 1); });
  }
  tryProxy(0);
}

function loadSatGroup(source) {
  // Special case: fetch individual satellites by NORAD ID (e.g. Iran/DPRK)
  if (source.noradIds) {
    satObjects[source.key] = [];
    var pending = source.noradIds.length;
    var done = 0;
    source.noradIds.forEach(function(id) {
      var url = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=' + id + '&FORMAT=tle';
      fetchTLEWithProxies(url, source,
        function(text) {
          processTLE(text, source);
          done++;
          if (done === pending) onGroupLoaded();
        },
        function() {
          done++;
          if (done === pending) onGroupLoaded();
        }
      );
    });
    return;
  }

  // Standard GROUP fetch
  satObjects[source.key] = [];
  fetchTLEWithProxies(source.url, source,
    function(text) { processTLE(text, source); onGroupLoaded(); },
    function() {
      var el = document.getElementById('sat-loading');
      el.textContent = source.key + ' TLE unavailable \u2014 click to retry';
      el.style.cursor = 'pointer';
      el.onclick = function(){ el.textContent = 'Retrying\u2026'; el.onclick = null; el.style.cursor = ''; satLoadedGroups--; loadSatGroup(source); };
      onGroupLoaded(); // onGroupLoaded handles the increment
    }
  );
}

function parseTLE(tleText, maxCount) {
  var lines = tleText.trim().replace(/\r/g,'').split('\n');
  var result = [], i = 0;
  while (i < lines.length && result.length < maxCount) {
    var name = (lines[i]||'').trim();
    var l1   = (lines[i+1]||'').trim();
    var l2   = (lines[i+2]||'').trim();
    if (l1.charAt(0)==='1' && l2.charAt(0)==='2') {
      try { result.push({ name:name, satrec:satellite.twoline2satrec(l1,l2) }); } catch(e){}
      i += 3;
    } else { i += 1; }
  }
  return result;
}

function getSatPos(satrec) {
  var now = new Date();
  var pv = satellite.propagate(satrec, now);
  if (!pv || !pv.position || typeof pv.position === 'boolean') return null;
  var gmst = satellite.gstime(now);
  var geo  = satellite.eciToGeodetic(pv.position, gmst);
  return { lat: satellite.degreesLat(geo.latitude), lng: satellite.degreesLong(geo.longitude), alt: Math.round(geo.height) };
}

function updateSatPositions() {
  Object.keys(satObjects).forEach(function(key){
    if (!satFilters[key]) return;
    satObjects[key].forEach(function(obj){
      var pos = getSatPos(obj.satrec);
      if (!pos) return;
      obj.marker.setLatLng([pos.lat, pos.lng]);
      if (overheadMode) {
        var isOH = checkSingleOverhead(obj.satrec);
        obj.marker.setStyle({ fillOpacity: isOH ? 1.0 : 0.2, opacity: isOH ? 1.0 : 0.2 });
        var el = obj.marker.getElement ? obj.marker.getElement() : null;
        if (el) { if (isOH) el.classList.add('sat-overhead-marker'); else el.classList.remove('sat-overhead-marker'); }
      } else {
        obj.marker.setStyle({ fillOpacity: 0.75, opacity: 0.9 });
        var el2 = obj.marker.getElement ? obj.marker.getElement() : null;
        if (el2) el2.classList.remove('sat-overhead-marker');
      }
    });
  });
  var now = new Date();
  document.getElementById('sat-updated').textContent = 'Updated: ' +
    String(now.getUTCHours()).padStart(2,'0') + ':' + String(now.getUTCMinutes()).padStart(2,'0') + ' UTC';
}

function checkSingleOverhead(satrec) {
  var now = new Date();
  var pv = satellite.propagate(satrec, now);
  if (!pv || !pv.position || typeof pv.position === 'boolean') return false;
  var gmst = satellite.gstime(now);
  // Convert satellite ECI position → ECF for look-angle calc
  var satEcf = satellite.eciToEcf(pv.position, gmst);
  var obs = satellite.geodeticToEcf({
    longitude: satellite.degreesToRadians(overheadLng),
    latitude:  satellite.degreesToRadians(overheadLat),
    height: 0.0
  });
  var lookAngles = satellite.ecfToLookAngles(obs, satEcf);
  return lookAngles && lookAngles.elevation > 0;
}

function checkOverhead() {
  Object.keys(satObjects).forEach(function(key){
    satObjects[key].forEach(function(obj){
      var isOH = checkSingleOverhead(obj.satrec);
      obj.marker.setStyle({ fillOpacity: isOH ? 1.0 : 0.2, opacity: isOH ? 1.0 : 0.2 });
      var el = obj.marker.getElement ? obj.marker.getElement() : null;
      if (el) { if (isOH) el.classList.add('sat-overhead-marker'); else el.classList.remove('sat-overhead-marker'); }
    });
  });
}

function toggleSatFilter(key, btn) {
  satFilters[key] = !satFilters[key];
  if (btn) { if (satFilters[key]) btn.classList.remove('off'); else btn.classList.add('off'); }
  if (!satObjects[key]) return;
  satObjects[key].forEach(function(obj){
    if (satFilters[key]) { if (!satLayer.hasLayer(obj.marker)) obj.marker.addTo(satLayer); }
    else                 { if (satLayer.hasLayer(obj.marker))  satLayer.removeLayer(obj.marker); }
  });
  var total = Object.keys(satObjects).reduce(function(n,k){ return satFilters[k] ? n+satObjects[k].length : n; }, 0);
  document.getElementById('sat-count').textContent = total + ' satellites tracked';
}

function toggleOverheadMode() {
  overheadMode = !overheadMode;
  var btn = document.getElementById('sat-overhead-toggle');
  if (btn) {
    if (overheadMode) { btn.classList.add('active'); btn.textContent='\u2299 OVERHEAD: ON'; }
    else              { btn.classList.remove('active'); btn.textContent='\u2299 OVERHEAD NOW'; }
  }
  if (overheadMode) { checkOverhead(); } else {
    Object.keys(satObjects).forEach(function(key){
      satObjects[key].forEach(function(obj){
        obj.marker.setStyle({ fillOpacity: 0.75, opacity: 0.9 });
        var el = obj.marker.getElement ? obj.marker.getElement() : null;
        if (el) el.classList.remove('sat-overhead-marker');
      });
    });
  }
}

function parseSatLocInput(val) {
  var parts = val.replace(/\s/g,'').split(',');
  if (parts.length === 2) {
    var lat = parseFloat(parts[0]), lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng) && lat>=-90 && lat<=90 && lng>=-180 && lng<=180) {
      overheadLat = lat; overheadLng = lng;
      if (overheadMode) checkOverhead();
    }
  }
}

// ── SHIPS / AIS ────────────────────────────────────────────────────────────

var SHIP_REGIONS = {
  global:  { zoom:3,  lat:20,   lng:0    },
  hormuz:  { zoom:8,  lat:26.5, lng:56.5 },
  redsea:  { zoom:6,  lat:18,   lng:38   },
  scs:     { zoom:5,  lat:12,   lng:114  },
  taiwan:  { zoom:7,  lat:24.5, lng:120  },
  med:     { zoom:5,  lat:36,   lng:15   },
  blacksea:{ zoom:6,  lat:43,   lng:33   },
};

function setShipRegion(key) {
  var r = SHIP_REGIONS[key]; if (!r) return;
  var fr = document.getElementById('ships-iframe');
  if (fr) fr.src = 'https://www.vesselfinder.com/aismap?zoom='+r.zoom+'&lat='+r.lat+'&lng='+r.lng+'&width=100%25&height=100%25&names=true&show_track=false';
  var btns = document.querySelectorAll('#tab-ships .sat-filter-btn');
  var keys = Object.keys(SHIP_REGIONS);
  btns.forEach(function(b){ b.style.borderColor = 'var(--dim)'; b.style.color = 'var(--dim2)'; });
  var idx = keys.indexOf(key);
  if (btns[idx]) { btns[idx].style.borderColor = 'var(--accent)'; btns[idx].style.color = 'var(--accent)'; }
}

// ── WORLD NEWS FEED ───────────────────────────────────────────────────────

(function loadWorldNews() {
  var feeds = [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml',            label: 'BBC' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', label: 'NYT' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml',              label: 'AJE' },
  ];
  var allItems = [];
  var pending = feeds.length;

  // CORS proxy chain — tried in order until one succeeds
  var PROXIES = [
    function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
    function(u){ return 'https://corsproxy.io/?url='          + encodeURIComponent(u); },
  ];

  function fetchWithTimeout(url, ms) {
    return new Promise(function(resolve, reject) {
      var t = setTimeout(function(){ reject(new Error('timeout')); }, ms);
      fetch(url).then(
        function(r){ clearTimeout(t); resolve(r); },
        function(e){ clearTimeout(t); reject(e); }
      );
    });
  }

  function parseRSS(xml, label) {
    try {
      var doc = new DOMParser().parseFromString(xml, 'application/xml');
      // Bail on parse error
      if (doc.querySelector('parsererror')) return;
      doc.querySelectorAll('item').forEach(function(item) {
        var title = (item.querySelector('title') || {}).textContent || '';
        // <link> in RSS is a text node between tags, not an attribute
        var linkEl = item.querySelector('link');
        var link = '';
        if (linkEl) {
          link = linkEl.textContent.trim() ||
                 (linkEl.nextSibling && linkEl.nextSibling.nodeValue
                   ? linkEl.nextSibling.nodeValue.trim() : '');
        }
        var pub = (item.querySelector('pubDate') || {}).textContent || '';
        if (title.trim() && link) {
          allItems.push({ title: title.trim(), link: link, date: new Date(pub || 0), src: label });
        }
      });
    } catch(e) {}
  }

  function tryFeed(feed, proxyIdx) {
    if (proxyIdx >= PROXIES.length) {
      pending--;
      if (pending === 0) renderNews();
      return;
    }
    var url = PROXIES[proxyIdx](feed.url);
    fetchWithTimeout(url, 9000)
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function(text) {
        parseRSS(text, feed.label);
        pending--;
        if (pending === 0) renderNews();
      })
      .catch(function() {
        tryFeed(feed, proxyIdx + 1);
      });
  }

  feeds.forEach(function(feed) { tryFeed(feed, 0); });

  function renderNewsList() {
    var list = document.getElementById('news-feed-list');
    if (!list) return;
    if (!allItems.length) {
      list.innerHTML = '<div id="news-loading">Unable to load news.</div>';
      return;
    }
    allItems.sort(function(a,b){ return b.date - a.date; });
    list.innerHTML = allItems.slice(0, 18).map(function(item) {
      var title = item.title.length > 80 ? item.title.slice(0, 78) + '\u2026' : item.title;
      return '<a class="news-item" href="' + item.link + '" target="_blank" rel="noopener">'
        + title
        + '<span class="news-src">' + item.src + ' \xb7 ' + item.date.toUTCString().slice(0,16) + '</span>'
        + '</a>';
    }).join('');
  }

  function renderNews() {
    var list = document.getElementById('news-feed-list');
    if (!list) return;
    if (allItems.length) { renderNewsList(); return; }

    // All RSS feeds failed — fall back to HackerNews public API (no key, CORS-enabled)
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(function(r){ return r.json(); })
      .then(function(ids) {
        var top = (ids || []).slice(0, 10);
        var done = 0;
        if (!top.length) { list.innerHTML = '<div id="news-loading">Unable to load news.</div>'; return; }
        top.forEach(function(id) {
          fetch('https://hacker-news.firebaseio.com/v0/item/' + id + '.json')
            .then(function(r){ return r.json(); })
            .then(function(s) {
              if (s && s.title) {
                allItems.push({
                  title: s.title,
                  link:  s.url || 'https://news.ycombinator.com/item?id=' + s.id,
                  date:  new Date((s.time || 0) * 1000),
                  src:   'HN'
                });
              }
            })
            .catch(function(){})
            .finally(function(){
              done++;
              if (done === top.length) renderNewsList();
            });
        });
      })
      .catch(function() {
        list.innerHTML = '<div id="news-loading">Unable to load news.</div>';
      });
  }
})();

// ── SEISMIC MONITOR (USGS) ────────────────────────────────────────────────
(function loadSeismic() {
  var body = document.getElementById('seismic-body');
  if (!body) return;
  // M4.5+ earthquakes in past 7 days — no API key, CORS-enabled
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    .then(function(r){ return r.json(); })
    .then(function(data) {
      var quakes = (data.features || []).slice(0, 15);
      if (!quakes.length) { body.innerHTML = '<div class="intel-loading">No significant events this week.</div>'; return; }
      body.innerHTML = quakes.map(function(q) {
        var mag = parseFloat(q.properties.mag || 0).toFixed(1);
        var color = mag >= 7 ? '#ff3030' : mag >= 6 ? '#ff8800' : mag >= 5 ? '#ffcc00' : 'var(--dim2)';
        var place = (q.properties.place || 'Unknown location');
        var t = new Date(q.properties.time);
        var ts = t.toUTCString().slice(5, 16);
        return '<div class="intel-quake">'
          + '<span class="quake-mag" style="color:' + color + '">M' + mag + '</span>'
          + '<span class="quake-place">' + place + '</span>'
          + '<span class="quake-time">' + ts + '</span>'
          + '</div>';
      }).join('');
    })
    .catch(function() { body.innerHTML = '<div class="intel-loading">Seismic feed unavailable.</div>'; });
})();

// ── THEATER STATUS BOARD ─────────────────────────────────────────────────
(function renderTheaterStatusBoard() {
  var body = document.getElementById('globalwx-body');
  if (!body) return;

  var links = [
    { l:'Zoom Earth', u:'https://zoom.earth/' },
    { l:'NASA Worldview', u:'https://worldview.earthdata.nasa.gov/' }
  ];

  body.innerHTML = '<div class="intel-section-head">KEY THEATERS</div>'
    + THEATER_STATUS.map(function(item) {
      return '<div class="op-row">'
        + '<span class="op-city">' + escapeHtml(item.city) + '</span>'
        + '<span class="op-brief">'
          + '<span class="intel-pill ' + intelPillClass(item.level) + '">' + escapeHtml(item.level.toUpperCase()) + '</span>'
          + ' ' + escapeHtml(item.summary)
          + '<br><span style="color:var(--dim2)">' + escapeHtml(item.detail) + '</span>'
        + '</span>'
        + '<span class="op-meta">' + escapeHtml(item.updated) + '<br>' + escapeHtml(item.source) + '</span>'
        + '</div>';
    }).join('')
    + '<div class="intel-note">Curated operational-status board. This replaces brittle live weather embeds with infrastructure and access signals that matter more for conflict tracking.</div>'
    + '<div class="intel-link-list">' + renderIntelLinks(links, 'intel-link') + '</div>';
})();

// ── SOURCE RELIABILITY MATRIX ─────────────────────────────────────────────
(function renderSourceReliabilityMatrix() {
  var body = document.getElementById('spacewx-body');
  if (!body) return;
  var links = [
    { l:'NOAA SWPC', u:'https://www.swpc.noaa.gov/' },
    { l:'SpaceWeatherLive', u:'https://www.spaceweatherlive.com/' }
  ];

  body.innerHTML = '<div class="intel-section-head">CURRENT FEED HEALTH</div>'
    + SOURCE_RELIABILITY.map(function(item) {
      return '<div class="src-row">'
        + '<span class="src-name">' + escapeHtml(item.name) + '</span>'
        + '<span class="src-brief">'
          + '<span class="intel-pill ' + intelPillClass(item.state) + '">' + escapeHtml(item.state.toUpperCase()) + '</span>'
          + ' ' + escapeHtml(item.summary)
          + '<br><span style="color:var(--dim2)">' + escapeHtml(item.note) + '</span>'
        + '</span>'
        + '<span class="src-meta">' + escapeHtml(item.updated) + '</span>'
        + '</div>';
    }).join('')
    + '<div class="intel-note">This matrix explains which inputs are truly live, which are curated, and which were downgraded because browser-only fetching proved unreliable in static deployment.</div>'
    + '<div class="intel-link-list">' + renderIntelLinks(links, 'intel-link') + '</div>';
})();

// ── HISTORY / TIME MACHINE ───────────────────────────────────────────────

var HIST_DATA = [
  // ── 1500s: Age of Exploration & Conquest ─────────────────────────────
  { year:1513, lat:8.4,   lng:-77.3,  cat:'DISCOVERY',  color:'#00d4ff', title:'Balboa Sees the Pacific',           body:'Vasco N\xfa\xf1ez de Balboa leads the first European expedition across Panama to sight the Pacific Ocean, opening an era of trans-oceanic exploration.' },
  { year:1517, lat:51.9,  lng:11.7,   cat:'REVOLUTION', color:'#ffcc00', title:'Luther\u2019s 95 Theses',           body:'Martin Luther nails his theses to the Wittenberg church door, igniting the Protestant Reformation and permanently fracturing Western Christianity.', outcome:'Religious wars across Europe for the next 130 years' },
  { year:1519, lat:41.9,  lng:12.5,   cat:'DISCOVERY',  color:'#00d4ff', title:'Magellan-Elcano Circumnavigation',  body:'Magellan departs Spain with 5 ships to circumnavigate the globe. Juan Sebasti\xe1n Elcano completes the voyage in 1522 with 1 ship and 18 survivors, proving the Earth\u2019s roundness.' },
  { year:1521, lat:19.4,  lng:-99.1,  cat:'CONFLICT',   color:'#ff4d00', title:'Fall of Tenochtitlan',              body:'Hern\xe1n Cort\xe9s and Tlaxcalan allies capture the Aztec capital after a 75-day siege. The Aztec Empire \u2014 population 5\u201325 million \u2014 collapses.', parties:['Spanish Empire','Aztec Empire'] },
  { year:1526, lat:46.0,  lng:18.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Moh\xe1cs',               body:'Ottoman Sultan Suleiman I crushes the Hungarian army in 2 hours. King Louis II is killed. Hungary loses independence for 150 years; Ottomans push to the gates of Vienna.', parties:['Ottoman Empire','Kingdom of Hungary'] },
  { year:1532, lat:-13.5, lng:-72.0,  cat:'CONFLICT',   color:'#ff4d00', title:'Spanish Conquest of the Inca',      body:'Francisco Pizarro captures Inca Emperor Atahualpa at Cajamarca with 168 men against thousands. The largest empire in the Americas collapses within decades.', parties:['Spain','Inca Empire'] },
  { year:1545, lat:45.9,  lng:10.9,   cat:'DIPLOMACY',  color:'#00ff88', title:'Council of Trent',                  body:'The Catholic Church convenes to respond to the Protestant Reformation with internal reform \u2014 the Counter-Reformation that will reshape European culture for centuries.' },
  { year:1571, lat:38.3,  lng:21.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Lepanto',                 body:'The Holy League destroys the Ottoman fleet off Greece in the largest naval battle of the 16th century, halting Ottoman expansion in the Mediterranean.', parties:['Holy League','Ottoman Empire'] },
  { year:1572, lat:48.9,  lng:2.3,    cat:'DISASTER',   color:'#cc44ff', title:'St. Bartholomew\u2019s Day Massacre', body:'Catholic mobs kill an estimated 5,000\u201330,000 French Protestants (Huguenots) over several weeks, escalating the French Wars of Religion.' },
  { year:1588, lat:51.5,  lng:-3.0,   cat:'CONFLICT',   color:'#ff4d00', title:'Spanish Armada Defeated',           body:'England\u2019s smaller fleet and Atlantic storms destroy Spain\u2019s 130-ship invasion fleet. Spain\u2019s dominance of the seas ends; England rises as a naval power.', parties:['England','Spain'] },
  { year:1598, lat:48.9,  lng:2.3,    cat:'DIPLOMACY',  color:'#00ff88', title:'Edict of Nantes',                   body:'Henry IV of France grants Huguenots substantial rights, ending 36 years of the French Wars of Religion. Revoked in 1685, triggering mass Protestant emigration.' },

  // ── 1600s: Colonial Expansion ────────────────────────────────────────
  { year:1600, lat:51.5,  lng:-0.1,   cat:'EMPIRE',     color:'#ff8800', title:'British East India Company Founded', body:'English merchants receive a royal charter to trade with the East Indies \u2014 the beginning of British commercial and eventually colonial dominance of Asia.' },
  { year:1603, lat:35.0,  lng:135.8,  cat:'EMPIRE',     color:'#ff8800', title:'Tokugawa Shogunate Established',    body:'Tokugawa Ieyasu becomes Shogun, unifying Japan after decades of civil war. Japan closes itself to the outside world for 265 years under the Edo period.' },
  { year:1607, lat:37.2,  lng:-76.5,  cat:'EMPIRE',     color:'#ff8800', title:'Jamestown Colony Founded',          body:'England establishes its first permanent North American colony at Jamestown, Virginia. Of 104 original settlers, only 38 survive the first year.' },
  { year:1618, lat:50.1,  lng:14.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Thirty Years War Begins',           body:'Europe\u2019s most destructive pre-modern war begins in Bohemia. Religious, dynastic, and political conflicts kill up to 8 million people and depopulate parts of Germany by 30%.', parties:['Protestant Union','Catholic League'] },
  { year:1620, lat:41.9,  lng:-70.0,  cat:'DISCOVERY',  color:'#00d4ff', title:'Mayflower \u2014 Plymouth Colony',   body:'102 Puritan settlers cross the Atlantic and establish Plymouth Colony in Massachusetts, signing the Mayflower Compact \u2014 an early model of self-governance.' },
  { year:1644, lat:39.9,  lng:116.4,  cat:'EMPIRE',     color:'#ff8800', title:'Qing Dynasty Replaces Ming China', body:'Manchu forces capture Beijing and establish the Qing Dynasty, which will rule China until 1912 \u2014 the last imperial dynasty of China.' },
  { year:1648, lat:52.5,  lng:5.8,    cat:'DIPLOMACY',  color:'#00ff88', title:'Peace of Westphalia',               body:'Treaties ending the Thirty Years War establish the modern concept of national sovereignty and state equality, forming the foundation of international law.', outcome:'Birth of the modern nation-state system' },
  { year:1683, lat:48.2,  lng:16.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Ottoman Siege of Vienna Repulsed', body:'A Polish-Habsburg relief force defeats the Ottoman army besieging Vienna. The Ottoman Empire begins its long decline; Europe\u2019s eastern frontier is secured.', parties:['Holy Roman Empire & Poland','Ottoman Empire'] },
  { year:1688, lat:51.5,  lng:-0.1,   cat:'REVOLUTION', color:'#ffcc00', title:'Glorious Revolution',               body:'William of Orange invades England, replacing Catholic King James II without bloodshed. Constitutional monarchy and parliamentary supremacy are established.' },

  // ── 1700s: Enlightenment & Revolution ───────────────────────────────
  { year:1700, lat:59.3,  lng:18.1,   cat:'CONFLICT',   color:'#ff4d00', title:'Great Northern War',                body:'Russia, Denmark, and Poland attack Sweden. Peter the Great defeats Charles XII at Poltava (1709), establishing Russia as the dominant Baltic power and a major European force.', parties:['Russia, Denmark, Poland','Sweden'] },
  { year:1756, lat:48.2,  lng:16.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Seven Years War',                   body:'A global conflict fought across Europe, North America, India, Africa, and Asia. Britain defeats France to dominate North America and India \u2014 often called the first \u201cworld war\u201d.', parties:['Britain & Prussia','France, Austria, Russia, Spain'] },
  { year:1757, lat:23.4,  lng:88.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Plassey',                 body:'Robert Clive\u2019s British East India Company force defeats the Nawab of Bengal. Effective British control of the Indian subcontinent begins.', parties:['British East India Co.','Nawab of Bengal'] },
  { year:1775, lat:42.3,  lng:-71.1,  cat:'REVOLUTION', color:'#ffcc00', title:'American Revolutionary War',        body:'Shots fired at Lexington and Concord begin the revolution. Thirteen colonies, backed by France, fight Britain for independence in a war that reshapes the Western world.', parties:['American Colonies & France','British Empire'] },
  { year:1776, lat:39.9,  lng:-75.2,  cat:'REVOLUTION', color:'#ffcc00', title:'Declaration of Independence',       body:'The Continental Congress adopts the Declaration, proclaiming the USA based on Enlightenment ideals of liberty, equality, and natural rights. A blueprint for revolutions worldwide.' },
  { year:1789, lat:48.9,  lng:2.3,    cat:'REVOLUTION', color:'#ffcc00', title:'French Revolution',                 body:'The storming of the Bastille (July 14) ignites a decade of radical transformation. Monarchy falls; the Reign of Terror executes 17,000. Napoleon emerges from the chaos.' },
  { year:1791, lat:18.5,  lng:-72.3,  cat:'REVOLUTION', color:'#ffcc00', title:'Haitian Revolution',               body:'Enslaved people in Saint-Domingue revolt against French colonial rule \u2014 the only successful slave revolt in history. Haiti becomes independent in 1804.' },
  { year:1799, lat:48.9,  lng:2.3,    cat:'EMPIRE',     color:'#ff8800', title:'Napoleon Seizes Power',            body:'Napoleon Bonaparte stages the 18 Brumaire coup, ending the French Revolution. The Napoleonic Era begins; France will redraw the map of Europe.' },

  // ── 1800s: Napoleonic Era & Industrial Age ───────────────────────────
  { year:1803, lat:38.9,  lng:-77.0,  cat:'DIPLOMACY',  color:'#00ff88', title:'Louisiana Purchase',               body:'The United States doubles its territory, buying 828,000 sq mi from Napoleonic France for $15 million (about 3 cents per acre), enabling westward expansion.' },
  { year:1804, lat:18.5,  lng:-72.3,  cat:'REVOLUTION', color:'#ffcc00', title:'Haitian Independence',             body:'Haiti becomes the first Black republic and second independent nation in the Western Hemisphere, after defeating Napoleon\u2019s army sent to restore slavery.' },
  { year:1805, lat:36.9,  lng:-5.9,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Trafalgar',              body:'Admiral Nelson\u2019s fleet destroys the Franco-Spanish fleet, giving Britain undisputed naval supremacy for a century. Nelson is killed at the moment of victory.', parties:['Britain','France & Spain'] },
  { year:1805, lat:49.1,  lng:16.6,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Austerlitz',             body:'Napoleon\u2019s tactical masterpiece: he defeats the Russian and Austrian emperors simultaneously in under 9 hours, cementing French dominance of Europe.', parties:['France','Russia & Austria'] },
  { year:1812, lat:55.8,  lng:37.6,   cat:'CONFLICT',   color:'#ff4d00', title:'Napoleon Invades Russia',          body:'Grande Arm\xe9e of 600,000 enters Russia. Moscow is taken but burned. The brutal retreat kills 400,000+ French soldiers. Napoleon\u2019s empire begins its collapse.', parties:['France','Russia'] },
  { year:1815, lat:50.7,  lng:4.4,    cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Waterloo',               body:'Wellington and Bl\xfccher defeat Napoleon near Brussels, ending the Napoleonic Wars and Napoleon\u2019s \u201cHundred Days\u201d return. Napoleon is exiled to St. Helena.', parties:['Britain & Prussia','France'] },
  { year:1815, lat:48.2,  lng:16.4,   cat:'DIPLOMACY',  color:'#00ff88', title:'Congress of Vienna',               body:'European powers redraw the map of Europe and establish the Concert of Europe \u2014 a balance-of-power system maintaining relative peace for nearly a century.', outcome:'European order largely preserved until 1914' },
  { year:1821, lat:38.0,  lng:23.7,   cat:'REVOLUTION', color:'#ffcc00', title:'Greek War of Independence',        body:'Greece revolts against 400 years of Ottoman rule. With British, French, and Russian naval support (Battle of Navarino), Greece wins independence by 1829.' },
  { year:1839, lat:23.1,  lng:113.3,  cat:'CONFLICT',   color:'#ff4d00', title:'First Opium War',                  body:'Britain forces China to open its ports after Chinese officials confiscate British opium. Hong Kong is ceded; China\u2019s \u201cCentury of Humiliation\u201d begins.', parties:['Britain','Qing China'] },
  { year:1845, lat:53.4,  lng:-7.5,   cat:'DISASTER',   color:'#cc44ff', title:'Irish Famine',                     body:'Potato blight kills 1 million Irish and forces 2 million to emigrate. Ireland loses 25% of its population. The catastrophe fuels deep anti-British sentiment for generations.' },
  { year:1848, lat:48.9,  lng:2.3,    cat:'REVOLUTION', color:'#ffcc00', title:'Revolutions of 1848',              body:'Democratic uprisings sweep France, Germany, Italy, Austria-Hungary, and Poland. Most are suppressed within a year but permanently alter the political consciousness of Europe.' },
  { year:1853, lat:45.0,  lng:34.0,   cat:'CONFLICT',   color:'#ff4d00', title:'Crimean War',                      body:'Britain, France, and the Ottoman Empire fight Russia over Black Sea influence. 500,000 die, largely of disease. Florence Nightingale transforms nursing. Russia begins modernizing.', parties:['Britain, France & Ottomans','Russia'] },
  { year:1857, lat:28.6,  lng:77.2,   cat:'REVOLUTION', color:'#ffcc00', title:'Indian Rebellion',                 body:'Widespread mutiny of Indian soldiers (sepoys) against British East India Company rule. After brutal suppression, Britain abolishes the Company and assumes direct Crown rule of India.' },
  { year:1861, lat:37.5,  lng:-77.5,  cat:'CONFLICT',   color:'#ff4d00', title:'American Civil War',               body:'Confederate states secede over slavery. Four years of war kill 620,000 \u2014 the bloodiest conflict in US history. Ends with the abolition of slavery via the 13th Amendment.', parties:['Union (North)','Confederacy (South)'] },
  { year:1868, lat:35.7,  lng:139.7,  cat:'REVOLUTION', color:'#ffcc00', title:'Meiji Restoration',                body:'Emperor Meiji is restored to power. Japan rapidly industrializes, adopts Western institutions, and transforms from a feudal state to an imperial power within a generation.' },
  { year:1870, lat:48.9,  lng:2.3,    cat:'CONFLICT',   color:'#ff4d00', title:'Franco-Prussian War',              body:'Prussia crushes France, captures Napoleon III, and annexes Alsace-Lorraine. Germany is unified under Kaiser Wilhelm I. France\u2019s humiliation seeds WWI 44 years later.', parties:['Prussia & German states','France'] },
  { year:1885, lat:52.5,  lng:13.4,   cat:'EMPIRE',     color:'#ff8800', title:'Berlin Conference \u2014 Scramble for Africa', body:'European powers divide Africa among themselves without African representation. By 1900, 90% of Africa is under European colonial rule. Borders are drawn arbitrarily, causing conflicts to this day.' },
  { year:1894, lat:37.5,  lng:126.5,  cat:'CONFLICT',   color:'#ff4d00', title:'First Sino-Japanese War',          body:'Japan defeats China, gains Taiwan and Korea\u2019s suzerainty, and forces a massive indemnity. Japan emerges as Asia\u2019s dominant power; China\u2019s Qing Dynasty hastens toward collapse.', parties:['Japan','Qing China'] },
  { year:1898, lat:14.6,  lng:121.0,  cat:'CONFLICT',   color:'#ff4d00', title:'Spanish-American War',             body:'The US defeats Spain in 10 weeks, gaining Philippines, Guam, and Puerto Rico \u2014 America\u2019s emergence as an imperial Pacific power. Cuba wins nominal independence.', parties:['United States','Spain'] },
  { year:1899, lat:-29.1, lng:26.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Second Boer War',                  body:'Britain fights Afrikaner settlers in South Africa. Britain uses concentration camps; 26,000 Boer civilians die. Britain wins but moral authority is severely damaged.', parties:['Britain','Boer Republics'] },

  // ── 1900\u20131918: WWI Era ──────────────────────────────────────────────────
  { year:1904, lat:43.1,  lng:131.9,  cat:'CONFLICT',   color:'#ff4d00', title:'Russo-Japanese War',               body:'Japan defeats Russia at Mukden and Tsushima \u2014 the first time an Asian power defeats a European power in modern history. Russia\u2019s humiliation triggers the 1905 revolution.', parties:['Japan','Russia'] },
  { year:1905, lat:55.8,  lng:37.6,   cat:'REVOLUTION', color:'#ffcc00', title:'Russian Revolution of 1905',       body:'Bloody Sunday massacre of peaceful workers, naval mutiny (Battleship Potemkin), and mass strikes force Tsar Nicholas II to grant a parliament (Duma) \u2014 a rehearsal for 1917.' },
  { year:1910, lat:19.4,  lng:-99.1,  cat:'REVOLUTION', color:'#ffcc00', title:'Mexican Revolution',               body:'Armed revolt against dictator Porfirio D\xedaz erupts, plunging Mexico into a decade of violence. Pancho Villa, Emiliano Zapata, and others reshape Mexico\u2019s national identity.' },
  { year:1912, lat:42.0,  lng:21.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Balkan Wars',                      body:'Balkan states drive the Ottomans from most of Europe, then fight among themselves. The powder keg created directly triggers the assassination of Franz Ferdinand two years later.' },
  { year:1914, lat:43.9,  lng:17.7,   cat:'CONFLICT',   color:'#ff4d00', title:'WWI Begins \u2014 Franz Ferdinand Assassinated', body:'Gavrilo Princip shoots Archduke Franz Ferdinand in Sarajevo. A chain of alliances and failed diplomacy drags all major European powers into war within weeks. 17 million die.', parties:['Triple Entente','Central Powers'] },
  { year:1915, lat:40.1,  lng:26.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Gallipoli Campaign',               body:'Allied attempt to knock the Ottoman Empire out of the war by seizing the Dardanelles fails after 8 months, costing 250,000 Allied casualties. A national trauma for Australia and New Zealand.', parties:['Britain, ANZACs, France','Ottoman Empire'] },
  { year:1915, lat:39.9,  lng:44.0,   cat:'DISASTER',   color:'#cc44ff', title:'Armenian Genocide',                body:'Ottoman authorities systematically deport and massacre Armenians. 600,000\u20131.5 million killed in the first genocide of the 20th century \u2014 still denied by Turkey.' },
  { year:1916, lat:49.2,  lng:5.4,    cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Verdun',                 body:'Germany and France fight the longest battle of WWI: 10 months, 300,000 dead, 700,000 casualties total. Neither side gains meaningful ground. A symbol of industrialized slaughter.', parties:['France','Germany'] },
  { year:1916, lat:50.1,  lng:-2.8,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of the Somme',              body:'July 1: 57,470 British casualties in a single day \u2014 the bloodiest day in British military history. The 4-month battle produces 1.2 million casualties and moves the front 10 km.', parties:['Britain & France','Germany'] },
  { year:1917, lat:59.9,  lng:30.3,   cat:'REVOLUTION', color:'#ffcc00', title:'Russian Revolution',               body:'February: Tsar Nicholas II abdicates. October: Lenin\u2019s Bolsheviks seize power. Russia exits WWI. The Communist Soviet era begins, reshaping global politics for 74 years.' },
  { year:1918, lat:48.9,  lng:2.3,    cat:'DIPLOMACY',  color:'#00ff88', title:'World War I Ends',                 body:'Armistice signed November 11 at 11am. 17 million dead, 23 million wounded. Four empires collapse: Ottoman, Austro-Hungarian, Russian, and German. The world map is redrawn.', outcome:'17 million dead; 4 empires collapse' },
  { year:1918, lat:39.9,  lng:-75.2,  cat:'DISASTER',   color:'#cc44ff', title:'Spanish Flu Pandemic',             body:'A catastrophic influenza pandemic kills 50\u2013100 million worldwide in 2 years \u2014 more than WWI itself. Disproportionately kills healthy young adults aged 20\u201340.' },

  // ── Interwar Period ───────────────────────────────────────────────────
  { year:1919, lat:48.9,  lng:2.3,    cat:'DIPLOMACY',  color:'#00ff88', title:'Treaty of Versailles',             body:'WWI peace treaty humiliates Germany: war guilt, \xe340 billion in reparations, loss of 13% of territory, and military limits. Historians broadly agree the harsh terms seed WWII.' },
  { year:1922, lat:55.8,  lng:37.6,   cat:'EMPIRE',     color:'#ff8800', title:'Soviet Union Established',         body:'The Union of Soviet Socialist Republics (USSR) is formally proclaimed, uniting Russia and former tsarist territories under Leninist Communist rule.' },
  { year:1929, lat:40.7,  lng:-74.0,  cat:'DISASTER',   color:'#cc44ff', title:'Wall Street Crash',                body:'US stock markets collapse on Black Tuesday. Global GDP falls 15%; US unemployment reaches 25%. The Great Depression spreads worldwide, fueling political extremism across Europe.' },
  { year:1931, lat:41.8,  lng:123.4,  cat:'CONFLICT',   color:'#ff4d00', title:'Japan Invades Manchuria',          body:'Japan fabricates the Mukden Incident to seize Manchuria, creating the puppet state of Manchukuo. The League of Nations condemns but does nothing \u2014 its authority is fatally undermined.', parties:['Japan','China'] },
  { year:1933, lat:52.5,  lng:13.4,   cat:'EMPIRE',     color:'#ff8800', title:'Hitler Becomes Chancellor',        body:'Adolf Hitler is appointed Chancellor of Germany. Within months he dismantles democracy, begins persecution of Jews, and violates the Versailles Treaty by rearming. WWII is set in motion.' },
  { year:1935, lat:9.0,   lng:38.7,   cat:'CONFLICT',   color:'#ff4d00', title:'Italian Invasion of Ethiopia',     body:'Mussolini\u2019s forces use poison gas and aerial bombardment against Ethiopia. Emperor Haile Selassie appeals to the League of Nations, which fails again. Fascism is emboldened.', parties:['Italy','Ethiopia'] },
  { year:1936, lat:40.4,  lng:-3.7,   cat:'CONFLICT',   color:'#ff4d00', title:'Spanish Civil War',                body:'Nationalist General Franco (backed by Hitler and Mussolini) fights the Republican government (backed by the USSR). A proxy war and testing ground for WWII weapons and tactics.', parties:['Nationalists (+ Germany & Italy)','Republicans (+ USSR)'] },
  { year:1937, lat:32.1,  lng:118.8,  cat:'CONFLICT',   color:'#ff4d00', title:'Nanjing Massacre',                 body:'Japanese forces capture Nanjing and kill an estimated 200,000\u2013300,000 Chinese civilians and POWs in 6 weeks. One of WWII\u2019s most horrific war crimes.', parties:['Japan','China'] },
  { year:1938, lat:48.2,  lng:16.4,   cat:'DIPLOMACY',  color:'#00ff88', title:'Munich Agreement',                 body:'Britain and France appease Hitler by ceding Czechoslovakia\u2019s Sudetenland. Chamberlain declares \u201cpeace for our time.\u201d Hitler invades the rest of Czechoslovakia 6 months later.', outcome:'Appeasement fails; WWII becomes inevitable' },

  // ── World War II ─────────────────────────────────────────────────────
  { year:1939, lat:52.2,  lng:21.0,   cat:'CONFLICT',   color:'#ff4d00', title:'Germany Invades Poland / WWII Begins', body:'Germany invades from the west, USSR from the east (Molotov-Ribbentrop Pact). Britain and France declare war. WWII begins; 70\u201385 million will die in 6 years.', parties:['Germany & USSR','Poland, then Allied Powers'] },
  { year:1940, lat:51.5,  lng:-0.1,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Britain',                body:'Luftwaffe attempts to destroy the RAF to enable invasion. RAF holds across 4 months. Churchill: \u201cNever in the field of human conflict was so much owed by so many to so few.\u201d', parties:['RAF Britain','Luftwaffe Germany'] },
  { year:1941, lat:55.8,  lng:37.6,   cat:'CONFLICT',   color:'#ff4d00', title:'Operation Barbarossa',             body:'Germany invades the USSR with 3.8 million troops \u2014 the largest invasion in history. Initial gains are staggering. The Eastern Front will produce 30 million of WWII\u2019s deaths.', parties:['Germany & Axis','Soviet Union'] },
  { year:1941, lat:21.3,  lng:-157.8, cat:'CONFLICT',   color:'#ff4d00', title:'Pearl Harbor Attack',              body:'Japan\u2019s carrier strike destroys much of the US Pacific Fleet. The US enters WWII. Japan simultaneously attacks Malaya, Philippines, and Hong Kong \u2014 unleashing the Pacific War.', parties:['Japan','United States'] },
  { year:1942, lat:48.7,  lng:44.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Stalingrad',             body:'The war\u2019s pivotal battle: 6 months, 2 million casualties. Germany\u2019s entire 6th Army is encircled and destroyed. The tide of WWII irrevocably turns. Hitler\u2019s first major defeat.', parties:['Soviet Union','Germany'] },
  { year:1942, lat:28.2,  lng:177.4,  cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Midway',                 body:'US codebreakers allow a smaller US carrier force to ambush the Japanese fleet. Four Japanese fleet carriers are sunk. Japan\u2019s offensive capability is permanently broken.', parties:['United States','Japan'] },
  { year:1944, lat:49.4,  lng:-0.9,   cat:'CONFLICT',   color:'#ff4d00', title:'D-Day \u2014 Normandy Landings',    body:'156,000 Allied troops storm 5 beaches across 50 miles of Normandy coast in the largest seaborne invasion in history. The Western Front is opened. Germany faces war on two fronts.', parties:['Allied Forces','Germany'] },
  { year:1945, lat:34.4,  lng:132.5,  cat:'CONFLICT',   color:'#ff4d00', title:'Hiroshima \u2014 Atomic Bomb',      body:'US drops \u201cLittle Boy\u201d on Hiroshima (Aug 6) and \u201cFat Man\u201d on Nagasaki (Aug 9). 110,000\u2013210,000 killed. Japan surrenders August 15. The nuclear age begins.', parties:['United States','Japan'] },
  { year:1945, lat:48.9,  lng:2.3,    cat:'DIPLOMACY',  color:'#00ff88', title:'WWII Ends \u2014 United Nations Founded', body:'Germany surrenders May 8; Japan September 2. 70\u201385 million dead. The United Nations is founded with 51 original members to prevent future world wars.', outcome:'70\u201385 million killed; world order remade' },

  // ── Cold War ─────────────────────────────────────────────────────────
  { year:1947, lat:28.6,  lng:77.2,   cat:'REVOLUTION', color:'#ffcc00', title:'Indian Independence \u2014 Partition', body:'Britain grants independence to India and Pakistan (August 15 & 14). Partition triggers mass migrations of 10\u201320 million people and communal violence killing 200,000\u20132 million.' },
  { year:1948, lat:31.8,  lng:35.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Israeli Independence \u2014 First Arab-Israeli War', body:'State of Israel is declared May 14; Arab states immediately invade. Israel survives; 700,000 Palestinians are displaced (the Nakba). The modern Middle East conflict begins.', parties:['Israel','Arab States'] },
  { year:1949, lat:39.9,  lng:116.4,  cat:'REVOLUTION', color:'#ffcc00', title:'People\u2019s Republic of China Proclaimed', body:'Mao Zedong proclaims the PRC after Communist victory in the civil war. Chiang Kai-shek retreats to Taiwan. China aligns with the USSR; the world\u2019s most populous nation turns Communist.' },
  { year:1950, lat:37.5,  lng:127.0,  cat:'CONFLICT',   color:'#ff4d00', title:'Korean War',                       body:'North Korea invades South Korea; US-led UN force intervenes; China sends 300,000 troops. 36,000 Americans, 400,000 Chinese, 600,000 Koreans die. Armistice (1953) \u2014 no peace treaty yet.', parties:['UN & South Korea','North Korea & China'] },
  { year:1954, lat:21.4,  lng:103.0,  cat:'CONFLICT',   color:'#ff4d00', title:'Battle of Dien Bien Phu',          body:'Viet Minh forces defeat the French colonial army in a decisive 57-day siege, ending French Indochina and splitting Vietnam at the 17th parallel. The US begins filling the vacuum.', parties:['Viet Minh','France'] },
  { year:1956, lat:30.1,  lng:31.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Suez Crisis',                      body:'Britain, France, and Israel secretly invade Egypt after Nasser nationalizes the Suez Canal. The US and USSR force their withdrawal \u2014 humiliating Europe and signaling the end of colonial-era power.', parties:['Egypt','Britain, France & Israel'] },
  { year:1956, lat:47.5,  lng:19.1,   cat:'REVOLUTION', color:'#ffcc00', title:'Hungarian Revolution Crushed',     body:'Hungarians revolt against Soviet rule. The USSR sends 17 divisions with 1,000 tanks. 2,500 Hungarians die; 200,000 flee. The West does nothing. The Iron Curtain holds.' },
  { year:1957, lat:55.8,  lng:37.6,   cat:'DISCOVERY',  color:'#00d4ff', title:'Sputnik \u2014 Space Age Begins',  body:'The USSR launches Sputnik 1 \u2014 humanity\u2019s first artificial satellite (Oct 4). The Space Race begins. American panic: if Soviets can orbit a satellite, they can orbit a nuclear warhead.' },
  { year:1959, lat:23.1,  lng:-82.4,  cat:'REVOLUTION', color:'#ffcc00', title:'Cuban Revolution',                 body:'Fidel Castro\u2019s guerrillas overthrow US-backed dictator Batista. Cuba becomes a Communist state 90 miles from Florida, transforming Western Hemisphere geopolitics.' },
  { year:1961, lat:52.5,  lng:13.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Berlin Wall Constructed',          body:'East Germany erects a wall through Berlin overnight (Aug 13), sealing the border and halting the flow of refugees West. 171 people die trying to cross it over 28 years.' },
  { year:1962, lat:23.1,  lng:-82.4,  cat:'CONFLICT',   color:'#ff4d00', title:'Cuban Missile Crisis',             body:'US spy planes discover Soviet nuclear missiles in Cuba. 13 days of brinkmanship bring the world closer to nuclear war than any other moment. Soviets withdraw; US pledges not to invade Cuba.', parties:['USA','USSR & Cuba'] },
  { year:1963, lat:32.8,  lng:-96.8,  cat:'CONFLICT',   color:'#ff4d00', title:'JFK Assassinated',                 body:'President John F. Kennedy is shot in Dallas (Nov 22). Lee Harvey Oswald is arrested and then murdered. The assassination reshapes American politics and fuels decades of conspiracy theories.' },
  { year:1965, lat:16.1,  lng:107.8,  cat:'CONFLICT',   color:'#ff4d00', title:'Vietnam War Escalates',            body:'US deploys first combat troops (Marines, March 1965). What follows: 10 years of guerrilla war, 58,000 American and 2 million Vietnamese dead, and eventual Communist victory.', parties:['USA & South Vietnam','North Vietnam & Viet Cong'] },
  { year:1967, lat:31.8,  lng:35.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Six-Day War',                      body:'Israel launches a pre-emptive strike and defeats Egypt, Jordan, and Syria in 6 days, capturing the Sinai, West Bank, Gaza, and Golan Heights \u2014 tripling its territory.', parties:['Israel','Egypt, Jordan & Syria'] },
  { year:1968, lat:50.1,  lng:14.4,   cat:'REVOLUTION', color:'#ffcc00', title:'Prague Spring Crushed',            body:'Czech reformer Dub\u010dek introduces \u201csocialism with a human face.\u201d 500,000 Warsaw Pact troops invade in 3 days. Reform is crushed; the Brezhnev Doctrine is proclaimed.' },
  { year:1969, lat:28.6,  lng:-80.6,  cat:'DISCOVERY',  color:'#00d4ff', title:'Moon Landing \u2014 Apollo 11',    body:'Neil Armstrong and Buzz Aldrin walk on the Moon (July 20). \u201cOne small step for man, one giant leap for mankind.\u201d The US wins the Space Race decisively.' },
  { year:1971, lat:23.8,  lng:90.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Bangladesh Liberation War',        body:'Pakistan\u2019s army conducts genocide in East Pakistan (300,000\u20133 million killed). India intervenes militarily; Pakistan surrenders in 13 days. Bangladesh is born.', parties:['India & Bangladesh','Pakistan'] },
  { year:1973, lat:30.1,  lng:31.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Yom Kippur War',                   body:'Egypt and Syria launch a surprise attack on Israel on Yom Kippur. Initial Arab gains are reversed; Israel counter-attacks deep into Egypt. US-Soviet airlift confrontation raises nuclear alert levels.', parties:['Israel','Egypt & Syria'] },
  { year:1975, lat:10.8,  lng:106.7,  cat:'CONFLICT',   color:'#ff4d00', title:'Fall of Saigon',                   body:'North Vietnamese tanks crash through the Presidential Palace gates (April 30). US helicopters evacuate the last personnel from the embassy roof. The Vietnam War ends in Communist victory.' },
  { year:1979, lat:35.7,  lng:51.4,   cat:'REVOLUTION', color:'#ffcc00', title:'Iranian Revolution',               body:'Mass protests force the Shah to flee. Ayatollah Khomeini returns from exile. Iran becomes an Islamic Republic, transforming Middle East politics and US-Iran relations permanently.' },
  { year:1979, lat:34.5,  lng:69.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Soviet Invasion of Afghanistan',   body:'USSR invades to prop up the Communist Afghan government. A 10-year insurgency, backed by the US, Pakistan, and Saudi Arabia, kills 1\u20132 million Afghans. The mujahideen later become Al-Qaeda.', parties:['USSR','Mujahideen (US/Saudi-backed)'] },
  { year:1980, lat:32.0,  lng:53.0,   cat:'CONFLICT',   color:'#ff4d00', title:'Iran-Iraq War',                    body:'Saddam Hussein\u2019s Iraq invades Iran. 8 years of trench warfare, chemical weapons attacks, and tanker strikes. 500,000\u20131 million dead. Both sides receive US support at various points.', parties:['Iraq','Iran'] },
  { year:1982, lat:-51.7, lng:-59.0,  cat:'CONFLICT',   color:'#ff4d00', title:'Falklands War',                    body:'Argentina invades the British Falkland Islands. Thatcher dispatches a naval task force 13,000 km. Argentina surrenders after 74 days. 907 killed; decisive Thatcher political victory.', parties:['Britain','Argentina'] },
  { year:1986, lat:51.4,  lng:30.1,   cat:'DISASTER',   color:'#cc44ff', title:'Chernobyl Nuclear Disaster',       body:'Reactor 4 explodes, releasing 400\xd7 Hiroshima\u2019s radiation. 31 immediate deaths; long-term deaths estimated at 4,000\u201360,000. The disaster accelerates Gorbachev\u2019s glasnost reforms.' },
  { year:1989, lat:39.9,  lng:116.4,  cat:'REVOLUTION', color:'#ffcc00', title:'Tiananmen Square Massacre',        body:'Chinese military crushes pro-democracy demonstrations with tanks (June 4). Death toll: 200\u201310,000 (disputed). China\u2019s leadership chooses authoritarian capitalism over political reform.' },
  { year:1989, lat:52.5,  lng:13.4,   cat:'REVOLUTION', color:'#ffcc00', title:'Berlin Wall Falls',                body:'East Germany opens its borders (Nov 9); jubilant crowds tear down the Wall. Unification follows in 1990. The Cold War effectively ends. The \u201cend of history\u201d is proclaimed.' },
  { year:1991, lat:29.4,  lng:47.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Gulf War \u2014 Desert Storm',      body:'US-led coalition of 35 nations liberates Kuwait in 42 days with an unprecedented precision air campaign. Ground war lasts 100 hours. Saddam retreats but survives in power.', parties:['US-led Coalition','Iraq'] },
  { year:1991, lat:55.8,  lng:37.6,   cat:'REVOLUTION', color:'#ffcc00', title:'Soviet Union Dissolves',           body:'Gorbachev resigns on Christmas Day. The USSR is replaced by 15 independent states. The Cold War ends. The US emerges as the sole superpower. 74 years of Communist rule ends.' },

  // ── Post-Cold War & Modern ─────────────────────────────────────────
  { year:1992, lat:43.9,  lng:17.7,   cat:'CONFLICT',   color:'#ff4d00', title:'Bosnian War',                      body:'Yugoslavia\u2019s breakup triggers Europe\u2019s worst conflict since WWII. Bosnian Serb forces conduct ethnic cleansing. 100,000 killed; Srebrenica massacre is Europe\u2019s first genocide since WWII.', parties:['Bosnia & Croatia','Bosnian Serbs'] },
  { year:1994, lat:-1.9,  lng:29.9,   cat:'DISASTER',   color:'#cc44ff', title:'Rwandan Genocide',                 body:'Hutu extremists massacre 500,000\u2013800,000 Tutsis and moderate Hutus in 100 days. The international community \u2014 US, UN, and France \u2014 fails to intervene despite clear warning signs.' },
  { year:1994, lat:-29.9, lng:25.1,   cat:'REVOLUTION', color:'#ffcc00', title:'End of Apartheid \u2014 S. Africa',  body:'Nelson Mandela leads the ANC to victory in South Africa\u2019s first democratic elections, ending 46 years of white minority rule. The world watches one of history\u2019s most peaceful transitions of power.' },
  { year:2001, lat:40.7,  lng:-74.0,  cat:'CONFLICT',   color:'#ff4d00', title:'September 11 Attacks',             body:'Al-Qaeda hijackers crash planes into the World Trade Center, Pentagon, and Pennsylvania. 2,977 killed. The War on Terror begins. Airport security, surveillance, and the world are permanently changed.', parties:['Al-Qaeda','United States'] },
  { year:2001, lat:34.5,  lng:69.2,   cat:'CONFLICT',   color:'#ff4d00', title:'US Invades Afghanistan',           body:'NATO invades Afghanistan 26 days after 9/11, toppling the Taliban. What follows is a 20-year war \u2014 America\u2019s longest. The Taliban regains power in 2021 upon US withdrawal.' },
  { year:2003, lat:33.3,  lng:44.4,   cat:'CONFLICT',   color:'#ff4d00', title:'US Invasion of Iraq',              body:'US and UK invade based on (fabricated) WMD claims. Saddam is toppled but insurgency follows. 200,000+ Iraqis and 4,500 US soldiers die. Iraq is destabilized for a generation.', parties:['USA & UK','Iraq'] },
  { year:2004, lat:3.3,   lng:95.9,   cat:'DISASTER',   color:'#cc44ff', title:'Indian Ocean Tsunami',             body:'A 9.1 magnitude earthquake off Sumatra triggers tsunamis killing 227,898 people across 14 countries \u2014 the deadliest tsunami in recorded history. 1.7 million are displaced.' },
  { year:2008, lat:42.0,  lng:43.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Russia-Georgia War',               body:'Russia invades Georgia, recognizes South Ossetia and Abkhazia as independent. The first Russian military action in a former Soviet republic \u2014 a direct preview of the Ukraine invasions.', parties:['Russia','Georgia'] },
  { year:2010, lat:33.8,  lng:9.6,    cat:'REVOLUTION', color:'#ffcc00', title:'Arab Spring Begins',               body:'Mohamed Bouazizi\u2019s self-immolation in Tunisia (Dec 2010) triggers a wave of pro-democracy protests across the Arab world. Tunisia democratizes; Egypt, Libya, Syria spiral into chaos.' },
  { year:2011, lat:32.9,  lng:13.2,   cat:'CONFLICT',   color:'#ff4d00', title:'Libyan Civil War \u2014 Gaddafi Killed', body:'NATO-backed rebels overthrow and kill Muammar Gaddafi. Libya descends into years of civil war, militia rule, and becomes the main human-trafficking route to Europe.', parties:['NATO & Rebels','Gaddafi Government'] },
  { year:2011, lat:33.5,  lng:36.3,   cat:'CONFLICT',   color:'#ff4d00', title:'Syrian Civil War Begins',          body:'Assad crushes Arab Spring protests with live fire. Multi-faction war erupts. 500,000+ dead; 6 million refugees. ISIS rises. Russia and Iran prop up Assad with decisive military support.', parties:['Assad + Russia + Iran','Rebels, Kurds, ISIS'] },
  { year:2014, lat:45.4,  lng:34.4,   cat:'CONFLICT',   color:'#ff4d00', title:'Russia Annexes Crimea',            body:'Russia seizes Crimea from Ukraine and foments separatist war in the Donbas. The first forcible annexation of European territory since WWII. Western sanctions follow but change little.', parties:['Russia','Ukraine'] },
  { year:2014, lat:33.3,  lng:43.7,   cat:'CONFLICT',   color:'#ff4d00', title:'ISIS Caliphate Proclaimed',        body:'ISIS (Islamic State) seizes Mosul and declares a caliphate across Iraq and Syria, controlling territory the size of the UK and 8 million people. A global terrorist campaign follows.' },
  { year:2020, lat:30.6,  lng:114.3,  cat:'DISASTER',   color:'#cc44ff', title:'COVID-19 Global Pandemic',        body:'SARS-CoV-2 emerges in Wuhan and spreads to every country. 7+ million officially dead (15\u201320 million estimated). The largest global health crisis since the 1918 flu. Global economy collapses.' },
  { year:2022, lat:50.4,  lng:30.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Russia Invades Ukraine (Full Scale)', body:'Russia launches a full-scale invasion of Ukraine (February 24). The largest land war in Europe since WWII. Hundreds of thousands of casualties; cities destroyed; nuclear threats raised.', parties:['Russia','Ukraine & Western-backed allies'] },
  { year:2023, lat:31.5,  lng:34.5,   cat:'CONFLICT',   color:'#ff4d00', title:'Hamas Attacks Israel \u2014 Gaza War', body:'Hamas launches an unprecedented attack from Gaza (Oct 7), killing 1,200 Israelis and taking 250 hostages. Israel launches a major military campaign in Gaza; 40,000+ Palestinian casualties in the first year.', parties:['Israel','Hamas'] },
];

function getEra(y) {
  if (y < 1600) return 'AGE OF EXPLORATION';
  if (y < 1700) return 'COLONIAL EXPANSION';
  if (y < 1800) return 'ENLIGHTENMENT & REVOLUTION';
  if (y < 1815) return 'NAPOLEONIC ERA';
  if (y < 1850) return 'INDUSTRIAL REVOLUTION';
  if (y < 1900) return 'IMPERIAL AGE';
  if (y < 1914) return 'BELLE \xc9POQUE';
  if (y < 1919) return 'WORLD WAR I';
  if (y < 1939) return 'INTERWAR PERIOD';
  if (y < 1946) return 'WORLD WAR II';
  if (y < 1991) return 'COLD WAR';
  if (y < 2001) return 'POST-COLD WAR';
  if (y < 2012) return 'WAR ON TERROR';
  return 'MODERN ERA';
}

function onHistSlider(val) {
  histYear = parseInt(val, 10);
  document.getElementById('hist-year-num').textContent = histYear;
  document.getElementById('hist-era-label').textContent = getEra(histYear);
  var pct = ((histYear - 1500) / (2024 - 1500) * 100).toFixed(1);
  var sl = document.getElementById('hist-slider');
  if (sl) sl.style.background = 'linear-gradient(to right,var(--accent) 0%,var(--accent) ' + pct + '%,var(--border) ' + pct + '%,var(--border) 100%)';
  if (histMapInited) renderHistYear();
}

function setHistFilter(cat, btn) {
  histCatFilter = cat;
  document.querySelectorAll('.hf-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (histMapInited) renderHistYear();
}

function initHistMap() {
  if (histMapInited) return;
  histMapInited = true;
  histMap = L.map('hist-map', { center:[25,15], zoom:2, zoomControl:true, attributionControl:false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { subdomains:'abcd', maxZoom:19 }).addTo(histMap);
  histLayer = L.layerGroup().addTo(histMap);
  onHistSlider(histYear); // set initial slider gradient
  renderHistYear();
  setTimeout(function(){ if (histMap) histMap.invalidateSize(); }, 200);
}

function renderHistYear() {
  if (!histMap || !histLayer) return;
  histLayer.clearLayers();
  var visible = HIST_DATA.filter(function(e) {
    return Math.abs(e.year - histYear) <= HIST_WINDOW &&
           (histCatFilter === 'ALL' || e.cat === histCatFilter);
  });
  visible.forEach(function(e) {
    var diff = Math.abs(e.year - histYear);
    var isCur = diff <= 3;
    var opacity = isCur ? 0.95 : Math.max(0.2, 1 - diff / HIST_WINDOW * 0.8);
    var radius  = isCur ? 9 : 5;
    var marker = L.circleMarker([e.lat, e.lng], {
      radius: radius, fillColor: e.color, color: e.color,
      weight: isCur ? 2 : 1, opacity: opacity, fillOpacity: opacity * 0.75,
    });
    var partHtml    = e.parties  ? '<br><span style="color:var(--dim2)">Parties: ' + e.parties.join(' vs. ') + '</span>' : '';
    var outcomeHtml = e.outcome  ? '<br><em style="color:var(--dim2)">' + e.outcome + '</em>' : '';
    marker.bindPopup(
      '<div class="popup-cat" style="color:' + e.color + '">[' + e.cat + '] ' + e.year + '</div>' +
      '<div class="popup-title">' + e.title + '</div>' +
      '<div class="popup-body">' + e.body + partHtml + outcomeHtml + '</div>'
    );
    marker.addTo(histLayer);
  });
  updateHistFeed(visible);
}

function updateHistFeed(events) {
  var hdr  = document.getElementById('hist-feed-hdr');
  var list = document.getElementById('hist-feed-list');
  if (!hdr || !list) return;
  hdr.textContent = 'EVENTS \u00b720 YRS \u2014 ' + histYear;
  var sorted = (events || []).slice().sort(function(a, b) {
    return Math.abs(a.year - histYear) - Math.abs(b.year - histYear);
  });
  if (!sorted.length) {
    list.innerHTML = '<div style="padding:12px 10px;font-family:\'Share Tech Mono\',monospace;font-size:10px;color:var(--dim2)">No events in this window.</div>';
    return;
  }
  list.innerHTML = sorted.map(function(e) {
    var isHL  = Math.abs(e.year - histYear) <= 3;
    var short = e.body.length > 110 ? e.body.slice(0, 108) + '\u2026' : e.body;
    return '<div class="hist-event' + (isHL ? ' hl' : '') + '" onclick="histFocus(' + e.lat + ',' + e.lng + ')">' +
      '<div class="hist-event-meta">' +
        '<span class="hist-yr">' + e.year + '</span>' +
        '<span class="hist-cdot" style="background:' + e.color + '"></span>' +
        '<span class="hist-cat-lbl">' + e.cat + '</span>' +
      '</div>' +
      '<div class="hist-etitle">' + e.title + '</div>' +
      '<div class="hist-ebody">' + short + '</div>' +
    '</div>';
  }).join('');
}

function histFocus(lat, lng) {
  if (histMap) histMap.setView([lat, lng], 5, { animate:true });
}

// ── DEFENSE SPENDING COUNTER ───────────────────────────────────────────────
(function initDefenseCounter() {
  var FY_BUDGET   = 849.8e9;                           // FY2025 enacted
  var FY_START    = new Date('2024-10-01T00:00:00Z');  // Oct 1, 2024
  var PER_SEC     = FY_BUDGET / (365.25 * 24 * 3600); // ~$26,929/s

  function fmt(n) {
    // Always show X.XXB format
    var b = n / 1e9;
    if (b >= 100) return '$' + b.toFixed(1) + 'B';
    return '$' + b.toFixed(2) + 'B';
  }

  function update() {
    var elapsed = (Date.now() - FY_START.getTime()) / 1000;
    if (elapsed < 0) elapsed = 0;
    var spent   = Math.min(elapsed * PER_SEC, FY_BUDGET);
    var pct     = (spent / FY_BUDGET * 100);

    var el = document.getElementById('def-counter-val');
    if (el) el.textContent = fmt(spent);

    var bar = document.getElementById('def-bar-fill');
    if (bar) bar.style.width = Math.min(pct, 100) + '%';

    var rate = document.getElementById('def-per-sec');
    if (rate) rate.textContent = '$' + Math.round(PER_SEC).toLocaleString() + '/sec';
  }

  update();
  setInterval(update, 100); // update 10x/sec for smooth counter
})();

// ── NUCLEAR ARSENAL GRID ──────────────────────────────────────────────────
(function initNukeGrid() {
  var NUKES = [
    { flag:'🇷🇺', name:'RUSSIA',   total:6257, deployed:1558, color:'#f44336' },
    { flag:'🇺🇸', name:'USA',      total:5550, deployed:1670, color:'#00c8f0' },
    { flag:'🇨🇳', name:'CHINA',    total:410,  deployed:0,    color:'#ff9800' },
    { flag:'🇫🇷', name:'FRANCE',   total:290,  deployed:280,  color:'#f5c518' },
    { flag:'🇬🇧', name:'UK',       total:225,  deployed:120,  color:'#f5c518' },
    { flag:'🇮🇳', name:'INDIA',    total:172,  deployed:0,    color:'#a855f7' },
    { flag:'🇵🇰', name:'PAKISTAN', total:170,  deployed:0,    color:'#4caf50' },
    { flag:'🇮🇱', name:'ISRAEL',   total:90,   deployed:0,    color:'#2196f3' },
    { flag:'🇰🇵', name:'DPRK',     total:50,   deployed:0,    color:'#cc44ff' },
  ];
  var MAX = 6257;

  function render() {
    var el = document.getElementById('nuke-grid-cell');
    if (!el) return;
    var html = NUKES.map(function(c) {
      var wp = (c.total  / MAX * 100).toFixed(1);
      var dp = (c.deployed / MAX * 100).toFixed(1);
      return '<div class="nuke-row">' +
        '<span class="nuke-flag">' + c.flag + '</span>' +
        '<span class="nuke-name">' + c.name + '</span>' +
        '<div class="nuke-bar-wrap">' +
          '<div class="nuke-bar-total" style="width:' + wp + '%;background:' + c.color + '22;"></div>' +
          (c.deployed > 0
            ? '<div class="nuke-bar-dep"   style="width:' + dp + '%;background:' + c.color + ';"></div>'
            : '') +
        '</div>' +
        '<span class="nuke-count">' + c.total.toLocaleString() + '</span>' +
      '</div>';
    }).join('');
    html += '<div class="nuke-legend">' +
      '<span><span class="nuke-ldot" style="background:#888"></span>Total</span>' +
      '<span><span class="nuke-ldot" style="background:#00c8f0"></span>Deployed</span>' +
      '<span style="margin-left:auto;color:var(--dim)">SIPRI 2024</span>' +
    '</div>';
    el.innerHTML = html;
  }

  render();
})();

// ── SATELLITE COUNT IN STATUS BAR ─────────────────────────────────────────
(function watchSatCount() {
  setInterval(function() {
    var el = document.getElementById('status-sat-count');
    if (!el || typeof satObjects === 'undefined') return;
    var total = Object.keys(satObjects).reduce(function(n,k){ return n + satObjects[k].length; }, 0);
    el.textContent = 'SATS: ' + total;
  }, 3000);
})();

// ── INIT ──────────────────────────────────────────────────────────────────

(function(){ var n = document.getElementById('nav-cameras'); if(n) n.classList.add('active'); })();
