import { Productable } from "./Productable";
import { Monomial } from "./Monomial";
import * as math from "mathjs";
import { Expression } from "./Expression";
import { Power } from "./Power";

/**
 * Numeric is wrapper around number and fraction
 */
export class Numeric implements Productable {
 
    frac: math.Fraction | number[] | number[][] | math.Matrix;

    static max(a: Numeric, b: Numeric) {
        if (a["n"]/a["d"] > b["n"]/b["d"]) {
            return a;
        } else {
            return b;
        }
    }

    static fromNumber(num: number) {
        if (Math.round(num) === num) {
            return new Numeric(num, 1);
        } else {
            return new Numeric(num);
        }    
    }
 
    static fromFraction(a: number, b: number) {
        return new Numeric(a, b);
    }
  
    constructor(num: number, num2?: number) {
        if (num2) {
            this.frac = math.fraction(num, num2);
        } else {
            this.frac = math.fraction(num);
        }        
    }

    inverse(): Numeric {
        if (this.isZero()) {
            throw "Numeric:: Divide by zero";            
        } else {
            return new Numeric(this.frac["d"], this.frac["n"]);
        }
    }

    multiply(b: Numeric | Expression) {
        if (b instanceof Numeric) {
            const bnum = <Numeric> b;
            const product = math.multiply(this.frac, bnum.frac);
            return new Numeric(product["n"], product["d"]);
        } else {
            return b.multiply(this);
        }
    }    

    divide(b: Numeric): Numeric {
        return <Numeric> this.multiply(b.inverse());
    }

    is(n: number): boolean {
        return this.frac["n"] / this.frac["d"] === n;
    }

    isZero(): boolean {
        return this.is(0);
    }

    isOne(): boolean {
        return this.is(1);
    }

    isInt(): boolean {
        const r = this.frac["n"] / this.frac["d"];
        return Math.floor(r) === r;
    }

    isNegative(): boolean {
        return this.frac["n"] * this.frac["d"] < 0;
    }

    oposite() {
        return new Numeric(-this.frac["n"], this.frac["d"]);
    }

    add(n: Numeric) {
        const add = math.add(this.frac, n.frac);
        return new Numeric(add["n"], add["d"]);
    }

    substract(n: Numeric) {
        const sub = math.subtract(this.frac, n.frac);
        return new Numeric(sub["n"], sub["d"]);
    }

    power(n: Numeric) {
        
        let base = <Numeric> this;
        if (n.isNegative()) {
            base = base.inverse();
        }

        if (n.isZero()) {
            return Numeric.fromNumber(1);
        } else if (n.isOne()) {
            return base;
        } else if (n.isInt()) {
            const intv = n.frac["n"] / n.frac["d"];
            return new Numeric(Math.pow(base.frac["n"], intv), Math.pow(base.frac["d"], intv) );
        } else {
            // Power of rational exponent --> becomes a radical or its power representation
            return new Power(base, n);
        }
    }

    toString(): string {
        if (this.frac["d"] === 1) {
            return this.frac["n"];
        } else {
            return "\\frac{" + this.frac["n"] + "}{" + this.frac["d"] + "}";
        }
    }
}