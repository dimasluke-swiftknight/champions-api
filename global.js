const appRoot = require('app-root-path');
const path = require('path');
const winston = require('winston');

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: path.join(appRoot.toString(), 'logs', 'main.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, correlationId, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info({
      message: 'Use a helper method if you want',
      correlationId: 'x-knight-correlation-id',
      tracePoint: 'START,END,BEFORE_API,AFTER_API'
    })
    logger.error(message, correlationId)
  },
};

global.logger = logger;