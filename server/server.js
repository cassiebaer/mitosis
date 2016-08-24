/** Dependencies **/
const app = require('express')();

/** Postgres Sequelize DB Config **/
require('./config/db');

/** Express Middleware **/
require('./config/express')(app);

/** Routes **/
require('./config/routes')(app);

module.exports = app;
