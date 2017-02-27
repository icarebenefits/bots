/**
 * Created by vinhcq on 2/27/17.
 */

const getQuery = function (condition) {
    var query = '',
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

const regex = ' ';

const buildExpr = function (exprs) {
    if (Array.isArray(exprs) && exprs.length > 2)
    // return `(${args[0]} ${args[1]} "${args[2]}")`;
        return exprs.join(regex);
    else {
        console.log("invalid args:" + exprs);
        throw new Error("invalid args");
    }
};

const parseExpr = function (str) {
    let arr = str.split(regex);
    if (arr.length > 2) return arr;
    else {
        console.log("invalid args:" + str);
        throw new Error("invalid args");
    }
    // return {
    //     "field": arr[0],
    //     "operator": arr[1],
    //     "value": arr[2]
    // }

};

module.exports = {
    buildExpr: buildExpr,
    getQuery: getQuery,
    parseExpr: parseExpr
};
