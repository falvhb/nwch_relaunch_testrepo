var React = require('react');

var Iso = require('iso-react');
var iso = new Iso();

var Demo = require('demo/article');
var Container = require('components/container');

var components = {
  demo: Demo,
  container: Container
}

iso.hydrate(components);
