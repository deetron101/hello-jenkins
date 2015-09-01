var express     = require('express');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var multer      = require('multer');
var app         = require('../../app');
var Utils       = require('../../common/utils');
var User        = require('../../models/user'); // get the User model
var Meme        = require('../../models/meme'); // get the User model
var memesRoutes = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var path = '../../public/uploads/1'
    Utils.createDir(path)
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

var upload = multer({ storage: storage }).array('files');

memesRoutes.post('/upload', upload, function(req, res, next) {
  saveFiles(req.files);
  res.status(200).json({
    success: true,
    message: 'Your file has been uploaded successfully'
  });
});

var saveFiles = function(files) {
  for (var i in files) {
    file = files[i];
    var newMeme = new Meme({
        userid: 1,
        filename: file.filename,
        name: file.originalfilename
    });
    newMeme.save(function(err, newMeme) {
      if (err) return next(err);
      else {
        Meme.find(function (err, memes) {
          if (err) return next(err);
          console.log(memes);
        });
      }
    });
  }
}

module.exports = memesRoutes;