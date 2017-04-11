import moment from 'moment';
import bodybuilder from 'bodybuilder';


/**
 * List all Elastic supported time units
 * @type {{years: string, months: string, weeks: string, days: string, hours: string, minutes: string, seconds: string}}
 */
export const timeUnits = {
  years: 'y',
  months: 'M',
  weeks: 'w',
  days: 'd',
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};

/**
 * Composition Objects for all of operators
 */

/**
 * Generic
 */
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
const empty = () => ({
  props: {
    id: 'empty',
    name: 'is',
    type: 'null',
    params: 2,
  },
  buildQuery: (field) => {
    return bodybuilder()
      .query('exists', 'field', field)
      .build();
  },
  getParams: (field) => {
    return {type: 'exists', field: 'field', value: field};
  },
});

/**
 * Bitwise
 */
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

/**
 * Boolean
 */
const bool = () => ({
  props: {
    id: 'bool',
    name: 'is',
    type: 'bool',
    params: 2,
  },
  buildQuery: (field, values) => {
    const bool = Boolean(values[0].value);
    return bodybuilder()
      .query('term', field, bool)
      .build();
  },
  getParams: (field, values) => {
    const bool = Boolean(values[0].value);
    return {type: 'term', field, value: bool};
  },
});

/**
 * Gender
 */
const gender = () => ({
  props: {
    id: 'gender',
    name: 'is',
    type: 'gender',
    params: 2,
  },
  buildQuery: (field, values) => {
    const str = values[0].value.toString();
    return bodybuilder()
      .query('term', field, str)
      .build();
  },
  getParams: (field, values) => {
    const str = values[0].value.toString();
    return {type: 'term', field, value: str};
  },
});

/**
 * Array
 */
const inArray = () => ({
  props: {
    id: 'inArray',
    name: 'in',
    type: 'array',
  },
  buildQuery: (field, values) => {
    return bodybuilder()
      .query('terms', field, values)
      .build();
  },
  getParams: (field, values) => {
    const str = values[0].value.toString();
    return {type: 'term', field, value: str};
  },
});

/**
 * String
 */
const is = () => ({
  props: {
    id: 'is',
    name: 'is',
    type: 'string',
    params: 2,
  },
  buildQuery: (field, values) => {
    const str = values[0].value.toString();
    return bodybuilder()
      .query('term', `${field}.keyword`, str)
      .build();
  },
  getParams: (field, values) => {
    const str = values[0].value.toString();
    return {type: 'term', field: `${field}.keyword`, value: str};
  },
});
const contains = () => ({
  props: {
    id: 'contains',
    name: 'contains',
    type: 'string',
    params: 2,
  },
  buildQuery: (field, values) => {
    const str = values[0].value.toString();
    return bodybuilder()
      .query('wildcard', `${field}.keyword`, `*${str}*`)
      .build();
  },
  getParams: (field, values) => {
    const str = values[0].value.toString();
    return {type: 'wildcard', field: `${field}.keyword`, value: `*${str}*`};
  },
});
const startsWith = () => ({
  props: {
    id: 'startsWith',
    name: 'starts with',
    type: 'string',
    params: 2,
  },
  buildQuery: (field, values) => {
    const str = values[0].value.toString();
    return bodybuilder()
      .query('prefix', `${field}.keyword`, str)
      .build();
  },
  getParams: (field, values) => {
    const str = values[0].value.toString();
    return {type: 'prefix', field: `${field}.keyword`, value: str};
  },
});

/**
 * Date
 */
