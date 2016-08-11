/** Dependencies **/
const app = require('express')();

/** Docker Service **/
const docker = require('./docker.service');

/** Express Middleware **/
require('./config/express')(app);

/** Routes **/
require('./config/routes')(app);

module.exports = app;
