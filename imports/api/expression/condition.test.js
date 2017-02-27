/**
 * Created by vinhcq on 2/27/17.
 */

var Condition = require('./condition');

// test
var expr = [
    "Code",
    "contains",
    "abb"
];

console.log(Condition.buildExpr(expr));
var str = Condition.buildExpr(expr);

console.log(Array.isArray(expr));
var parsedExpr = Condition.parseExpr(str);
console.log(parsedExpr);
console.log(Array.isArray(parsedExpr));

var condition = {
    "operator": "and",
    "expressions": [
        [
            "email",
            "contains",
            "chris"
        ],
        [
            "code",
            "contains",
            "sss"
        ],
        {
            "operator": "or",
            "expressions": [
                [
                    "Country",
                    "is",
                    "vn"
                ],
                [
                    "Country",
                    "is",
                    "la"
                ]
            ]
        }
    ]
};
console.log(Condition.getQuery(condition));