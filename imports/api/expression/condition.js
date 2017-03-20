/**
 * Created by vinhcq on 2/27/17.
 */

const regex = ' ';

const getQuery = function (condition) {
  let
    tmp = [], i;

  if (condition.expressions.length == 1) {
    return buildExpr(condition.expressions[0])
  } else {
    for (i = 0; i < condition.expressions.length; i++) {
      if (Array.isArray(condition.expressions[i])) {
        tmp.push(buildExpr(condition.expressions[i]))
      } else {
        tmp.push(getQuery(condition.expressions[i]))
      }
    }

    return '(' + tmp.join(' ' + condition.operator + ' ') + ')'
  }
};

const buildExpr = function (exprs) {
  if (Array.isArray(exprs) && exprs.length > 2)
  // return `(${args[0]} ${args[1]} "${args[2]}")`;
    return exprs.join(regex);
  else {
    // console.log("invalid args:" + exprs);
    throw new Error("invalid args");
  }
};

const buildQuery = function (condition) {
  let tmp = [], i;
  // console.log( condition);
  if (condition.rules) {
    if (condition.rules.length == 1) {
      return toQuery(condition.rules[0])
    } else {
      for (i = 0; i < condition.rules.length; i++) {
        if (condition.rules[i].combinator == undefined) {
          tmp.push(toQuery(condition.rules[i]));
        } else {
          tmp.push(buildQuery(condition.rules[i]));
        }
      }
      return '(' + tmp.join(' ' + condition.combinator + ' ') + ')'
    }
  }
};

const toQuery = function (rule) {
  return `(${rule.field} ${rule.operator} "${rule.value}")`;
};

const parseExpr = function (str) {
  let arr = str.split(regex);
  if (arr.length > 2) return arr;
  else {
    // console.log("invalid args:" + str);
    throw new Error("invalid args");
  }
};

module.exports = {
  buildExpr: buildExpr,
  getQuery: getQuery,
  parseExpr: parseExpr,
  buildQuery: buildQuery
};
