import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp-client';
import {later} from 'meteor/mrt:later';
import {Promise} from 'meteor/promise';


/**
 * Function create job on job server from bots client
 * @param country
 * @return {{getJobs: (function()), createJob: (function()), editJob: (function()), pauseJob: (function()), resumeJob: (function()), restartJob: (function()), cancelJob: (function()), removeJob: (function())}}
 * @constructor
 */
export const connectJobServer = () => {
  const {host, port} = Meteor.settings.public.jobs_server;

  try {
    const server = DDP.connect(`http://${host}:${port}`);
    const {status, connected, reason} = server.status();

    if (status === 'failed') {
      throw new Meteor.Error('JobServer.connect', `Failed: ${JSON.stringify({status, connected, reason})}`);
    } else {
      return server;
    }
  } catch (err) {
    throw new Meteor.Error('JobServer.connect', `Failed: ${err.reason}`);
  }
};
const server = connectJobServer();

const controlJobServer = (controller, params) => {
  return new Promise((resolve, reject) => {
    server.call(controller, params, (err, res) => {
      if (err) {
        reject(new Meteor.Error(`JobServer.${controller}`, err.reason));
      } else {
        resolve(res);
      }
    });
  });
};

export const getJobs = ({name, country}) => {
  const params = {
    type: `${country}-${name}`,
  };

  return controlJobServer('controllers.getJobs', params);
}
export const createJob = ({name, priority, freqText, info, country}) => {
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

  return controlJobServer('controllers.create', params);
}
export const editJob = ({name, priority, freqText, info, country}) => {
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

  return controlJobServer('controllers.edit', params);
}
export const cancelJob = ({name, country}) => {
  const params = {
    type: `${country}-${name}`,
  };

  return controlJobServer('controllers.cancel', params);
};
export const removeJob = ({name, country}) => {
  const params = {
    type: `${country}-${name}`,
  };

  return controlJobServer('controllers.remove', params);
};
export const startJob = ({name, priority, freqText, info, country}) => {
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

  return controlJobServer('controllers.start', params);
};
