import { check, Match } from 'meteor/check';
import compare from './comparison';

const createRule = ({name, priority, condition, operator, threshold}) => {
  check(name, String);
  check(priority, Number);
  check(condition, String);
  check(operator, String);
  // check(threshold, Match.oneOf(String, Object, Number));
  
  return {
    name,
    priority,
    condition: function(R) {
      // let compareResult = false;

      // compareResult = compareResult
      //   && compare(this[condition])[operator](threshold)
      // ;
      // console.log({condition, operator, threshold});
      // console.log();
      // console.log(compare(this[condition])[operator](threshold));
      //
      // R.when(this && compareResult);

      R.when(this && compare(this[condition])[operator](threshold));
    },
    consequence: function(R) {
      this.notify = true;
      R.stop();
    }
  };
};

export default createRule
