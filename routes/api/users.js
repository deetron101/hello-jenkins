var express     = require('express');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var usersRoutes = express.Router();
var app         = require('../../app');
var User        = require('../../models/user'); // get the User model

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

usersRoutes.get('/me', function(req, res, next) {
  jwt.verify(getToken(req), app.get('superSecret'), function(err, decodedUser) {
    if (err) return next(err);
    User.findOne({email:decodedUser.email}, function (err, user) {
    if (err) return next(err);
      var userObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      res.status(200).json({
        success: true,
        message: 'This is you',
        user: userObj
      });
    });
  });
});

usersRoutes.get('/all', function(req, res, next) {
  jwt.verify(getToken(req), app.get('superSecret'), function(err, decodedUser) {
    if (err) return next(err);
    User.find(function (err, users) {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        message: 'All current users',
        users: users
      });
    });
  });
});

module.exports = usersRoutes;
