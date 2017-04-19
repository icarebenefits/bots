import _ from 'lodash';
import {Operator, Field} from '/imports/api/fields';
import Query from './query';

// list of supported operators
const operators = Object.keys(Operator());
// support for compound conditions
operators.push('(');
operators.push(')');

const getField = (group, fieldId) => {
  const {field} = Field()[group]().field()[fieldId]().elastic();
  return field;
};

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
      stack.push({group, name: getField(group, field)});
    } else {
      if (!_.isEmpty(filter)) {
        stack.push({group, name: getField(group, filter)});
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
export const infixToPostfix = (expression) => {
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

/**
 * Function check an object is a query object or not
 * @param q
 * @return {boolean}
 */
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
 * Function build Elastic query from conditions with Polish Notation Algorithm
 * @param conditions
 * @param aggregation
 * @return {*}
 */
const polishNotation = (conditions, aggregation) => {

  /* get expression */
  const expression = makeExpression(conditions);
  /* validate conditions */
  const {error: condErr} = validateConditions(conditions, expression);
  if(condErr) return {error: condErr};

  const {
    group,
  } = aggregation;

  /* build elastic query */
  const polishNotation = infixToPostfix(expression);
  const stack = [];
  let query = {};

  // console.log('conditions', conditions);
  // console.log('expression', expression);
  // console.log('polishNotaion', polishNotation);
  // console.log('aggregation', aggregation);

  polishNotation.map(p => {
    if (isOperator(p)) {
      const params = {
        aggGroup: group
      };
      switch (p) {
        case 'not':
        {
          // only build query with 1 param
          const param = stack.pop();
          if (isQueryObject(param)) {
            params.query = param.query;
          } else {
            // build new query
            return {error: "can't build 'not' query from a non query object!!!"};
          }
          break;
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

          params.queries = [param1.query, param2.query];

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

          params.queries = [param1.query, param2.query];

          break;
        }
        default:
        {
          // build new query
          const
            values = stack.pop(),
            field = stack.pop()
            ;

          params.field = field;
          params.values = values;
        }
      }

      query = Query().buildQuery({params, operator: p});

      stack.push(query);
    } else {
      stack.push(p);
    }
  });

  return {query};
};

/**
 *
 * @param type
 * @return {{build: (function())}}
 * @constructor
 */
const QueryBuilder = (type = 'conditions') => {
  let build = () => {};
  switch (type) {
    case 'conditions': {
      build = polishNotation;
      break;
    }
    case 'aggregation': {
      build = Query().buildAggregation;
      break;
    }
    default: {
      build = Query().buildNormalQuery;
    }
  }
  return {build};
};

export default QueryBuilder

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


/* Test data */
// const {SLAs} = require('../collections/slas');
// const SLA = SLAs.findOne({_id: "ZkY73hbBmXCtfAigy"});
// const {conditions, message} = SLA;
// const {error, query} = queryBuilder(conditions);
// if(error) {
//   console.log('error', error);
// } else {
//   console.log(JSON.stringify(query));
// }

