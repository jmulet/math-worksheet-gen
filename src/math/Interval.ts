import { Numeric } from "./Numeric";

export class Interval {

    static isolatePoint(p: Numeric) {
        return new Interval(p, p, true, true);
    }

    static emptySet() {
        return new Interval(null, null, false, false);
    }

    static realLine() {
        return new Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, false);
    }

    // null depicts infinity
    constructor(public a: Numeric | Number, public b: Numeric | Number, public aIncluded?: boolean, public bIncluded?: boolean) {
        if (a === Number.NEGATIVE_INFINITY) {
            aIncluded = false;
        }

        if (b === Number.POSITIVE_INFINITY) {
            bIncluded = false;
        }
    }

    toString(): string {
        return this.toTeX();
    }

    toTeX(): string {
        if (this.a == null && this.b === null) {
            return "\\O";
        }
        if (this.a === Number.NEGATIVE_INFINITY) {
            if (this.b === Number.POSITIVE_INFINITY) {
                return "\\left( -\\infty, +\\infty \\right)";
            } else {
                return "( -\\infty, " + this.b.toString + (this.bIncluded? "]":")");
            }
        } else {
            if (this.b === Number.POSITIVE_INFINITY) {
                return (this.aIncluded? "[":"(") + this.a.toString + ", +\\infty)";
            } else {
                return (this.aIncluded? "[":"(") + this.a.toString + ", "+ this.b.toString() + (this.bIncluded? "]":")");
            }
        }
    }
}