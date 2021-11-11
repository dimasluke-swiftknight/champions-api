const appRoot = require('app-root-path');
const path = require('path');
const { transport } = require('winston');
const winston = require('winston');
const logstash = require('winston-logstash-transport');

const MESSAGE = Symbol.for('message');
const LEVEL = Symbol.for('level');

const errorToLog = log => {
  // convert an instance of the Error class to a formatted log
  const formatted = {
    message: null,
    level: 'error',
  }

  formatted[LEVEL] = 'error'

  if (log.message) {
    formatted.message = `${log.message}: ${log.stack}`
  } else {
    formatted.message = log.stack;
  }

  return formatted;
}

const errorFormatter = logEntry => {
  const message = {
    message: logEntry.message,
    correlationId: logEntry.correlationId,
    tracePoint: logEntry.tracePoint
  }

  if (logEntry instanceof Error) {
    // an error object was passed in
    return errorToLog(logEntry);
  }

  if (logEntry.stack) {
    // an error object was passed in addition to an error message
    logEntry.message = `${logEntry.message}: ${logEntry.stack}`;
  }

  if (logEntry.message && (typeof(logEntry.message)) === 'object') {
    if (logEntry.message?.err instanceof Error) {
      // Ugh. So here we are with a log message that is an instance of the Error class
      return errorToLog(logEntry.message.err);
    } else {
      // here we have an object as the log message but it's not an Error object
      console.log('logEntry.message')
      logEntry.message = JSON.stringify(message);
    }
  }

  logEntry.message = JSON.stringify(message);

  return logEntry;
}

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.cli({
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        verbose: 'cyan',
        debug: 'white'
      }
    }),
  ),
  handleExceptions: true
});

const fileTransport = new winston.transports.File({
  filename: path.join('logs', 'main.log'),
  level: 'info'
});

const logstashTransport = new logstash.LogstashTransport({
  host: 'logstash_demo',
  port: 1514
})

const envTag = (logEntry) => {
  const tag = {
    env: process.env.APPLICATION_ENV || 'local'
  }
  const taggedLog = Object.assign(tag, logEntry)
  logEntry[MESSAGE] = JSON.stringify(taggedLog)
  return logEntry
}

const transports = []

// configure transports (defined above)
transports.push(consoleTransport)
// transports.push(logstashTransport)
transports.push(fileTransport);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format(errorFormatter)(),
    winston.format(envTag)(),
  ),
  transports
})

// define the custom settings for each transport (file, console)
// const options = {
//   file: {
//     level: 'info',
//     filename: path.join(appRoot.toString(), 'logs', 'main.log'),
//     handleExceptions: true,
//     json: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//   },
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//   },
// };

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, correlationId, encoding) {
    logger.http(message)
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    // logger.info({
    //   message: 'Use a helper method if you want',
    //   correlationId: 'x-knight-correlation-id',
    //   tracePoint: 'START,END,BEFORE_API,AFTER_API'
    // })
    // logger.error({
    //     message: message, 
    //     correlationId: 'x-knight-correlation-id'
    // })
  },
};

module.exports = logger;