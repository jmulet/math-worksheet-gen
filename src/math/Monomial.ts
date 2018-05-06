import { Polynomial } from "./Polynomial";
import { Power } from "./Power";  
import { Expression } from "./Expression";
import { Numeric } from "./Numeric";
import { Literal } from "./Literal";

export class Monomial extends Expression {
    
    literals: Literal[];
    coef: Numeric;

    static fromNumber(num: number) {
        return new Monomial(Numeric.fromNumber(num), []);
    }
    
    static fromNumeric(numeric: Numeric) {
        return new Monomial(numeric, []);
    }

    static One(): Monomial {
        return new Monomial(Numeric.fromNumber(1), []);
    }

    /*
    static parse(str: string): Monomial {
    }
    */

    /** Two monomials are equivalent if they have the same literal part
     * including exponents as well xy is equivalent to 2xy but not 2xy².
     * Assume that Literals are sorted and reduced
     */
    static equivalent(m1: Monomial, m2: Monomial): boolean {
        if (m1.literals.length !== m2.literals.length) {
            return false;
        }
        for (var i = 0; i < m1.literals.length; i++) {
            const l1 = m1.literals[i];
            const l2 = m2.literals[i];
            if (l1.symbol!==l2.symbol || l1.exponent !== l2.exponent) {
                return false;
            }
        }
        return true;
    }

    constructor(coef: Numeric | number, literals: Literal[] | string) {
        super();
        if (typeof(coef) === "number") {
            coef = Numeric.fromNumber(coef);
        }
        if (typeof(literals) === "string") {
            literals = [
                new Literal(literals, 1)
            ]
        } 
        this.coef = coef;
        this.literals = literals || [];
        this.reduceLiterals();
    }

    // Literals which have the same symbol can be merged into one by adding exponents
    // Eliminate those which are to 0 power. Negative power is accepted, meaning 1/...
    reduceLiterals() {
        let symbolsFound = <{[key:string]: Literal}> {}; 
        const newLiterals = [];
        this.literals.forEach( (literal, pos) => {
            // First instance
            if (Object.keys(symbolsFound).indexOf(literal.symbol) < 0) {
                const obj = literal.copy();
                symbolsFound[literal.symbol] = obj;
                newLiterals.push(obj);
            } else {
                symbolsFound[literal.symbol].exponent += literal.exponent;
            }
        });
        // get rid of 0 exponents
        this.literals = newLiterals.filter( (e) => e.exponent!==0 );
        // sort by symbol
        this.literals = this.literals.sort( (x, y) => {
            return x.symbol.localeCompare(y.symbol);
        });
        symbolsFound = null;
    }

    oposite(): Monomial {
        const clone = this.copy();
        clone.coef = clone.coef.oposite();
        return clone;
    }

    multiply(m2: Monomial): Monomial {
        const literals2 = [...this.literals, ...m2.literals];
        return new Monomial(<Numeric> this.coef.multiply(m2.coef), literals2);
    }

    inverse(): Monomial {
        const literals2 = this.literals.map( e => {
            const e2 = e.copy();
            e2.exponent = -e.exponent;
            return e2;
        });
        return new Monomial(<Numeric> this.coef.inverse(), literals2);
    }

    divide(m2: Monomial): Monomial {
       return this.multiply(m2.inverse());
    }

    power(n: number): Monomial {
        const literals2 = this.literals.map( e => {
            const e2 = e.copy();
            e2.exponent = e.exponent * n;
            return e2;
        });
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

    copy(): Monomial {
        const literalsCopy = this.literals.map( e => e.copy() );
        return new Monomial(this.coef.copy(), literalsCopy);
    }

    degree(): number {
        let deg = 0;
        if(this.literals.length===0) {
            return 0;
        }
        this.literals.forEach( (x) => deg += x.degree());
        return deg;
    }

    literalsToString() {
        return this.literals.map( e => e.toString() ).join(" ");
    }

    literalsToTeX() {
        return this.literals.map( e => e.toTeX() ).join(" ");
    }

    toString(): string {
        const literalPart = this.literalsToString();
        if (this.coef.isZero()) {
            return "0";
        } else if (this.coef.is(-1)) {
            return "-" + (literalPart.trim() || 1);
        } else if (this.coef.is(1)) {
            return literalPart.trim() || "1";
        } else {
            return this.coef.toString() + "*" + literalPart;
        }
    }

    toTeX(): string {
        const literalPart = this.literalsToTeX();
        if (this.coef.isZero()) {
            return "0";
        } else if (this.coef.is(-1)) {
            return "-" + (literalPart.trim() || 1);
        } else if (this.coef.is(1)) {
            return literalPart.trim() || "1";
        } else {
            return this.coef.toTeX({factorizeAbove: 150}) + " " + literalPart;
        }
    }
}