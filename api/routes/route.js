const express = require('express');

const router = express.Router();

const User = require('../models/db_conf');

router.post('/add', (req, res) => {
  User.save({
    pseudo: req.body.nicknameSignIn,
    email: req.body.emailSignIn,
    password: req.body.passwordSignIn,
  });
  res.sendStatus(200)
});

module.exports = router;