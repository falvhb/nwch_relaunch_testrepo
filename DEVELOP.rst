

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
                                    objectAssign({}, componentData),
                                    {});
  res.write(React.renderToString(element));
  res.end();


NewsArticles
^^^^^^^^^^^^

props::

    {
        "article": <article-object>,
        "variation": <variationname>
    }

- article-object is requested from the API
- variationname is from the URL


Error Handling
--------------

Because the teasers are rendered as a part of a page it is important to return
only correct HTML and no error HTML. 

Therefore::

    In case of an error the response contains HTML with a comment describing
    the error.
