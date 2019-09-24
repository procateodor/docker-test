const jwt = require('jsonwebtoken');

exports.constants = require('./constants');

exports.createTkn = (payload = {}, secret) => {
  if (payload.exp === null) {
    delete payload.exp;
    return jwt.sign(payload, secret);
  }

  if (payload.exp !== undefined || Number.isInteger(payload.exp)) {
    return jwt.sign(payload, secret);
  }

  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

exports.decodeTkn = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

exports.getEvenToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[1] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[0];
  }

  if (req.params && req.params.token) {
    return req.params.token;
  }

  return null;
};
