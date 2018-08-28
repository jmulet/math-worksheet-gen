"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
const Numeric_1 = require("./Numeric");
const Random_1 = require("../util/Random");
class Matrix {
    constructor(elems) {
        this.rows = 0;
        this.cols = 0;
        this.elems = elems;
        this.rows = this.elems.length;
        if (this.rows) {
            const rowsLength = this.elems.map(r => r.length);
            const minLen = Math.min(...rowsLength);
            const maxLen = Math.max(...rowsLength);
            if (minLen !== maxLen) {
                throw "Irregular matrix are not supported.";
            }
            else {
                this.cols = minLen;
            }
        }
    }
    static Identity(n) {
        return Matrix.fromDefinition(n, n, (i, j) => i === j ? Numeric_1.Numeric.fromNumber(1) : Numeric_1.Numeric.fromNumber(0));
    }
    static Zero(n, m) {
        return Matrix.fromDefinition(n, m, (i, j) => Numeric_1.Numeric.fromNumber(0));
    }
    static fromNumbers(nums) {
        const elems = [];
        nums.forEach((r) => {
            elems.push(r.map(n => Numeric_1.Numeric.fromNumber(n)));
        });
        return new Matrix(elems);
    }
    static fromVectors(vs) {
        const elems = [];
        vs.forEach((v) => {
            elems.push(v.components.map(n => n.copy()));
        });
        return new Matrix(elems);
    }
    static fromDefinition(n, m, dfun) {
        const elems = new Array(n);
        for (var i = 0; i < n; i++) {
            elems[i] = new Array(m);
            for (var j = 0; j < m; j++) {
                elems[i][j] = dfun(i, j);
            }
        }
        return new Matrix(elems);
    }
    transpose() {
        var elems = new Array(this.cols);
        for (var i = 0; i < this.cols; i++) {
            elems[i] = new Array(this.rows);
            for (var j = 0; j < this.rows; j++) {
                elems[i][j] = this.elems[j][i].copy();
            }
        }
        return new Matrix(elems);
    }
    opposite() {
        var elems = this.elems.map(r => r.map(e => e.oposite()));
        return new Matrix(elems);
    }
    copy() {
        var elems = this.elems.map(r => r.map(e => e.copy()));
        return new Matrix(elems);
    }
    isSquared() {
        return this.cols === this.rows && this.cols > 0;
    }
    add(m) {
        //Match dimensions
        if (m.rows !== this.rows || m.cols !== this.cols) {
            throw "Invalid matrix dimensions for +";
        }
        var elems = this.elems.map((r, i) => r.map((e, j) => e.add(m.elems[i][j])));
        return new Matrix(elems);
    }
    substract(m) {
        //Match dimensions
        if (m.rows !== this.rows || m.cols !== this.cols) {
            throw "Invalid matrix dimensions for -";
        }
        var elems = this.elems.map((r, i) => r.map((e, j) => e.substract(m.elems[i][j])));
        return new Matrix(elems);
    }
    multiply(m) {
        let elems;
        if (m instanceof Matrix) {
            if (this.cols !== m.rows) {
                throw "Invalid matrix dimensions for *";
            }
            elems = new Array(this.rows);
            for (let i = 0; i < this.rows; i++) {
                elems[i] = new Array(m.cols);
                for (let j = 0; j < m.cols; j++) {
                    let sum = Numeric_1.Numeric.fromNumber(0);
                    for (let k = 0; k < this.cols; k++) {
                        sum = sum.add(this.elems[i][k].multiply(m.elems[k][j]));
                    }
                    elems[i][j] = sum;
                }
            }
        }
        else if (m instanceof Vector_1.Vector) {
            if (m.components.length !== this.cols) {
                throw "Invalid matrix dimensions for *";
            }
            elems = new Array(this.rows);
            for (let i = 0; i < this.rows; i++) {
                elems[i] = new Array(1);
                let sum = Numeric_1.Numeric.fromNumber(0);
                for (let k = 0; k < this.cols; k++) {
                    sum = sum.add(this.elems[i][k].multiply(m.components[k]));
                }
                elems[i][0] = sum;
            }
        }
        else {
            if (typeof (m) === "number") {
                m = Numeric_1.Numeric.fromNumber(m);
            }
            elems = this.elems.map((r, i) => r.map((e, j) => e.multiply(m)));
        }
        return new Matrix(elems);
    }
    divide(n) {
        if (n.isZero()) {
            throw "Divide by zero";
        }
        var elems = this.elems.map((r) => r.map((e) => e.divide(n)));
        return new Matrix(elems);
    }
    power(n) {
        if (!this.isSquared()) {
            throw "Power is not valid for square matrices";
        }
        let mat = this;
        if (n < 0) {
            mat = this.inverse();
            n = -n;
        }
        let p = Matrix.Identity(this.rows);
        for (let i = 0; i < n; i++) {
            p = p.multiply(mat);
        }
        return p;
    }
    // Determinant by expansion of first row
    static det(arr) {
        let detVal = Numeric_1.Numeric.fromNumber(0);
        if (arr.length === 1) {
            return arr[0][0];
        }
        else if (arr.length === 2) {
            return arr[0][0].multiply(arr[1][1]).substract(arr[1][0].multiply(arr[0][1]));
        }
        else {
            for (var j = 0; j < arr.length; j++) {
                const f = Numeric_1.Numeric.fromNumber(Math.pow(-1, j));
                const menor = Matrix.det(Matrix.removeRowCol(arr, 0, j));
                detVal = detVal.add(arr[0][j].multiply(f).multiply(menor));
            }
        }
        return detVal;
    }
    static removeRowCol(arr, i, j) {
        // Clone the array
        let arr2 = arr.map(r => r.slice());
        arr2.splice(i, 1);
        arr2.forEach(r => r.splice(j, 1));
        // Do not clone numerics 
        return arr2;
    }
    menor(row, col) {
        const men = Matrix.removeRowCol(this.elems, row, col);
        return Matrix.det(men);
    }
    adjunt(row, col) {
        const f = Numeric_1.Numeric.fromNumber(Math.pow(-1, row + col));
        return this.menor(row, col).multiply(f);
    }
    adjunts() {
        let elems = new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {
            elems[i] = new Array(this.cols);
            for (var j = 0; j < this.cols; j++) {
                elems[i][j] = this.adjunt(i, j);
            }
        }
        return new Matrix(elems);
    }
    determinant() {
        return Matrix.det(this.elems);
    }
    inverse() {
        if (!this.isSquared()) {
            throw "Inverse is only valid for square matrices";
        }
        const det = this.determinant();
        if (!det || det.isZero()) {
            throw "Inverse is only possible for regular matrices";
        }
        return this.transpose().adjunts().divide(det);
    }
    getDimensions() {
        return [this.rows, this.cols];
    }
    toString() {
        const rows = this.elems.map(r => {
            return "[" + r.map(e => e.toString()).join(", ") + "]";
        });
        return "[" + rows.join(", ") + "]";
    }
    toTeX() {
        const rows = this.elems.map(r => {
            return r.map(e => e.toTeX()).join(" & ");
        });
        let str = this.name ? (this.name.toUpperCase() + " = ") : "";
        if (this.rows === 1 && this.cols === 1) {
            //escalar
            str += this.elems[0][0].toTeX();
        }
        else {
            str += "\\left( \\begin{array}{" + new Array(this.cols).fill("c").join("") + "}\n" + rows.join(" \\\\[2mm]") + "\n\\end{array} \\right)";
        }
        return str;
    }
    toClozeForm(opts) {
        const options = Object.assign({ accuracy: 0.01, maxBlanks: 4 }, opts);
        const builder = [];
        const nn = this.rows * this.cols;
        if (options.maxBlanks > nn) {
            options.maxBlanks = nn;
        }
        let elements = [];
        if (options.maxBlanks > 0) {
            elements = Random_1.Random.shuffle(Random_1.Random.fillRange(0, nn - 1)).splice(0, options.maxBlanks);
        }
        builder.push(`
        <table style="display: inline-table; vertical-align: middle;">
        <tbody>`);
        let blankNum = 1;
        for (var i = 0; i < this.rows; i++) {
            let decorate = "";
            builder.push(`<tr>
        <td style="width: 1px; border-left: 2px solid black; ${decorate}"> </td>
        `);
            for (var j = 0; j < this.cols; j++) {
                const elemNum = this.cols * i + j;
                const v = this.elems[i][j];
                let tex, blank;
                if (v) {
                    tex = v.toTeX();
                    blank = `{${blankNum}:NUMERICAL:=${v.toNumber()}:${options.accuracy}}`;
                }
                else {
                    tex = "0";
                    blank = `{${blankNum}:SHORTANSWER:=}`;
                }
                if (elements.indexOf(elemNum) >= 0) {
                    blankNum += 1;
                    builder.push(`<td style="width: 30px; height: 30px; text-align: center;"><span>${blank}</span></td>`);
                }
                else {
                    builder.push(`<td style="width: 30px; height: 30px; text-align: center;"><span>\\( ${tex} \\)</span></td>`);
                }
            }
            builder.push(`
        <td style="width: 1px; border-right: 2px solid black; ${decorate};"> </td>
        </tr>`);
        }
        builder.push(`
    </tbody>
    </table>
    `);
        return builder.join(" ");
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=Matrix.js.map