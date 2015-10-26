if (typeof window.AZTracker !== 'undefined' && window.AZTracker.trackPageView) {
  window.AZTracker.trackPageView({
    domain: 'aznetz',
    path: {
      product: 'live',
      // @TODO: track sitename (skin or 'styleguide')
      sitename: window.az.globals.skin || 'styleguide',

      // component name event tracking, "page" or empty for pageview tracking
      // @TODO: adjust in concept
      // view: 'page',

      path: window.location.pathname,
      event: 'pageview',
      id: null,
      index: null
    },
    referer: document.referer,
    screenWidth: screen.width,
    screenHeight: screen.height
  });
}
