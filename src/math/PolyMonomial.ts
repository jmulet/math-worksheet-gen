import {Expression} from './Expression';
import { Monomial } from './Monomial';
import { Numeric } from './Numeric'; 
import { Literal } from './Literal';

export class PolyMonomial extends Expression {
    
    static fromCoefs(coefficients: Numeric[], symbol: string): PolyMonomial {
        const n = coefficients.length - 1;
        const monomials = coefficients.map( (coef, i) =>  new Monomial(coef, [new Literal(symbol, n-i)] ) );
        return new PolyMonomial(monomials);
    }

    static fromNumber(num: number): PolyMonomial {
        return new PolyMonomial([Monomial.fromNumber(num)]);
    }

    static fromNumeric(num: Numeric): PolyMonomial {
        return new PolyMonomial([Monomial.fromNumeric(num)]);
    }

    static fromMonomial(mono: Monomial): PolyMonomial {
        return new PolyMonomial([mono]);
    }

 
    static add(m1: Monomial | PolyMonomial, m2: Monomial | PolyMonomial) : PolyMonomial {
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        } else {
            x2 = [m2];
        }
        const monomials = [...x1, ...x2];
        return new PolyMonomial(monomials);
    }

    static substract(m1: Monomial |PolyMonomial, m2: Monomial | PolyMonomial): PolyMonomial {
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = (<PolyMonomial> m2.oposite()).monomials;
        } else {
            x2 = [(<Monomial> m2).oposite()];
        }
        const monomials = <Monomial[]> [...x1, ...x2];
        return new PolyMonomial(monomials);
    }

    static multiply(m1: Monomial | PolyMonomial, m2: Monomial | PolyMonomial): PolyMonomial {
        const products = <Monomial[]> [];
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        } else {
            x2 = [m2];
        }
        x1.forEach((term1) => {
            x2.forEach((term2) => {
                products.push(term1.multiply(term2));
            });
        });
        return new PolyMonomial(products);
    }


    static divide(m1: Monomial | PolyMonomial, m2: Monomial): PolyMonomial {
        const products = <Monomial[]> [];
        let x1, x2;
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMonomial) {
            x2 = m2.monomials;
        } else {
            x2 = [m2];
        }
        x1.forEach((term1) => {
            x2.forEach((term2) => {
                products.push(term1.multiply(term2));
            });
        });
        return new PolyMonomial(products);
    }

    static One(): PolyMonomial {
        return new PolyMonomial([Monomial.One()]);
    }

    static power(m1: Monomial | PolyMonomial, n: number): PolyMonomial {
        let x1: Monomial[];
        if (m1 instanceof PolyMonomial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (n===0) {
            return PolyMonomial.One();
        } else if (n===1) {
            return new PolyMonomial(x1);
        }
        const p = new PolyMonomial(x1);
        let pow = p;
        for(var i=0; i < n-1; i++) {
            pow = PolyMonomial.multiply(pow, p);
        }
        return pow;
    }

    constructor(public monomials: Monomial[]) {
        super();
        this.reduceMonomials();
    }

    /** 
     * Monomials having the same literal part are merged into one
     * by adding its coefficients. 
     */
    reduceMonomials() {
        let monomialsFound = <{[key:string]: Monomial}> {}; 
        const newMonomials = <Monomial[]> [];
        this.monomials.forEach( (mono, pos) => {
            // First instance
            const key = mono.literalsToString()
            if (Object.keys(monomialsFound).indexOf(key) < 0) {
                const obj = mono.copy();
                monomialsFound[key] = obj;
                newMonomials.push(obj);
            } else {
                monomialsFound[key].coef = monomialsFound[key].coef.add(mono.coef)
            }
        });
        // get rid of 0 coefficients
        this.monomials = newMonomials.filter( (e) => !e.coef.isZero() );
        // sort by degree
        this.monomials = this.monomials.sort( (x, y) => {
            return y.degree() - x.degree();
        });
        monomialsFound = null;
    }

    oposite() {
        const list = this.monomials.map( e => e.oposite() );
        return new PolyMonomial(list);
    }

    degree() {
        const degrees = this.monomials.map( e => e.degree() );
        return Math.max(...degrees);
    }

    copy(): PolyMonomial {
        const list = this.monomials.map( e=> e.copy() );
        return new PolyMonomial(list);
    }

    toString(bar?: string) {
        return this.monomials.map( (e, i) => {
            let str = "";
            if (!e.coef.isNegative() && i > 0) {
                str += "+";
            }
            str += e.toString();
            return str;
        }).join(" ");
    }

    toTeX(bar?: string) {
        const str = this.monomials.map( (e, i) => {
            let str = "";
            if (!e.coef.isNegative() && i > 0) {
                str += "+";
            }
            str += e.toTeX();
            return str;
        }).join(" ").trim();
        if(!str) {
            return "0";
        }
        return str;
    }
}