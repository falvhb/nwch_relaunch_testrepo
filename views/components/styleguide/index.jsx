'use strict';
var React = require('react');
var Sample = require('../sample');

var Styleguide = React.createClass({

  componentDidMount: function() {
    console.log('mounted'); //eslint-disable-line
  },

  test: function() {
    alert('test behaviour'); //eslint-disable-line
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
