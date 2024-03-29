const fetch = require('node-fetch');
const docker = require('./docker.service');

const Usage = require('../usage/usage.model');

const jwt = require('jwt-simple');
const config = process.env.SECRET_KEY;

/** Controlllers **/
const checkRequest = ((req, res, next) => {
  if (!req.body.language) {
    return res.status(400).json({ message: 'missing "language" property' });
  }
  if (!req.body.content) {
    return res.status(400).json({ message: 'missing "content" property'});
  }
  next();
});

/* Specific to testing authentication via FluidNotes */
//const authEndpoint = 'http://localhost:3000/auth/check-token';

const run = (req, res) => {

  const originRequest = req.get('origin');
  const authEndpoint = `${originRequest}/auth/check-token`;

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
      return decodeToken(token);
    })
    .then((compiles) => {
      docker(req.body.language, req.body.content, compiles)
        .then(res.json.bind(res))
        .catch(res.json.bind(res));
    })
    .catch((err) => {
      if (err.message === 'Compile limit exceeded') {
        console.log('expected behavior');
        res.status(400).json({ message: 'Compile limit exceeded' });
      }
    });

  } else {
    console.log('no authentication token provided');
    res.sendStatus(401);
  }
};

module.exports = {
  checkRequest,
  run,
};


const decodeToken = (token) => {
  const payload = jwt.decode(token, config);
  const email = payload.email;

  return Usage.findOne({
    where: {
      email: email,
    }
  })
  .then(user => {
    if (!user) {
      return Usage.create({
        email,
      })
      .then(user => {
        return user.dataValues.compileLimit - user.dataValues.compileCount;
      });
    } else {
      if (user.dataValues.compileCount >= user.dataValues.compileLimit) {
        throw Error('Compile limit exceeded');
      }
      user.increment('compileCount', {by: 1});
      return user.dataValues.compileLimit - user.dataValues.compileCount;
    }
  });
};
