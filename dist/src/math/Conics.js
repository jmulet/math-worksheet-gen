"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = require("./Point");
const Numeric_1 = require("./Numeric");
const Line_1 = require("./Line");
const Vector_1 = require("./Vector");
class Conics {
    constructor(O, a, b, c) {
        this.O = new Point_1.Point([0, 0]);
        this.a = 1;
        this.b = 1;
        this.c = 0;
        this.O = O;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    excentricity() {
        return this.c / this.a;
    }
    toTeX() {
        return "";
    }
    static Circumference(O, R) {
        return new Circumference(O, R);
    }
    static Elipse(O, a, b) {
        return new Elipse(O, a, b);
    }
    static Hiperbola(O, a, b) {
        return new Hiperbola(O, a, b);
    }
    static Parabola(O, p, position) {
        return new Parabola(O, p, position);
    }
}
Conics.CIRCUMFERENCE = 0;
Conics.ELIPSE = 1;
Conics.HIPERBOLA = 2;
Conics.PARABOLA = 3;
exports.Conics = Conics;
class Circumference extends Conics {
    static fromThreePoints(A, B, C) {
        return new Circumference(new Point_1.Point([0, 0]), 1);
    }
    constructor(O, R) {
        super(O, R, R, 0);
        this.R = R;
        this.type = Conics.CIRCUMFERENCE;
    }
    toTeX(general) {
        if (general) {
            const x0 = this.O.components[0].toNumber();
            const y0 = this.O.components[1].toNumber();
            const D = -2 * x0;
            const E = -2 * y0;
            const F = x0 * x0 + y0 * y0 - this.R * this.R;
            let str = "x^2 + y^2";
            if (D) {
                if (D > 0) {
                    str += " + ";
                }
                str += D + "x ";
            }
            if (E) {
                if (E > 0) {
                    str += " + ";
                }
                str += E + "y ";
            }
            if (F) {
                if (F > 0) {
                    str += " + ";
                }
                str += F;
            }
            return str + " = 0";
        }
        else {
            const x0 = this.O.components[0].oposite();
            const y0 = this.O.components[1].oposite();
            let str;
            if (!x0.isZero()) {
                str = "\\left( x ";
                if (!x0.isNegative()) {
                    str += " + ";
                }
                str += x0.toTeX() + " \\right)^2 + ";
            }
            else {
                str = "x^2 + ";
            }
            if (!y0.isZero()) {
                str += "\\left( y ";
                if (!y0.isNegative()) {
                    str += " + ";
                }
                str += y0.toTeX() + " \\right)^2";
            }
            else {
                str += "y^2";
            }
            return str + "=" + this.R * this.R;
        }
    }
}
exports.Circumference = Circumference;
class Elipse extends Conics {
    constructor(O, a, b) {
        super(O, a, b, Math.sqrt(Math.abs(a * a - b * b)));
        this.type = Conics.ELIPSE;
    }
    toTeX() {
        const x0 = this.O.components[0].oposite();
        const y0 = this.O.components[1].oposite();
        let str;
        if (!x0.isZero()) {
            str = "\\left( x ";
            if (!x0.isNegative()) {
                str += " + ";
            }
            str += x0.toTeX() + " \\right)^2 ";
        }
        else {
            str = "x^2";
        }
        if (this.a !== 1) {
            const a2 = this.a * this.a;
            str = "\\frac{" + str + "}{" + a2 + "}";
        }
        let str2;
        if (!y0.isZero()) {
            str2 = "\\left( y ";
            if (!y0.isNegative()) {
                str2 += " + ";
            }
            str2 += y0.toTeX() + " \\right)^2";
        }
        else {
            str2 = "y^2";
        }
        if (this.b !== 1) {
            const b2 = this.b * this.b;
            str2 = "\\frac{" + str2 + "}{" + b2 + "}";
        }
        return str + "+" + str2 + "=1";
    }
}
exports.Elipse = Elipse;
class Hiperbola extends Conics {
    constructor(O, a, b) {
        super(O, a, b, Math.sqrt(a * a + b * b));
        this.type = Conics.HIPERBOLA;
    }
    toTeX() {
        const x0 = this.O.components[0].oposite();
        const y0 = this.O.components[1].oposite();
        let str;
        if (!x0.isZero()) {
            str = "\\left( x ";
            if (!x0.isNegative()) {
                str += " + ";
            }
            str += x0.toTeX() + " \\right)^2 ";
        }
        else {
            str = "x^2";
        }
        if (this.a !== 1) {
            const a2 = this.a * this.a;
            str = "\\frac{" + str + "}{" + a2 + "}";
        }
        let str2;
        if (!y0.isZero()) {
            str2 = "\\left( y ";
            if (!y0.isNegative()) {
                str2 += " + ";
            }
            str2 += y0.toTeX() + " \\right)^2";
        }
        else {
            str2 = "y^2";
        }
        if (this.b !== 1) {
            const b2 = this.b * this.b;
            str2 = "\\frac{" + str2 + "}{" + b2 + "}";
        }
        return str + "-" + str2 + "=1";
    }
}
exports.Hiperbola = Hiperbola;
class Parabola extends Conics {
    constructor(O, p, position = 0) {
        super(O, 1, 1, 1);
        this.position = position;
        this.p = p;
        this.type = Conics.PARABOLA;
        // Compute focus
        this.F = O.copy();
        if (position === Parabola.VERTICAL) {
            this.F.components[1] = this.F.components[1].add(p.divide(Numeric_1.Numeric.fromNumber(2)));
        }
        else {
            this.F.components[0] = this.F.components[0].add(p.divide(Numeric_1.Numeric.fromNumber(2)));
        }
    }
    focus() {
        return this.F;
    }
    directrice() {
        const P = this.O.copy();
        let vec;
        if (this.position === Parabola.VERTICAL) {
            P.components[1] = P.components[1].substract(this.p.divide(Numeric_1.Numeric.fromNumber(2)));
            vec = new Vector_1.Vector([1, 0]);
        }
        else {
            P.components[0] = P.components[0].substract(this.p.divide(Numeric_1.Numeric.fromNumber(2)));
            vec = new Vector_1.Vector([0, 1]);
        }
        return new Line_1.Line(P, vec);
    }
    excentricity() {
        return 1;
    }
    toTeX() {
        const coef = this.p.multiply(Numeric_1.Numeric.fromNumber(2)).inverse();
        let bar1, bar2;
        let v1, v2;
        if (this.position === Parabola.VERTICAL) {
            bar1 = "x";
            bar2 = "y";
            v1 = this.O.components[0];
            v2 = this.O.components[1];
        }
        else {
            bar2 = "x";
            bar1 = "y";
            v1 = this.O.components[1];
            v2 = this.O.components[0];
        }
        let str = bar2 + " = ";
        if (!v2.isZero()) {
            str += v2.toTeX();
        }
        if (!coef.isNegative()) {
            str += " + ";
        }
        str += coef.toTeX();
        if (!v1.isZero()) {
            str += "\\left( x ";
            if (!v1.isNegative()) {
                str += " + ";
            }
            str += v1.toTeX() + "\\right)^2";
        }
        else {
            str += bar1 + "^2";
        }
        return str;
    }
}
Parabola.VERTICAL = 0;
Parabola.HORIZONTAL = 1;
exports.Parabola = Parabola;
//# sourceMappingURL=Conics.js.map