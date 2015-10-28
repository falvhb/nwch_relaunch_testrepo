# Tracking documentation

For API documentation see [Tracker](http://localhost:8000/esdoc/).

To build documentation run task `gulp esdoc`.


## Introduction

Tracking for Google Analytics, Net Metrix and Chartbeat is centralized in `app/node_modules/tracking`.

We differentiate between two kinds of tracking:
* Pageview
* Event

Pageview tracking occurs when a page is loaded. Event tracking on the other side is triggered by a user interaction.


## Integration


### Event Tracking

Event tracking is triggered by a user interaction such as clicking on a video teaser in the `Video Library` component.
User interactions are always handled by components. 

To make a `ComponentA` track a user interaction it has to include the mixin `app/node_includes/mixins/tracking.jsx` and call its `track` method.

Example for using the mixin `Tracking` to track an event in Net Metrix:

```
import Tracking from 'mixins/tracking';

const MyComponent = React.createClass({

  displayName: 'MyComponent',

  mixins: [Tracking],

  handleClick(e) {
    this.track(Tracking.EVENT, {
      event: 'clickLink',
      id: 'Link A'
    });
  }

  render() {
    return (
      <a onClick={this.handleClick}>Link A</a>
    );
  }
});

export default MyComponent;

```

### Pageview Tracking

Pageview tracking is triggered when a page is loaded. The tracking happens in the Node include `app/includes/__body_top` by using the static class `Tracker` (`app/node_modules/tracking/tracker.jsx`).

Example for usage of `Tracker` to track a pageview in Net Metrix:

```
import NetMetrixTracker from 'tracking/net-metrix-tracker';

Tracker.trackPageView({
  domain: 'aznetz',
  path: {
    product: 'live',
    sitename: (typeof window.az !== 'undefined' ? window.az.globals.skin : 'noskin'),
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
```

