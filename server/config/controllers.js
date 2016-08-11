const fetch = require('node-fetch');
const docker = require('./docker.service');

/** Controlllers **/
const checkRequest = ((req, res, next) => {
  if (!req.body.language) {
    return res.json({ message: 'missing "language" property' });
  }
  if (!req.body.content) {
    return res.json({ message: 'missing "content" property'});
  }
  next();
});

/* Specific to testing authentication via FluidNotes */
const authEndpoint = 'http://localhost:3000/auth/check-token';

const auth = (req, res) => {
  if (req.get('Authorization')) {
    const token = req.get('Authorization').split(' ')[1];

    fetch(authEndpoint, {
      method: 'POST',
      body: JSON.stringify({'token': token}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      docker(req.body.language, req.body.content)
        .then(res.json.bind(res))
        .catch(res.json.bind(res));
    })
    .catch(() => res.sendStatus(401));

  } else {
    console.log('no authentication token provided');
    res.sendStatus(401);
  }
};

module.exports = {
  checkRequest,
  run,
};
