/**
 * Instant Prefetch: Zero-Latency Speculative Page Loading
 * Prefetches internal links on hover (65ms debounce) or touchstart,
 * ensuring target HTML is cached in memory before the user finishes clicking.
 */
(function () {
  'use strict';

  // Respect user preference for data saving or slow 2G connections
  if (navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType))) {
    return;
  }

  const prefetched = new Set();
  let hoverTimeout = null;

  function prefetch(url) {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  function getTargetUrl(target) {
    const anchor = target.closest('a');
    if (!anchor || !anchor.href) return null;

    // Only prefetch internal HTTP(S) links
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname === window.location.pathname && url.hash) return null;
    if (/\.(pdf|zip|gz|tar|exe|dmg)$/i.test(url.pathname)) return null;

    return url.href;
  }

  // Touchstart: instant prefetch on mobile (user intent is clear)
  document.addEventListener('touchstart', function (e) {
    const url = getTargetUrl(e.target);
    if (url) prefetch(url);
  }, { passive: true });

  // Mouseover: 65ms debounce to avoid spamming on fast cursor sweeps
  document.addEventListener('mouseover', function (e) {
    const url = getTargetUrl(e.target);
    if (!url) return;

    hoverTimeout = setTimeout(function () {
      prefetch(url);
    }, 65);
  }, { passive: true });

  document.addEventListener('mouseout', function () {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }, { passive: true });
})();
