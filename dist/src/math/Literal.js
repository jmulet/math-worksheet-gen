"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Literal {
    constructor(symbol, exponent) {
        this.symbol = symbol;
        this.exponent = exponent;
    }
    static equivalent(l1, l2) {
        return l1.symbol === l2.symbol;
    }
    degree() {
        return this.exponent;
    }
    copy() {
        return new Literal(this.symbol, this.exponent);
    }
    toString() {
        if (this.exponent === 0) {
            return "1";
        }
        else if (this.exponent === 1) {
            return this.symbol;
        }
        else if (this.exponent > 1) {
            return this.symbol + "^{" + this.exponent + "} ";
        }
        else {
            const exponentAbs = Math.abs(this.exponent);
            return "1/" + this.symbol + (exponentAbs !== 1 ? ("^{" + exponentAbs + "} ") : "");
        }
    }
    toTeX() {
        if (this.exponent === 0) {
            return "1";
        }
        else if (this.exponent === 1) {
            return this.symbol;
        }
        else if (this.exponent > 1) {
            return this.symbol + "^{" + this.exponent + "}";
        }
        else {
            return "\\frac{1}{" + this.symbol + "^{" + Math.abs(this.exponent) + "}}";
        }
    }
}
exports.Literal = Literal;
//# sourceMappingURL=Literal.js.map