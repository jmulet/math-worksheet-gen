import { Monomial } from "./Monomial";
import { Numeric } from "./Numeric";
import { Expression } from "./Expression";

export class Power {
    base: Monomial;
    exponent: Monomial;
    constructor(base: number | Numeric | Monomial, exponent?: Numeric | Monomial) {      
        if (base == null) {
            this.base = Monomial.fromNumber(0);
        } else if (base instanceof Numeric) {
            this.base = Monomial.fromNumeric(base);
        }
        
        if (exponent == null) {
            this.exponent = Monomial.fromNumber(1);
        } else if (exponent instanceof Numeric) {
            this.exponent = Monomial.fromNumeric(exponent);
        }
    }
 
    /**
     * Look for the same symbol and joins into a single power
     * x^2 x^3 --> x^5
     * @param powers 
     */
    static reduceProduct(powers: Power[]): Power[] {
        const reduced: Power[] = [];
        powers.forEach( power => {
            const found = reduced.filter( e => e.base === power.base)[0];
            if (found) {
                found.exponent = found.exponent.multiply(power.exponent);
            } else {
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

    toString(): string {
        return this.toTeX();
    }

    toTeX(): string {
        if (this.exponent.isOne()) {
            return "" + this.base.toString();
        } else if (this.exponent.isZero()) {
            return "1";
        } else {
            let base = this.base.toString() + "";
            if ( !this.base.isPositiveNumber() ) {
                base = "\\left(" + base + "\\right)";
            }
            return base + "^{" + this.exponent.toString() + "}";
        }
    }
}