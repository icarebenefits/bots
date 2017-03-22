import moment from 'moment';
import S from 'string';
import bodybuilder from 'bodybuilder';

/**
 * Composition Objects for all of operators
 */

// generic
const not = () => ({
  props: {
    id: 'not',
    name: 'not',
    type: 'not',
    params: 1,
  },
  buildQuery: (query) => {
    return bodybuilder()
      .query("bool", {"must_not": [query]})
      .build();
  }
});

// bitwise
const and = () => ({
  props: {
    id: 'and',
    name: 'and',
    type: 'and',
    params: 2,
  },
  buildQuery: (query1, query2) => {
    return bodybuilder()
      .query("bool", {"must": [query1]})
      .query("bool", {"must": [query2]})
      .build();
  }
});
const or = () => ({
  props: {
    id: 'or',
    name: 'or',
    type: 'or',
    params: 2,
  },
  buildQuery: (query1, query2) => {
    return bodybuilder()
      .query("bool", {"should": [query1]})
      .query("bool", {"should": [query2]})
      .build();
  }
});



// string
const is = (s1, s2) => ({
  props: {
    id: 'is',
    name: 'is',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => s1 === s2,
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('term', `${field}.keyword`, values[0].value)
      .build();
  }
});
const contains = (s1, s2) => ({
  props: {
    id: 'contains',
    name: 'contains',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => S(s1).contains(s2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('wildcard', `${field}.keyword`, `*${values[0].value}*`)
      .build();
  }
});
const startsWith = (s1, s2) => ({
  props: {
    id: 'startsWith',
    name: 'starts with',
    type: 'string',
    params: 2,
  },
  check: (s1, s2) => S(s1).startsWith(s2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('prefix', `${field}.keyword`, values[0].value)
      .build();
  }
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
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('term', field, values[0].value)
      .build();
  }
});
const before = (d1, d2) => ({
  props: {
    id: 'before',
    name: 'before',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isBefore(d2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {gt: values[0].value})
      .build();
  }
});
const after = (d1, d2) => ({
  props: {
    id: 'after',
    name: 'after',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isAfter(d2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {lt: values[0].value})
      .build();
  }
});
const onOrBefore = (d1, d2) => ({
  props: {
    id: 'onOrBefore',
    name: 'on or before',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isSameOrBefore(d2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {gte: values[0].value})
      .build();
  }
});
const onOrAfter = (d1, d2) => ({
  props: {
    id: 'onOrAfter',
    name: 'on or after',
    type: 'date',
    params: 2,
  },
  check: (d1, d2) => moment(d1).isSameOrAfter(d2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {lte: values[0].value})
      .build();
  }
});
const within = (d1, d2) => ({
  props: {
    id: 'within',
    name: 'within',
    type: 'date',
    params: 3,
  },
  check: (d, d1, d2) => moment(d).isBetween(d1, d2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {gte: values[0].value, lte: values[1].value})
      .build();
  }
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
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('term', field, values[0].value)
      .build();
  }
});
const lessThan = () => ({
  props: {
    id: 'lessThan',
    name: 'less than',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 < n2,
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {lt: values[0].value})
      .build();
  }
});
const greaterThan = (n1, n2) => ({
  props: {
    id: 'greaterThan',
    name: 'greater than',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 > n2,
  buildQuery: (values) => {
    return bodybuilder()
      .query('range', field, {gt: values[0].value})
      .build();
  }
});
const lessThanOrEqual = (n1, n2) => ({
  props: {
    id: 'lessThanOrEqual',
    name: 'less than or equal to',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 <= n2,
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {lte: values[0].value})
      .build();
  }
});
const greaterThanOrEqual = (n1, n2) => ({
  props: {
    id: 'greaterThanOrEqual',
    name: 'greater than or equal to',
    type: 'number',
    params: 2,
  },
  check: (n1, n2) => n1 >= n2,
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {gte: values[0].value})
      .build();
  }
});
const between = (n, n1, n2) => ({
  props: {
    id: 'between',
    name: 'between',
    type: 'number',
    params: 3,
  },
  check: (n, n1, n2) => (n >= n1 && n <= n2),
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('range', field, {gte: values[0].value, lte: values[1].value})
      .build();
  }
});

// aggregation


const Operators = {
  //generic
  not,
  // bitwise
  and,
  or,
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