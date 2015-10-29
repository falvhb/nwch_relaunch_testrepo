// @TODO: move to include `__body_top.html` inline and replace skin with nunjucks variable {{skin}})
if (typeof window.AZTracker !== 'undefined' && window.AZTracker.trackPageView) {
  //@TODO: use nunjucks variable {{without_wemf}} directly when moved to `__body_top.html`.
  if (!window.az.globals.without_wemf) {
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
}

