# Tracking documentation


## Introduction

Tracking for Google Analytics, Net Metrix and Chartbeat is centralized in `app/node_modules/tracking`.

We differentiate between two kinds of tracking:
* Pageview
* Event

Pageview tracking occurs when a page is loaded. Event tracking on the other side is triggered by a user interaction.

To make sure tracking only happens on live environment you have to configure the live hosts under `app/node_modules/tracking/config.json`. Tracking on non-live hosts, e.g. hosts which are not contained in the list, is currently logged to `console` on the client.


## Integration


### Event Tracking

Event tracking is triggered by a user interaction such as clicking on a video teaser in the `Video Library` component.
User interactions are always handled by components. 

To make a component track a user interaction it has to include the mixin `app/node_includes/mixins/tracking.jsx` and call its `track` method.

#### Net Metrix

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

#### Google Analytics

@TODO: Add code sample


#### Chartbeat

@TODO: Add code sample


### Pageview Tracking

Pageview tracking is triggered when a page is loaded. The tracking happens in the Node include `app/includes/__body_top` by using the static class `Tracker` (`app/node_modules/tracking/tracker.jsx`).

#### Net Metrix

Example for usage of `Tracker` to track a pageview in Net Metrix:

```
import Tracker from 'tracking/tracker';

Tracker.trackPageView({
  domain: 'aznetz',
  path: {
    product: 'live',
    sitename: (typeof window.az !== 'undefined' ? window.az.globals.skin : 'noskin'),
    view: 'page',
    path: window.location.pathname,
    event: 'pageview'
  },
  referer: document.referer,
  screenWidth: screen.width,
  screenHeight: screen.height
});
```

#### Google Analytics

@TODO: Add code sample


#### Chartbeat

@TODO: Add code sample


## API Documentation

To make inline documentation in code more readable you can build esdoc or jsdoc to generate HTML documentation locally.

To build documentation run tasks `gulp esdoc` and `gulp jsdoc`respectively.

Documentation can then be accessed locally:
* [Tracker](http://localhost:8000/esdoc/)
* [Mixin Tracking](http://localhost:8000/jsdoc/)
