"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numeric_1 = require("../math/Numeric");
const Monomial_1 = require("../math/Monomial");
class Formatter {
    /**
     * Formats something like 1, x, 0, y, -1, z
     * to produce a string x - z
     * @param args Numeric, string, Numeric, String, ...
     */
    static numericXstringTeX(useCdot, ...args) {
        const n = args.length;
        if (n % 2 !== 0) {
            throw "numericXstring: the number of arguments must be even.";
        }
        let str = [];
        for (let i = 0; i < n; i += 2) {
            let numeric;
            let literal = '';
            if (args[i] instanceof Numeric_1.Numeric) {
                numeric = args[i];
            }
            else if (args[i] instanceof Monomial_1.Monomial) {
                const monomial = args[i];
                numeric = monomial.coef;
                literal = monomial.literals.map((e) => e.toTeX()).join(" \\cdot ") || '';
            }
            let cdot = " ";
            if (useCdot) {
                cdot = " \\cdot ";
            }
            let symbol = args[i + 1];
            if (literal) {
                symbol = literal + (symbol ? (cdot + symbol) : '');
            }
            if (!numeric.isZero()) {
                if (numeric.is(1)) {
                    if (i > 0) {
                        str.push(" + ");
                    }
                    str.push(symbol ? symbol : ' 1 ');
                }
                else if (numeric.is(-1)) {
                    str.push(symbol ? (' -' + symbol) : ' -1 ');
                }
                else {
                    if (!numeric.isNegative() && i > 0) {
                        str.push(" + ");
                    }
                    let nn = numeric.toTeX().trim();
                    if (nn && symbol.trim() !== '1') {
                        nn += cdot + symbol;
                    }
                    str.push(nn);
                }
            }
        }
        return str.join('');
    }
    static numericXstring(...args) {
        const n = args.length;
        if (n % 2 !== 0) {
            throw "numericXstring: the number of arguments must be even.";
        }
        let str = [];
        for (let i = 0; i < n; i += 2) {
            let numeric;
            let literal = '';
            if (args[i] instanceof Numeric_1.Numeric) {
                numeric = args[i];
            }
            else if (args[i] instanceof Monomial_1.Monomial) {
                const monomial = args[i];
                numeric = monomial.coef;
                literal = monomial.literals.map((e) => e.toString()).join("*") || '';
            }
            let symbol = args[i + 1];
            if (literal) {
                symbol = literal + (symbol ? ("*" + symbol) : '');
            }
            if (!numeric.isZero()) {
                if (numeric.is(1)) {
                    if (i > 0) {
                        str.push(" + ");
                    }
                    str.push(symbol ? symbol : ' 1 ');
                }
                else if (numeric.is(-1)) {
                    str.push(symbol ? (' -' + symbol) : ' -1 ');
                }
                else {
                    if (!numeric.isNegative() && i > 0) {
                        str.push(" + ");
                    }
                    str.push(numeric.toString() + "*" + symbol);
                }
            }
        }
        return str.join('');
    }
}
exports.Formatter = Formatter;
//# sourceMappingURL=Formatter.js.map