import bodybuilder from 'bodybuilder';
import _ from 'lodash';

const conditions = [
  {
    not: false,
    openParens: '',
    filter: 'business units',
    field: 'full_name',
    operator: 'contains',
    values: ['Justin'],
    closeParens: '',
    bitwise: 'and'
  },
  {
    not: true,
    openParens: '',
    filter: 'salary',
    field: '',
    operator: 'lessThan',
    values: ['1000'],
    closeParens: '',
    bitwise: ''
  },
  // {
  //   not: true,
  //   openParens: '',
  //   filter: 'credit_limit',
  //   field: '',
  //   operator: 'lessThan',
  //   values: ['2000'],
  //   closeParens: ')',
  //   bitwise: 'or'
  // },
  // {
  //   not: true,
  //   openParens: '',
  //   filter: 'hiring_date',
  //   field: '',
  //   operator: 'before',
  //   values: ['2012-01-27'],
  //   closeParens: '))',
  //   bitwise: ''
  // },
];

// list of supported operators
const operators = ['(', ')', 'not', 'and', 'or', 'contains', 'startsWith', 'greaterThan', 'lessThan', 'before'];
// support for compound conditions
operators.push('(');
operators.push(')');

const contains = (field, value) => {
  return bodybuilder()
    .query('wildcard', `${field}.keyword`, `*${value}*`)
    .build();
};
const greaterThan = (field, value) => {
  return bodybuilder()
    .query('range', field, {gt: value})
    .build();
};
const lessThan = (field, value) => {
  return bodybuilder()
    .query('range', field, {lt: value})
    .build();
};
const before = (field, value) => {
  return bodybuilder()
    .query('range', field, {gt: value})
    .build();
};

/**
 * Function convert conditions object to array of conditions
 * @param conditions
 * @return {Array}
 */
const makeExpression = (conditions) => {
  const stack = [];
  conditions.map((condition, idx) => {
    const {not, openParens, filter, field, operator, values, closeParens, bitwise} = condition;
    if (not) {
      stack.push('not');
    }
    if (!_.isEmpty(openParens)) {
      const parens = Array.from(openParens);
      parens.map(p => stack.push(p));
    }
    if (!_.isEmpty(field)) {
      stack.push(field);
    } else {
      if (!_.isEmpty(filter)) {
        stack.push(filter);
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
          while (!_.isEmpty(stack) && stack[stack.length - 1] !== '(' && getPriority(stack[stack.length - 1]) > getPriority(e)) {
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
 * Function build Elastic query from conditions with Polish Notation Algorithm
 * @param conditions
 * @return {string}
 */
const queryBuilder = (conditions) => {
  const expression = makeExpression(conditions);
  const polishNotation = infixToPostfix(expression);
  const stack = [];
  let query = {};

  polishNotation.map(p => {
    if (isOperator(p)) {
      switch (p) {
        case 'not': {
          // only build query with 1 param
          const param = stack.pop();
          if (isQueryObject(param)) {
            // build query from a previous query
            const {query: preQuery} = param;
            query = bodybuilder()
              .query("bool", {"must_not": [preQuery]})
              .build();

            stack.push(query);
            break;
          } else {
            // build new query
            console.log("can't build 'not' query from a non query object!!!");
            return {};
          }
        }
        case 'and': {
          // build query with 2 params
          const
            param2 = stack.pop(),
            param1 = stack.pop();

          // verify params type
          if(!isQueryObject(param1) || !isQueryObject(param2)) {
            console.log("can't build 'and' query from a non query object!!!");
            return {};
          }
          const
            {query: preQuery1} = param1,
            {query: preQuery2} = param2
            ;

          query = bodybuilder()
            .query("bool", {"must": [preQuery1]})
            .query("bool", {"must": [preQuery2]})
            .build()

          stack.push(query);
          break;
        }
        case 'or': {
          // build query with 2 params
          const
            param2 = stack.pop(),
            param1 = stack.pop();

          // verify params type
          if(!isQueryObject(param1) || !isQueryObject(param2)) {
            console.log("can't build 'and' query from a non query object!!!");
            return {};
          }
          const
            {query: preQuery1} = param1,
            {query: preQuery2} = param2
            ;

          query = bodybuilder()
            .query("bool", {"should": [preQuery1]})
            .query("bool", {"should": [preQuery2]})
            .build()

          stack.push(query);
          break;
        }
        default: {
          // build new query
          const
            values = stack.pop(),
            field = stack.pop()
            ;

          switch (p) {
            case 'contains': {
              query = contains(field, values[0]);
              break;
            }
            case 'greaterThan': {
              query = greaterThan(field, values[0]);
              break;
            }
            case 'lessThan': {
              query = lessThan(field, values[0]);
              break;
            }
            case 'before': {
              query = before(field, values[0]);
              break;
            }
            default: {
              console.log(`Unsupported operator ${p}`);
              return {};
            }
          }

          stack.push(query);
        }
      }
    } else {
      stack.push(p);
    }
  });

  return query;
};

export default queryBuilder

// const query = queryBuilder(conditions);
// console.log(JSON.stringify(query, null, 2));
