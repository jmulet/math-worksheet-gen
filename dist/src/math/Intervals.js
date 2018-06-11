"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interval_1 = require("./Interval");
/**
 * Allow the union of several interval
 */
class Intervals {
    constructor(a, b, aIncluded, bIncluded) {
        this.listOfIntervals = [];
        if (a && a instanceof Interval_1.Interval) {
            this.listOfIntervals.push(a);
        }
        else if (a && b) {
            this.listOfIntervals.push(new Interval_1.Interval(a, b, aIncluded, bIncluded));
        }
    }
    static isolatePoint(p) {
        return new Intervals(p, p, true, true);
    }
    static emptySet() {
        return new Intervals(null, null, false, false);
    }
    static realLine() {
        return new Intervals(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, false);
    }
    union(interval) {
        this.listOfIntervals.push(interval);
        return this;
    }
    toString() {
        const n = this.listOfIntervals.length;
        if (n === 0) {
            return "O";
        }
        else {
            return this.listOfIntervals.map(e => e.toString()).join(" U ");
        }
    }
    toTeX() {
        const n = this.listOfIntervals.length;
        if (n === 0) {
            return "\\emptyset";
        }
        else {
            return this.listOfIntervals.map(e => e.toTeX()).join(" \\cup ");
        }
    }
}
exports.Intervals = Intervals;
//# sourceMappingURL=Intervals.js.map