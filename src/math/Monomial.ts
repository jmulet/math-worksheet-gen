import { Polynomial } from "./Polynomial";
import { Power } from "./Power"; 
import { Fraction } from "./Fraction";
import { Expression } from "./Expression";
import { Numeric } from "./Numeric";


export class Monomial extends Expression {
    
    static fromNumber(num: number) {
        return new Monomial(Numeric.fromNumber(num), []);
    }
    
    static fromNumeric(numeric: Numeric) {
        return new Monomial(numeric, []);
    }

    constructor(public coef: Numeric, public literals: Power[]) {
        super();
        this.literals = Power.reduceProduct(this.literals)
    }

    multiply(m2: Monomial): Monomial {
        const literals2 = Power.reduceProduct([...this.literals, ...m2.literals]);
        return new Monomial(<Numeric> this.coef.multiply(m2.coef), literals2);
    }

    power(n: number): Monomial {
        const literals2 = this.literals.map( e => {
            const literal = new Power(e.base, <Monomial> e.exponent.multiply(Monomial.fromNumber(n)));
            return literal;
        })
        return new Monomial(<Numeric> this.coef.power(Numeric.fromNumber(n)), literals2);
    }

    is(n: number): boolean {
        return this.coef.is(n) && this.literals.length === 0;
    }

    isOne(): boolean {
        return this.is(1);
    }

    isZero(): boolean {
        return this.is(0);
    }

    isPositiveNumber(): boolean {
        return this.coef.isInt() && !this.coef.isNegative() && this.literals.length === 0;
    }

    toString(): string {
        const literalPart = this.literals.map( power => power.toString() ).join(" ");
        if (this.coef.isZero()) {
            return "0";
        } else if (this.coef.is(-1)) {
            return "-" + (literalPart.trim() || 1);
        } else if (this.coef.is(1)) {
            return literalPart.trim() || "1";
        } else {
            return this.coef.toString() + " " + literalPart;
        }
    }
}