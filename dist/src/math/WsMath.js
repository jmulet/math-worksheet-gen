"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numeric_1 = require("./Numeric");
const Monomial_1 = require("./Monomial");
function typed(args, rules) {
    const types = Array.from(args).map(a => a.constructor ? a.constructor.name : typeof (a)).join(", ");
    const fun = rules[types];
    if (fun) {
        return fun(args);
    }
    else {
        throw "Not found typed rule for " + types;
    }
}
exports.typed = typed;
class WsMath {
    static add(a, b) {
        typed(arguments, {
            "Numeric, Numeric": function (x, y) {
                return x.add(y);
            }
        });
    }
    static substract(a, b) {
        typed(arguments, {
            "Numeric, Numeric": function (x, y) {
                return x.substract(y);
            }
        });
    }
    static multiply(a, b) {
        typed(arguments, {
            "Numeric, Numeric": function (x, y) {
                return x.multiply(y);
            },
            "Numeric, Monomial": function (x, y) {
                return new Monomial_1.Monomial(y.coef.multiply(x), y.literals);
            },
            "Monomial, Monomial": function (x, y) {
                return x.multiply(y);
            }
        });
    }
    static divide(a, b) {
        typed(arguments, {
            "Numeric, Numeric": function (x, y) {
                return x.divide(y);
            },
            "Monomial, Numeric": function (x, y) {
                return new Monomial_1.Monomial(x.coef.divide(y), x.literals);
            },
            "Monomial, Monomial": function (x, y) {
                return x.divide(y);
            }
        });
    }
    static pow(a, n) {
        typed(arguments, {
            "Numeric, number": function (x, y) {
                return x.power(Numeric_1.Numeric.fromNumber(y));
            },
            "Numeric, Numeric": function (x, y) {
                return x.power(y);
            }
        });
    }
    static root(a, n) {
    }
}
exports.WsMath = WsMath;
//# sourceMappingURL=WsMath.js.map