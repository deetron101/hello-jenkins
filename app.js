var express = require('express');
var multer  = require('multer');
var fs = require('fs');

var app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index.html')
});

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

var upload = multer({ storage: storage }).array('files');

app.post('/api/upload', upload, function(req, res){
    console.log(req.files);
    res.end("File uploaded.");
});

app.listen(process.env.PORT || 5000);

module.exports = app;