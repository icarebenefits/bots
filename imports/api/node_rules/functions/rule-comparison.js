import { create } from 'node-comparison';
import { check } from 'meteor/check';

const createComparison = (type, operator) => {
  check(type, String);
  check(operator, String);

  return create(type, operator);
};

export default createComparison;
