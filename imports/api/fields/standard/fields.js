import Operators from '../operators';

/**
 * Composition Standard fields
 * @constructor
 */
const StringField = () => {
  const {is, startsWith, contains} = Operators;

  return {
    id: 'string',
    description: 'string',
    operators: Object.assign({}, {is, startsWith, contains}),
  }
};

const NumberField = () => {
  const {equal, lessThan, greaterThan, lessThanOrEqual, greaterThanOrEqual, between} = Operators;

  return {
    id: 'number',
    description: 'number',
    operators: Object.assign({}, {equal, lessThan, greaterThan, lessThanOrEqual, greaterThanOrEqual}),
  }
};

const DateField = () => {
  const {on, before, after, onOrBefore, onOrAfter, within} = Operators;

  return {
    id: 'date',
    description: 'date',
    operators: Object.assign({}, {on, before, after, onOrBefore, onOrAfter}),
  }
};

const Fields = {
  StringField,
  NumberField,
  DateField,
};

export default Fields