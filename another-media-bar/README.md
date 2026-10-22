# Another Media Bar for Jellyfin 12

A lightweight spotlight bar for the top of the Jellyfin 12 Home screen. It shows random movies and series from your library, or the items of your KefinTweaks home rows, with the backdrop running up behind the header and fading out behind the first row.

One file, pasted into the JavaScript Injector plugin. No iframe, no plugin, no file to copy on the server, no change to `index.html`.

## Features

- Backdrop from the very top of the page. While the page is at the top, the theme's header background makes way for one smooth shade that starts at the top edge and ends a little below the menu, with no step at the header's edge; the theme's header comes back as soon as you scroll. Everything fades into the same page background: top, right side (a soft halo that never goes fully dark), and a long progressive fade behind the first row.
- Backdrops anchored at the top (never cut at the top), requested at the size they are really drawn, sharp on 4K and on phones.
- On phones the bar stays compact: the logo and text block sits low, over the empty top of the rows area, and stops on its own just above the first row, whatever the theme or KefinTweaks layout.
- Clear logo, community rating (IMDb logo), critic rating (MDBList logo), genres, runtime or seasons, year, three-line synopsis.
- Source: random library items, or one or more KefinTweaks v0.5 home rows (built-in rows and custom sections, by name or id), optionally mixed with a share of random library items.
- Click or tap the logo / text block to open the item, arrows on desktop, swipe on touch screens (reacts at once, the next two items are preloaded), small dots under the text on phones, slides paused while the bar is off screen, on another tab or in a hidden browser tab.
- French and English labels, following the Jellyfin display language.

## Fast and light

