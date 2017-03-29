import {Meteor} from 'meteor/meteor';
import winston from 'winston';

/**
 * Logger instance
 * @function error: [Function],
 * @function warn: [Function],
 * @function info: [Function],
 * @function verbose: [Function],
 * @function debug: [Function],
 * @function silly: [Function],
 */

// Using:
// import {Logger} from '/imports/api/logger/index';
// Logger.info({name: "migration", message: `Created new employee - employeeId: abc`});
const Logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)(Meteor.settings.logger.file)
  ]
});

export default Logger