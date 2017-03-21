import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp-client';
import {later} from 'meteor/mrt:later';

const JobServer = (country) => {
  const server = DDP.connect('http://localhost:4000');

  return {
    getJobs: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.getJobs', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    createJob: ({name, priority, freqText, info}, callback = () => {}) => {
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
      server.call('controllers.create', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    editJob: ({name, priority, freqText, info}, callback = () => {}) => {
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
      server.call('controllers.edit', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    pauseJob: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.pause', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    resumeJob: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.resume', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    restartJob: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.restart', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    cancelJob: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.cancel', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
    removeJob: ({name}, callback = () => {}) => {
      const params = {
        type: `${country}-${name}`,
      };
      server.call('controllers.remove', params, (err, res) => {
        if(err) callback(err, null);

        callback(null, res);
      });
    },
  };
};

export default JobServer