if (typeof window.AZTracker !== 'undefined' && window.AZTracker.trackPageView) {
  window.AZTracker.trackPageView({
    domain: 'aznetz',
    path: {
      product: 'live',
      sitename: (typeof window.az !== 'undefined' ? window.az.globals.skin : 'styleguide'),
      view: 'page',
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
