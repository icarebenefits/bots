export default {
  grapes: [
    'Baco Noir',
    'Barbera',
    'Cabernet Franc',
    'Cabernet Sauvignon'
  ],
  conditionsBuilder: {
    not: [true, false],
    openParens: ['', '(', '((', '((('],
    closeParens: ['', ')', '))', ')))'],
    filters: ['', 'Email', 'Hire date', 'iCare role', 'iCare member', 'Subsidiary', 'Gender',],
    operators: {
      string: ['is', 'startsWith', 'contains'],
      number: ['equal', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between'],
      date: ['on', 'before', 'after', 'onOrBefore', 'onOrAfter', 'within'],
      boolean: ['yes', 'no'],
      gender: ['male', 'female'],
    },
    fieldTypes: {
      'Email': 'string',
      'Hire date': 'date',
      'iCare role': 'string',
      'iCare member': 'number',
      'Subsidiary': 'boolean',
      'Gender': 'gender'
    },
    bitwise: ['', 'And', 'Or'],
  }
}