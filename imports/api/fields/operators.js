/**
 * Composition Objects for all of operators
 */

// generic
const empty = {
  id: 'empty',
  description: 'empty',
  params: 1,
  active: true,
  operate: () => {}
};
const notEmpty = {
  id: 'notEmpty',
  description: 'not empty',
  params: 1,
  active: true,
  operate: () => {}
};
const any = {
  id: 'any',
  description: 'any',
  params: 1,
  active: true,
  operate: () => {}
};

// bitwise
const and = {
  id: 'and',
  description: 'And',
  params: 1,
  active: true,
  operate: () => {}
};
const or = {
  id: 'or',
  description: 'Or',
  params: 1,
  active: true,
  operate: () => {}
};
const not = {
  id: 'not',
  description: 'Not',
  params: 1,
  active: true,
  operate: () => {}
};

// string
const is = {
  id: 'is',
  description: 'is',
  params: 1,
  active: true,
  operate: () => {}
};
const startsWith = {
  id: 'startsWith',
  description: 'starts with',
  params: 1,
  active: true,
  operate: () => {}
};
const contains = {
  id: 'contains',
  description: 'contains',
  params: 1,
  active: true,
  operate: () => {}
};

// date
const on = {
  id: 'on',
  description: 'on',
  params: 1,
  active: true,
  operate: () => {}
};
const before = {
  id: 'before',
  description: 'before',
  params: 1,
  active: true,
  operate: () => {}
};
const after = {
  id: 'after',
  description: 'after',
  params: 1,
  active: true,
  operate: () => {}
};
const onOrBefore = {
  id: 'onOrBefore',
  description: 'on or before',
  params: 1,
  active: true,
  operate: () => {}
};
const onOrAfter = {
  id: 'onOrAfter',
  description: 'on or after',
  params: 1,
  active: true,
  operate: () => {}
};
const within ={
  id: 'within',
  description: 'within',
  params: 1,
  active: true,
  operate: () => {}
};

// number
const equal ={
  id: 'equal',
  description: 'equal to',
  params: 1,
  active: true,
  operate: () => {}
};
const lessThan = {
  id: 'lessThan',
  description: 'less than',
  params: 1,
  active: true,
  operate: () => {}
};
const greaterThan = {
  id: 'greaterThan',
  description: 'greater than',
  params: 1,
  active: true,
  operate: () => {}
};
const lessThanOrEqual = {
  id: 'lessThanOrEqual',
  description: 'less than or equal to',
  params: 1,
  active: true,
  operate: () => {}
};
const greaterThanOrEqual = {
  id: 'greaterThanOrEqual',
  description: 'greater than or equal to',
  params: 1,
  active: true,
  operate: () => {}
};
const between = {
  id: 'is',
  description: 'between',
  params: 1,
  active: true,
  operate: () => {}
};

// aggregation

const count = {
  id: 'count',
  description: 'count',
  params: 1,
  active: true,
  operate: () => {}
};
const average = {
  id: 'average',
  description: 'average',
  params: 1,
  active: true,
  operate: () => {}
};
const sum = {
  id: 'sum',
  description: 'sum',
  params: 1,
  active: true,
  operate: () => {}
};
const median = {
  id: 'median',
  description: 'median',
  params: 1,
  active: true,
  operate: () => {}
};
const min = {
  id: 'min',
  description: 'min',
  params: 1,
  active: true,
  operate: () => {},
};
const max = {
  id: 'max',
  description: 'max',
  params: 1,
  active: true,
  operate: () => {},
};
const percentage = {
  id: 'percentage',
  description: 'percentage',
  params: 1,
  active: true,
  operate: () => {},
};

const Operators = {
  empty,
  notEmpty,
  any,
  is,
  startsWith,
  contains,
  on,
  before,
  after,
  onOrBefore,
  onOrAfter,
  within,
  equal,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  between,
  count,
  average,
  median,
  min,
  max,
  percentage
};

export default Operators