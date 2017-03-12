import Operators from '../operators';

/**
 * Composition Standard fields
 * @constructor
 */
export const StringField = (...args) => ({
  props: {
    id: 'string',
    name: 'string',
  },
  operators: {
    is: Object.assign({}, Operators.is(args[0], args[1])),
    contains: Object.assign({}, Operators.contains(args[0], args[1])),
    startsWith: Object.assign({}, Operators.startsWith(args[0], args[1])),
  }
});

const NumberField = (...args) => ({
  props: {
    id: 'number',
    name: 'number'
  },
  operators: {
    equal: Object.assign({}, Operators.equal(args[0], args[1])),
    lessThan: Object.assign({}, Operators.lessThan(args[0], args[1])),
    greaterThan: Object.assign({}, Operators.greaterThan(args[0], args[1])),
    lessThanOrEqual: Object.assign({}, Operators.lessThanOrEqual(args[0], args[1])),
    greaterThanOrEqual: Object.assign({}, Operators.greaterThanOrEqual(args[0], args[1])),
    between: Object.assign({}, Operators.between(args[0], args[1])),
  }
});

const DateField = (...args) => ({
  props: {
    id: 'date',
    name: 'date',
  },
  operators: {
    on: Object.assign({}, Operators.on(args[0], args[1])),
    before: Object.assign({}, Operators.before(args[0], args[1])),
    after: Object.assign({}, Operators.after(args[0], args[1])),
    onOrBefore: Object.assign({}, Operators.onOrBefore(args[0], args[1])),
    onOrAfter: Object.assign({}, Operators.onOrAfter(args[0], args[1])),
    within: Object.assign({}, Operators.within(args[0], args[1])),
  }
});

const Fields = {
  StringField,
  NumberField,
  DateField,
};

export default Fields