import S from 'string';
import moment from 'moment';
import { check, Match } from 'meteor/check';

// trying to use Currying in this function
/**
 * Function create a suitable comparison function for specific type and operator
 * @param {String} type
 * @param {String} operator
 * @returns {function()}
 */
const compare = (arg) => {
  let type = typeof arg;
  const isSupported = Match.test(type, Match.OneOf('string', 'number', 'boolean', 'object'));

  // verify supported type
  if(!isSupported) {
    throw new Error('UNSUPPORTED_TYPE', `data type of argument (${type}) is unsupported.`);
  }
  if(type === 'object') {
    if(moment.isDate(arg)) {
      type = 'date';
    } else {
      throw new Error('UNSUPPORTED_TYPE', `data type of argument (${type}) is unsupported.`);
    }
  }

  const comparison = {
    string: {
      is: (arg1) => {
        // should check data type of args
        check(arg1, String);

        return arg.toLowerCase() === arg1.toLowerCase();
      },
      startWith: (arg1) => {
        check(arg1, String);

        return S(arg).startsWith(arg1);
      },
      contains: (arg1) => {
        check(arg1, String);

        return S(arg).contains(arg1);
      }
    },
    number: {
      equal: (arg1) => {
        check(arg1, Number);

        return arg === arg1;
      },
      noEqual: (arg1) => {
        check(arg1, Number);

        return arg !== arg1;
      },
      lessThan: (arg1) => {
        check(arg1, Number);

        return arg < arg1;
      },
      lessThanOrEqual: (arg1) => {
        check(arg1, Number);

        return arg <= arg1;
      },
      greaterThan: (arg1) => {
        check(arg1, Number);

        return arg > arg1;
      },
      greaterThanOrEqual: (arg1) => {
        check(arg1, Number);

        return arg >= arg1;
      },
      between: (arg1, arg2) => {
        check(arg1, Number);
        check(arg2, Number);

        return (arg >= arg1 && arg <= arg2);
      },
    },
    boolean: {
      equal: (arg1) => {
        check(arg1, Boolean);

        return arg === arg1;
      },
      notEqual: (arg1) => {
        check(arg1, Boolean);

        return arg !== arg1;
      }
    },
    date: {
      on: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isSame(arg1, arg2);
      },
      before: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isBefore(arg1, arg2);
      },
      onOrBefore: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isSameOrBefore(arg1, arg2);
      },
      after: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isAfter(arg1, arg2);
      },
      onOrAfter: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isSameOrAfter(arg1, arg2);
      },
      within: (arg1, arg2) => {
        check(arg1, Date);
        check(arg2, String);

        return moment(arg).isBetween(arg1, arg2);
      },
    }
  };

  console.log({type, compare: comparison[type]});

  return comparison[type];
};

export default compare