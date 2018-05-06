
export class Literal {
    constructor(public symbol: string, public exponent: number) {        
    }
    static equivalent(l1: Literal, l2: Literal): boolean {
        return l1.symbol === l2.symbol;
    }
    degree() {
        return this.exponent;
    }
    copy() {
        return new Literal(this.symbol, this.exponent);
    }
    toString(): string {
        if (this.exponent === 0) {
            return "1";
        } else if(this.exponent === 1) {
            return this.symbol;
        } else if(this.exponent > 1) {
            return this.symbol + "^{" + this.exponent + "} ";
        } else {
            const exponentAbs = Math.abs(this.exponent);
            return "1/" + this.symbol + (exponentAbs!==1? ("^{" + exponentAbs + "} "):"");
        }        
    }
    toTeX(): string {
        if (this.exponent === 0) {
            return "1";
        } else if(this.exponent === 1) {
            return this.symbol;
        } else if(this.exponent > 1) {
            return this.symbol + "^{" + this.exponent + "}";
        } else {
            return "\\frac{1}{" + this.symbol + "^{" + Math.abs(this.exponent) + "}}";
        }        
    }
}