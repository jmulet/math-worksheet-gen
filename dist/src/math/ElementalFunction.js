"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interval_1 = require("./Interval");
const Numeric_1 = require("./Numeric");
const Point_1 = require("./Point");
const Intervals_1 = require("./Intervals");
const applyProductTeX = function (c, p, bar) {
    var str = "";
    if (!c.isZero()) {
        if (c.isOne()) {
            str = bar;
        }
        else if (c.is(-1)) {
            str = "-" + bar;
        }
        else {
            str = c.toTeX() + p + bar;
        }
    }
    return str;
};
const applyProduct = function (c, p, bar) {
    var str = "";
    if (!c.isZero()) {
        if (c.isOne()) {
            str = bar;
        }
        else if (c.is(-1)) {
            str = "-" + bar;
        }
        else {
            str = c.toString() + p + bar;
        }
    }
    return str;
};
const applyTeX = function (str, v, bar) {
    if (!v.isZero()) {
        if (!v.isNegative()) {
            str += "+";
        }
        str += " " + v.toTeX();
        if (bar) {
            str += bar;
        }
    }
    return str;
};
const apply = function (str, v, bar) {
    if (!v.isZero()) {
        if (!v.isNegative()) {
            str += "+";
        }
        str += " " + v.toString();
        if (bar) {
            str += bar;
        }
    }
    return str;
};
const applyOne = function (str, v) {
    if (v === -1) {
        str += "-";
    }
    else if (v === 1) {
        str += "";
    }
    else {
        str += v;
    }
    return str;
};
var applyOneOp = function (str, v, op) {
    if (v.is(-1)) {
        str += "-";
    }
    else if (v.isOne()) {
        str += "";
    }
    else {
        str += v + op;
    }
    return str;
};
class ElementalFunction {
    static getTypeName(id) {
        var name = "";
        for (var key in ElementalFunction.types) {
            if (ElementalFunction.types[key] == id) {
                name = key;
                break;
            }
        }
        return name;
    }
    static logBase(n, base) {
        return Math.log(n) / Math.log(base);
    }
}
ElementalFunction.types = { "Lineal": 0, "Quadratic": 1, "Radical": 2, "Hyperbole": 3, "Exponential": 4, "Logarithm": 5, "Trigonometric": 6 };
exports.ElementalFunction = ElementalFunction;
class LinealFunction extends ElementalFunction {
    // y = mx+n
    constructor(m, n) {
        super();
        this.m = m || Numeric_1.Numeric.fromNumber(1);
        this.n = n || Numeric_1.Numeric.fromNumber(0);
    }
    eval(x) {
        return this.m.multiply(x).add(this.n).toNumber();
    }
    toTeX(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProductTeX(this.m, "\\,", x);
        return applyTeX(str, this.n);
    }
    toString(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProduct(this.m, "*", x);
        return apply(str, this.n);
    }
    inverse() {
        return [new LinealFunction(this.m.inverse(), this.n.oposite().divide(this.m))];
    }
    getDomain() {
        return Intervals_1.Intervals.realLine();
    }
    getRange() {
        return new Intervals_1.Intervals(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    getType() {
        return ElementalFunction.types.Lineal;
    }
    getExtrema() {
        return [];
    }
}
exports.LinealFunction = LinealFunction;
;
class QuadraticFunction extends ElementalFunction {
    // y = a*x^2 + b*x + c
    constructor(a, b, c) {
        super();
        this.getType = function () {
            return ElementalFunction.types.Quadratic;
        };
        this.eval = function (x) {
            return (this.a * x + this.b) * x + this.c;
        };
        this.toTeX = function (x) {
            x = x || 'x';
            if (x.length > 1) {
                x = "(" + x + ")";
            }
            var str = "" + applyProductTeX(this.a, "\\,", x + "^2");
            str = applyTeX(str, this.b, "\\," + x);
            str = applyTeX(str, this.c);
            return str;
        };
        this.a = a;
        this.b = b;
        this.c = c;
    }
    inverse() {
        return [];
    }
    getDomain() {
        return Intervals_1.Intervals.realLine();
    }
    getRange() {
        const extrema = this.getExtrema();
        const yv = extrema[0].components[1];
        if (this.a.isNegative()) {
            return new Intervals_1.Intervals(Number.NEGATIVE_INFINITY, yv, false, true);
        }
        else {
            return new Intervals_1.Intervals(yv, Number.POSITIVE_INFINITY, true, false);
        }
    }
    toString(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProduct(this.a, "*", x + "^2");
        str = apply(str, this.b, "*" + x);
        str = apply(str, this.c);
        return str;
    }
    getExtrema() {
        const xv = this.b.oposite().divide(this.a.multiply(Numeric_1.Numeric.fromNumber(2)));
        const yv = this.eval(xv);
        return [new Point_1.Point([xv, yv])];
    }
}
exports.QuadraticFunction = QuadraticFunction;
// y = b*sqrt(x+a)
class RadicalFunction extends ElementalFunction {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
    }
    getType() {
        return ElementalFunction.types.Radical;
    }
    eval(x) {
        return this.b.toNumber() * Math.sqrt(x.toNumber() + this.a.toNumber());
    }
    toTeX(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "";
        if (!this.b.isOne()) {
            str += this.b.toTeX() + "\\,";
        }
        str += "\\sqrt{" + x;
        str = applyTeX(str, this.b) + "}";
        return str;
    }
    ;
    toString(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "";
        if (!this.b.isOne()) {
            str += this.b.toString() + "*";
        }
        str += "sqrt(" + x;
        str = apply(str, this.b) + ")";
        return str;
    }
    ;
    inverse() {
        return [new QuadraticFunction(this.b.multiply(this.b).inverse(), Numeric_1.Numeric.fromNumber(0), this.a.oposite())];
    }
    getDomain() {
        return new Intervals_1.Intervals(this.a.oposite(), Number.POSITIVE_INFINITY, true, false);
    }
    ;
    getRange() {
        if (this.b.isNegative()) {
            return new Intervals_1.Intervals(Number.NEGATIVE_INFINITY, 0, false, true);
        }
        else {
            return new Intervals_1.Intervals(0, Number.POSITIVE_INFINITY, true, false);
        }
    }
    getExtrema() {
        return [];
    }
}
exports.RadicalFunction = RadicalFunction;
// y = b / (x+a) + c
class HyperboleFuntion extends ElementalFunction {
    constructor(a, b, c) {
        super();
        this.a = a || 0;
        this.b = b || 1;
        this.c = c || 0;
    }
    getType() {
        return ElementalFunction.types.Hyperbole;
    }
    eval(x) {
        return this.b.divide(x.add(this.a)).add(this.c);
    }
    toTeX(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "\\frac{" + this.b.toTeX() + "}{" + x;
        str = applyTeX(str, this.a) + "} ";
        str = applyTeX(str, this.c);
        return str;
    }
    toString(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "\\frac{" + this.b.toString() + "}{" + x;
        str = apply(str, this.a) + "} ";
        str = apply(str, this.c);
        return str;
    }
    inverse() {
        return [new HyperboleFuntion(-this.c, this.b, -this.a)];
    }
    getDomain() {
        const semi1 = new Interval_1.Interval(Number.NEGATIVE_INFINITY, this.a, false, false);
        const semi2 = new Interval_1.Interval(this.a, Number.POSITIVE_INFINITY, false, false);
        return new Intervals_1.Intervals(semi1).union(semi2);
    }
    getRange() {
        const semi1 = new Interval_1.Interval(Number.NEGATIVE_INFINITY, this.c, false, false);
        const semi2 = new Interval_1.Interval(this.c, Number.POSITIVE_INFINITY, false, false);
        return new Intervals_1.Intervals(semi1).union(semi2);
    }
    getExtrema() {
        return [];
    }
}
exports.HyperboleFuntion = HyperboleFuntion;
;
// y = a^x or y=e^x
class ExponentialFunction extends ElementalFunction {
    constructor(a) {
        super();
        this.a = a;
    }
    getType() {
        return ElementalFunction.types.Exponential;
    }
    eval(x) {
        return Math.pow(this.a.toNumber(), x.toNumber());
    }
    toTeX(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        return this.a.toTeX() + "^" + x;
    }
    toString(x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        return this.a.toString() + "**" + x;
    }
    inverse() {
        return [new LogarithmFunction(this.a)];
    }
    getDomain() {
        return Intervals_1.Intervals.realLine();
    }
    getRange() {
        return new Intervals_1.Intervals(0, Number.POSITIVE_INFINITY, false, false);
    }
    getExtrema() {
        return [];
    }
}
exports.ExponentialFunction = ExponentialFunction;
// y = log_a x  or y= ln x
class LogarithmFunction extends ElementalFunction {
    constructor(a) {
        super();
        this.a = a;
    }
    getType() {
        return ElementalFunction.types.Logarithm;
    }
    eval(x) {
        return Math.pow(this.a.toNumber(), x.toNumber());
    }
    toTeX(bar) {
        let b = this.a.toTeX();
        if (b === "10") {
            b = "";
        }
        return "\\log_{" + b + "}\\, " + (bar || 'x');
    }
    toString(bar) {
        return "log(" + (bar || 'x') + ")/log(" + this.a.toString() + ")";
    }
    inverse() {
        throw new ExponentialFunction(this.a);
    }
    getDomain() {
        return Intervals_1.Intervals.realLine();
    }
    getRange() {
        return new Intervals_1.Intervals(0, Number.POSITIVE_INFINITY, false, false);
    }
    getExtrema() {
        return [];
    }
}
exports.LogarithmFunction = LogarithmFunction;
//t=sin, cos, tan  e.g.  b*sin(a*x)
class TrigonometricFunction extends ElementalFunction {
    getType() {
        return ElementalFunction.types.Trigonometric;
    }
    eval(x) {
        throw new Error("Method not implemented.");
    }
    toTeX(bar) {
        throw new Error("Method not implemented.");
    }
    toString(bar) {
        throw new Error("Method not implemented.");
    }
    inverse() {
        throw new Error("Method not implemented.");
    }
    getDomain() {
        throw new Error("Method not implemented.");
    }
    getRange() {
        throw new Error("Method not implemented.");
    }
    getExtrema() {
        throw new Error("Method not implemented.");
    }
    constructor(t, a, b) {
        super();
        this.t = t || "sin";
        this.a = a || 1;
        this.b = b || 1;
    }
}
exports.TrigonometricFunction = TrigonometricFunction;
;
//# sourceMappingURL=ElementalFunction.js.map