"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Monomial_1 = require("./Monomial");
const Numeric_1 = require("./Numeric");
const mathjs = require("mathjs");
const Literal_1 = require("./Literal");
const Giac_1 = require("./Giac");
const Formatter_1 = require("../util/Formatter");
function factor2TeX(factors) {
    let y = "";
    let sep = "";
    for (let i = 0; i < factors.length; i += 2) {
        let expo = factors[i + 1];
        if (expo.toTeX) {
            expo = expo.toTeX();
        }
        y += sep + factors[i] + "^{" + expo + "} ";
        sep = "\\cdot ";
    }
    return y || "1";
}
function factor2Number(factors) {
    let y = 1;
    for (let i = 0; i < factors.length; i += 2) {
        y *= Math.pow(factors[i], factors[i + 1]);
    }
    return y;
}
function factor2Numeric(num, den) {
    return new Numeric_1.Numeric(factor2Number(num), factor2Number(den));
}
// Monomial coefficent · Root[index]{ Monomial radicand }
class Radical {
    constructor(_radicand, index = 2, _coefficient) {
        this.index = index;
        if (typeof (_radicand) === 'number') {
            this.radicand = Monomial_1.Monomial.fromNumber(_radicand);
        }
        else if (_radicand instanceof Numeric_1.Numeric) {
            this.radicand = Monomial_1.Monomial.fromNumeric(_radicand);
        }
        else {
            this.radicand = _radicand;
        }
        if (typeof (_coefficient) === 'number') {
            this.coefficient = Monomial_1.Monomial.fromNumber(_coefficient);
        }
        else if (_coefficient instanceof Numeric_1.Numeric) {
            this.coefficient = Monomial_1.Monomial.fromNumeric(_coefficient);
        }
        else {
            this.coefficient = _coefficient || Monomial_1.Monomial.fromNumber(1);
        }
    }
    copy() {
        return new Radical(this.radicand.copy(), this.index, this.coefficient.copy());
    }
    opposite() {
        const clone = this.copy();
        clone.coefficient.coef = clone.coefficient.coef.oposite();
        return clone;
    }
    multiply(r) {
        const lcm = mathjs.lcm(r.index, this.index);
        const e1 = lcm / this.index;
        const e2 = lcm / r.index;
        const newCoefficent = this.coefficient.multiply(r.coefficient);
        const rad1 = this.radicand.power(e1);
        const rad2 = r.radicand.power(e2);
        return new Radical(rad1.multiply(rad2), lcm, newCoefficent);
    }
    divide(r) {
        const lcm = mathjs.lcm(r.index, this.index);
        const e1 = lcm / this.index;
        const e2 = lcm / r.index;
        const newCoefficent = this.coefficient.divide(r.coefficient);
        const rad1 = this.radicand.power(e1);
        const rad2 = r.radicand.power(e2);
        return new Radical(rad1.divide(rad2), lcm, newCoefficent);
    }
    root(n) {
        const enterCoefficent = this.coefficient.power(this.index);
        return new Radical(this.radicand.multiply(enterCoefficent), n * this.index);
    }
    power(n) {
        return new Radical(this.radicand.power(n), this.index, this.coefficient.power(n));
    }
    // Enter coefficient
    enterCoefficient() {
        const coeff = this.coefficient.copy();
        const negative = coeff.coef.isNegative();
        coeff.coef.Re["s"] = 1;
        return new Radical(this.radicand.multiply(coeff.power(this.index)), this.index, negative ? -1 : 1);
    }
    // Try to extract factors and simplify powers
    simplify() {
        //Literals that can be taken out of the radical
        const inLiterals = this.radicand.literals.map((e) => e.copy());
        const powers = inLiterals.map((e) => e.exponent);
        const outLiterals = [];
        inLiterals.forEach((literal) => {
            var div = Math.trunc(literal.exponent / this.index);
            var rem = literal.exponent % this.index;
            if (div > 0) {
                outLiterals.push(new Literal_1.Literal(literal.symbol, div));
                literal.exponent = rem;
            }
        });
        // Factorize the coefficients in array form [prime1, expo1, prime2, expo2, ....]
        let numFactors, denFactors;
        try {
            numFactors = JSON.parse(Giac_1.Giac.ifactors(this.radicand.coef.Re['n']));
        }
        catch (Ex) {
            console.log(Ex);
            numFactors = [this.radicand.coef.Re['n'], 1];
        }
        try {
            denFactors = JSON.parse(Giac_1.Giac.ifactors(this.radicand.coef.Re['d']));
        }
        catch (Ex) {
            console.log(Ex);
            denFactors = [this.radicand.coef.Re['d'], 1];
        }
        const outNumFactors = [];
        const outDenFactors = [];
        for (let i = 0; i < numFactors.length; i += 2) {
            const exponent = numFactors[i + 1];
            powers.push(exponent);
            var div = Math.trunc(exponent / this.index);
            var rem = exponent % this.index;
            if (div > 0) {
                outNumFactors.push(numFactors[i]);
                outNumFactors.push(div);
                numFactors[i + 1] = rem;
            }
        }
        for (let i = 0; i < denFactors.length; i += 2) {
            const exponent = denFactors[i + 1];
            powers.push(exponent);
            var div = Math.trunc(exponent / this.index);
            var rem = exponent % this.index;
            if (div > 0) {
                outDenFactors.push(denFactors[i]);
                outDenFactors.push(div);
                denFactors[i + 1] = rem;
            }
        }
        // Check the gcd of all exponents including coefs and literals
        let index = this.index;
        powers.push(index);
        const gcd = parseInt(Giac_1.Giac.gcd(powers));
        if (gcd > 1) {
            inLiterals.forEach((literal) => literal.exponent /= gcd);
            for (let i = 0; i < numFactors.length; i += 2) {
                numFactors[i + 1] /= gcd;
            }
            for (let i = 0; i < denFactors.length; i += 2) {
                denFactors[i + 1] /= gcd;
            }
            index /= gcd;
        }
        // Transform factorizations back into numerics
        const numericOut = factor2Numeric(outNumFactors, outDenFactors);
        const numericIn = factor2Numeric(numFactors, denFactors);
        // build simplified radical
        const radicand = new Monomial_1.Monomial(numericIn, inLiterals);
        const coefficient = new Monomial_1.Monomial(numericOut, outLiterals);
        return new Radical(radicand, index, coefficient.multiply(this.coefficient));
    }
    isRadical() {
        const simplified = this.simplify();
        return simplified.index > 1;
    }
    toTeX(opts) {
        let str;
        opts = Object.assign({ coef: true }, opts);
        if (this.index > 2) {
            if (opts.coef) {
                str = Formatter_1.Formatter.numericXstringTeX(false, this.coefficient, " \\sqrt[" + this.index + "]{" + this.radicand.toTeX().trim() + "}");
            }
            else {
                str = " \\sqrt[" + this.index + "]{" + this.radicand.toTeX().trim() + "}";
            }
        }
        else if (this.index === 2) {
            if (opts.coef) {
                str = Formatter_1.Formatter.numericXstringTeX(false, this.coefficient, " \\sqrt{" + this.radicand.toTeX().trim() + "}");
            }
            else {
                str = " \\sqrt{" + this.radicand.toTeX().trim() + "}";
            }
        }
        else if (this.index === 1) {
            if (opts.coef) {
                str = this.coefficient.multiply(this.radicand).toTeX().trim();
            }
            else {
                str = this.radicand.toTeX().trim();
            }
        }
        return str;
    }
    toString(opts) {
        let str;
        opts = Object.assign({ coef: true }, opts);
        if (this.index > 2) {
            if (opts.coef) {
                str = Formatter_1.Formatter.numericXstring(this.coefficient, "root(" + this.index + ", " + this.radicand.toString().trim() + ")");
            }
            else {
                str = "root(" + this.index + ", " + this.radicand.toString().trim() + ")";
            }
        }
        else if (this.index === 2) {
            if (opts.coef) {
                str = Formatter_1.Formatter.numericXstring(this.coefficient, "sqrt(" + this.radicand.toString().trim() + ")");
            }
            else {
                str = "sqrt(" + this.radicand.toString() + ")";
            }
        }
        else if (this.index === 1) {
            if (opts.coef) {
                str = this.coefficient.multiply(this.radicand).toString().trim();
            }
            else {
                str = this.radicand.toString();
            }
        }
        return str;
    }
    /**
     * Displays the radical in power form
     */
    toPowerTeX() {
        let str = "";
        let numFactors, denFactors;
        try {
            numFactors = JSON.parse(Giac_1.Giac.ifactors(this.radicand.coef.Re['n']));
        }
        catch (Ex) {
            console.log(Ex);
            numFactors = [this.radicand.coef.Re['n'], 1];
        }
        try {
            denFactors = JSON.parse(Giac_1.Giac.ifactors(this.radicand.coef.Re['d']));
        }
        catch (Ex) {
            console.log(Ex);
            denFactors = [this.radicand.coef.Re['d'], 1];
        }
        // Add to num or den factors those from the literal part depending on sign
        this.radicand.literals.forEach((literal) => {
            if (literal.exponent > 0) {
                numFactors.push(literal.symbol, literal.exponent);
            }
            else if (literal.exponent < 0) {
                denFactors.push(literal.symbol, Math.abs(literal.exponent));
            }
        });
        // Map all factors exponents from i ==> i/index fraction in simplified form
        for (let i = 0; i < numFactors.length; i += 2) {
            numFactors[i + 1] = new Numeric_1.Numeric(numFactors[i + 1], this.index);
        }
        for (let i = 0; i < denFactors.length; i += 2) {
            denFactors[i + 1] = new Numeric_1.Numeric(denFactors[i + 1], this.index);
        }
        const num = factor2TeX(numFactors).trim();
        const den = factor2TeX(denFactors).trim();
        if (den === '1') {
            str = num;
        }
        else {
            str = "\\frac{" + num + "}{" + den + "}";
        }
        str = Formatter_1.Formatter.numericXstringTeX(true, this.coefficient, str);
        return str;
    }
}
exports.Radical = Radical;
//# sourceMappingURL=Radical.js.map