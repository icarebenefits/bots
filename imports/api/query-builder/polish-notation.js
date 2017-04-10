import _ from 'lodash';

import {Operators, FieldsGroups} from '/imports/api/fields';


// list of supported operators
const operators = Object.keys(Operators);
// support for compound conditions
operators.push('(');
operators.push(')');

/**
 * Function convert conditions object to array of conditions
 * @param conditions
 * @return {Array}
 */
export const makeExpression = (conditions) => {
  const stack = [];
  conditions.map((condition) => {
    const {not, openParens, group, filter, field, operator, values, closeParens, bitwise} = condition;
    if (not) {
      stack.push('not');
    }
    if (!_.isEmpty(openParens)) {
      const parens = Array.from(openParens);
      parens.map(p => stack.push(p));
    }
    if (!_.isEmpty(field)) {
      const {ESField} = FieldsGroups[group].fields[field]().props;
      stack.push(ESField);
    } else {
      if (!_.isEmpty(filter)) {
        const {ESField} = FieldsGroups[group].fields[filter]().props;
        stack.push(ESField);
      }
    }
    if (!_.isEmpty(operator)) {
      stack.push(operator);
    }
    if (!_.isEmpty(values)) {
      stack.push(values);
    }
    if (!_.isEmpty(closeParens)) {
      const parens = Array.from(closeParens);
      parens.map(p => stack.push(p));
    }
    if (!_.isEmpty(bitwise)) {
      stack.push(bitwise);
    }
  });

  if (!_.isEmpty(stack)) {
    return stack;
  } else {
    return [];
  }
};

/**
 * Function get the priority of the operator
 * @param operator
 * @return {number}
 */
const getPriority = (operator) => {
  if (['not', 'or', 'and'].indexOf(operator) > -1) {
    return 1;
  } else if (['(', ')'].indexOf(operator) > -1)
    return 0;
  else
    return 2;
};

/**
 * Function check an element is an operator or not
 * @param e
 * @return {boolean}
 */
const isOperator = (e) => {
  if (operators.indexOf(e) !== -1)
    return true;
  else
    return false;
};

/**
 * Function convert infix expression to postfix expression for Polish Notation
 * @param expression
 * @return {Array}
 */
const infixToPostfix = (expression) => {
  const stack = [];
  const queue = [];

  expression.map(e => {
    if (!isOperator(e)) {
      queue.push(e);
    } else {
      if (e === '(') stack.push(e);
      else {
        if (e === ')') {
          let c = '';
          do {
            c = stack.pop();
            if (c !== '(') queue.push(c);
          } while (c !== '(')
        } else {
          while (!_.isEmpty(stack) &&
          stack[stack.length - 1] !== '(' &&
          getPriority(stack[stack.length - 1]) > getPriority(e)) {
            const c = stack.pop();
            queue.push(c);
          }
          stack.push(e);
        }
      }
    }
  });
  // add all remain operators from stack into queue
  while (!_.isEmpty(stack)) {
    const o = stack.pop();
    queue.push(o);
  }

  return queue;
};

const isQueryObject = (q) => {
  if (!_.isEmpty(q.query))
    return true;
  else
    return false;
};


/**
 * Function validate the conditions
 * @param expression
 * @return {*}
 */
export const validateConditions = (conditions, expression) => {
  // number of open parens have to equal to number of close parens
  const noOfOpenParens = expression.filter(e => e === '(').length;
  const noOfCloseParens = expression.filter(e => e === ')').length;
  if(noOfOpenParens !== noOfCloseParens)
    return {error: 'The number of open Parens and close Parens mismatched!!'};
  // the last condition can't have bitwise
  const e = expression[expression.length - 1];
  if(['and', 'or'].indexOf(e) > -1)
    return {error: 'The last condition can not have And/Or operator!!'};
  // the number of bitwise have to be the number of conditions - 1
  const noOfBitwise = expression.filter(e => (e === 'and' || e === 'or')).length;
  if(noOfBitwise !== (conditions.length - 1))
    return {error: 'The number of And/Or is unacceptable!!'};

  return {};
};

/**
 * Function build query
 */
const buildQuery = () => {
  
};

/**
 * Function validate the aggregations
 * @param aggregations
 * @return {{}}
 */
// const validateAggregations = (aggregations) => {
//   return {};
// };

/**
 * Function build Elastic query from conditions with Polish Notation Algorithm
 * @param conditions
 * @return {string}
 */
const queryBuilder = (conditions) => {
  /* get expression */
  const expression = makeExpression(conditions);
  /* validate conditions */
  const {error: condErr} = validateConditions(conditions, expression);
  if(condErr) return {error: condErr};

  /* build elastic query */
  const polishNotation = infixToPostfix(expression);
  const stack = [];
  let query = {};

  polishNotation.map(p => {
    if (isOperator(p)) {
      switch (p) {
        case 'not':
        {
          // only build query with 1 param
          const param = stack.pop();
          if (isQueryObject(param)) {
            // build query from a previous query
            const {query: preQuery} = param;
            query = Operators[p]().buildQuery(preQuery);

            stack.push(query);
            break;
          } else {
            // build new query
            return {error: "can't build 'not' query from a non query object!!!"};
          }
        }
        case 'and':
        {
          // build query with 2 params
          const
            param2 = stack.pop(),
            param1 = stack.pop();

          // verify params type
          if (!isQueryObject(param1) || !isQueryObject(param2)) {
            return {error: "can't build 'and' query from a non query object!!!"};
          }
          const
            {query: preQuery1} = param1,
            {query: preQuery2} = param2
            ;

          query = Operators[p]().buildQuery(preQuery1, preQuery2);

          stack.push(query);
          break;
        }
        case 'or':
        {
          // build query with 2 params
          const
            param2 = stack.pop(),
            param1 = stack.pop();

          // verify params type
          if (!isQueryObject(param1) || !isQueryObject(param2)) {
            return {error: "can't build 'or' query from a non query object!!!"};
          }
          const
            {query: preQuery1} = param1,
            {query: preQuery2} = param2
            ;

          query = Operators[p]().buildQuery(preQuery1, preQuery2);

          stack.push(query);
          break;
        }
        default:
        {
          // build new query
          const
            values = stack.pop(),
            field = stack.pop()
            ;

          query = Operators[p]().buildQuery(field, values);

          stack.push(query);
        }
      }
    } else {
      stack.push(p);
    }
  });

  return {query};
};

export default queryBuilder

/**
 * Testing
 */
// const conditions = [
//   {
//     not: false,
//     openParens: '',
//     filter: 'business units',
//     field: 'full_name',
//     operator: 'contains',
//     values: ['Justin'],
//     closeParens: '',
//     bitwise: 'and'
//   },
//   {
//     not: true,
//     openParens: '(',
//     filter: 'salary',
//     field: '',
//     operator: 'lessThan',
//     values: ['1000'],
//     closeParens: '',
//     bitwise: 'or'
//   },
//   {
//     not: false,
//     openParens: '',
//     filter: 'credit_limit',
//     field: '',
//     operator: 'lessThan',
//     values: ['2000'],
//     closeParens: ')',
//     bitwise: ''
//   },
//   // {
//   //   not: true,
//   //   openParens: '',
//   //   filter: 'hiring_date',
//   //   field: '',
//   //   operator: 'before',
//   //   values: ['2012-01-27'],
//   //   closeParens: '))',
//   //   bitwise: ''
//   // },
// ];
// const {error, query} = queryBuilder(conditions);
// if(error) {
//   console.log('error', error);
// } else {
//   console.log(JSON.stringify(query, null, 2));
// }


