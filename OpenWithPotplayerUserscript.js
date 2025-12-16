// ==UserScript==
// @name         PPJF - PotPlayer launcher (Jellyfin 10.11+)
// @namespace    local.ppjf.potplayer
// @version      10.10.11
// @description  Intercept Play/Resume clicks and open local media path via potplayer://
// @author       Damocles-fr
// @match        http://localhost:8096/web/index.html*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const CFG = {
    debug: false
  };

  const log = (...a) => { if (CFG.debug) console.log('[PPJF]', ...a); };

  let _userIdPromise = null;
  const getUserId = async () => {
    if (!_userIdPromise) _userIdPromise = ApiClient.getCurrentUser().then(u => u.Id);
    return _userIdPromise;
  };

  const toPotplayerUrl = (rawPath) => {
    const forward = String(rawPath).replace(/\\/g, '/');
    const encoded = encodeURIComponent(forward).replace(/%2F/g, '/');
    return 'potplayer://' + encoded;
  };

  const isGuidLike = (s) =>
    typeof s === 'string' && /^[0-9a-f]{8,}(-[0-9a-f]{4,}){0,4}$/i.test(s);

  const getAttr = (el, name) => (el && el.getAttribute) ? el.getAttribute(name) : null;

  const getIdFromEl = (el) => {
    if (!el || !el.getAttribute) return null;

    const directAttrs = [
      'data-id',
      'data-itemid',
      'data-item-id',
      'data-baseitemid',
      'data-playbackid',
      'data-entityid',
      'data-mediaid',
      'data-episodeid'
    ];

    for (const a of directAttrs) {
      const v = getAttr(el, a);
      if (v && isGuidLike(v)) return v;
    }

    const ds = el.dataset || {};
    const dsCandidates = [ds.id, ds.itemid, ds.itemId, ds.baseitemid, ds.baseItemId, ds.entityid, ds.entityId];
    for (const v of dsCandidates) {
      if (v && isGuidLike(v)) return v;
    }

    const href = getAttr(el, 'href');
    if (href) {
      const m = /[?&]id=([^&]+)/.exec(href);
      if (m && isGuidLike(m[1])) return m[1];
    }

    return null;
  };

  const getIdFromHash = () => {
    const h = String(location.hash || '');
    const m = /[?&]id=([^&]+)/.exec(h);
    if (m && isGuidLike(m[1])) return m[1];
    return null;
  };

  const buildPath = (target) => {
    const out = [];
    let el = target;
    while (el) {
      out.push(el);
      el = el.parentNode;
      if (out.length > 25) break;
    }
    out.push(document, window);
    return out;
  };

  const eventPath = (e) => (e && typeof e.composedPath === 'function') ? e.composedPath() : buildPath(e.target);

  const normalizeText = (s) => String(s || '').trim().toLowerCase();
  const classHasToken = (cls, token) => new RegExp(`(^|[\\s_-])${token}([\\s_-]|$)`, 'i').test(String(cls || ''));

  const looksLikePlayControl = (el) => {
    if (!el || !el.getAttribute) return false;

    const dataMode = normalizeText(getAttr(el, 'data-mode'));
    const dataAction = normalizeText(getAttr(el, 'data-action'));
    const dataCommand = normalizeText(getAttr(el, 'data-command'));
    const aria = normalizeText(getAttr(el, 'aria-label'));
    const title = normalizeText(getAttr(el, 'title'));
    const cls = String(el.className || '');
    const txt = normalizeText(el.textContent);

    if (dataMode === 'play' || dataMode === 'resume') return true;
    if (dataAction === 'play' || dataAction === 'resume') return true;
    if (dataCommand.includes('play') || dataCommand.includes('resume')) return true;

    // FR/EN labels
    if (aria.includes('play') || aria.includes('lire') || aria.includes('reprendre') || aria.includes('resume')) return true;
    if (title.includes('play') || title.includes('lire') || title.includes('reprendre') || title.includes('resume')) return true;

    // Material icon names commonly used
    if (txt === 'play_arrow' || txt === 'play_circle' || txt === 'resume' || txt === 'replay') return true;

    // Conservative class token checks (avoid matching "player")
    if (classHasToken(cls, 'play') || classHasToken(cls, 'resume')) return true;

    return false;
  };

  const findPlayControlInPath = (path) => {
    for (const node of path) {
      if (!node || !node.getAttribute) continue;

      const tag = String(node.tagName || '').toLowerCase();
      const role = normalizeText(getAttr(node, 'role'));
      const isInteractive = (tag === 'button' || tag === 'a' || role === 'button');

      if (isInteractive && looksLikePlayControl(node)) return node;

      if (!isInteractive && looksLikePlayControl(node)) {
        const owner = node.closest ? node.closest('button,a,[role="button"]') : null;
        if (owner && looksLikePlayControl(owner)) return owner;
      }
    }
    return null;
  };

  const findItemIdInPath = (path) => {
    for (const node of path) {
      const id = getIdFromEl(node);
      if (id) return id;
    }
    return getIdFromHash();
  };

  const stopEvent = (e) => {
    try { e.preventDefault(); } catch {}
    try { e.stopPropagation(); } catch {}
    try { e.stopImmediatePropagation(); } catch {}
  };

  const resolvePathFromItem = async (itemId, depth = 0) => {
    if (!itemId || depth > 6) return null;

    const userId = await getUserId();
    const item = await ApiClient.getItem(userId, itemId);

    if (item && item.Path) return item.Path;

    const ms = item && item.MediaSources;
    if (ms && ms.length && ms[0] && ms[0].Path) return ms[0].Path;

    // Folder-like items: find a playable descendant
    const query = {
      parentId: itemId,
      recursive: true,
      includeItemTypes: 'Movie,Episode,Video',
      limit: 1,
      sortBy: 'SortName',
      sortOrder: 'Ascending'
    };

    const res = await ApiClient.getItems(userId, query);
    if (res && res.Items && res.Items.length && res.Items[0] && res.Items[0].Id) {
      return resolvePathFromItem(res.Items[0].Id, depth + 1);
    }

    return null;
  };

  let _lastLaunchAt = 0;
  const launchPotplayer = async (itemId) => {
    const now = Date.now();
    if (now - _lastLaunchAt < 600) return;
    _lastLaunchAt = now;

    const p = await resolvePathFromItem(itemId);
    if (!p) {
      console.warn('[PPJF] Unable to resolve a local Path for itemId:', itemId);
      return;
    }

    const url = toPotplayerUrl(p);
    log('launch', { itemId, path: p, url });
    window.location.replace(url);
  };

  const shouldIgnore = (e) => {
    if (!e) return true;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return true;
    if (typeof e.button === 'number' && e.button !== 0) return true;
    return false;
  };

  const onUserActivate = (e) => {
    if (shouldIgnore(e)) return;

    const path = eventPath(e);
    const control = findPlayControlInPath(path);
    if (!control) return;

    const itemId = findItemIdInPath(path);
    if (!itemId) return;

    stopEvent(e);
    launchPotplayer(itemId);
  };

  document.addEventListener('click', onUserActivate, true);
  document.addEventListener('pointerup', onUserActivate, true);

  document.addEventListener('keydown', (e) => {
    const key = e && e.key;
    if (key !== 'Enter' && key !== ' ') return;

    const path = eventPath(e);
    const control = findPlayControlInPath(path);
    if (!control) return;

    const itemId = findItemIdInPath(path);
    if (!itemId) return;

    stopEvent(e);
    launchPotplayer(itemId);
  }, true);

  log('loaded');
})();
