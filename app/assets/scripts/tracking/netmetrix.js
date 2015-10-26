if (typeof window.AZTracker !== 'undefined' && window.AZTracker.trackPageView) {
  window.AZTracker.trackPageView({
    domain: 'aznetz',
    path: {
      product: 'live',

      // exclude as it is already contained in url path
      // sitename: 'styleguide',

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
