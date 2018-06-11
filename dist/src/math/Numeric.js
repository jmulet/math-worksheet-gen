"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math = require("mathjs");
const Power_1 = require("./Power");
const Giac_1 = require("./Giac");
/**
 *  Numeric is a wrapper around number and fraction
 *  it can hold any rational number in the complex plane
 */
class Numeric {
    static factorize(n, opts) {
        if (!opts || !opts.factorizeAbove) {
            return n + '';
        }
        if (Math.abs(n) < opts.factorizeAbove) {
            return n + '';
        }
        else {
            let factors;
            try {
                factors = JSON.parse(Giac_1.Giac.ifactors(n));
            }
            catch (Ex) {
                console.log("Unable to factor ", n);
                console.log(Ex);
                return n + '';
            }
            if (!factors.length) {
                return n + '';
            }
            let str = "";
            let sep = "";
            for (let i = 0; i < factors.length; i += 2) {
                const expo = factors[i + 1];
                str += sep + factors[i] + (expo > 1 ? ('^{' + expo + '}') : '');
                sep = " \\cdot ";
            }
            return str;
        }
    }
    static listDivisors(n) {
        if (n < 1)
            throw "Argument error";
        var small = [];
        var large = [];
        var end = Math.floor(Math.sqrt(n));
        for (var i = 1; i <= end; i++) {
            if (n % i == 0) {
                small.push(i);
                if (i * i != n)
                    large.push(n / i);
            }
        }
        large.reverse();
        return small.concat(large);
    }
    static max(a, b) {
        if (a["n"] / a["d"] > b["n"] / b["d"]) {
            return a;
        }
        else {
            return b;
        }
    }
    static fromNumber(num) {
        if (Math.round(num) === num) {
            return new Numeric(num, 1);
        }
        else {
            return new Numeric(num);
        }
    }
    static fromFraction(a, b) {
        return new Numeric(a, b);
    }
    static parse(str) {
        if (str.indexOf('i') >= 0) {
            throw 'Numeric:: parse ' + str + ' with complex numbers not implemented yet';
        }
        else {
            const f = math.fraction(str);
            return new Numeric(f["n"] * f["n"], f["d"]);
        }
    }
    constructor(reNum, reDen, imNum, imDen) {
        if (reDen) {
            this.Re = math.fraction(reNum, reDen);
        }
        else {
            this.Re = math.fraction(reNum | 0);
        }
        if (imDen) {
            this.Im = math.fraction(imNum | 0, imDen);
        }
        else {
            this.Im = math.fraction(imNum | 0);
        }
    }
    inverse() {
        if (this.isZero()) {
            throw "Error:: Numeric Divide by zero";
        }
        else if (this.isReal()) {
            return new Numeric(this.Re["d"] * this.Re["s"], this.Re["n"]);
        }
        else {
            const mod2 = this.modulus2();
            const conj = this.conjugate();
            const re = math.divide(conj.Re, mod2.Re);
            const im = math.divide(conj.Im, mod2.Re);
            return new Numeric(re["n"] * re["s"], re["d"], im["n"] * im["s"], im["d"]);
        }
    }
    modulus2() {
        return this.multiply(this.conjugate());
    }
    multiply(b) {
        const p1 = math.multiply(this.Re, b.Re);
        if (this.isReal() && b.isReal()) {
            return new Numeric(p1["n"] * p1["s"], p1["d"]);
        }
        else {
            const p2 = math.multiply(this.Im, b.Im);
            const p3 = math.multiply(this.Re, b.Im);
            const p4 = math.multiply(this.Im, b.Re);
            const pRe = math.subtract(p1, p2);
            const pIm = math.add(p3, p4);
            return new Numeric(pRe["n"] * pRe["s"], pRe["d"], pIm["n"] * pIm["s"], pIm["d"]);
        }
    }
    divide(b) {
        return this.multiply(b.inverse());
    }
    isReal() {
        return this.Im["n"] === 0;
    }
    isImaginary() {
        return this.Re["n"] === 0;
    }
    isComplex() {
        return !this.isReal() && !this.isImaginary();
    }
    realPart() {
        return new Numeric(this.Re["n"] * this.Re["s"], this.Re["d"]);
    }
    imaginaryPart() {
        return new Numeric(this.Im["n"] * this.Im["s"], this.Im["d"]);
    }
    conjugate() {
        return new Numeric(this.Re["n"] * this.Re["s"], this.Re["d"], -this.Im["n"] * this.Im["s"], this.Im["d"]);
    }
    is(n) {
        return this.Re["s"] * this.Re["n"] / this.Re["d"] === n && this.Im["n"] === 0;
    }
    isZero() {
        return this.is(0);
    }
    isOne() {
        return this.is(1);
    }
    isInt() {
        const r1 = this.Re["n"] / this.Re["d"];
        const r2 = this.Im["n"] / this.Im["d"];
        return Math.floor(r1) === r1 && Math.floor(r2) === r2;
    }
    isNegative() {
        return this.Re["s"] < 0;
    }
    oposite() {
        return new Numeric(-this.Re["n"] * this.Re["s"], this.Re["d"], -this.Im["n"] * this.Im["s"], this.Im["d"]);
    }
    add(n) {
        const addRe = math.add(this.Re, n.Re);
        const addIm = math.add(this.Im, n.Im);
        return new Numeric(addRe["n"] * addRe["s"], addRe["d"], addIm["n"] * addIm["s"], addIm["d"]);
    }
    substract(n) {
        const subRe = math.subtract(this.Re, n.Re);
        const subIm = math.subtract(this.Im, n.Im);
        return new Numeric(subRe["n"] * subRe["s"], subRe["d"], subIm["n"] * subIm["s"], subIm["d"]);
    }
    copy() {
        return new Numeric(this.Re["s"] * this.Re["n"], this.Re["d"], this.Im["s"] * this.Im["n"], this.Im["d"]);
    }
    power(n) {
        if (typeof (n) === "number") {
            n = Numeric.fromNumber(n);
        }
        if (!this.isReal()) {
            throw "power of complex not implemented yet";
        }
        let base = this;
        if (n.isNegative()) {
            base = base.inverse();
        }
        if (n.isZero()) {
            return Numeric.fromNumber(1);
        }
        else if (n.isOne()) {
            return base;
        }
        else if (n.isInt()) {
            const intv = n.Re["n"] * n.Re["s"] / n.Re["d"];
            return new Numeric(Math.pow(base.Re["n"] * base.Re["s"], intv), Math.pow(base.Re["d"], intv));
        }
        else {
            // Power of rational exponent --> becomes a radical or its power representation
            return new Power_1.Power(base, n);
        }
    }
    abs() {
        const mod2 = this.modulus2();
        return Math.sqrt(mod2["n"] / mod2["d"]);
    }
    toNumber() {
        return this.Re["s"] * this.Re["n"] / this.Re["d"];
    }
    toTeX(opts) {
        let tex = "";
        if (this.Re["s"] < 0) {
            tex = "-";
        }
        if (this.Re["d"] === 1) {
            tex += Numeric.factorize(this.Re["n"], opts);
        }
        else {
            tex += "\\frac{" + Numeric.factorize(this.Re["n"], opts) + "}{" + Numeric.factorize(this.Re["d"], opts) + "}";
        }
        if (this.Im["n"]) {
            if (this.Im["s"] > 0) {
                tex += " + ";
            }
            else {
                tex += " - ";
            }
            if (this.Im["d"] === 1) {
                tex += Numeric.factorize(this.Im["n"], opts);
            }
            else {
                tex = "\\frac{" + Numeric.factorize(this.Im["n"], opts) + "}{" + Numeric.factorize(this.Im["d"], opts) + "}";
            }
            tex += "\\cdot i";
        }
        return tex;
    }
    toString() {
        let tex = "";
        if (this.Re["s"] < 0) {
            tex = "-";
        }
        if (this.Re["d"] === 1) {
            tex += this.Re["n"];
        }
        else {
            tex += "(" + this.Re["n"] + "/" + this.Re["d"] + ")";
        }
        if (this.Im["n"]) {
            if (this.Im["s"] > 0) {
                tex += " + ";
            }
            else {
                tex += " - ";
            }
            if (this.Im["d"] === 1) {
                tex += this.Im["n"];
            }
            else {
                tex = "(" + this.Im["n"] + "/" + this.Im["d"] + ")";
            }
            tex += "·i";
        }
        return tex;
    }
}
exports.Numeric = Numeric;
//# sourceMappingURL=Numeric.js.map