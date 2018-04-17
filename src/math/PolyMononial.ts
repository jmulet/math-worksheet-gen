import {Expression} from './Expression';
import { Monomial } from './Monomial';
import { Numeric } from './Numeric';

export class PolyMononial extends Expression {
    
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
            return x.degree() - y.degree();
        });
        monomialsFound = null;
    }

    static add(m1: Monomial | PolyMononial, m2: Monomial | PolyMononial) : PolyMononial {
        let x1, x2;
        if (m1 instanceof PolyMononial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMononial) {
            x2 = m2.monomials;
        } else {
            x2 = [m2];
        }
        const monomials = [...x1, ...x2];
        return new PolyMononial(monomials);
    }

    static substract(m1: Monomial | Monomial[], m2: Monomial | Monomial[]): PolyMononial {
        let x1, x2;
        if (m1 instanceof PolyMononial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMononial) {
            x2 = (<PolyMononial> m2.oposite()).monomials;
        } else {
            x2 = [(<Monomial> m2).oposite()];
        }
        const monomials = <Monomial[]> [...x1, ...x2];
        return new PolyMononial(monomials);
    }

    static multiply(m1: Monomial | Monomial[], m2: Monomial | Monomial[]): PolyMononial {
        const products = <Monomial[]> [];
        let x1, x2;
        if (m1 instanceof PolyMononial) {
            x1 = m1.monomials;
        } else {
            x1 = [m1];
        }
        if (m2 instanceof PolyMononial) {
            x2 = m2.monomials;
        } else {
            x2 = [m2];
        }
        x1.forEach((term1) => {
            x2.forEach((term2) => {
                products.push(term1.multiply(term2));
            }
        })
        return new PolyMononial(products);
    }

    static power(m1: Monomial | Monomial[], n: number): PolyMononial {
        let pow = 

        return pow;
    }

    oposite() {
        const list = this.monomials.map( e => e.oposite() );
        return new PolyMononial(list);
    }

    degree() {
        const degrees = this.monomials.map( e => e.degree() );
        return Math.max(...degrees);
    }

    copy(): PolyMononial {
        const list = this.monomials.map( e=> e.copy() );
        return new PolyMononial(list);
    }
}