/* global document */
'use strict';

var React = require('react');
var Styleguide = require('components/styleguide');
var rootElement = document.getElementById('app');

React.render(React.createElement(Styleguide), rootElement);
