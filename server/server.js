/** Dependencies **/
const app = require('express')();

/** Express Middleware **/
require('./config/express')(app);

/** Routes **/
require('./config/routes')(app);

module.exports = app;
