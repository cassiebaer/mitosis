const Controller = require('./controllers');

module.exports = (app) => {
  app.post('/run', Controller.checkRequest, Controller.run);
};
