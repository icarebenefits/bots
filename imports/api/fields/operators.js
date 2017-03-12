import moment from 'moment';
import S from 'string';

/**
 * Composition Objects for all of operators
 */

// generic


// bitwise


// string
const is = (s1, s2) => ({
  props: {
    id: 'is',
    name: 'is',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => s1 === s2,
});
const contains = (s1, s2) => ({
  props: {
    id: 'contains',
    name: 'contains',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => S(s1).contains(s2),
});
const startsWith = (s1, s2) => ({
  props: {
    id: 'startsWith',
    name: 'starts with',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => S(s1).startsWith(s2),
});

// date
const on = (d1, d2) => ({
  props: {
    id: 'on',
    name: 'on',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isSame(d2),
});
const before = (d1, d2) => ({
  props: {
    id: 'before',
    name: 'before',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isBefore(d2),
});
const after = (d1, d2) => ({
  props: {
    id: 'after',
    name: 'after',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isAfter(d2),
});
const onOrBefore = (d1, d2) => ({
  props: {
    id: 'onOrBefore',
    name: 'on or before',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isSameOrBefore(d2),
});
const onOrAfter = (d1, d2) => ({
  props: {
    id: 'onOrAfter',
    name: 'on or after',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isSameOrAfter(d2),
});
const within = (d1, d2) => ({
  props: {
    id: 'within',
    name: 'within',
    type: 'date',
    params: 3,
  },
  check: (d, d1, d2) => moment(d).isBetween(d1, d2)
});

// number
const equal = (n1, n2) => ({
  props: {
    id: 'equal',
    name: 'equal to',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 === n2,
});
const lessThan = (n1, n2) => ({
  props: {
    id: 'lessThan',
    name: 'less than',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 < n2,
});
const greaterThan = (n1, n2) => ({
  props: {
    id: 'greaterThan',
    name: 'greater than',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 > n2
});
const lessThanOrEqual = (n1, n2) => ({
  props: {
    id: 'lessThanOrEqual',
    name: 'less than or equal to',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 <= n2
});
const greaterThanOrEqual = (n1, n2) => ({
  props: {
    id: 'greaterThanOrEqual',
    name: 'greater than or equal to',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 >= n2
});
const between = (n, n1, n2) => ({
  props: {
    id: 'between',
    name: 'between',
    type: 'number',
    params: 2,
  },
  check: (n, n1, n2) => (n >= n1 && n <= n2)
});

// aggregation


const Operators = {
  // string
  is,
  contains,
  startsWith,
  // date
  on,
  before,
  after,
  onOrBefore,
  onOrAfter,
  within,
  // number
  equal,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  between
};

export default Operators