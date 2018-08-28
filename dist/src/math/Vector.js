"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numeric_1 = require("./Numeric");
const mathjs = require("mathjs");
function trimArray(arr, len) {
    const clen = arr.length;
    const out = new Array(len);
    for (var i = 0; i < len; i++) {
        if (i < clen) {
            out[i] = arr[i];
        }
        else {
            out[i] = Numeric_1.Numeric.fromNumber(0);
        }
    }
    return out;
}
class Vector {
    static fromPoints(A, B) {
        if (!A || !B) {
            return null;
        }
        if (A.dimension() !== B.dimension()) {
            throw new Error("invalid point dimensions in fixed AB vector");
        }
        const components = [];
        A.components.forEach((c, i) => components.push(B.components[i].substract(c)));
        return new Vector(components);
    }
    static determinant(...vectors) {
        const dims = vectors.map(v => v.dimension());
        if (Math.min(...dims) !== Math.max(...dims)) {
            throw new Error("invalid dimensions in determinant");
        }
        const dim = Math.min(...dims);
        if (vectors.length !== dim) {
            throw new Error("invalid dimensions in determinant");
        }
        const matrix = vectors.map(v => {
            return v.components.map(c => c.toNumber());
        });
        return mathjs.det(matrix);
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
        this.arrow = symbol ? `\\vec{${symbol}}` : "";
    }
    dimension() {
        return this.components.length;
    }
    times(n) {
        let nn;
        if (typeof (n) === "number") {
            nn = Numeric_1.Numeric.fromNumber(n);
        }
        else {
            nn = n;
        }
        const components2 = this.components.map((c) => c.multiply(nn));
        return new Vector(components2);
    }
    dotProduct(v) {
        const n = this.dimension();
        if (n === v.dimension()) {
            const products = this.components.map((e, i) => e.multiply(v.components[i]));
            let scalar = products[0];
            for (let i = 1; i < n; i++) {
                scalar = scalar.add(products[i]);
            }
            return scalar;
        }
        else {
            throw "Invalid vector dimension";
        }
    }
    crossProduct(v) {
        const n = this.dimension();
        if (v.dimension() <= 3 && n <= 3) {
            const a = trimArray(this.components, 3);
            const b = trimArray(v.components, 3);
            const c1 = a[1].multiply(b[2]).substract(b[1].multiply(a[2]));
            const c2 = a[2].multiply(b[0]).substract(b[2].multiply(a[0]));
            const c3 = a[0].multiply(b[1]).substract(b[0].multiply(a[1]));
            return new Vector([c1, c2, c3]);
        }
        else {
            throw "Invalid vector dimension";
        }
    }
    norm2() {
        return this.dotProduct(this);
    }
    norm() {
        return Math.sqrt(this.dotProduct(this).toNumber());
    }
    angle(v) {
        const op = this.dotProduct(v).toNumber() / (this.norm() * v.norm());
        return 180 * Math.acos(op) / Math.PI;
    }
    oposite() {
        const components2 = this.components.map(e => e.oposite());
        return new Vector(components2, "(-" + this.symbol + ")");
    }
    copy() {
        const components2 = this.components.map(e => e.copy());
        return new Vector(components2, this.symbol);
    }
    add(v) {
        const n = this.dimension();
        if (n === v.dimension()) {
            const components2 = this.components.map((e, i) => e.add(v.components[i]));
            return new Vector(components2, this.symbol + "+" + v.symbol);
        }
        else {
            throw "Invalid vector dimension";
        }
    }
    substract(v) {
        return this.add(v.oposite());
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
    isParallelTo(v, accuracy = 1e-10) {
        const n = this.dimension();
        if (n === v.dimension()) {
            if (this.isZero()) {
                return false;
            }
            const first = this.firstComponentNonZero();
            const pos = this.components.indexOf(first);
            const ratio = v.components[pos].divide(first).abs();
        }
        else {
            throw "Invalid vector dimension";
        }
    }
    isPerpendicularTo(v, accuracy = 1e-8) {
        return this.dotProduct(v).abs() <= accuracy;
    }
    toTeX(printSymbol) {
        let str = "";
        if (printSymbol) {
            str = "\\vec " + this.symbol;
        }
        return str + " \\left("
            + this.components.map(e => e.toTeX()).join(", ")
            + "\\right) ";
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map