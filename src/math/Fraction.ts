/*
import { Monomial } from "./Monomial";
import { productExpression, performPower } from "../util/productUtil";
import { Productable } from "./Productable";

export class Fraction implements Productable {
    constructor(private num: Monomial | number | Fraction, private den: Monomial| number | Fraction) {
        if (!den) {
            this.den = 1;
        }
        if (num instanceof Fraction) {
            const fracNum = <Fraction> num;
            if (den instanceof Fraction) {
                const fracDen = <Fraction> den;                
                this.num = productExpression(fracNum.num, fracDen.den);
                this.den = productExpression(fracNum.den, fracDen.num);
            } else if (den instanceof Monomial){
                this.num = fracNum.num;
                this.den = productExpression(fracNum.den, this.den);
            } else {

            }
        }
    }

    inverse() {
        return new Fraction(this.den, this.num);
    }

    divide(f: Fraction) {
        return new Fraction(this, f);
    }

    multiply(f: Fraction) {
        return new Fraction(this, f.inverse());
    }

    times(n: number) {
        return this.multiply(new Fraction(n, 1));
    }

    power(n: number) {
        return new Fraction(performPower(this.num, n), performPower(this.den, n));
    }

    toString(): string {
        if(this.den === 1) {
            return this.num + "";
        } else {
            return "\\frac{" + this.num.toString() + "}{" + this.den.toString() + "}";
        }
    }
}

*/
