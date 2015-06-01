var React = require('react');

var Styleguide = React.createClass({

  componentDidMount: function() {
    console.log('mounted');
  },

  test: function() {
    alert('test');
  },

  render: function() {
    return <div onClick={this.test}>heldsfsfdlo world</div>
  }
});

module.exports = Styleguide;
