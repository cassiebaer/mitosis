const app = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const docker = require('./docker.service');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.post('/run', checkRequest, (req, res) => {
  docker.run(req.body.language, req.body.content)
  .then(res.json.bind(res))
  .catch(res.json.bind(res));
});

/**
 * Checks request for required parameters
 */
function checkRequest(req, res, next) {
  if (!('language' in req.body)) {
    res.json({message: 'missing "language" property'});
  }
  if (!('content' in req.body)) {
    res.json({message: 'missing "content" property'});
  }
  next();
}

module.exports = app;
