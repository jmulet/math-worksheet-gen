import { Interval } from "./Interval";
import { Numeric } from "./Numeric";

/**
 * Allow the union of several interval
 */
export class Intervals {

    listOfIntervals: Interval[] = [];

    static isolatePoint(p: Numeric) {
        return new Intervals(p, p, true, true);
    }

    static emptySet() {
        return new Intervals(null, null, false, false);
    }

    static realLine() {
        return new Intervals(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, false);
    }

    constructor(a?: any, b?: Numeric | Number, aIncluded?: boolean, bIncluded?: boolean) {
        if (a && a instanceof Interval) {
            this.listOfIntervals.push(a);
        } else if(a && b) {
            this.listOfIntervals.push(new Interval(a, b, aIncluded, bIncluded));
        } 
    }

    union(interval: Interval): Intervals {
        this.listOfIntervals.push(interval);
        return this;
    }

    toString(): string {
        const n = this.listOfIntervals.length;
        if (n === 0) {
            return "O";
        } else {
            return this.listOfIntervals.map( e => e.toString() ).join(" U ");
        }
    }

    toTeX(): string {
        const n = this.listOfIntervals.length;
        if (n === 0) {
            return "\\emptyset"
        } else {
            return this.listOfIntervals.map( e => e.toTeX() ).join(" \\cup ");
        }
    }

}