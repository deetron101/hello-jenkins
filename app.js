/* Packages */
var express     = require('express');
var bcrypt      = require('bcrypt');
var bodyParser  = require('body-parser');
var fs          = require('fs');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var multer      = require('multer');
var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens
var expressJwt  = require('express-jwt'); // used to protect restricted routes

var app         = express();

/* Config */
var Config      = require('./config/config.'+app.get('env')); // get the right config file
/* Models */
var User        = require('./models/user'); // get the User model
var Meme        = require('./models/meme'); // get the Meme model

/* Setup */
mongoose.connect(Config.database);
app.set('superSecret', Config.secret);
if (Config.morgan) {
  app.use(morgan(Config.morgan));
}

// Use to get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the following headers for JWT
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var jwtOpts = expressJwt({
  secret: app.get('superSecret'),
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      req.token = req.headers.authorization.split(' ')[1];
      return req.token;
    } else if (req.query && req.query.token) {
      req.token = req.query.token;
      return req.token;
    }
    return null;
  }
});

// API ROUTES -------------------

// Get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/register', function(req, res) {
  // See if the user already exists
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;
    if (user) {
      res.json({ success: false, message: 'Register failed. User already exists.'});
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'pleb'
        });
        newUser.save(function(err, newUser) {
          if (err) {
            return console.error(err);
          } else {
            console.log('Saved new user : ', newUser);
          }
        });
      });
      // Return success as JSON
      res.json({
        success: true,
        message: 'New user created successfully',
      });
    }
  });
});

apiRoutes.post('/auth', function(req, res) {
  // find the User
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) throw err;
    if (user) {
      // Load password hash from DB
      bcrypt.compare(req.body.password, user.password, function(berr, bres) {
        if (bres) {
          // if user is found and password is correct, then create a token
          var userObj = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
          var token = jwt.sign(userObj, app.get('superSecret'), {
            expiresInMinutes: 60*24
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Authentication succeeded. Here is your access token',
            user: userObj,
            token: token
          });
        }
        else {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong username or password.'
          });
        }
      });
    }
    else {
      res.json({
        success: false,
        message: 'Authentication failed. Wrong username or password.'
      });
    }
  });
});

apiRoutes.get('/me', jwtOpts, function(req, res) {
  var userObj = jwt.verify(req.token,app.get('superSecret'));
  User.findOne({email:userObj.email}, function (err, user) {
    if (err) throw (err);
    res.json({
      success: true,
      message: 'This is you',
      user: user
    });
  });
});

apiRoutes.get('/users', expressJwt({ secret: app.get('superSecret') }), function(req, res) {
  User.find(function (err, users) {
    if (err) throw (err);
    res.json({
      success: true,
      message: 'All current users',
      users: users
    });
  });
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

apiRoutes.post('/upload', upload, function(req, res) {
  console.log("Uploading files");
  saveFiles(req.files);
  res.json({
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

// Apply the api routes to the application with the prefix /api
app.use('/api', apiRoutes);

app.use('/', express.static(__dirname + '/public'));
app.use('/images', express.static(__dirname + '/public/uploads'));
app.use('/nm', express.static(__dirname + '/node_modules'));

app.use('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  if (err.name == 'UnauthorizedError') {
    res.status(401).send('User not authorized');
  }
  else {
    res.status(500).send('Something broke!');
  }
});

app.listen(process.env.PORT || 5000);

module.exports = app;