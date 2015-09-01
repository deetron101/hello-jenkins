// Packages
var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var app = module.exports = express();

// Includes
var Config      = require('./config/config.'+app.get('env')); // get the right config file
var Utils       = require('./common/utils');

// Set up application logging
var logger = Utils.getLogger();

// Setup database connection
mongoose.connect(Config.database);

// Set up Morgan logging
if (Config.morgan) {
  app.use(morgan(Config.morgan));
}

console.log('Starting in '+app.get('env')+' mode');

logger.log('info','Starting in '+app.get('env')+' mode');

// Use to get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up JWT requirements
app.set('superSecret', Config.secret);
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

logger.log('info','Done with setup and configuration');

// API ROUTES -------------------

var authRoutes = require('./routes/api/auth');
var usersRoutes = require('./routes/api/users');
var memesRoutes = require('./routes/api/memes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/memes', memesRoutes);

// END API ROUTES -------------------

// OTHER ROUTES -------------------

app.use('/', express.static(__dirname + '/public'));

app.use('/images', express.static(__dirname + '/public/uploads'));
app.use('/nm', express.static(__dirname + '/node_modules'));

app.use('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// END OTHER ROUTES -------------------

// Error handling

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  logger.log('error', err.name, { error : err.stack });
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  // To Do - make this just for xhrs
  console.log(err.name+': '+err.message);
  if (err.name == 'UnauthorizedError') {
    res.status(403).json({success: false, message: 'User not authorized'});
    next('route');
  }
  else if (err.name == 'TokenExpiredError') {
    res.status(401).json({success: false, message: 'User token expired'});
    next('route');
  }
  else if (err.name == 'JsonWebTokenError') {
    res.status(401).json({success: false, message: 'User token must be provided'});
    next('route');
  }
  else {
    res.status(500).json({success: false, message: 'Unidentified Error'});
    next(err);
  }
}

function errorHandler(err, req, res, next) {}

app.listen(process.env.PORT || 5000);