var express = require('express');
var multer = require('multer');
var fs = require('fs');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1/test');
mongoose.connect('mongodb://deetron101:test@ds055762.mongolab.com:55762/deetron101');

var db = mongoose.connection;
db.on('error', function (err) {
  console.log('connection error', err);
});

db.once('open', function () {
  console.log('connected.');
});

var memeSchema = new mongoose.Schema({
  filename: String,
  userid: Number,
  filepath: String
});

var Meme = mongoose.model('Meme', memeSchema);

var app = express();

app.use('/', express.static(__dirname + '/public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './public/uploads/1'
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir)

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

var saveFiles = function(files) {

  for (var i in files) {
    file = files[i];
    console.log(file);
    var newMeme = new Meme({
        filename: file.filename,
        userid: 1,
        filepath: file.path
    });
    newMeme.save(function(err, newMeme) {
      if (err) {
        return console.error(err);
      } else {
        console.log('Saved : ', newMeme);
        Meme.find(function (err, memes) {
        if (err) return console.error(err);
          console.log(memes);
        });
      }
    });
  }

}

var upload = multer({ storage: storage }).array('files');

app.post('/api/upload', upload, function(req, res){
    console.log("Upload Saving files");
    saveFiles(req.files);
    res.end("File uploaded.");
});

app.listen(process.env.PORT || 5000);

module.exports = app;