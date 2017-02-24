import JobList from '../collections';

let JobServer = {};

const start = (type) => {
  JobList[type].startJobServer();
};

const stop = () => {

};

const restart = () => {

};

JobServer = {
  start,
  stop,
  restart
};

export default JobServer