const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = app => {
  app.use(morgan('dev'));
  app.use(bodyParser.json());
};
