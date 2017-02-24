import {Meteor} from 'meteor/meteor';
// import later from 'later';
import _ from 'lodash';

// Job Collections
import JobList from '../collections';

// constants
import * as ERROR_CODE from '/imports/utils/error_code';

let Jobs = {}; // store all job actions

const get = () => {
};

const create = (type, attributes, data) => {
  if (Meteor.isServer) {
    const
      currentDate = new Date(),
      {
        depends = [],
        priority = "",
        retry = {},
        repeat = {},
        delay = 0,
        after = currentDate
      } = attributes
      ;

    // console.log(JobList);
    const job = new Job(JobList[type], type, data);

    if (!_.isEmpty(depends)) {
      job.depends(depends);
    }
    if (priority !== "") {
      job.priority(priority);
    }
    if (!_.isEmpty(retry)) {
      job.retry(retry);
    }
    if (!_.isEmpty(repeat)) {
      job.repeat(repeat);
    }
    if (delay > 0) {
      job.delay(delay);
    }
    if (after - currentDate > 0) {
      job.after(after);
    }
    return job.save();
  } else {
    return ERROR_CODE.PERMISSION_DENIED;
  }
};

const start = (type, worker) => {
  JobList[type].processJobs(type, worker);
};

const stop = () => {
};

const cancel = () => {
};

const remove = () => {
};

export default Jobs = {
  get,
  create,
  start,
  stop,
  cancel,
  remove
}