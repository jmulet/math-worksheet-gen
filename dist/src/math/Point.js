"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numeric_1 = require("./Numeric");
const Vector_1 = require("./Vector");
class Point {
    static midPoint(A, B) {
        return A.add(B).divide(2);
    }
    constructor(components, symbol) {
        this.components = components.map((e) => {
            if (typeof (e) === 'number') {
                return Numeric_1.Numeric.fromNumber(e);
            }
            else {
                return e;
            }
        });
        this.symbol = symbol;
        this.arrow = symbol ? symbol : "";
    }
    dimension() {
        return this.components.length;
    }
    oposite() {
        const components2 = this.components.map(e => e.oposite());
        return new Point(components2, "(-" + this.symbol + ")");
    }
    copy() {
        const components2 = this.components.map(e => e.copy());
        return new Point(components2, this.symbol);
    }
    add(v) {
        const n = this.dimension();
        if (n === v.dimension()) {
            const components2 = this.components.map((e, i) => e.add(v.components[i]));
            return new Point(components2, this.symbol + "+" + v.symbol);
        }
        else {
            throw "Invalid vector dimension";
        }
    }
    substract(v) {
        return this.add(v.oposite());
    }
    divide(n) {
        let nn;
        if (typeof (n) === "number") {
            nn = Numeric_1.Numeric.fromNumber(n);
        }
        else {
            nn = n;
        }
        const p = this.copy();
        p.components.forEach(c => c.divide(nn));
        return p;
    }
    isZero() {
        const n = this.dimension();
        for (var i = 0; i < n; i++) {
            if (!this.components[i].isZero()) {
                return false;
            }
        }
        return true;
    }
    firstComponentNonZero() {
        let comp = this.components[0];
        const n = this.dimension();
        let i = 1;
        while (comp.isZero() && i < n) {
            comp = this.components[i];
            i += 1;
        }
        if (comp.isZero()) {
            return null;
        }
        return comp;
    }
    distance(e) {
        if (!e) {
            return null;
        }
        if (e instanceof Point) {
            return Vector_1.Vector.fromPoints(this, e).norm();
        }
        else {
            return e.distance(this);
        }
    }
    toTeX(printSymbol) {
        let str = "";
        if (printSymbol) {
            str = "" + this.symbol;
        }
        return str + " \\left("
            + this.components.map(e => e.toTeX()).join(", ")
            + "\\right) ";
    }
}
exports.Point = Point;
//# sourceMappingURL=Point.js.map