"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Interval {
    // null depicts infinity
    constructor(a, b, aIncluded, bIncluded) {
        this.a = a;
        this.b = b;
        this.aIncluded = aIncluded;
        this.bIncluded = bIncluded;
        if (a === Number.NEGATIVE_INFINITY) {
            aIncluded = false;
        }
        if (b === Number.POSITIVE_INFINITY) {
            bIncluded = false;
        }
    }
    static isolatePoint(p) {
        return new Interval(p, p, true, true);
    }
    static emptySet() {
        return new Interval(null, null, false, false);
    }
    static realLine() {
        return new Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, false);
    }
    toString() {
        return this.toTeX();
    }
    toTeX() {
        if (this.a == null && this.b === null) {
            return "\\O";
        }
        if (this.a === Number.NEGATIVE_INFINITY) {
            if (this.b === Number.POSITIVE_INFINITY) {
                return "\\left( -\\infty, +\\infty \\right)";
            }
            else {
                return "( -\\infty, " + this.b.toString + (this.bIncluded ? "]" : ")");
            }
        }
        else {
            if (this.b === Number.POSITIVE_INFINITY) {
                return (this.aIncluded ? "[" : "(") + this.a.toString + ", +\\infty)";
            }
            else {
                return (this.aIncluded ? "[" : "(") + this.a.toString + ", " + this.b.toString() + (this.bIncluded ? "]" : ")");
            }
        }
    }
}
exports.Interval = Interval;
//# sourceMappingURL=Intervals.js.map