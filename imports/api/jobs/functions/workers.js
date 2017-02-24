import {Logger} from '/imports/api/logger/index';
import JobList from '../collections';
import {executeSLA} from '/imports/api/node_rules';

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
    const {
      ruleConditions = [
        {
          name: 'rule_noOfResignedMemberInLast3Weeks',
          priority: 1,
          on: true,
          condition: "femaleIcareMembersAreFemaleInLast6Months",
          consequence: "next",
          operator: "greaterThanOrEqual",
          threshold: 70,
        }
      ],
      fact = {
        id: 1,
        femaleIcareMembersAreFemaleInLast6Months: 300,
        message: "TEST - SLA B2B 14: over 70% of iCare Members are female in last 6 months",
        groupId: 257279828017220,
        userId: 100015398923627,
        notify: false
      }
    } = job.data;
    console.log(`job has been run.`);
    const jobMessage = `job run on ${new Date()}`;
    executeSLA(ruleConditions, fact);
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

