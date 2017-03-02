import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {check} from 'meteor/check';
import classification from '/imports/ui/pages/classification';

export const IDValidator = {
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
};

export const Expression = {
  build: (conditions) => {
    check(conditions, Array);

    // console.log(conditions);
    let expression = [];

    conditions.map(condition => {
      let newCond = {};
      condition.map(cond => {
        if (cond.id === 'description') {
          newCond['operator'] = cond.operator;
          newCond['value'] = cond.value;
        } else {
          console.log(cond)
          newCond[cond.id] = cond.value || '';
        }
        delete newCond.description;
      });
      expression.push(newCond);
    });

    // console.log(expression);
    
    return expression;
  },
  create: (expression) => {
    check(expression, Array);

    const expr = [];
    expression.map(e => {
      // console.log(e);
      const {not, openParens, filter, operator, value, closeParens, bitwise} = e;
      expr.push(`${(not ? '!' : '')} ${openParens} ${filter} ${operator} ${value} ${closeParens} ${bitwise}`);
    });

    return expr.join(' ');
  }
};

export const Conditions = {
  parse: (expression) => {
    check(expression, Array);

    let conditions = [];

    expression.map(e => {
      const {not, openParens, filter, operator, value, closeParens, bitwise} = e;
      const condition = [
        {
          id: 'not',
          label: 'Not',
          type: 'checkbox',
          value: not
        },
        {
          id: 'openParens',
          label: 'Parens',
          type: 'select',
          options: classification.conditionsBuilder.openParens,
          value: openParens
        },
        {
          id: 'filter',
          label: 'Filter',
          type: 'select',
          options: classification.conditionsBuilder.filters,
          value: filter
        },
        {
          id: 'description',
          label: 'Description',
          type: 'label',
          operator: operator,
          value: value
        },
        {
          id: 'closeParens',
          label: 'Parens',
          type: 'select',
          options: classification.conditionsBuilder.closeParens,
          value: closeParens
        },
        {
          id: 'bitwise',
          label: 'And/Or',
          type: 'select',
          options: classification.conditionsBuilder.bitwise,
          value: bitwise
        },
      ];
      conditions.push(condition);
    });
    
    return conditions;
  }
};

export const Operators = {
  get: (field) => {
    check(field, String);

    const
      {operators, fieldTypes} = classification.conditionsBuilder,
      type = fieldTypes[field]
      ;

    return operators[type];
  }
};

export const FormFields = {
  create: (operator) => {
    const fields = [
      {
        id: 'operator',
        type: 'select',
        label: '',
        options: operators
      },
      {
        id: 'value',
        type: 'input',
        label: '',
      }
    ];
  }
};