- One small `/Items` request per page load (random source), or one KefinTweaks row read (shared with KefinTweaks' own cache) plus one `/Items?Ids=` request, plus one small random `/Items` request when `RANDOM_SHARE` is used.
- Server-resized images with `tag=`: Jellyfin serves them as immutable for a year, so a backdrop already seen costs no request at all.
- Instant start: the previous pool is kept in the browser, the next visit shows its first slide straight away (images already cached) while the new pool loads in the background.
- No webfont, no icon font download: the page's own font and icons are reused.

## Install

1. Dashboard > Plugins > JavaScript Injector > Add Script.
2. Paste the whole `another-media-bar.js`, keep it Enabled, leave "Requires authentication" unchecked (it starts sooner), Save.
3. Reload the page (Ctrl+F5).

## Settings

Edit the `CONFIG` block at the top of the script. Settings are grouped: source, slides, design, then phones.

### Source

| Setting | Default | What it does |
|---|---|---|
| `KEFIN_SECTIONS` | `[]` | KefinTweaks home rows the items come from, by name or id. `[]` = random library items only. Example: `['Tendances Films', 'Horreur', 'Halloween']` |
| `RANDOM_SHARE` | `0` | With `KEFIN_SECTIONS`: part of the items picked at random in the whole library, mixed with the rows' items (`TYPES` and `QUERY` apply). `0` = none, `0.25` = a quarter, `0.5` = half |
| `SHUFFLE` | `true` | With `KEFIN_SECTIONS`: `true` = items taken in turn from each row (a small row counts as much as a big one), shown in random order. `false` = the rows one after the other |
| `FALLBACK_RANDOM` | `true` | With `KEFIN_SECTIONS`: `true` = random library items when the rows are not found or have nothing to show |
| `TYPES` | `'Movie,Series'` | Random items: `'Movie'`, `'Series'` or `'Movie,Series'` |
| `QUERY` | `{}` | Random items: extra Jellyfin filters. Example: `{ IsPlayed: false, MinCommunityRating: 7 }` |
| `POOL_SIZE` | `28` | Number of items loaded once per page load, then shown in turn |

### Slides

| Setting | Default | What it does |
|---|---|---|
| `INTERVAL_MS` | `12000` | Time on each slide, in milliseconds |
| `INSTANT_START` | `true` | Start at once with the items kept from the previous visit, the new items load in the background |
| `SHOW_COMMUNITY_RATING` / `SHOW_CRITIC_RATING` | `true` | IMDb and MDBList ratings |
| `MAX_GENRES` | `2` | Number of genres shown, `0` = none |
| `PLOT_MAX_LENGTH` | `450` | Longest synopsis, in characters (also cut to 3 lines) |
| `LANGUAGE` | `'auto'` | `'auto'` (Jellyfin display language), `'fr'` or `'en'` |

### Design

| Setting | Default | What it does |
|---|---|---|
| `HEIGHT` | `'60vh'` | Where the first row starts, from the top of the page |
| `FADE_ABOVE` / `FADE_BELOW` | `'9vh'` / `'16vh'` | Bottom fade of the backdrop: where it starts above the first row, how far it goes on behind it |
| `SIDE_FADE` | `0.24` | Part of the backdrop width that fades out on the right, `0` to `0.5` |
| `SIDE_FADE_MIN` | `0.3` | Backdrop opacity left at the right edge, so it stays faintly visible like a halo |
| `BACKDROP_POSITION` | `'center top'` | Part of the backdrop kept when it is cropped (the top is never cut) |
| `LOGO_MAX_WIDTH` / `LOGO_MAX_HEIGHT` | `'36vw'` / `'24vh'` | Largest logo size; smaller logos keep their real size |
| `LOGO_MARGIN_LEFT` | `'1vw'` | Space between the left edge of the text and the logo |
| `HEADER_MODE` | `'blend'` | `'blend'` = at the top of the page the bar's shade replaces the header background, `'theme'` = keep the theme's header |
| `HEADER_SHADE` | `0.8` | Darkness of the shade at the top of the page, `0` to `1` |
| `HEADER_FADE` | `'12vh'` | How far below the header the shade ends |
| `HEADER_COLOR` | `''` | Shade color, `''` = the page background color |
| `IMAGE_QUALITY` | `90` | Image quality asked from the server |
| `BACKDROP_MAX_WIDTH` | `0` | Backdrop width in pixels, `0` = fit the screen |

### Phones (screens up to 768 px wide)

| Setting | Default | What it does |
|---|---|---|
| `HEIGHT_MOBILE` | `'min(53vh, 106vw)'` | Where the first row starts, from the top of the page |
| `BACKDROP_HEIGHT_MOBILE` | `'min(62vh, 125vw)'` | Backdrop drawn as if the bar were this high, so a smaller `HEIGHT_MOBILE` only cuts the bottom of the image |
| `TEXT_DROP_MOBILE` | `0.1` | How far below the bar the logo and text may go, over the empty top of the rows, as a part of the screen height. Always stops just above the first row (measured on the page) |
| `DOTS_MOBILE` | `true` | Small dots under the synopsis, one per item |
| `LOGO_MAX_WIDTH_MOBILE` / `LOGO_MAX_HEIGHT_MOBILE` | `'62vw'` / `'16vh'` | Largest logo size |
| `LOGO_ALIGN_MOBILE` | `'center'` | Logo position: `'center'` = centered (the text stays on the left), `'left'` = aligned with the text like desktop |
| `IMAGE_QUALITY_MOBILE` | `82` | Image quality on touch screens, phones and tablets |

If a KefinTweaks row name is wrong, the browser console (F12) lists the available rows with their ids.

## Requirements

Jellyfin 12 web client (modern or legacy layout), JavaScript Injector plugin. Works with ElegantFin and the ElegantFin JF12 companion stylesheet. KefinTweaks v0.5+ only for the KefinTweaks source. Items need a backdrop and a clear logo to be shown.

## Credits

Successor of Simple Home Spotlight Bar. Inspired by the Jellyfin Media Bar by MakD and its plugin versions. KefinTweaks by ranaldsgift. IMDb and MDBList logos belong to their owners.
