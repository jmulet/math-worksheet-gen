import { Polynomial } from "./Polynomial";
import { Power } from "./Power";  
import { Expression } from "./Expression";
import { Numeric } from "./Numeric";

export class Literal {
    constructor(public symbol: string, public exponent: number) {        
    }
    static equivalent(l1: Literal, l2: Literal): boolean {
        return l1.symbol === l2.symbol;
    }

    copy() {
        return new Literal(this.symbol, this.exponent);
    }
    toString(): string {
        if (this.exponent === 0) {
            return "1";
        } else if(this.exponent > 0) {
            return this.symbol + "^{" + this.exponent + "}";
        } else {
            return "\\frac{1}{" + this.symbol + "^{" + Math.abs(this.exponent) + "}}";
        }        
    }
}


export class Monomial extends Expression {
    
    literals: Literal[];
    coef: Numeric;

    static fromNumber(num: number) {
        return new Monomial(Numeric.fromNumber(num), []);
    }
    
    static fromNumeric(numeric: Numeric) {
        return new Monomial(numeric, []);
    }

    static equivalent(m1: Monomial, m2: Monomial): boolean {
        const s1 = m1.literals.map(e=>e.symbol).sort();
        const s2 = m2.literals.map(e=>e.symbol).sort();
    }

    static add(m1: Monomial | Monomial[], m2: Monomial | Monomial[]) : Monomial[] {
        const addition = <Monomial[]> [];

        return addition;
    }

    static substract(m1: Monomial | Monomial[], m2: Monomial | Monomial[]) : Monomial[] {
        const sub = <Monomial[]> [];

        return sub;
    }

    static multiply(m1: Monomial | Monomial[], m2: Monomial | Monomial[]) : Monomial[] {
        const product = <Monomial[]> [];

        return product;
    }

    static power(m1: Monomial | Monomial[], n: number) : Monomial[] {
        const pow = <Monomial[]> [];

        return pow;
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
        this.literals = literals;
        this.reduceLiterals()
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
        this.literals = newLiterals.filter( (e) => e.exponent!==0 );
        symbolsFound = null;
    }

    multiply(m2: Monomial): Monomial {
        const literals2 = [...this.literals, ...m2.literals];
        return new Monomial(<Numeric> this.coef.multiply(m2.coef), literals2);
    }

    inverse(): Monomial {
        const literals2 = this.literals.map( e => {
            const e2 = e.copy();
            e2.exponent = - e.exponent;
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

    toString(): string {
        const literalPart = this.literals.map( e => e.toString() ).join(" ");
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