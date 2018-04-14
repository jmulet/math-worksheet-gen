import { Power } from "./Power";
import { Fraction } from "./Fraction";
import { productExpression } from "../util/productExpression";
import { Arithmetics } from "./Arithmetics";
import { Monomial } from "./Monomial";
import { Numeric } from "./Numeric";

export class Radical {
    index: Monomial;
    constructor(index: number | Monomial, public radicand: Power) {                
        if (!index) {
            this.index = Monomial.fromNumber(1);
        } else if(typeof(index) === "number") {
            this.index = Monomial.fromNumber(index);
        } else {
            this.index = index;
        }
    }

    toPowerForm(): Power {
        return new Power(this.radicand.base, this.radicand.exponent.multiply(this.index.inverse()));
    }

    multiply(r2: Radical): Radical {
        const lcm = Arithmetics.lcm(this.index, r2.index);
        return new Radical(lcm, this.radicand.power().multiply(r2.radicand.power()));
    }

    divide(r2: Radical): Radical {
        return new Radical();
    }

    root(n: number): Radical {
        return new Radical(productExpression(this.index, n), this.radicand);
    }


    toString() {
        if (this.index==2) {
            return "\\sqrt{" + this.radicand.toString() + "}";
        } else {
            return "\\nroot[" + this.index + "]{" + this.radicand.toString() + "}";
        }
    }
}