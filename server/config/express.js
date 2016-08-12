const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

module.exports = app => {
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(cors());
};
