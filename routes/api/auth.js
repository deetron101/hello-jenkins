var express     = require('express');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt      = require('bcrypt');
var app         = require('../../app');
var User        = require('../../models/user'); // get the User model
var authRoutes  = express.Router();

authRoutes.post('/register', function(req, res, next) {
  // See if the user already exists
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return next(err);
    if (user) {
      res.status(422).json({success: false, message: 'Register failed. User already exists.'});
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) return next(err);
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'creator'
        });
        newUser.save(function(err, newUser) {
          if (err) return next(err);
          logger.log('info','Saved new user : ', newUser);
        });
        // Return success as JSON
        res.status(200).json({success: true, message: 'New user created successfully'});
      });
    }
  });
});

authRoutes.post('/login', function(req, res, next) {
  // find the User
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return next(err);
    if (user) {
      // Load password hash from DB
      bcrypt.compare(req.body.password, user.password, function(err, bres) {
        if (err) return next(err);
        if (bres) {
          // if user is found and password is correct, then create a token
          var userObj = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
          var token = jwt.sign(userObj, app.get('superSecret'), { expiresInMinutes: 60 });
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            message: 'Authentication succeeded. Here is your access token',
            user: userObj,
            token: token
          });
        }
        else {
          res.status(401).json({
            success: false,
            message: 'Authentication failed. Wrong username or password.'
          });
        }
      });
    }
    else {
      res.status(401).json({
        success: false,
        message: 'Authentication failed. Wrong username or password.'
      });
    }
  });
});

module.exports = authRoutes;
