import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp-client';
import {later} from 'meteor/mrt:later';
import {Promise} from 'meteor/promise';
import {Tracker} from 'meteor/tracker';

/**
 * Function create job on job server from bots client
 * @param country
 * @return {{getJobs: (function()), createJob: (function()), editJob: (function()), pauseJob: (function()), resumeJob: (function()), restartJob: (function()), cancelJob: (function()), removeJob: (function())}}
 * @constructor
 */
export const JobServer = async(country) => {
  const {host, port} = Meteor.settings.public.jobs_server;

  try {
    const server = DDP.connect(`http://${host}:${port}`);
    const {status, connected, reason} = server.status();

    if (status === 'failed') {
      throw new Meteor.Error('JobServer.connect', `Failed: ${JSON.stringify({status, connected, reason})}`);
    } else {
      return {
        status,
        getJobs: async({name}) => {
          const params = {
            type: `${country}-${name}`,
          };

          try {
            return await server.call('controllers.getJobs', params);
          } catch (err) {
            throw new Meteor.Error('JobServer.getJobs', err.message);
          }
        },
        createJob: async({name, priority, freqText, info}) => {
          const params = {
            type: `${country}-${name}`,
            attributes: {
              priority: priority || 'normal',
              repeat: {
                schedule: later.parse.text(freqText)
              }
            },
            data: info
          };

          try {
            return await server.call('controllers.create', params);
          } catch (err) {
            throw new Meteor.Error('JobServer.createJob', err.message);
          }
        },
        editJob: async({name, priority, freqText, info}) => {
          const params = {
            type: `${country}-${name}`,
            attributes: {
              priority: priority || 'normal',
              repeat: {
                schedule: later.parse.text(freqText)
              }
            },
            data: info
          };

          try {
            return await server.call('controllers.edit', params);
          } catch (err) {
            throw new Meteor.Error('JobServer.editJob', err.message);
          }
        },
        cancelJob: async({name}) => {
          const params = {
            type: `${country}-${name}`,
          };

          try {
            return await server.call('controllers.cancel', params);
          } catch (err) {
            throw new Meteor.Error('JobServer.cancelJob', err.message);
          }
        },
        removeJob: async({name}) => {
          const params = {
            type: `${country}-${name}`,
          };

          try {
            return await server.call('controllers.remove', params);
          } catch (err) {
            throw new Meteor.Error('JobServer.removeJob', err.message);
          }
        },
        startJob: ({name, priority, freqText, info}) => {
          const params = {
            type: `${country}-${name}`,
            attributes: {
              priority: priority || 'normal',
              repeat: {
                schedule: later.parse.text(freqText)
              }
            },
            data: info
          };

          return new Promise((resolve, reject) => {
            server.call('controllers.start', params, (err, res) => {
              if (err) {
                reject(new Meteor.Error('JobServer.startJob', err.reason));
              } else {
                resolve(res);
              }
            });
          });
        }
      };
    }
  } catch (err) {
    throw new Meteor.Error('JobServer.connect', `Failed: ${err.reason}`);
  }
};