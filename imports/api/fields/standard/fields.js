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
    is: Object.assign({}, Operators.is()),
    contains: Object.assign({}, Operators.contains()),
    startsWith: Object.assign({}, Operators.startsWith()),
  }
});

const NumberField = (...args) => ({
  props: {
    id: 'number',
    name: 'number'
  },
  operators: {
    equal: Object.assign({}, Operators.equal()),
    lessThan: Object.assign({}, Operators.lessThan()),
    greaterThan: Object.assign({}, Operators.greaterThan()),
    lessThanOrEqual: Object.assign({}, Operators.lessThanOrEqual()),
    greaterThanOrEqual: Object.assign({}, Operators.greaterThanOrEqual()),
    between: Object.assign({}, Operators.between()),
  }
});

const DateField = (...args) => ({
  props: {
    id: 'date',
    name: 'date',
  },
  operators: {
    on: Object.assign({}, Operators.on()),
    before: Object.assign({}, Operators.before()),
    after: Object.assign({}, Operators.after()),
    onOrBefore: Object.assign({}, Operators.onOrBefore()),
    onOrAfter: Object.assign({}, Operators.onOrAfter()),
    within: Object.assign({}, Operators.within()),
  }
});

const BooleanField = (...args) => ({
  props: {
    id: 'boolean',
    name: 'boolean',
  },
  operators: {
    bool: Object.assign({}, Operators.bool()),
  }
});

const ArrayField = (...args) => ({
  props: {
    id: 'array',
    name: 'array',
  },
  operators: {
    in: Object.assign({}, Operators.inArray()),
  }
});

const GenderField = (...args) => ({
  props: {
    id: 'gender',
    name: 'gender',
  },
  operators: {
    is: Object.assign({}, Operators.gender()),
  }
});

const Fields = {
  BooleanField,
  StringField,
  NumberField,
  DateField,
  ArrayField,
  GenderField,
};

export default Fields