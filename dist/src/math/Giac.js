"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Polynomial_1 = require("./Polynomial");
const Numeric_1 = require("./Numeric");
const AlgebraicFraction_1 = require("./AlgebraicFraction");
const giac = require('bindings')('giac');
/**
 * Wrapper around giac
 */
class Giac {
    static evaluate(str) {
        return giac.evaluate(str);
    }
    static coeffs(polynomial, bar = 'x') {
        console.log("Trying to parse polynomial", polynomial, bar);
        const str = Giac.evaluate('coeffs(' + polynomial + ', ' + bar + ')');
        console.log("Els coefs del polynomial are ", str);
        const list = str.slice(str.indexOf('[') + 1, str.length - 1).split(",");
        console.log("List is ", list);
        //console.log("Trying to numeric parse ", list);
        return list.filter((e) => e !== 'undef').map((e) => Numeric_1.Numeric.parse(e));
    }
    static parsePolynomial(str, bar = 'x') {
        const coeffs = Giac.coeffs(str, bar);
        return new Polynomial_1.Polynomial(coeffs);
    }
    static parseAlgebraicFraction(str, bar = 'x') {
        const numer = giac.evaluate('numer(' + str + ')');
        const denom = giac.evaluate('denom(' + str + ')');
        console.log('el numerador i denominador son ', numer, denom);
        return new AlgebraicFraction_1.AlgebraicFraction(Giac.parsePolynomial(numer), Giac.parsePolynomial(denom));
    }
    /**
     * Simplify some object and tries to cast it into the clazz type
     * if specified otherwise returns plain text
     */
    static simplify(expr, clazz) {
        const simp = giac.evaluate('simplify(' + expr.toString() + ')');
        if (clazz === Polynomial_1.Polynomial) {
            return Giac.parsePolynomial(simp);
        }
        else if (clazz === AlgebraicFraction_1.AlgebraicFraction) {
            return Giac.parseAlgebraicFraction(simp);
        }
        else {
            return simp;
        }
    }
    static factor(expr, latex) {
        let str = 'factor(' + expr.toString() + ')';
        if (latex) {
            str = 'latex(' + str + ')';
        }
        return giac.evaluate(latex);
    }
    static ifactors(expr) {
        let str = 'ifactors(' + expr.toString() + ')';
        return giac.evaluate(str);
    }
    static lcm(...args) {
        return giac.evaluate('lcm(' + args.map(e => e.toString()).join(",") + ')');
    }
    static gcd(...args) {
        return giac.evaluate('gcd(' + args.map(e => e.toString()).join(",") + ')');
    }
}
exports.Giac = Giac;
//# sourceMappingURL=Giac.js.map