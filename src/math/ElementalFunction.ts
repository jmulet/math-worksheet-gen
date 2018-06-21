import { Interval } from "./Interval";
import { Numeric } from "./Numeric";
import { Point } from "./Point";
import { Intervals } from "./Intervals";

const applyProductTeX = function(c: Numeric, p: string, bar?: string) {
    var str = "";
    if (!c.isZero()) {
        if (c.isOne()) {
            str = bar;
        } else if (c.is(-1)) {
            str = "-" + bar;
        } else {
            str = c.toTeX() + p + bar;
        }
    }
    return str;
};

const applyProduct = function (c: Numeric, p: string, bar?: string) {
    var str = "";
    if (!c.isZero()) {
        if (c.isOne()) {
            str = bar;
        } else if (c.is(-1)) {
            str = "-" + bar;
        } else {
            str = c.toString() + p + bar;
        }
    }
    return str;
};

const applyTeX = function (str: string, v: Numeric, bar?: string) {
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

const apply = function (str: string, v: Numeric, bar?: string) {
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

var applyOneOp = function (str: string, v: Numeric, op: string) {
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


export interface ElementalFunctionInterface {
    getType(): number;
    eval(x: Numeric): number;
    toTeX(bar?: string): string;
    toString(bar?: string): string;
    inverse(): ElementalFunction[];
    getDomain(): Intervals;
    getRange(): Intervals;
    getExtrema(): Point[];
}

export abstract class ElementalFunction {

    static types: any = { "Lineal": 0, "Quadratic": 1, "Radical": 2, "Hyperbole": 3, "Exponential": 4, "Logarithm": 5, "Trigonometric": 6 };
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

export class LinealFunction extends ElementalFunction implements ElementalFunctionInterface {
    n: Numeric;
    m: Numeric;
 
    // y = mx+n
    constructor(m?: Numeric, n?: Numeric) {
        super();
        this.m = m || Numeric.fromNumber(1);
        this.n = n || Numeric.fromNumber(0);
    }

    eval(x: Numeric): number {
        return this.m.multiply(x).add(this.n).toNumber();
    }
    toTeX(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProductTeX(this.m, "\\,", x);
        return applyTeX(str, this.n);
    }
    toString(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProduct(this.m, "*", x);
        return apply(str, this.n);
    }
    inverse(): LinealFunction[] {
        return [new LinealFunction(this.m.inverse(), this.n.oposite().divide(this.m))];
    }
    getDomain(): Intervals {
        return Intervals.realLine();
    }
    getRange(): Intervals {
        return new Intervals(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
    getType() {
        return ElementalFunction.types.Lineal;
    }
    getExtrema(): Point[] {
        return [];
    }

};

export class QuadraticFunction extends ElementalFunction implements ElementalFunctionInterface {

    a: Numeric;
    b: Numeric;
    c: Numeric;

    // y = a*x^2 + b*x + c
    constructor(a: Numeric, b: Numeric, c: Numeric) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
    }
    inverse(): ElementalFunction[] {
        return [];
    }
    getDomain(): Intervals {
        return Intervals.realLine();
    }
    getRange(): Intervals {
        const extrema = this.getExtrema();
        const yv = extrema[0].components[1];
        if (this.a.isNegative()) {
            return new Intervals(Number.NEGATIVE_INFINITY, yv, false, true);
        }
        else {
            return new Intervals(yv, Number.POSITIVE_INFINITY, true, false);
        }
    }
    getType = function () {
        return ElementalFunction.types.Quadratic;
    }
    eval = function (x) {
        return (this.a * x + this.b) * x + this.c;
    }
    toTeX = function (x) {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProductTeX(this.a, "\\,", x + "^2");
        str = applyTeX(str, this.b, "\\," + x);
        str = applyTeX(str, this.c);
        return str;
    }
    toString(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "" + applyProduct(this.a, "*", x + "^2");
        str = apply(str, this.b, "*" + x);
        str = apply(str, this.c);
        return str;
    }
    getExtrema(): Point[] {
        const xv = this.b.oposite().divide(this.a.multiply(Numeric.fromNumber(2)));
        const yv = this.eval(xv);
        return [new Point([xv, yv])];
    }
}


// y = b*sqrt(x+a)
export class RadicalFunction extends ElementalFunction implements ElementalFunctionInterface {

    a: Numeric;
    b: Numeric;
    constructor(a: Numeric, b: Numeric) {
        super();
        this.a = a;
        this.b = b;
    }
    getType() {
        return ElementalFunction.types.Radical;
    }

    eval(x: Numeric): number {
        return this.b.toNumber() * Math.sqrt(x.toNumber() + this.a.toNumber());
    }

    toTeX(x?: string): string {
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
    };

    toString(x?: string): string {
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
    };

    inverse(): ElementalFunction[] {
        return [new QuadraticFunction(this.b.multiply(this.b).inverse(), Numeric.fromNumber(0), this.a.oposite())];
    }

    getDomain(): Intervals {
        return new Intervals(this.a.oposite(), Number.POSITIVE_INFINITY, true, false);
    };

    getRange(): Intervals {
        if (this.b.isNegative()) {
            return new Intervals(Number.NEGATIVE_INFINITY, 0, false, true);
        }
        else {
            return new Intervals(0, Number.POSITIVE_INFINITY, true, false);
        }
    }
    getExtrema(): Point[] {
        return [];
    }
}


// y = b / (x+a) + c
export class HyperboleFuntion extends ElementalFunction implements ElementalFunctionInterface {
    c: any;
    b: any;
    a: any;
    constructor(a, b, c) {
        super();
        this.a = a || 0;
        this.b = b || 1;
        this.c = c || 0;
    }
    getType(): number {
        return ElementalFunction.types.Hyperbole;
    }
    eval(x: Numeric): number {
        return this.b.divide(x.add(this.a)).add(this.c);
    }
    toTeX(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "\\frac{" + this.b.toTeX() + "}{" + x;
        str = applyTeX(str, this.a) + "} ";
        str = applyTeX(str, this.c);
        return str;
    }
    toString(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        var str = "\\frac{" + this.b.toString() + "}{" + x;
        str = apply(str, this.a) + "} ";
        str = apply(str, this.c);
        return str;
    }
    inverse(): ElementalFunction[] {
        return [new HyperboleFuntion(-this.c, this.b, -this.a)];
    }
    getDomain(): Intervals {
        const semi1 = new Interval(Number.NEGATIVE_INFINITY, this.a, false, false);
        const semi2 = new Interval(this.a, Number.POSITIVE_INFINITY, false, false);
        return new Intervals(semi1).union(semi2);
    }
    getRange(): Intervals {
        const semi1 = new Interval(Number.NEGATIVE_INFINITY, this.c, false, false);
        const semi2 = new Interval(this.c, Number.POSITIVE_INFINITY, false, false);
        return new Intervals(semi1).union(semi2);
    }
    getExtrema(): Point[] {
        return [];
    }

};




// y = a^x or y=e^x
export class ExponentialFunction extends ElementalFunction implements ElementalFunctionInterface {

    a: Numeric;
    constructor(a) {
        super();
        this.a = a;
    }

    getType(): number {
        return ElementalFunction.types.Exponential;
    }
    eval(x: Numeric): number {
        return Math.pow(this.a.toNumber(), x.toNumber());
    }
    toTeX(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        return this.a.toTeX() + "^" + x;
    }
    toString(x?: string): string {
        x = x || 'x';
        if (x.length > 1) {
            x = "(" + x + ")";
        }
        return this.a.toString() + "**" + x;
    }
    inverse(): ElementalFunction[] {
        return [new LogarithmFunction(this.a)];
    }
    getDomain(): Intervals {
        return Intervals.realLine();
    }
    getRange(): Intervals {
        return new Intervals(0, Number.POSITIVE_INFINITY, false, false);
    }
    getExtrema(): Point[] {
        return [];
    }
}


// y = log_a x  or y= ln x
export class LogarithmFunction extends ElementalFunction implements ElementalFunctionInterface {
      a: Numeric;
    constructor(a: Numeric) {
        super();
        this.a = a;
    }
    getType(): number {
        return ElementalFunction.types.Logarithm;
     }
     eval(x: Numeric): number {
         return Math.pow(this.a.toNumber(), x.toNumber());
     }
     toTeX(bar?: string): string {
         let b = this.a.toTeX();
         if(b === "10") {
             b = "";
         }
         return "\\log_{" + b + "}\\, " + (bar || 'x');
     }
     toString(bar?: string): string {
         return "log(" + ( bar || 'x') + ")/log(" + this.a.toString() + ")";
     }
     inverse(): ElementalFunction[] {
         throw new ExponentialFunction(this.a);
     }
     getDomain(): Intervals {
         return Intervals.realLine();
     }
     getRange(): Intervals {
         return new Intervals(0, Number.POSITIVE_INFINITY, false, false);
     }
     getExtrema(): Point[] {
         return [];
     }
}
 

//t=sin, cos, tan  e.g.  b*sin(a*x)
export class TrigonometricFunction extends ElementalFunction implements ElementalFunctionInterface {
    b: any;
    a: any;
    t: any;
    getType(): number {
        return ElementalFunction.types.Trigonometric;
    }
    eval(x: Numeric): number {
        throw new Error("Method not implemented.");
    }
    toTeX(bar?: string): string {
        throw new Error("Method not implemented.");
    }
    toString(bar?: string): string {
        throw new Error("Method not implemented.");
    }
    inverse(): ElementalFunction[] {
        throw new Error("Method not implemented.");
    }
    getDomain(): Intervals {
        throw new Error("Method not implemented.");
    }
    getRange(): Intervals {
        throw new Error("Method not implemented.");
    }
    getExtrema(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(t, a, b) {
        super();
        this.t = t || "sin";
        this.a = a || 1;
        this.b = b || 1;
    }
      
};

 
 

