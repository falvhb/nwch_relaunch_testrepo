/* global document */
'use strict';

var React = require('react');
var Styleguide = require('styleguide/layout');
var rootElement = document.getElementById('app');

React.render(React.createElement(Styleguide), rootElement);
