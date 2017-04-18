import {Meteor} from 'meteor/meteor';
import {DDP} from 'meteor/ddp-client';
import {later} from 'meteor/mrt:later';

/**
 * Function create job on job server from bots client
 * @param country
 * @return {{getJobs: (function()), createJob: (function()), editJob: (function()), pauseJob: (function()), resumeJob: (function()), restartJob: (function()), cancelJob: (function()), removeJob: (function())}}
 * @constructor
 */
const JobServer = (country) => {
  const {host, port} = Meteor.settings.public.jobs_server;
  try {
    const server = DDP.connect(`http://${host}:${port}`);
    
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
      readyJob: ({name}, callback = () => {}) => {
        const params = {
          type: `${country}-${name}`,
        };
        server.call('controllers.ready', params, (err, res) => {
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
      startJob: ({name, priority, freqText, info}, callback = () => {}) => {
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
        server.call('controllers.start', params, (err, res) => {
          if(err) callback(err, null);

          callback(null, res);
        });
      },
    };
  } catch(e) {
    return {
      error: 'CONNECT_JOBS_SERVER_FAILED',
      message: JSON.stringify(e),
    };
  }
};

export default JobServer