/** Dependencies **/
const app = require('express')();

require('./config/db');

/** Express Middleware **/
require('./config/express')(app);

/** Routes **/
require('./config/routes')(app);

module.exports = app;
