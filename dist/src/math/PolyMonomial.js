"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
const Monomial_1 = require("./Monomial");
const Literal_1 = require("./Literal");
class PolyMonomial extends Expression_1.Expression {
    constructor(monomials) {
        super();
        this.monomials = monomials;
        this.reduceMonomials();
    }
    static fromCoefs(coefficients, symbol) {
        const n = coefficients.length - 1;
        const monomials = coefficients.map((coef, i) => new Monomial_1.Monomial(coef, [new Literal_1.Literal(symbol, n - i)]));
        return new PolyMonomial(monomials);
    }
    static fromNumber(num) {
        return new PolyMonomial([Monomial_1.Monomial.fromNumber(num)]);
    }
    static fromNumeric(num) {
        return new PolyMonomial([Monomial_1.Monomial.fromNumeric(num)]);
    }
    static fromMonomial(mono) {
        return new PolyMonomial([mono]);
    }
    static add(m1, m2) {
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        }
        else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        }
        else {
            x2 = [m2];
        }
        const monomials = [...x1, ...x2];
        return new PolyMonomial(monomials);
    }
    static substract(m1, m2) {
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        }
        else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.oposite().monomials;
        }
        else {
            x2 = [m2.oposite()];
        }
        const monomials = [...x1, ...x2];
        return new PolyMonomial(monomials);
    }
    static multiply(m1, m2) {
        const products = [];
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        }
        else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        }
        else {
            x2 = [m2];
        }
        x1.forEach((term1) => {
            x2.forEach((term2) => {
                products.push(term1.multiply(term2));
            });
        });
        return new PolyMonomial(products);
    }
    static divide(m1, m2) {
        const products = [];
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        }
        else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        }
        else {
            x2 = [m2];
        }
        x1.forEach((term1) => {
            x2.forEach((term2) => {
                products.push(term1.multiply(term2));
            });
        });
        return new PolyMonomial(products);
    }
    static One() {
        return new PolyMonomial([Monomial_1.Monomial.One()]);
    }
    static power(m1, n) {
        let x1;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        }
        else {
            x1 = [m1];
        }
        if (n === 0) {
            return PolyMonomial.One();
        }
        else if (n === 1) {
            return new PolyMonomial(x1);
        }
        const p = new PolyMonomial(x1);
        let pow = p;
        for (var i = 0; i < n - 1; i++) {
            pow = PolyMonomial.multiply(pow, p);
        }
        return pow;
    }
    /**
     * Monomials having the same literal part are merged into one
     * by adding its coefficients.
     */
    reduceMonomials() {
        let monomialsFound = {};
        const newMonomials = [];
        this.monomials.forEach((mono, pos) => {
            // First instance
            const key = mono.literalsToString();
            if (Object.keys(monomialsFound).indexOf(key) < 0) {
                const obj = mono.copy();
                monomialsFound[key] = obj;
                newMonomials.push(obj);
            }
            else {
                monomialsFound[key].coef = monomialsFound[key].coef.add(mono.coef);
            }
        });
        // get rid of 0 coefficients
        this.monomials = newMonomials.filter((e) => !e.coef.isZero());
        // sort by degree
        this.monomials = this.monomials.sort((x, y) => {
            return y.degree() - x.degree();
        });
        monomialsFound = null;
    }
    oposite() {
        const list = this.monomials.map(e => e.oposite());
        return new PolyMonomial(list);
    }
    degree() {
        const degrees = this.monomials.map(e => e.degree());
        return Math.max(...degrees);
    }
    copy() {
        const list = this.monomials.map(e => e.copy());
        return new PolyMonomial(list);
    }
    toString(bar) {
        return this.monomials.map((e, i) => {
            let str = "";
            if (!e.coef.isNegative() && i > 0) {
                str += "+";
            }
            str += e.toString();
            return str;
        }).join(" ");
    }
    toTeX(bar) {
        const str = this.monomials.map((e, i) => {
            let str = "";
            if (!e.coef.isNegative() && i > 0) {
                str += "+";
            }
            str += e.toTeX();
            return str;
        }).join(" ").trim();
        if (!str) {
            return "0";
        }
        return str;
    }
}
exports.PolyMonomial = PolyMonomial;
//# sourceMappingURL=PolyMonomial.js.map