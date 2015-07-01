

Rendering Teaser URLs
=====================


Component Lookup
----------------

The react components are looked up using::

    var component = require('../../app/node_modules/components/' + req.params.component);

req.params.component is extracted from the URL.

If a component can not be found an empty result is returned.


Component Rendering
-------------------

Component rendering is done using React::

  var element = React.createElement(component,
                                    objectAssign({}, data),
                                    {});
  res.write(React.renderToString(element));
  res.end();


NewsArticles
^^^^^^^^^^^^

General URL for an article::

    /:ressort/:subressort?/:text-:articleId(\\d+)/:component/:variation

data for the react component::

    {
        "article": <article-object>,
        "variation": <variation>
    }

- article-object is requested from the API
- variation is from the URL


Error Handling
--------------

Because the teasers are rendered as part of the full page it is important to return
only correct HTML without any visual content shown by the browser. 

Therefore::

    In case of an error the response contains HTML with a comment describing
    the error.

