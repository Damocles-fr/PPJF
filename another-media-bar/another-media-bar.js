(function () {
    'use strict';

    /*  Another Media Bar v1.18 for Jellyfin 12 (JavaScript Injector)
     *
     *  SETTINGS
     */
    const CONFIG = {
        // SOURCE
        KEFIN_SECTIONS: [],                          // KefinTweaks home rows the items come from, by name or id. [] = random library items only. Example: ['Tendances Films', 'Horreur', 'Halloween']
        RANDOM_SHARE: 0,                             // With KEFIN_SECTIONS: part of the items picked at random in the whole library, mixed with the rows' items (TYPES and QUERY apply). 0 = none, 0.25 = a quarter, 0.5 = half
        SHUFFLE: true,                               // With KEFIN_SECTIONS: true = items taken in turn from each row (a small row counts as much as a big one), shown in random order. false = the rows one after the other, in their order
        FALLBACK_RANDOM: true,                       // With KEFIN_SECTIONS: true = random library items when the rows are not found or have nothing to show. false = only the RANDOM_SHARE items, or no bar
        TYPES: 'Movie,Series',                       // Random items: kind of items. 'Movie', 'Series' or 'Movie,Series'
        QUERY: {},                                   // Random items: extra Jellyfin filters. {} = none. Example: { IsPlayed: false, MinCommunityRating: 7 }
        POOL_SIZE: 28,                               // Number of items loaded once per page load, then shown in turn

        // SLIDES
        INTERVAL_MS: 12000,                          // Time on each slide, in milliseconds. Example: 8000 = 8 seconds
        INSTANT_START: true,                         // true = start at once with the items kept from the previous visit, the new items load in the background
        SHOW_COMMUNITY_RATING: true,                 // true = community rating, with the IMDb logo
        SHOW_CRITIC_RATING: true,                    // true = critic rating, with the MDBList logo
        MAX_GENRES: 2,                               // Number of genres shown. 0 = none
        PLOT_MAX_LENGTH: 450,                        // Longest synopsis, in characters (it is also cut to 3 lines)
        LANGUAGE: 'auto',                            // Labels language. 'auto' = Jellyfin display language, 'fr' = French, 'en' = English

        // DESIGN
        HEIGHT: '60vh',                              // Where the first row starts, from the top of the page. Example: '55vh'
        FADE_ABOVE: '9vh',                           // Where the bottom fade of the backdrop starts, above the first row
        FADE_BELOW: '16vh',                          // How far the backdrop goes on behind the first row while it fades out
        SIDE_FADE: 0.24,                             // Part of the backdrop width that fades out on the right. 0 = sharp edge, 0.5 = half the width
        SIDE_FADE_MIN: 0.3,                          // Backdrop opacity left at the right edge. 0 = fully faded, 1 = no fade
        BACKDROP_POSITION: 'center top',             // Part of the backdrop kept when it has to be cropped. 'center top' = the top is never cut
        LOGO_MAX_WIDTH: '36vw',                      // Largest logo width. Smaller logos keep their real size
        LOGO_MAX_HEIGHT: '24vh',                     // Largest logo height
        LOGO_MARGIN_LEFT: '1vw',                     // Space between the left edge of the text and the logo
        HEADER_MODE: 'blend',                        // 'blend' = at the top of the page, the bar's shade replaces the header background. 'theme' = keep the theme's header
        HEADER_SHADE: 0.8,                           // Darkness of the shade at the very top of the page. 0 = none, 1 = darkest
        HEADER_FADE: '12vh',                         // How far below the header the shade ends
        HEADER_COLOR: '',                            // Shade color. '' = the page background color. Example: '#000000'
        IMAGE_QUALITY: 90,                           // Backdrop and logo quality asked from the server. 10 to 100
        BACKDROP_MAX_WIDTH: 0,                       // Backdrop width asked from the server, in pixels. 0 = fit the screen

        // PHONES (screens up to 768 px wide)
        HEIGHT_MOBILE: 'min(53vh, 106vw)',           // Where the first row starts, from the top of the page
        BACKDROP_HEIGHT_MOBILE: 'min(62vh, 125vw)',  // Backdrop drawn as if the bar were this high, so a smaller HEIGHT_MOBILE only cuts the bottom of the image
        TEXT_DROP_MOBILE: 0.1,                       // How far below the bar the logo and text may go, over the empty top of the rows, as a part of the screen height; always stops just above the first row. 0 = never, 0.1 = up to 10 %
        DOTS_MOBILE: true,                           // true = small dots under the synopsis, one per item
        LOGO_MAX_WIDTH_MOBILE: '62vw',               // Largest logo width
        LOGO_MAX_HEIGHT_MOBILE: '16vh',              // Largest logo height
        LOGO_ALIGN_MOBILE: 'center',                 // Logo position. 'center' = centered (the text stays on the left), 'left' = aligned with the text like desktop
        IMAGE_QUALITY_MOBILE: 82                     // Image quality on touch screens, phones and tablets. 10 to 100
    };

    if (window.__anotherMediaBar) return;
    window.__anotherMediaBar = true;

    const TAG = '[Another Media Bar]';
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const FADE_MS = 1300;
    const FIELDS = 'Overview,Genres,ChildCount';
    const GUID = /^[0-9a-f]{32}$/i;
    const POOL = Math.max(1, Math.round(+CONFIG.POOL_SIZE) || 15);
    const TOUCH = !!(window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);
    const PHONE = window.matchMedia ? matchMedia('screen and (max-width: 768px)') : null;
    const QUALITY = Math.min(100, Math.max(10, Math.round(+(TOUCH ? CONFIG.IMAGE_QUALITY_MOBILE : CONFIG.IMAGE_QUALITY)) || 90));
    const SECTIONS = [].concat(CONFIG.KEFIN_SECTIONS || []).map(s => String(s).trim()).filter(Boolean);
    const STORE = 'amb-pool:';
    const ROOM = 'amb-room';
    const SIG = JSON.stringify([1, SECTIONS, CONFIG.RANDOM_SHARE, CONFIG.TYPES, CONFIG.QUERY, POOL, CONFIG.MAX_GENRES, CONFIG.PLOT_MAX_LENGTH]);
    const I18N = {
        en: { season: ['Season', 'Seasons'], prev: 'Previous', next: 'Next', open: 'Open details' },
        fr: { season: ['saison', 'saisons'], prev: 'Précédent', next: 'Suivant', open: 'Ouvrir la fiche' }
    };

    const svg = s => 'data:image/svg+xml,' + encodeURIComponent(s);
    const IMDB = svg('<svg xmlns="http://www.w3.org/2000/svg" width="575" height="289.83" viewBox="0 0 575 289.83"><path fill="#f6c700" d="M575 24.91C573.44 12.15 563.97 1.98 551.91 0C499.05 0 76.18 0 23.32 0C10.11 2.17 0 14.16 0 28.61C0 51.84 0 237.64 0 260.86C0 276.86 12.37 289.83 27.64 289.83C79.63 289.83 495.6 289.83 547.59 289.83C561.65 289.83 573.26 278.82 575 264.57C575 216.64 575 48.87 575 24.91Z"/><path fill="#000" d="M69.35 58.24L114.98 58.24L114.98 233.89L69.35 233.89L69.35 58.24ZM201.2 139.15C197.28 112.38 195.1 97.5 194.67 94.53C192.76 80.2 190.94 67.73 189.2 57.09C185.25 57.09 165.54 57.09 130.04 57.09L130.04 232.74L170.01 232.74L170.15 116.76L186.97 232.74L215.44 232.74L231.39 114.18L231.54 232.74L271.38 232.74L271.38 57.09L211.77 57.09L201.2 139.15ZM346.71 93.63C347.21 95.87 347.47 100.95 347.47 108.89C347.47 115.7 347.47 170.18 347.47 176.99C347.47 188.68 346.71 195.84 345.2 198.48C343.68 201.12 339.64 202.43 333.09 202.43C333.09 190.9 333.09 98.66 333.09 87.13C338.06 87.13 341.45 87.66 343.25 88.7C345.05 89.75 346.21 91.39 346.71 93.63ZM367.32 230.95C372.75 229.76 377.31 227.66 381.01 224.67C384.7 221.67 387.29 217.52 388.77 212.21C390.26 206.91 391.14 196.38 391.14 180.63C391.14 174.47 391.14 125.12 391.14 118.95C391.14 102.33 390.49 91.19 389.48 85.53C388.46 79.86 385.93 74.71 381.88 70.09C377.82 65.47 371.9 62.15 364.12 60.13C356.33 58.11 343.63 57.09 321.54 57.09C319.27 57.09 307.93 57.09 287.5 57.09L287.5 232.74L342.78 232.74C355.52 232.34 363.7 231.75 367.32 230.95ZM464.76 204.7C463.92 206.93 460.24 208.06 457.46 208.06C454.74 208.06 452.93 206.98 452.01 204.81C451.09 202.65 450.64 197.72 450.64 190C450.64 185.36 450.64 148.22 450.64 143.58C450.64 135.58 451.04 130.59 451.85 128.6C452.65 126.63 454.41 125.63 457.13 125.63C459.91 125.63 463.64 126.76 464.6 129.03C465.55 131.3 466.03 136.15 466.03 143.58C466.03 146.58 466.03 161.58 466.03 188.59C465.74 197.84 465.32 203.21 464.76 204.7ZM406.68 231.21L447.76 231.21C449.47 224.5 450.41 220.77 450.6 220.02C454.32 224.52 458.41 227.9 462.9 230.14C467.37 232.39 474.06 233.51 479.24 233.51C486.45 233.51 492.67 231.62 497.92 227.83C503.16 224.05 506.5 219.57 507.92 214.42C509.34 209.26 510.05 201.42 510.05 190.88C510.05 185.95 510.05 146.53 510.05 141.6C510.05 131 509.81 124.08 509.34 120.83C508.87 117.58 507.47 114.27 505.14 110.88C502.81 107.49 499.42 104.86 494.98 102.98C490.54 101.1 485.3 100.16 479.26 100.16C474.01 100.16 467.29 101.21 462.81 103.28C458.34 105.35 454.28 108.49 450.64 112.7C450.64 108.89 450.64 89.85 450.64 55.56L406.68 55.56L406.68 231.21Z"/></svg>');
    const MDBL = svg('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" rx="30" fill="#4284cb"/><path fill="#fff" d="M61 76h30l53 49.3v39.5l-50-47.7V224H61zm178 0h-30l-52 48.4v39.5l50-46.7V224h32z"/></svg>');

    const S = {
        api: null, user: '', epoch: 0, started: false, waiting: false, loading: null, failed: false,
        pool: [], order: [], after: null, pos: -1, start: 0, shown: '', random: !SECTIONS.length, stamp: 0,
        bar: null, stage: null, bds: null, txs: null, prevBtn: null, dots: null, slide: null, seq: 0, opening: false, bdw: 0,
        vis: false, timer: 0, pre: 0, lock: 0, touch: null, io: null, ro: null, roTarget: null, rs: null, rsTarget: null, rz: 0, room: null
    };
    try { S.room = JSON.parse(localStorage.getItem(ROOM)) || null; } catch (e) { }

    const lang = () => String((CONFIG.LANGUAGE !== 'auto' && CONFIG.LANGUAGE) || document.documentElement.lang || navigator.language || 'en');
    const tr = () => I18N[lang().slice(0, 2).toLowerCase()] || I18N.en;
    const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const tpl = document.createElement('template');
    const clean = s => {
        if (!s) return '';
        s = String(s);
        if (/[<&]/.test(s)) { tpl.innerHTML = s.replace(/<br\s*\/?>/gi, ' '); s = tpl.content.textContent || ''; tpl.innerHTML = ''; }
        return s.replace(/\s+/g, ' ').trim();
    };
    const cut = (s, n) => s.length > n ? s.slice(0, n).trimEnd() + '...' : s;
    const yearOf = s => { const m = /^(\d{4})/.exec(s || ''); return m ? +m[1] : 0; };
    const norm = v => String(v == null ? '' : v).normalize('NFC').trim().toLowerCase();
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const waitFor = async (test, ms, step) => {
        const t0 = Date.now(), end = t0 + ms;
        for (;;) {
            const v = test();
            if (v || Date.now() >= end) return v || null;
            await sleep(Date.now() - t0 > 20000 ? Math.max(step, 1000) : step);
        }
    };
    const shuffle = a => {
        const r = a.slice();
        for (let i = r.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [r[i], r[j]] = [r[j], r[i]];
        }
        return r;
    };
    const mk = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text) e.textContent = text;
        return e;
    };

    const css = () => {
        if (document.getElementById('amb-style')) return;
        const shade = Math.max(0, Math.min(1, +CONFIG.HEADER_SHADE || 0));
        const side = Math.max(0, Math.min(0.5, +CONFIG.SIDE_FADE || 0));
        const sideMin = Math.max(0, Math.min(1, +CONFIG.SIDE_FADE_MIN || 0));
        const num = v => String(Math.round(v * 1000) / 1000);
        const pct = k => num(k * 100) + '%';
        const curve = (a0, a1, n, pow, into, at) => Array.from({ length: n + 1 }, (_, i) => {
            const k = i / n;
            const t = into ? 1 - Math.pow(1 - k, pow) : Math.pow(k, pow);
            return [a0 + (a1 - a0) * t, at(k)];
        });
        const smooth = (a0, n, at) => Array.from({ length: n + 1 }, (_, i) => {
            const k = i / n;
            return [a0 * (1 - k * k * (3 - 2 * k)), at(k)];
        });
        const black = ([a, at]) => 'rgba(0,0,0,' + num(a) + ') ' + at;
        const tone = ([a, at]) => 'color-mix(in srgb,var(--amb-hc) ' + num(a * 100) + '%,transparent) ' + at;
        const tint = smooth(shade, 14, k => pct(k));
        const vmask = [[1, '0']]
            .concat(curve(1, 0.5, 5, 1.8, false, k => 'calc(100% - var(--amb-extend) - var(--amb-up) * ' + num(1 - k) + ')'))
            .concat(curve(0.5, 0, 5, 1.5, true, k => 'calc(100% - var(--amb-extend) * ' + num(1 - k) + ')').slice(1));
        const hmask = side && sideMin < 1 ? [[1, '0']].concat(smooth(1 - sideMin, 8, k => pct(1 - side + side * k)).map(([a, at]) => [a + sideMin, at])) : [[1, '0'], [1, '100%']];
        const grad = (stops, fn) => 'linear-gradient(' + fn + ',' + stops.map(black).join(',') + ')';
        const style = document.createElement('style');
        style.id = 'amb-style';
        style.textContent = [
            '.amb{--amb-bleed:0px;--amb-drop:0px;--amb-dots:0px;--amb-h:' + CONFIG.HEIGHT + ';--amb-extend:' + CONFIG.FADE_BELOW + ';--amb-up:' + CONFIG.FADE_ABOVE + ';--amb-hf:' + CONFIG.HEADER_FADE + ';' +
                '--amb-hc:' + (String(CONFIG.HEADER_COLOR || '').trim() || 'var(--jf-palette-background-default,#101010)') + ';' +
                '--amb-side:max(3.3%,env(safe-area-inset-left));--amb-gutter:calc(.75rem + 52px);--amb-col:45vw;' +
                '--amb-sh:drop-shadow(0 3px 7px rgba(0,0,0,.82)) drop-shadow(0 5px 12px rgba(0,0,0,.68)) drop-shadow(0 0 3px rgba(0,0,0,.45));' +
                '--amb-sh-r:drop-shadow(0 3px 7px rgba(0,0,0,.82)) drop-shadow(0 5px 12px rgba(0,0,0,.68)) drop-shadow(0 0 3px rgba(0,0,0,.72));' +
                '--amb-sh-l:drop-shadow(0 2px 3px rgba(0,0,0,.5));' +
                'position:relative;display:block;box-sizing:border-box;width:100%;height:max(240px,calc(var(--amb-h) - var(--amb-bleed)));margin:0;padding:0;' +
                'font-size:max(1rem,16px);line-height:normal;color:#f5f5f5;text-align:left;-webkit-user-select:none;user-select:none;touch-action:pan-y;-webkit-tap-highlight-color:transparent}',
            '.amb~.sections{position:relative;z-index:0}',
            '.amb-stage,.amb-txs{position:absolute;left:0;right:0;top:calc(var(--amb-bleed) * -1 - 1px);bottom:calc(var(--amb-extend) * -1);overflow:hidden;pointer-events:none}',
            '.amb-stage{z-index:0}',
            '.amb-txs{z-index:1}',
            '.amb-bds{position:absolute;top:0;right:0;bottom:0;left:0}',
            '.amb-tint{position:absolute;top:0;left:0;right:0;height:calc(var(--amb-bleed) + 1px + var(--amb-hf));' +
                'background:linear-gradient(180deg,' + tint.map(black).join(',') + ');background:linear-gradient(180deg,' + tint.map(tone).join(',') + ')}',
            CONFIG.HEADER_MODE === 'theme' ? '' : [
                'html.amb-hero .MuiAppBar-root.MuiAppBar-colorTransparent{background:transparent!important;border-color:transparent!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}',
                'html.amb-hero .MuiAppBar-root.MuiAppBar-colorTransparent::before,html.amb-hero .MuiAppBar-root.MuiAppBar-colorTransparent::after{opacity:0!important}'
            ].join('\n'),
            '.amb-slide{position:absolute;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity 1.3s ease}',
            '.amb-txs .amb-slide{filter:blur(5px);transition:opacity 1.3s ease,filter 1.3s ease}',
            '.amb-slide.amb-on{opacity:1}',
            '.amb-txs .amb-slide.amb-on{filter:blur(0)}',
            '.amb-slide.amb-quick{transition-duration:.6s}',
            '.amb-slide.amb-now{transition:none}',
            '.amb-txs .amb-slide.amb-on.amb-done{filter:none}',
            '.amb-bdw{position:absolute;top:0;right:0;bottom:0;left:0;-webkit-mask-image:' + grad(vmask, 'to bottom') + ';mask-image:' + grad(vmask, 'to bottom') + '}',
            '.amb-bd:not(.amb-ld){opacity:0}',
            '.amb-probe{position:absolute;top:0;left:0;width:1px;height:100%;visibility:hidden;pointer-events:none}',
            '.amb-bd{transition:opacity .45s ease;position:absolute;top:0;left:0;display:block;width:100%;height:100%;max-width:none;margin:0;border:0;border-radius:0;object-fit:cover;object-position:' + (CONFIG.BACKDROP_POSITION || 'center top') + ';' +
                '-webkit-mask-image:' + grad(hmask, 'to right') + ';mask-image:' + grad(hmask, 'to right') + '}',
            '.amb-text{position:absolute;left:max(var(--amb-side),var(--amb-gutter));bottom:calc(var(--amb-extend) + 3.25em);max-width:60vw;display:flex;flex-direction:column;align-items:flex-start;gap:.8em;' +
                'pointer-events:auto;cursor:pointer;outline:none}',
            '.amb-text::before{content:"";position:absolute;top:-1.5em;right:-2.5em;bottom:-1.25em;left:-2.5em}',
            '.amb-slide:not(.amb-on) .amb-text{pointer-events:none}',
            '.amb-head{display:flex;flex-direction:column;align-items:flex-start;max-width:100%}',
            '.amb-logo{display:block;flex:none;align-self:flex-start;width:auto;height:auto;max-width:min(' + CONFIG.LOGO_MAX_WIDTH + ',100%);' +
                'max-height:max(2.5em,min(' + CONFIG.LOGO_MAX_HEIGHT + ',calc(var(--amb-h) - var(--amb-bleed) - 15em)));object-fit:contain;object-position:left bottom;' +
                'margin:0 0 1.8em ' + CONFIG.LOGO_MARGIN_LEFT + ';filter:drop-shadow(1px 1px 1.1px #000)}',
            '.amb-meta{margin:-20px;padding:20px;max-width:max(var(--amb-col),36em);font-size:1.2em;font-weight:400;line-height:1.8em;color:#f5f5f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
            '.amb-meta *{white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
            '.amb-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:-20px;padding:20px}',
            '.amb-row>*{filter:var(--amb-sh)}',
            '.amb-item{display:inline-flex;align-items:center;gap:6px}',
            '.amb-item::before{content:"";flex:none;width:.36em;height:.36em;margin-right:6px;border-radius:50%;background-color:#3d36b2}',
            '.amb-row>.amb-item:first-child::before,.amb-row>.amb-nl::before{display:none}',
            '.amb-val{margin-right:-6px;filter:var(--amb-sh-r)}',
            '.amb-rl{display:block;flex:none;width:calc(var(--amb-rh) * 1.984);height:var(--amb-rh);margin-right:-6px;filter:var(--amb-sh-l);--amb-rh:.94em}',
            '.amb-rl.amb-rl-m{width:var(--amb-rh)}',
            '.amb-br{display:none}',
            '.amb .material-icons{font-size:1em;line-height:1;width:auto;height:auto}',
            '.amb-row .material-icons{display:inline-block;vertical-align:middle}',
            '.amb-row .amb-star{color:gold}',
            '.amb-row>.amb-star-c{filter:hue-rotate(170deg) saturate(1.4) var(--amb-sh)}',
            '.amb-plot{max-width:var(--amb-col);font-size:1.2em;font-weight:500;line-height:1.3em;color:#f1f1f1;white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;' +
                '-webkit-line-clamp:3;line-clamp:3;overflow:hidden;text-overflow:ellipsis;filter:var(--amb-sh)}',
            '.amb-nav{position:absolute;top:50%;z-index:3;box-sizing:border-box;width:48px;height:48px;min-width:0;display:flex;align-items:center;justify-content:center;margin:0;padding:0;' +
                'border:1px solid transparent;border-radius:9999px;background:transparent;box-shadow:none;color:var(--md-sys-color-on-primary-container,#e9ddff);font:inherit;font-size:1.4em;' +
                'cursor:pointer;transform:translateY(-50%);transition:transform .2s ease;-webkit-appearance:none;appearance:none}',
            '.amb-dots{position:absolute;left:0;right:0;top:calc(100% + var(--amb-drop));box-sizing:border-box;height:var(--amb-dots);padding-top:6px;display:none;align-items:center;justify-content:center;gap:6px;pointer-events:none;z-index:2}',
            '.amb-dots>i{display:block;flex:none;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.38);box-shadow:0 0 2px rgba(0,0,0,.35);transition:background-color .3s ease,transform .3s ease}',
            '.amb-dots>i.amb-dot-on{background:#fff}',
            '.amb-dots>i.amb-dot-s{transform:scale(.6)}',
            '.amb-prev{left:.75rem}',
            '.amb-next{right:.75rem}',
            '.amb-nav::after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:inherit;background-color:currentColor;opacity:0;pointer-events:none;transition:opacity .2s ease}',
            '.amb-nav:not(:disabled):hover{transform:translateY(-50%) scale(1.35)}',
            '.amb-nav:not(:disabled):hover::after{opacity:.08}',
            '.amb-nav .material-icons{font-size:max(2rem,32px);text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:none}',
            '.amb-nav:disabled{opacity:.5;cursor:default}',
            '.amb-nav:focus-visible,.amb-text:focus-visible{outline:2px solid currentColor;outline-offset:6px}',
            '@media screen and (max-width:768px){' +
                '.amb{--amb-h:' + CONFIG.HEIGHT_MOBILE + ';--amb-col:90vw;--amb-side:5vw;--amb-gutter:calc(.75rem + 44px)}' +
                (CONFIG.DOTS_MOBILE ? '.amb:not(.amb-no-dots){--amb-dots:28px}.amb:not(.amb-no-dots) .amb-dots{display:flex}' : '') +
                '.amb-bd,.amb-probe{height:max(100%,calc(' + CONFIG.BACKDROP_HEIGHT_MOBILE + ' + 1px + var(--amb-extend)))}' +
                '.amb-text{right:5vw;max-width:90vw;gap:.6em;bottom:calc(var(--amb-extend) - var(--amb-drop));transition:bottom .35s ease}' +
                '.amb-text::before{right:-5vw;bottom:calc(var(--amb-dots) * -1);left:-5vw}' +
                '.amb-dots{transition:top .35s ease}' +
                (CONFIG.LOGO_ALIGN_MOBILE === 'left' ? '' : '.amb-head{align-self:stretch}') +
                '.amb-logo{max-width:' + CONFIG.LOGO_MAX_WIDTH_MOBILE + ';max-height:max(2.5em,min(' + CONFIG.LOGO_MAX_HEIGHT_MOBILE + ',calc(var(--amb-h) - var(--amb-bleed) - 13em)));margin-bottom:.9em' +
                    (CONFIG.LOGO_ALIGN_MOBILE === 'left' ? '}' : ';align-self:center;margin-left:0;object-position:center bottom}') +
                '.amb-row{row-gap:1px}' +
                '.amb-br{display:block;flex:0 0 100%;height:0;padding:0;filter:none}' +
                '.amb-meta{max-width:90vw;font-size:1em;line-height:1.5em}' +
                '.amb-plot{font-size:.9em}' +
                '.amb-row .amb-star{font-size:.9em}' +
                '.amb-rl{--amb-rh:.8em}' +
                '.amb-nav{width:40px;height:40px}' +
            '}',
            '@media (hover:none) and (pointer:coarse){.amb{--amb-gutter:0px}.amb-nav{display:none}}',
            '@media (prefers-reduced-motion:reduce){.amb-slide{filter:none;transition:opacity .4s ease}.amb-nav,.amb-text,.amb-dots,.amb-dots>i{transition:none}}'
        ].filter(Boolean).join('\n');
        (document.head || document.documentElement).appendChild(style);
    };

    const client = () => {
        const c = window.ApiClient;
        if (!c || typeof c.getJSON !== 'function' || typeof c.getUrl !== 'function' || typeof c.getCurrentUserId !== 'function') return null;
        if (typeof c.accessToken === 'function' && !c.accessToken()) return null;
        return c.getCurrentUserId() ? c : null;
    };
    const api = () => client() || S.api;
    const get = (path, params) => { const c = api(); return c.getJSON(c.getUrl(path, params)); };

    const model = it => ({
        id: it.Id,
        type: it.Type,
        name: it.Name || '',
        plot: cut(clean(it.Overview), Math.max(40, +CONFIG.PLOT_MAX_LENGTH || 450)),
        genres: (it.Genres || []).slice(0, Math.max(0, +CONFIG.MAX_GENRES || 0)),
        cr: it.CommunityRating > 0 ? Math.round(it.CommunityRating * 10) / 10 : 0,
        mr: it.CriticRating > 0 ? Math.round(it.CriticRating) : 0,
        year: it.ProductionYear || yearOf(it.PremiereDate),
        mins: it.Type !== 'Series' && it.RunTimeTicks > 0 ? Math.round(it.RunTimeTicks / 6e8) : 0,
        seasons: it.Type === 'Series' && it.ChildCount > 0 ? it.ChildCount : 0,
        logo: (it.ImageTags && it.ImageTags.Logo) || '',
        bd: (it.BackdropImageTags && it.BackdropImageTags[0]) || ''
    });
    const usable = m => !!(m && m.id && m.logo && m.bd && Array.isArray(m.genres));

    const step = (px, s, max) => Math.min(max, Math.max(s, Math.ceil(px / s) * s));
    const bdWidth = () => {
        if (+CONFIG.BACKDROP_MAX_WIDTH) return +CONFIG.BACKDROP_MAX_WIDTH;
        if (!S.bdw) {
            const pr = S.stage && S.stage.isConnected ? S.stage.querySelector('.amb-probe') : null;
            const h = pr ? pr.offsetHeight : 0;
            const w = step(Math.max(window.innerWidth || 1280, h * 16 / 9) * DPR, 320, 3840);
            if (!h) return w;
            S.bdw = w;
        }
        return S.bdw;
    };
    const bdUrl = m => api().getUrl('Items/' + m.id + '/Images/Backdrop/0', { maxWidth: bdWidth(), quality: QUALITY, tag: m.bd });
    const logoUrl = m => api().getUrl('Items/' + m.id + '/Images/Logo', {
        maxWidth: step((window.innerWidth || 1280) * 0.5 * DPR, 160, 1920), maxHeight: step((window.innerHeight || 720) * 0.4 * DPR, 80, 1200), quality: QUALITY, tag: m.logo
    });
    const warm = (m, pri) => {
        if (!m) return;
        [bdUrl(m), logoUrl(m)].forEach(src => {
            const i = new Image();
            i.decoding = 'async';
            if (pri) i.fetchPriority = pri;
            i.src = src;
        });
    };

    const fetchRandom = async n => {
        const p = {
            userId: S.user, IncludeItemTypes: CONFIG.TYPES || 'Movie,Series', Recursive: true, SortBy: 'Random', ImageTypes: 'Logo', Limit: n + 5,
            Fields: FIELDS, EnableImageTypes: 'Backdrop,Logo', ImageTypeLimit: 1, EnableUserData: false, CollapseBoxSetItems: false, EnableTotalRecordCount: false
        };
        const extra = CONFIG.QUERY || {};
        Object.keys(extra).forEach(k => {
            Object.keys(p).forEach(d => { if (d.toLowerCase() === k.toLowerCase()) delete p[d]; });
            p[k] = extra[k];
        });
        const r = await get('Items', p);
        return ((r && r.Items) || []).map(model).filter(usable).slice(0, n);
    };
    const fetchIds = async (ids, n) => {
        if (!ids.length || !n) return [];
        const r = await get('Items', {
            userId: S.user, Ids: ids.join(','), Fields: FIELDS, EnableImageTypes: 'Backdrop,Logo', ImageTypeLimit: 1, EnableUserData: false, EnableTotalRecordCount: false
        });
        const by = new Map(((r && r.Items) || []).map(it => [it.Id, it]));
        return ids.map(id => by.get(id)).filter(Boolean).map(model).filter(usable).slice(0, n);
    };

    const kefinReady = () => {
        const h = window.KefinHomeScreen, s = window.sectionHelper;
        return !!(h && typeof h.getSections === 'function' && s && typeof s.loadSectionForRendering === 'function');
    };
    const homePrefs = async () => {
        const u = window.userHelper, U = window.KefinUserHomeScreenConfig;
        if (!u || typeof u.getUserDisplayPreferences !== 'function' || !U || typeof U.parseKefinTweaksHomeScreen !== 'function') return null;
        try {
            const r = await u.getUserDisplayPreferences({ cacheOnly: true });
            const p = r && (r.cached || await Promise.race([r.promise, sleep(3000)]));
            return p ? U.parseKefinTweaksHomeScreen(p.CustomPrefs || {}) : null;
        } catch (e) {
            return null;
        }
    };
    const sectionList = () => {
        const out = [];
        try { out.push(...((window.KefinHomeScreen.getSections() || {}).enabledHomeSections || [])); } catch (e) { }
        try {
            const cfg = window.KefinHomeScreen.getConfig && window.KefinHomeScreen.getConfig();
            if (cfg && typeof cfg.then !== 'function') {
                ['HOME_SECTION_GROUPS', 'SEASONAL_SECTION_GROUPS', 'CUSTOM_SECTION_GROUPS'].forEach(g => (cfg[g] || []).forEach(grp => out.push(...((grp && grp.sections) || []))));
            }
        } catch (e) { }
        return out.filter(Boolean);
    };
    const findSection = (name, home) => {
        const n = norm(name), U = window.KefinUserHomeScreenConfig;
        const hit = s => String(s.id) === name || norm(s.name) === n;
        let found = sectionList().find(hit);
        if (!found && home && U && typeof U.buildPinnedSectionConfigs === 'function') {
            try { found = (U.buildPinnedSectionConfigs(home) || []).find(s => s && hit(s)); } catch (e) { }
        }
        if (!found) return null;
        let cfg = JSON.parse(JSON.stringify(found));
        if (home && U && typeof U.applyUserSectionOverrides === 'function') {
            try { cfg = U.applyUserSectionOverrides([cfg], home, { serverSectionsById: new Map([[cfg.id, cfg]]) })[0] || cfg; } catch (e) { }
        }
        return cfg;
    };
    const sectionItems = cfg => Promise.race([(async () => {
        try {
            const s = await window.sectionHelper.loadSectionForRendering(cfg);
            const r = s && s.result;
            const v = !r ? [] : typeof r.ensureData === 'function' ? await r.ensureData() : await (r.dataPromise || r.data);
            return Array.isArray(v) ? v : (v && Array.isArray(v.Items) ? v.Items : []);
        } catch (e) {
            return [];
        }
    })(), sleep(15000).then(() => [])]);
    const kefinIds = async () => {
        const t0 = Date.now();
        const ok = await waitFor(() => kefinReady() || (Date.now() - t0 > (window.KefinTweaks || window.KefinTweaksConfig ? 25000 : 8000) ? 'gone' : null), 30000, 100);
        if (ok !== true) {
            console.warn(TAG, 'KefinTweaks is not available.');
            return null;
        }
        const home = await homePrefs();
        const cfgs = SECTIONS.map(name => findSection(name, home));
        const missing = SECTIONS.filter((n, i) => !cfgs[i]);
        if (missing.length) {
            console.warn(TAG, 'KefinTweaks rows not found:', missing.join(', '), '| available rows:', sectionList().map(s => s.name + ' (' + s.id + ')').join(', '));
        }
        const lists = await Promise.all(cfgs.map(cfg => cfg ? sectionItems(cfg) : []));
        const rows = lists.map(list => {
            const ids = [], seen = new Set();
            list.forEach(it => {
                const t = it && it.Type;
                const id = t === 'Movie' || t === 'Series' ? it.Id : t === 'Episode' || t === 'Season' ? it.SeriesId : '';
                if (id && GUID.test(id) && !seen.has(id)) {
                    seen.add(id);
                    ids.push(id);
                }
            });
            return CONFIG.SHUFFLE ? shuffle(ids) : ids;
        }).filter(r => r.length);
        const out = [], seen = new Set();
        const add = id => { if (!seen.has(id)) { seen.add(id); out.push(id); } };
        if (CONFIG.SHUFFLE) {
            for (let i = 0; rows.some(r => i < r.length); i++) shuffle(rows).forEach(r => { if (i < r.length) add(r[i]); });
        } else {
            rows.forEach(r => r.forEach(add));
        }
        return out;
    };

    const blend = (a, b) => {
        const out = [], n = a.length + b.length;
        for (let i = 0, j = 0, k = 0; k < n; k++) {
            out.push(j < b.length && (i >= a.length || (j + 0.5) * n <= (k + 1) * b.length) ? b[j++] : a[i++]);
        }
        return out;
    };
    const fetchPool = async () => {
        if (!SECTIONS.length) return { items: await fetchRandom(POOL), random: true };
        const nr = Math.round(POOL * Math.max(0, Math.min(1, +CONFIG.RANDOM_SHARE || 0))), nk = POOL - nr;
        const extra = nr ? fetchRandom(POOL) : null;
        if (extra) extra.catch(() => { });
        const ids = nk ? await kefinIds() : [];
        const rows = ids && ids.length ? await fetchIds(ids.slice(0, nk * 2 + 4), nk) : [];
        if (!rows.length && (!nr || CONFIG.FALLBACK_RANDOM)) {
            if (!CONFIG.FALLBACK_RANDOM) return { items: [], random: false };
            if (nk) console.warn(TAG, 'KefinTweaks rows gave nothing to show (backdrop and logo needed), using random items.');
            return { items: extra ? await extra : await fetchRandom(POOL), random: true };
        }
        if (!extra) return { items: rows, random: false };
        const seen = new Set(rows.map(m => m.id));
        const rand = (await extra.catch(() => [])).filter(m => !seen.has(m.id)).slice(0, rows.length ? POOL - rows.length : nr);
        return { items: blend(rows, rand), random: !rows.length };
    };

    const cacheKey = () => STORE + S.user;
    const readCache = () => {
        try {
            const c = JSON.parse(localStorage.getItem(cacheKey()) || 'null');
            if (c && c.k === SIG && Array.isArray(c.items) && Date.now() - c.t < 7 * 864e5) return c;
        } catch (e) { }
        return null;
    };
    const saveCache = first => {
        if (!CONFIG.INSTANT_START || !S.pool.length || !S.stamp) return;
        try { localStorage.setItem(cacheKey(), JSON.stringify({ k: SIG, t: S.stamp, r: S.random, first: first || '', items: S.pool })); } catch (e) { }
    };

    const mixed = () => S.random || !!CONFIG.SHUFFLE;
    const newOrder = n => {
        const o = Array.from({ length: n }, (_, i) => i);
        return mixed() ? shuffle(o) : o;
    };
    const front = i => {
        S.order.unshift(S.order.splice(i, 1)[0]);
        return 0;
    };

    const adopt = (items, random, first) => {
        const cur = S.shown && !items.some(m => m.id === S.shown) ? S.pool.find(m => m.id === S.shown) : null;
        if (cur) items = [cur].concat(items.slice(0, Math.max(1, POOL - 1)));
        S.random = random;
        S.pool = items;
        S.order = newOrder(items.length);
        S.after = null;
        const key = S.shown || first;
        const i = key ? S.order.findIndex(k => items[k].id === key) : -1;
        if (S.shown) {
            S.pos = i < 0 ? -1 : mixed() ? front(i) : i;
            buttons();
            prepNext();
            return;
        }
        S.pos = -1;
        S.start = i < 0 ? 0 : mixed() ? front(i) : i;
        const m = S.pool[S.order[S.start]];
        if (S.stage && S.stage.isConnected) warm(m, 'high');
        saveCache(m.id);
        begin();
    };

    const fail = (why, retry) => {
        stop();
        if (why) console.warn(TAG, why);
        if (S.bar) S.bar.remove();
        if (retry) Object.assign(S, { started: false, loading: null });
        else S.failed = true;
        hero();
    };

    const load = () => {
        if (S.loading) return S.loading;
        const ep = S.epoch;
        S.loading = fetchPool().then(r => {
            if (ep !== S.epoch) return;
            if (r.items.length) {
                S.stamp = Date.now();
                adopt(r.items, r.random, '');
            } else if (!S.pool.length) {
                fail('nothing to show (items need a backdrop and a logo).');
            }
        }, e => {
            if (ep !== S.epoch) return;
            console.warn(TAG, 'loading failed:', e);
            if (!S.pool.length) fail('', true);
        });
        return S.loading;
    };

    const reset = () => {
        S.epoch++;
        S.seq++;
        stop();
        clearTimeout(S.pre);
        Object.assign(S, { user: '', started: false, loading: null, failed: false, pool: [], order: [], after: null, pos: -1, start: 0, shown: '', stamp: 0, slide: null, opening: false, random: !SECTIONS.length });
        if (S.bds) S.bds.textContent = '';
        if (S.txs) S.txs.textContent = '';
        buttons();
    };

    const ensure = () => {
        const c = client();
        if (!c) {
            if (!S.waiting) {
                S.waiting = true;
                waitFor(client, 864e5, 250).then(() => { S.waiting = false; ensure(); mount(); });
            }
            return;
        }
        const u = c.getCurrentUserId();
        if (S.user && S.user !== u) reset();
        S.api = c;
        if (S.started) return;
        S.started = true;
        S.user = u;
        const cached = CONFIG.INSTANT_START ? readCache() : null;
        const items = cached ? cached.items.filter(usable) : [];
        if (items.length) {
            S.stamp = cached.t;
            adopt(items, !!cached.r, cached.first);
            setTimeout(load, 1500);
        } else {
            load();
        }
    };

    const metaHtml = (m, L) => {
        const h = [];
        const icon = n => '<span class="material-icons" aria-hidden="true">' + n + '</span>';
        if (CONFIG.SHOW_COMMUNITY_RATING && m.cr) {
            h.push('<img class="amb-rl" alt="IMDb" src="' + IMDB + '"><span class="amb-val">' + (+m.cr).toFixed(1) + '</span><span class="material-icons amb-star" aria-hidden="true">star</span>');
        }
        if (CONFIG.SHOW_CRITIC_RATING && m.mr) {
            h.push('<img class="amb-rl amb-rl-m" alt="MDBList" src="' + MDBL + '"><span class="amb-val">' + m.mr + '</span><span class="material-icons amb-star amb-star-c" aria-hidden="true">star</span>');
        }
        if (h.length) h.push('<span class="amb-br" aria-hidden="true"></span>');
        if (m.genres.length) h.push('<span class="amb-item">' + icon('theater_comedy') + '<span>' + esc(m.genres.join(', ')) + '</span></span>');
        const len = m.type === 'Series' ? (m.seasons ? m.seasons + ' ' + L.season[m.seasons > 1 ? 1 : 0] : '') : (m.mins ? m.mins + ' min' : '');
        if (len) h.push('<span class="amb-item">' + icon(m.type === 'Series' ? 'calendar_today' : 'schedule') + '<span>' + len + '</span></span>');
        if (m.year) h.push('<span class="amb-item"><span>' + m.year + '</span></span>');
        if (h[h.length - 1] && h[h.length - 1].indexOf('amb-br') > 0) h.pop();
        return '<div class="amb-row">' + h.join('') + '</div>';
    };

    const slide = (m, pri) => {
        const el = mk('div', 'amb-slide');
        const tx = mk('div', 'amb-slide');
        const wrap = mk('div', 'amb-bdw');
        const bd = mk('img', 'amb-bd');
        bd.alt = '';
        bd.decoding = 'async';
        bd.draggable = false;
        if (pri) bd.fetchPriority = pri;
        bd.addEventListener('load', () => bd.classList.add('amb-ld'), { once: true });
        bd.src = bdUrl(m);
        if (bd.complete && bd.naturalWidth) bd.classList.add('amb-ld');
        wrap.appendChild(bd);
        const text = mk('div', 'amb-text');
        text.tabIndex = 0;
        text.setAttribute('role', 'link');
        text.setAttribute('aria-label', tr().open + ' : ' + m.name);
        const logo = mk('img', 'amb-logo');
        logo.alt = m.name;
        logo.decoding = 'async';
        logo.draggable = false;
        if (pri) logo.fetchPriority = pri;
        logo.addEventListener('load', () => { if (S.slide && S.slide.logo === logo) { fitLogo(S.slide); lines(tx); } }, { once: true });
        logo.src = logoUrl(m);
        const meta = mk('div', 'amb-meta');
        meta.innerHTML = metaHtml(m, tr());
        const head = mk('div', 'amb-head');
        head.append(logo, meta);
        text.appendChild(head);
        if (m.plot) text.appendChild(mk('div', 'amb-plot', m.plot));
        el.appendChild(wrap);
        tx.appendChild(text);
        return { el, tx, bd, logo, text };
    };

    const loaded = (imgs, ms) => new Promise(resolve => {
        let n = imgs.length, done = false;
        const fin = ok => {
            if (done) return;
            done = true;
            clearTimeout(t);
            resolve(ok);
        };
        const t = setTimeout(() => fin(true), ms);
        imgs.forEach(img => {
            const p = typeof img.decode === 'function' ? img.decode() : new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
            p.then(() => { if (--n === 0) fin(true); }, () => {
                if (img.complete && !img.naturalWidth) fin(false);
                else if (--n === 0) fin(true);
            });
        });
    });

    const fitLogo = s => {
        const img = s && s.logo, w0 = img && img.naturalWidth, h0 = img && img.naturalHeight;
        if (!w0 || !h0 || !img.isConnected) return;
        img.style.width = img.style.height = '';
        const k = Math.min(1 / DPR, (img.offsetWidth || w0) / w0, (img.offsetHeight || h0) / h0);
        img.style.width = Math.max(1, Math.round(w0 * k)) + 'px';
        img.style.height = Math.max(1, Math.round(h0 * k)) + 'px';
    };

    const lines = el => {
        const row = el && el.querySelector('.amb-row');
        if (!row) return;
        let prev = null;
        for (const c of row.children) {
            if (!c.getClientRects().length) continue;
            c.classList.toggle('amb-nl', !!prev && c.offsetTop >= prev.offsetTop + prev.offsetHeight);
            prev = c;
        }
    };

    const drop = id => {
        const k = S.pool.findIndex(m => m.id === id);
        if (k < 0) return;
        S.pool.splice(k, 1);
        S.order = S.order.filter(x => x !== k).map(x => (x > k ? x - 1 : x));
        S.after = null;
        S.pos = S.shown ? S.order.findIndex(x => S.pool[x].id === S.shown) : -1;
    };

    const show = async (pos, mode) => {
        const m = S.pool[S.order[pos]];
        if (!m || !S.stage) return;
        const seq = ++S.seq;
        const s = slide(m, mode === 'first' ? 'high' : '');
        S.bds.appendChild(s.el);
        S.txs.appendChild(s.tx);
        const ok = await loaded([s.bd, s.logo], mode === 'first' ? 8000 : mode === 'user' ? 300 : 6000);
        if (seq !== S.seq || !S.stage) {
            s.el.remove();
            s.tx.remove();
            return;
        }
        if (!ok) {
            s.el.remove();
            s.tx.remove();
            drop(m.id);
            if (!S.pool.length) return fail('no displayable item.');
            const p = Math.min(pos, S.order.length - 1);
            if (S.shown && S.pool[S.order[p]].id === S.shown) {
                buttons();
                tick();
                return;
            }
            return show(p, mode);
        }
        fitLogo(s);
        lines(s.tx);
        const both = fn => { fn(s.el.classList); fn(s.tx.classList); };
        const speed = mode === 'now' ? 'amb-now' : mode === 'fade' ? '' : 'amb-quick';
        if (speed) both(c => c.add(speed));
        void s.el.offsetWidth;
        both(c => c.add('amb-on'));
        const bad = () => {
            if (S.slide !== s) return;
            drop(m.id);
            if (S.pool.length) next(true);
            else fail('no displayable item.');
        };
        s.bd.addEventListener('error', bad, { once: true });
        s.logo.addEventListener('error', bad, { once: true });
        const old = S.slide;
        S.slide = s;
        if (old) {
            old.tx.className = 'amb-slide';
            old.text.tabIndex = -1;
            setTimeout(() => old.tx.remove(), FADE_MS + 100);
            let gone = false;
            const go = () => {
                if (gone) return;
                gone = true;
                old.el.className = 'amb-slide';
                setTimeout(() => old.el.remove(), FADE_MS + 100);
            };
            if (s.bd.classList.contains('amb-ld')) go();
            else {
                s.bd.addEventListener('load', go, { once: true });
                s.bd.addEventListener('error', go, { once: true });
                setTimeout(go, 5000);
            }
        }
        setTimeout(() => { if (S.slide === s) both(c => c.add('amb-done')); }, mode === 'now' ? 0 : FADE_MS + 100);
        S.shown = m.id;
        S.pos = S.order.findIndex(k => S.pool[k] && S.pool[k].id === m.id);
        S.opening = false;
        buttons();
        tick();
        prepNext();
    };

    const dots = () => {
        const d = S.dots;
        if (!d) return;
        const n = S.order.length;
        if (S.pool.length && S.bar.classList.contains('amb-no-dots') !== n < 2) {
            S.bar.classList.toggle('amb-no-dots', n < 2);
            place();
        }
        if (n < 2) {
            d.textContent = '';
            return;
        }
        const cnt = Math.min(n, 15), pos = Math.max(0, S.pos);
        const first = Math.max(0, Math.min(n - cnt, pos - (cnt >> 1)));
        if (d.childElementCount !== cnt) {
            d.textContent = '';
            for (let i = 0; i < cnt; i++) d.appendChild(document.createElement('i'));
        }
        for (let i = 0; i < cnt; i++) {
            const c = d.children[i].classList;
            c.toggle('amb-dot-on', S.pos >= 0 && first + i === pos);
            c.toggle('amb-dot-s', (i === 0 && first > 0) || (i === cnt - 1 && first + cnt < n));
        }
    };
    const buttons = () => {
        if (S.prevBtn) S.prevBtn.disabled = S.pos <= 0;
        dots();
    };

    const live = () => S.vis && !document.hidden && !!S.bar && S.bar.isConnected;
    const stop = () => {
        if (S.timer) {
            clearTimeout(S.timer);
            S.timer = 0;
        }
    };
    const tick = () => {
        stop();
        if (live() && S.shown && (S.order.length > 1 || (S.pos < 0 && S.order.length > 0))) {
            S.timer = setTimeout(() => { S.timer = 0; if (live()) next(true); }, Math.max(3000, +CONFIG.INTERVAL_MS || 12000));
        }
    };

    const guard = () => {
        const now = Date.now();
        if (now < S.lock) return false;
        S.lock = now + 250;
        return true;
    };
    const wrapOrder = () => {
        if (!mixed()) return S.order.slice();
        const last = S.order[S.pos];
        let o = S.order;
        for (let t = 0; t < 10; t++) {
            o = shuffle(S.order);
            if (o[0] !== last) break;
        }
        return o;
    };
    const nextPos = () => {
        if (S.pos < 0) return { pos: 0, order: null };
        if (S.pos + 1 < S.order.length) return { pos: S.pos + 1, order: null };
        if (!S.after) S.after = wrapOrder();
        return { pos: 0, order: S.after };
    };
    const next = auto => {
        if (!S.pool.length || (S.order.length < 2 && S.pos >= 0)) return;
        if (!auto && !guard()) return;
        const n = nextPos();
        if (n.order) {
            S.order = n.order;
            S.after = null;
        }
        show(n.pos, auto ? 'fade' : 'user');
    };
    const prev = () => {
        if (S.pos <= 0 || !guard()) return;
        show(S.pos - 1, 'user');
    };
    const prepNext = () => {
        clearTimeout(S.pre);
        const n = nextPos();
        const o = n.order || S.order;
        const m = S.pool[o[n.pos]];
        const ahead = m && m.id !== S.shown ? m : null;
        saveCache(ahead ? ahead.id : S.shown);
        if (!ahead) return;
        warm(ahead, 'low');
        const m2 = n.pos + 1 < o.length ? S.pool[o[n.pos + 1]] : null;
        if (m2 && m2.id !== S.shown) S.pre = setTimeout(() => warm(m2, 'low'), 1500);
    };

    const open = () => {
        const id = S.shown;
        if (!id) return;
        const c = api();
        const sid = c && typeof c.serverId === 'function' ? c.serverId() : '';
        try {
            if (window.Emby && window.Emby.Page && typeof window.Emby.Page.showItem === 'function') {
                window.Emby.Page.showItem(id, sid);
                return;
            }
        } catch (e) { }
        location.hash = '#/details?id=' + encodeURIComponent(id) + (sid ? '&serverId=' + encodeURIComponent(sid) : '');
    };

    const onTouchStart = e => {
        const t = e.changedTouches && e.changedTouches[0];
        S.touch = t ? { x: t.clientX, y: t.clientY, at: Date.now() } : null;
    };
    const onTouchEnd = e => {
        const a = S.touch, t = e.changedTouches && e.changedTouches[0];
        S.touch = null;
        if (!a || !t || Date.now() - a.at > 800) return;
        const dx = t.clientX - a.x, dy = t.clientY - a.y;
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        if (dx < 0) next(false);
        else prev();
    };
    const onTouchCancel = () => { S.touch = null; };

    const contentTop = (sec, y) => {
        let top = Infinity, rows = 0;
        for (const c of sec.children) {
            const r = c.getBoundingClientRect();
            if (!r.height || r.bottom <= y) continue;
            let n = 0;
            for (const e of c.querySelectorAll('h1,h2,h3,.sectionTitle,.card,img,a[href],button')) {
                const q = e.getBoundingClientRect();
                if (!q.width || !q.height || q.bottom <= y) continue;
                if (e.tagName === 'IMG' ? e.complete && e.naturalWidth < 2 : !e.classList.contains('card') && !e.textContent.trim()) continue;
                if (getComputedStyle(e).visibility === 'hidden') continue;
                top = Math.min(top, q.top);
                if (++n >= 6) break;
            }
            if (++rows >= 4) break;
        }
        return top;
    };
    const place = () => {
        const b = S.bar;
        if (!b || !b.isConnected) return;
        let d = 0;
        if (PHONE && PHONE.matches && b.offsetParent) {
            const y = b.getBoundingClientRect().bottom;
            const dh = S.dots ? S.dots.offsetHeight : 0;
            const want = Math.max(0, Math.min(0.5, +CONFIG.TEXT_DROP_MOBILE || 0)) * (window.innerHeight || 0);
            const sec = b.nextElementSibling;
            const w = window.innerWidth;
            let room = sec ? Math.round(contentTop(sec, y) - y) : Infinity;
            if (room === Infinity) {
                if (S.room && S.room.w === w) room = S.room.v;
            } else if (!S.room || S.room.w !== w || S.room.v !== room) {
                S.room = { w, v: room };
                try { localStorage.setItem(ROOM, JSON.stringify(S.room)); } catch (e) { }
            }
            const fit = Math.min(room - 6, S.txs ? S.txs.getBoundingClientRect().bottom - y - 2 : Infinity) - dh;
            d = Math.max(-dh, Math.min(want, fit));
        }
        const v = Math.round(d) + 'px';
        if (b.style.getPropertyValue('--amb-drop') !== v) b.style.setProperty('--amb-drop', v);
    };
    const measure = () => {
        const b = S.bar;
        if (!b || !b.isConnected || !b.offsetParent) return;
        let y = 0;
        for (let e = b; e; e = e.offsetParent) y += e.offsetTop;
        const v = Math.max(0, Math.ceil(y)) + 'px';
        if (b.style.getPropertyValue('--amb-bleed') !== v) b.style.setProperty('--amb-bleed', v);
        place();
    };
    const later = fn => () => requestAnimationFrame(() => requestAnimationFrame(fn));
    const watch = () => {
        if (typeof ResizeObserver !== 'function') return;
        const h = document.querySelector('.MuiAppBar-root') || document.querySelector('.skinHeader');
        if (h && h !== S.roTarget) {
            if (!S.ro) S.ro = new ResizeObserver(later(measure));
            if (S.roTarget) S.ro.unobserve(S.roTarget);
            S.ro.observe(h);
            S.roTarget = h;
        }
        const sec = S.bar && S.bar.nextElementSibling;
        if (sec && sec !== S.rsTarget) {
            if (!S.rs) S.rs = new ResizeObserver(later(place));
            if (S.rsTarget) S.rs.unobserve(S.rsTarget);
            S.rs.observe(sec);
            S.rsTarget = sec;
        }
    };

    const navBtn = (cls, icon, label) => {
        const b = mk('button', 'amb-nav ' + cls);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.innerHTML = '<span class="material-icons" aria-hidden="true">' + icon + '</span>';
        return b;
    };
    const build = () => {
        const L = tr();
        const bar = mk('div', 'amb');
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-roledescription', 'carousel');
        bar.setAttribute('aria-label', 'Spotlight');
        const stage = mk('div', 'amb-stage');
        const bds = mk('div', 'amb-bds');
        const txs = mk('div', 'amb-txs');
        stage.append(mk('div', 'amb-probe'), bds, mk('div', 'amb-tint'));
        const pv = navBtn('amb-prev', 'chevron_left', L.prev);
        const nx = navBtn('amb-next', 'chevron_right', L.next);
        pv.disabled = true;
        const onText = e => !!(e.target && e.target.closest && e.target.closest('.amb-slide.amb-on .amb-text'));
        txs.addEventListener('click', e => { if (onText(e)) open(); });
        txs.addEventListener('keydown', e => {
            if ((e.key !== 'Enter' && e.key !== ' ') || !onText(e)) return;
            e.preventDefault();
            open();
        });
        pv.addEventListener('click', prev);
        nx.addEventListener('click', () => next(false));
        bar.addEventListener('touchstart', onTouchStart, { passive: true });
        bar.addEventListener('touchend', onTouchEnd, { passive: true });
        bar.addEventListener('touchcancel', onTouchCancel, { passive: true });
        const dt = mk('div', 'amb-dots');
        dt.setAttribute('aria-hidden', 'true');
        bar.append(stage, txs, dt, pv, nx);
        Object.assign(S, { bar, stage, bds, txs, prevBtn: pv, dots: dt });
        if ('IntersectionObserver' in window) {
            S.io = new IntersectionObserver(es => {
                const e = es[es.length - 1];
                S.vis = !!(e && e.isIntersecting);
                hero();
                if (S.vis) {
                    measure();
                    begin();
                }
                tick();
            }, { threshold: 0 });
            S.io.observe(bar);
        } else {
            S.vis = true;
        }
    };

    const hero = () => {
        if (CONFIG.HEADER_MODE === 'theme') return;
        document.documentElement.classList.toggle('amb-hero', !!(S.vis && !S.failed && S.bar && S.bar.isConnected));
    };

    const begin = () => {
        if (S.failed || !S.bar || !S.bar.isConnected) return;
        ensure();
        if (!S.pool.length || !S.vis) return;
        if (!S.slide && !S.opening) {
            S.opening = true;
            show(S.shown ? Math.max(0, S.pos) : S.start, S.shown ? 'now' : 'first').finally(() => { S.opening = false; });
            return;
        }
        tick();
    };

    const mount = () => {
        const c = client();
        if (c && S.user && c.getCurrentUserId() !== S.user) reset();
        if (S.failed) return;
        css();
        const tab = document.querySelector('.homePage:not(.hide) #homeTab') || document.getElementById('homeTab');
        const sec = tab && tab.querySelector(':scope > .sections');
        if (!sec) {
            hero();
            return;
        }
        if (!S.bar) build();
        if (S.bar.parentNode !== tab || S.bar.nextElementSibling !== sec) tab.insertBefore(S.bar, sec);
        watch();
        measure();
        requestAnimationFrame(measure);
        begin();
    };

    const atHome = () => !location.hash || /^#!?\/?(home(\.html)?)?\/?(\?|$)/i.test(location.hash);
    const boot = () => {
        mount();
        if (atHome()) ensure();
    };

    document.addEventListener('viewshow', mount, true);
    document.addEventListener('viewbeforeshow', mount, true);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('resize', () => {
        if (!S.rz) S.rz = requestAnimationFrame(() => { S.rz = 0; S.bdw = 0; measure(); if (S.slide) { fitLogo(S.slide); lines(S.slide.tx); } });
    }, { passive: true });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
})();
