var fs      = require('fs');
var winston = require('winston');

var Utils = {
  createDir: function(path){
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  },
  getLogger: function() {
    this.createDir('../logs');
    var logger = new (winston.Logger)({
      transports: [
        new (winston.transports.DailyRotateFile)({
          name: 'info-file',
          datePattern: '.yyyy-MM-ddTHH',
          filename: '../logs/info.log',
          level: 'info'
        }),
        new (winston.transports.DailyRotateFile)({
          name: 'error-file',
          datePattern: '.yyyy-MM-ddTHH',
          filename: '../logs/error.log',
          level: 'error',
          json: false,
          timestamp: function() {
            return Date.now();
          },
          formatter: function(options) {
            return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
          }
        })
      ]
    });
    return logger;
  }
};

module.exports = Utils;