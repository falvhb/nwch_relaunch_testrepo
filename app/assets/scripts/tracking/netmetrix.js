// @TODO: move to include `__body_top.html` inline and replace skin with nunjucks variable {{skin}})
if (typeof window.AZTracker !== 'undefined' && window.AZTracker.trackPageView) {
  window.AZTracker.trackPageView({
    domain: 'aznetz',
    path: {
      product: 'live',
      sitename: (typeof window.az !== 'undefined' ? window.az.globals.skin : 'noskin'),
      view: 'page',
      path: window.location.pathname,
      event: 'pageview',
      id: null,
      paging: null
    },
    referer: document.referer,
    screenWidth: screen.width,
    screenHeight: screen.height
  });
}

