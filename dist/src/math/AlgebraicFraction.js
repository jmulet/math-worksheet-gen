"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Polynomial_1 = require("./Polynomial");
const Numeric_1 = require("./Numeric");
const Giac_1 = require("./Giac");
/**
 * We define an algebraic fraction as the quotient of two Polynomials
 */
class AlgebraicFraction {
    /**
     * Converts the string into a Fraction object by
     * splitting the str by the  /  symbol and parsing
     * each polynomial indepently
     * @param str string to be parsed
     */
    static parse(str) {
        return Giac_1.Giac.parseAlgebraicFraction(str);
    }
    constructor(polyNum, polyDen) {
        if (Array.isArray(polyNum)) {
            const coefs = polyNum.map((e) => {
                if (e instanceof Numeric_1.Numeric) {
                    return e;
                }
                else if (typeof (e) === 'number') {
                    return Numeric_1.Numeric.fromNumber(e);
                }
            });
            this.polyNum = new Polynomial_1.Polynomial(coefs);
        }
        else {
            this.polyNum = polyNum;
        }
        if (Array.isArray(polyDen)) {
            const coefs = polyDen.map((e) => {
                if (e instanceof Numeric_1.Numeric) {
                    return e;
                }
                else if (typeof (e) === 'number') {
                    return Numeric_1.Numeric.fromNumber(e);
                }
            });
            this.polyDen = new Polynomial_1.Polynomial(coefs);
        }
        else {
            this.polyDen = polyDen;
        }
    }
    simplified() {
        const res = Giac_1.Giac.simplify(this.toString(), AlgebraicFraction);
        console.log(res.toString());
        return res;
    }
    isPolynomial() {
        const fraction = this.simplified();
        return fraction.polyDen.degree() === 0;
    }
    isFraction() {
        return !this.isPolynomial;
    }
    toString(bar = 'x') {
        const num = this.polyNum.toString(bar);
        const den = this.polyDen.toString(bar);
        if (num === '0') {
            return num;
        }
        if (den === '1') {
            return num;
        }
        return "(" + num + ")/(" + den + ")";
    }
    toTeX(bar = 'x') {
        const num = this.polyNum.toTeX(bar);
        const den = this.polyDen.toTeX(bar);
        if (num === '0') {
            return num;
        }
        if (den === '1') {
            return num;
        }
        return "\\dfrac{" + num + "}{" + den + "}";
    }
}
exports.AlgebraicFraction = AlgebraicFraction;
//# sourceMappingURL=AlgebraicFraction.js.map