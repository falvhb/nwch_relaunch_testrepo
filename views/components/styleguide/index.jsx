/* eslint-disable no-console no-alert */
'use strict';
var React = require('react');
var Sample = require('../sample');

var Styleguide = React.createClass({

  componentDidMount: function() {
    console.log('mounted');
  },

  test: function() {
    alert('test behaviour');
  },

  render: function() {
    return (
      <div onClick={this.test}>
        <p>Styleguide compsonent</p>
        <Sample/>
      </div>
    );
  }
});

module.exports = Styleguide;
