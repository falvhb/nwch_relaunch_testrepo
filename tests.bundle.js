var context = require.context('./app', true, /.*spec/);
context.keys().forEach(context);
module.exports = context;
