"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Monomial_1 = require("./Monomial");
const Numeric_1 = require("./Numeric");
class Power {
    constructor(base, exponent) {
        if (base == null) {
            this.base = Monomial_1.Monomial.fromNumber(0);
        }
        else if (base instanceof Numeric_1.Numeric) {
            this.base = Monomial_1.Monomial.fromNumeric(base);
        }
        if (exponent == null) {
            this.exponent = Monomial_1.Monomial.fromNumber(1);
        }
        else if (exponent instanceof Numeric_1.Numeric) {
            this.exponent = Monomial_1.Monomial.fromNumeric(exponent);
        }
    }
    /**
     * Look for the same symbol and joins into a single power
     * x^2 x^3 --> x^5
     * @param powers
     */
    static reduceProduct(powers) {
        const reduced = [];
        powers.forEach(power => {
            const found = reduced.filter(e => e.base === power.base)[0];
            if (found) {
                found.exponent = found.exponent.multiply(power.exponent);
            }
            else {
                reduced.push(power);
            }
        });
        return reduced;
    }
    /*    static lcm(powers1: Power[], powers2: Power[]): Power[] {
        const p1 = Power.reduceProduct(powers1);
        const p2 = Power.reduceProduct(powers2);
        const reduced: Power[] = [];
        p1.forEach( power => {
            const found = p2.filter( e => e.base === power.base)[0];
            if (found) {
                let exponent2 = Numeric.max(found.exponent, power.exponent);
                reduced.push(new Power(power.base, exponent2));
            } else {
                reduced.push(power);
            }
        });
        p2.forEach( power => {
            const found = p1.filter( e => e.base === power.base)[0];
            if (!found) {
                reduced.push(power);
            }
        });
        return reduced;
    }
    */
    toString() {
        return this.toTeX();
    }
    toTeX() {
        if (this.exponent.isOne()) {
            return "" + this.base.toString();
        }
        else if (this.exponent.isZero()) {
            return "1";
        }
        else {
            let base = this.base.toString() + "";
            if (!this.base.isPositiveNumber()) {
                base = "\\left(" + base + "\\right)";
            }
            return base + "^{" + this.exponent.toString() + "}";
        }
    }
}
exports.Power = Power;
//# sourceMappingURL=Power.js.map