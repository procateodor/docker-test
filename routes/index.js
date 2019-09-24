const router = require('express').Router();
const HttpStatus = require('http-status-codes');

const users = require('./users');

router.get('/', (req, res) => {
  return res.status(HttpStatus.OK).json({
    status: 'active',
  });
});

router.use('/users', users);

module.exports = router;
