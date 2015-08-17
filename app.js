var express = require('express');
var multer = require('multer');
var fs = require('fs');
var mongoose = require('mongoose');

var memeSchema = new mongoose.Schema({
  userid: Number,
  filename: String,
  name: String
});

var Meme = mongoose.model('Meme', memeSchema);

var app = express();

var dbString = 'mongodb://127.0.0.1/test';
if (app.get('env') == 'production') {
  console.log("This is production!");
  dbString = 'mongodb://deetron101:test@ds055762.mongolab.com:55762/deetron101';
}
else {
  console.log("This is dev");
}

mongoose.connect(dbString);

var db = mongoose.connection;
db.on('error', function (err) {
  console.log('connection error', err);
});

db.once('open', function () {
  console.log('connected.');
});

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
    var newMeme = new Meme({
        userid: 1,
        filename: file.filename,
        name: file.originalfilename
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
    console.log("Uploading files");
    saveFiles(req.files);
    res.end("Success");
});

app.listen(process.env.PORT || 5000);

module.exports = app;