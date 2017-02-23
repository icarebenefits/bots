import {Logger} from '/imports/api/logger/index';
import JobList from '../collections';
import * as executeSLAs from '/imports/api/node_rules';

// constants
export const LOG_LEVEL = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  CRITICAL: "danger"
};

let Workers = {};

/**
 * 
 * @param job
 * @param cb
 */
const checkSLA = (job, cb) => {
  try {
    console.log(`job has been run.`);
    const jobMessage = `job run on ${new Date()}`;
    executeSLAs.B2B_14();
    job.log(jobMessage, {level: LOG_LEVEL.INFO});
    job.done();
  } catch (error) {
    job.log(error, {level: LOG_LEVEL.CRITICAL});
    job.fail();
  }
};

Workers = {
  checkSLA,
};

export default Workers

