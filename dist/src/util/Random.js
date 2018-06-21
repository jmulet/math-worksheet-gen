"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ran = require("random-seed");
const AlgebraicFraction_1 = require("../math/AlgebraicFraction");
const Conics_1 = require("../math/Conics");
const ElementalFunction_1 = require("../math/ElementalFunction");
const Line_1 = require("../math/Line");
const Literal_1 = require("../math/Literal");
const Monomial_1 = require("../math/Monomial");
const Numeric_1 = require("../math/Numeric");
const Point_1 = require("../math/Point");
const PolyMonomial_1 = require("../math/PolyMonomial");
const Polynomial_1 = require("../math/Polynomial");
const Radical_1 = require("../math/Radical");
const Vector_1 = require("../math/Vector");
/**
 *
 *  Wrapper around RadomSeed
 *
 */
exports.VECTOR_NAMES = ['u', 'v', 'w', 'a', 'b', 'c'];
exports.BAR_NAMES = ['x', 'y', 'z', 't', 'a', 'b', 'c', 'n', 'm'];
class Random {
    constructor(seed) {
        this.seed = seed;
        if (!seed) {
            this.seed = (new Date().getTime()).toString(36);
        }
        this.seed = this.seed.toLowerCase();
        this.rnd = Ran.create(this.seed);
    }
    decimal(a, b, decimals = 2) {
        if (decimals < 0) {
            decimals = 2;
        }
        const pow = Math.pow(10, decimals);
        return Math.round(this.rnd.floatBetween(a, b) * pow) / pow;
    }
    intList(length, range, rangeMax) {
        const array = [];
        if (!rangeMax) {
            rangeMax = range;
            range = -range;
        }
        for (let i = 0; i < length; i++) {
            let random;
            if (i === 0) {
                // First item cannot be zero
                random = this.intBetweenNotZero(range, rangeMax);
            }
            else {
                random = this.rnd.intBetween(range, rangeMax);
            }
            array.push(random);
        }
        return array;
    }
    numericList(length, range, domain = 'Z') {
        const array = [];
        for (let i = 0; i < length; i++) {
            let random;
            if (i === 0) {
                // First item cannot be zero
                random = this.numericBetweenNotZero(-range, range, domain);
            }
            else {
                random = this.numericBetween(-range, range, domain);
            }
            array.push(random);
        }
        return array;
    }
    intBetween(min, max, condition) {
        let val = this.rnd.intBetween(min, max);
        if (condition) {
            while (!condition(val)) {
                val = this.rnd.intBetween(min, max);
            }
        }
        return val;
    }
    numericBetween(min, max, domain = 'Z') {
        let random = this.rnd.intBetween(min, max);
        if (domain === 'Q') {
            let random2 = this.intBetween(1, max);
            return Numeric_1.Numeric.fromFraction(random, random2);
        }
        else if (domain === 'C') {
            let random2 = this.intBetween(1, max);
            return new Numeric_1.Numeric(random, 1, random2, 1);
        }
        else {
            return Numeric_1.Numeric.fromNumber(random);
        }
    }
    intBetweenNotZero(min, max) {
        let random = this.intBetween(min, max);
        while (random === 0) {
            random = this.intBetween(min, max);
        }
        return random;
    }
    numericBetweenNotZero(min, max, domain = 'Z') {
        let random = this.numericBetween(min, max, domain);
        while (random.isZero()) {
            random = this.numericBetween(min, max, domain);
        }
        return random;
    }
    fractionBetween(min, max) {
        let den = this.rnd.intBetween(1, max);
        let num = this.rnd.intBetween(0, max);
        while (num > den) {
            num = this.rnd.intBetween(1, max);
        }
        const numerator = min * den + (max - min) * num;
        return Numeric_1.Numeric.fromFraction(numerator, den);
    }
    fractionBetweenNotZero(min, max) {
        let random = this.fractionBetween(min, max);
        while (random.isZero()) {
            random = this.fractionBetween(min, max);
        }
        return random;
    }
    complexBetween(min, max) {
        let re = this.rnd.intBetween(min, max);
        let im = this.rnd.intBetween(min, max);
        return new Numeric_1.Numeric(re, 1, im, 1);
    }
    pickOne(list) {
        return list[this.rnd.intBetween(0, list.length - 1)];
    }
    shuffle(list) {
        const copy = list.slice();
        return copy.sort(() => this.rnd.random() - 0.5);
    }
    pickMany(list, n) {
        const shuffled = this.shuffle(list);
        if (n <= shuffled.length) {
            return shuffled.slice(0, n);
        }
        else {
            return shuffled;
        }
    }
    monomial(options) {
        const opts = Object.assign({ minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', maxVars: 1, bar: '' }, options);
        const degree = this.intBetween(opts.minDegree, opts.maxDegree);
        const literals = [];
        if (opts.maxVars > 1) {
            const nvars = this.intBetween(1, opts.maxVars);
            const symbols = this.pickMany(exports.BAR_NAMES, nvars);
            symbols.forEach((symb) => {
                literals.push(new Literal_1.Literal(symb, this.intBetween(opts.minDegree, opts.maxDegree)));
            });
        }
        else {
            const bar = opts.bar || this.pickOne(exports.BAR_NAMES);
            literals.push(new Literal_1.Literal(bar, this.intBetween(opts.minDegree, opts.maxDegree)));
        }
        return new Monomial_1.Monomial(this.numericBetweenNotZero(-opts.range, opts.range, opts.domain), literals);
    }
    radical(options) {
        const opts = Object.assign({ minIndex: 2, maxIndex: 10, minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', maxVars: 1, bar: '', algebraic: false, useCoeff: true }, options);
        const index = this.intBetween(opts.minIndex, opts.maxIndex);
        let divisorsOfIndex = Numeric_1.Numeric.listDivisors(index);
        divisorsOfIndex.splice(0, 1);
        let mono1, mono2;
        if (opts.algebraic) {
            mono1 = this.monomial(opts);
            mono1.coef.Re["s"] = 1; // Make positive
            if (opts.useCoeff) {
                mono2 = this.monomial(opts);
            }
            else {
                mono2 = Monomial_1.Monomial.fromNumber(1);
            }
            if (opts.simplificable) {
                const oneDivisor = this.pickOne(divisorsOfIndex);
                mono1.coef.power(oneDivisor);
                mono1.literals.forEach((literal) => {
                    const times = this.intBetween(1, 3);
                    literal.exponent *= oneDivisor;
                    literal.exponent += times * index;
                });
            }
        }
        else {
            if (opts.useCoeff) {
                mono2 = this.numericBetweenNotZero(-opts.range, opts.range, opts.domain);
            }
            else {
                mono2 = Numeric_1.Numeric.fromNumber(1);
            }
            if (opts.simplificable) {
                let oneDivisor = this.pickOne(divisorsOfIndex);
                if (oneDivisor === 1) {
                    oneDivisor = index;
                }
                const e1 = this.intBetween(0, 3);
                const e2 = this.intBetween(0, 2);
                const e3 = this.intBetween(0, 1);
                const r1 = this.intBetween(0, 2);
                const r2 = this.intBetween(0, 2);
                const r3 = this.intBetween(0, 2);
                const number = Math.pow(2, e1 * oneDivisor + r1) * Math.pow(3, e2 * oneDivisor + r2) * Math.pow(5, e3 * oneDivisor + r3);
                mono1 = Numeric_1.Numeric.fromNumber(number);
            }
            else {
                mono1 = this.numericBetween(2, opts.range, opts.domain);
            }
        }
        return new Radical_1.Radical(mono1, index, mono2);
    }
    polynomial(options) {
        const opts = Object.assign({ minDegree: 1, maxDegree: 5, range: 10, domain: 'Z', algIdentities: false, factorizable: false }, options);
        const degree = this.intBetween(opts.minDegree, opts.maxDegree);
        if (opts.factorizable) {
            // Roots must be calculable. Build from roots; 
            let roots;
            if (opts.domain === 'Z') {
                // Assume fully factorizable degree n --> n roots
                roots = this.numericList(degree, opts.range, 'Z');
            }
            else {
                // Assume fully factorizable degree n --> n roots. At most two roots can be rational
                roots = this.numericList(degree, opts.range, 'Z');
                roots[0] = this.fractionBetween(-opts.range, opts.range);
                if (this.intBetween(0, 1) === 1) {
                    roots[1] = this.fractionBetween(-opts.range, opts.range);
                }
            }
            if (opts.domain === 'C') {
                // Allow complex roots; but real coefficients
                roots = this.shuffle(roots);
                const complex = this.complexBetween(-opts.range, opts.range);
                roots[0] = complex;
                roots[1] = complex.conjugate();
            }
            return Polynomial_1.Polynomial.fromRoots(roots);
        }
        else {
            // No matter the roots, so coefficients are random
            const coefs = this.numericList(degree + 1, opts.range, opts.domain);
            return new Polynomial_1.Polynomial(coefs);
        }
    }
    binomial(options) {
        const opts = Object.assign({ univariant: true, range: 10, maxDegree: 4, domain: 'Z' }, options);
        const coefs = this.numericList(2, opts.range, opts.domain);
        if (opts.univariant) {
            return new Polynomial_1.Polynomial(coefs);
        }
        else {
            const letters = this.pickMany(exports.BAR_NAMES, 2);
            const expo1 = this.intBetween(1, opts.maxDegree);
            const expo2 = this.intBetween(0, opts.maxDegree);
            const mono1 = new Monomial_1.Monomial(coefs[0], [new Literal_1.Literal(letters[0], expo1)]);
            const mono2 = new Monomial_1.Monomial(coefs[1], [new Literal_1.Literal(letters[1], expo2)]);
            return new PolyMonomial_1.PolyMonomial([mono1, mono2]);
        }
    }
    algebraicFraction(options) {
        const opts = Object.assign({ range: 10, maxDegree: 4, domain: 'Z' }, options);
        let numerator, denominator;
        if (opts.simplificable) {
            const factor = this.polynomial({ range: 4, maxDegree: this.intBetween(1, 2) });
            opts.maxDegree -= factor.degree();
            opts.range = 5;
            if (opts.maxDegree < 1) {
                opts.maxDegree = 1;
            }
            numerator = this.polynomial(opts).multiply(factor);
            denominator = this.polynomial(opts).multiply(factor);
        }
        else {
            numerator = this.polynomial(opts);
            denominator = this.polynomial(opts);
        }
        return new AlgebraicFraction_1.AlgebraicFraction(numerator, denominator);
    }
    point(dim = 2, options) {
        const opts = Object.assign({ range: 10, domain: 'Z' }, options);
        const components = this.numericList(dim, opts.range, opts.domain);
        return new Point_1.Point(components);
    }
    vector(dim, options) {
        dim = dim || 2;
        // Generates a random vector
        const opts = Object.assign({ symbol: 'v', domain: 'Z', range: 10, allowZero: false }, options);
        const symbol = opts.symbol || this.pickOne(exports.VECTOR_NAMES);
        let coefs;
        if (opts.domain === 'Z') {
            coefs = this.intList(dim, opts.range);
        }
        else {
            coefs = this.numericList(dim, opts.range, opts.domain);
        }
        let v = new Vector_1.Vector(coefs, symbol);
        if (!opts.allowZero) {
            while (v.isZero()) {
                v = this.vector(dim, options);
            }
        }
        return v;
    }
    line(dim = 2, options) {
        options.allowZero = false;
        return new Line_1.Line(this.point(dim, options), this.vector(dim, options));
    }
    circumference(options) {
        return new Conics_1.Circumference(this.point(), this.intBetween(1, options.range | 10));
    }
    elipse(options) {
        return new Conics_1.Elipse(this.point(), this.intBetween(1, options.range | 10), this.intBetween(1, options.range | 10));
    }
    hiperbola(options) {
        return new Conics_1.Hiperbola(this.point(), this.intBetween(1, options.range | 10), this.intBetween(1, options.range | 10));
    }
    parabola(options) {
        return new Conics_1.Parabola(this.point(), this.numericBetween(1, 5), this.intBetween(0, 1));
    }
    conic(options) {
        switch (this.intBetween(0, 3)) {
            case 0:
                return this.circumference(options);
            case 1:
                return this.elipse(options);
            case 2:
                return this.hiperbola(options);
            case 3:
                return this.parabola(options);
        }
    }
    elementalFunction(mylist, options) {
        const opts = Object.assign({ range: 10, domain: 'Z' }, options);
        let list;
        if (Array.isArray(mylist)) {
            list = [...mylist];
        }
        else if (typeof (mylist) === "number") {
            list = [mylist];
        }
        else {
            list = Object.keys(ElementalFunction_1.ElementalFunction.types).map((key) => ElementalFunction_1.ElementalFunction.types[key]);
        }
        ;
        var type = this.pickOne(list);
        switch (type) {
            case ElementalFunction_1.ElementalFunction.types.Lineal:
                const m = this.numericBetween(-opts.range, opts.range, opts.domain);
                const n = this.numericBetween(-opts.range, opts.range, opts.domain);
                return new ElementalFunction_1.LinealFunction(m, n);
            case ElementalFunction_1.ElementalFunction.types.Quadratic:
                let a = this.numericBetweenNotZero(-1, 1);
                if (opts.complexity > 0) {
                    a = this.numericBetweenNotZero(-2, 2);
                }
                let b;
                if (opts.complexity === 0) {
                    b = this.numericBetween(-5, 5, 'Z').multiply(Numeric_1.Numeric.fromNumber(2));
                }
                else {
                    b = this.numericBetween(-opts.range, opts.range, opts.domain);
                }
                const c = this.numericBetween(-opts.range, opts.range, opts.domain);
                return new ElementalFunction_1.QuadraticFunction(a, b, c);
            case ElementalFunction_1.ElementalFunction.types.Radical:
                const a2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                const b2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                return new ElementalFunction_1.RadicalFunction(a2, b2);
            case ElementalFunction_1.ElementalFunction.types.Hyperbole:
                const m2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                const n2 = this.numericBetween(-opts.range, opts.range, opts.domain);
                const p = this.numericBetween(-opts.range, opts.range, opts.domain);
                return new ElementalFunction_1.HyperboleFuntion(m2, n2, p);
            case ElementalFunction_1.ElementalFunction.types.Exponential:
                const base = this.numericBetween(2, opts.range);
                return new ElementalFunction_1.ExponentialFunction(base);
            case ElementalFunction_1.ElementalFunction.types.Logarithm:
                const base2 = this.numericBetween(2, opts.range);
                return new ElementalFunction_1.LogarithmFunction(base2);
            default:
                const type = this.pickOne(['sin', 'cos', 'tan']);
                const amp = this.numericBetweenNotZero(-opts.range, opts.range, opts.domain);
                const w = this.numericBetween(1, 4);
                return new ElementalFunction_1.TrigonometricFunction(type, amp, w);
        }
    }
    /**
     * Generates a random funcion with complexity n
     * from bloc funtions in funcs list and operations in ops
     * which can be + - * / and comp
     */
    rfunction(n, ops, funcs) {
        var op = this.pickOne(ops);
        var f1 = funcs.random();
        var f2 = funcs.random();
        var str = "";
        if (op === '+') {
            str = f1.toString('x') + " " + op + " " + f2.toString('x');
        }
        else if (op === '-') {
            str = f1.toString('x') + " " + op + " (" + f2.toString('x') + ")";
        }
        else if (op === '*' || op === '/') {
            str = "(" + f1.toString('x') + ") " + op + " (" + f2.toString('x') + ")";
        }
        else if (op === 'comp') {
            str = f1.toString(f2.toString('x'));
        }
        return str;
    }
}
exports.Random = Random;
//# sourceMappingURL=Random.js.map