const on = () => ({
  props: {
    id: 'on',
    name: 'on',
    type: 'date',
    params: 2,
  },
  buildQuery: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('term', field, date)
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'term', field, value: date};
  },
});
const before = () => ({
  props: {
    id: 'before',
    name: 'before',
    type: 'date',
    params: 2,
  },
  buildQuery: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('range', field, {gt: date})
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'range', field, value: {gt: date}};
  },
});
const after = () => ({
  props: {
    id: 'after',
    name: 'after',
    type: 'date',
    params: 2,
  },
  buildQuery: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('range', field, {lt: date})
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'range', field, value: {lt: date}};
  },
});
const onOrBefore = () => ({
  props: {
    id: 'onOrBefore',
    name: 'on or before',
    type: 'date',
    params: 2,
  },
  buildQuery: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('range', field, {gte: date})
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'range', field, value: {gte: date}};
  },
});
const onOrAfter = () => ({
  props: {
    id: 'onOrAfter',
    name: 'on or after',
    type: 'date',
    params: 2,
  },
  buildQuery: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('range', field, {lte: date})
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'range', field, value: {lte: date}};
  },
});
const within = () => ({
  props: {
    id: 'within',
    name: 'within',
    type: 'date',
    params: 3,
  },
  buildQuery: (field, values) => {
    const date1 = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    const date2 = moment(new Date(values[1].value)).format('YYYY-MM-DD');
    return bodybuilder()
      .query('range', field, {gte: date1, lte: date2})
      .build();
  },
  getParams: (field, values) => {
    const date = moment(new Date(values[0].value)).format('YYYY-MM-DD');
    return {type: 'range', field, value: {gte: date1, lte: date2}};
  },
});
const inLast = () => ({
  props: {
    id: 'inLast',
    name: 'in last',
    type: 'inLast',
    params: 3,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value); // 3
    const str = values[1].value.toString(); // in Elastic timeUnits (years, months, ...)
    const tu = timeUnits[str];
    return bodybuilder()
      .query('range', field, {gte: `now-${num}${tu}`, lte: 'now'})
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value); // 3
    const str = values[1].value.toString(); // in Elastic timeUnits (years, months, ...)
    const tu = timeUnits[str];
    return {type: 'range', field, value: {gte: `now-${num}${tu}`, lte: 'now'}};
  },
});

/**
 * Number
 */
const equal = () => ({
  props: {
    id: 'equal',
    name: 'equal to',
    type: 'number',
    params: 2,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value);
    return bodybuilder()
      .query('term', field, num)
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value);
    return {type: 'term', field, value: num};
  },
});
const lessThan = () => ({
  props: {
    id: 'lessThan',
    name: 'less than',
    type: 'number',
    params: 2,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value);
    return bodybuilder()
      .query('range', field, {lt: num})
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value);
    return {type: 'range', field, value: {lt: num}};
  },
});
const greaterThan = () => ({
  props: {
    id: 'greaterThan',
    name: 'greater than',
    type: 'number',
    params: 2,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value);
    return bodybuilder()
      .query('range', field, {gt: num})
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value);
    return {type: 'range', field, value: {gt: num}};
  },
});
const lessThanOrEqual = () => ({
  props: {
    id: 'lessThanOrEqual',
    name: 'less than or equal to',
    type: 'number',
    params: 2,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value);
    return bodybuilder()
      .query('range', field, {lte: num})
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value);
    return {type: 'range', field, value: {lte: num}};
  },
});
const greaterThanOrEqual = () => ({
  props: {
    id: 'greaterThanOrEqual',
    name: 'greater than or equal to',
    type: 'number',
    params: 2,
  },
  buildQuery: (field, values) => {
    const num = Number(values[0].value);
    return bodybuilder()
      .query('range', field, {gte: num})
      .build();
  },
  getParams: (field, values) => {
    const num = Number(values[0].value);
    return {type: 'range', field, value: {gte: num}};
  },
});
const between = () => ({
  props: {
    id: 'between',
    name: 'between',
    type: 'number',
    params: 3,
  },
  buildQuery: (field, values) => {
    const num1 = Number(values[0].value);
    const num2 = Number(values[1].value);
    return bodybuilder()
      .query('range', field, {gte: num1, lte: num2})
      .build();
  },
  getParams: (field, values) => {
    const num1 = Number(values[0].value);
    const num2 = Number(values[1].value);
    return {type: 'range', field, value: {gte: num1, lte: num2}};
  },
});

/**
 * Aggregations
 */

/**
 * List all supported operators
 * @type {{not: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), and: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), or: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), bool: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), gender: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), inArray: (function(): {props: {id: string, name: string, type: string}, buildQuery: (function())}), is: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), contains: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), startsWith: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), on: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), before: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), after: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), onOrBefore: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), onOrAfter: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), within: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), inLast: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), equal: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), lessThan: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), greaterThan: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), lessThanOrEqual: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), greaterThanOrEqual: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())}), between: (function(): {props: {id: string, name: string, type: string, params: number}, buildQuery: (function())})}}
 */
const Operators = {
  //generic
  not,
  empty,
  // bitwise
  and,
  or,
  // boolean
  bool,
  // gender
  gender,
  // array
  inArray,
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
  inLast,
  // number
  equal,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  between
};

export default Operators