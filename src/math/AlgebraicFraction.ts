import { Polynomial } from "./Polynomial";
import { Numeric } from "./Numeric";
import { RandomSeed } from "random-seed"; 
import { Giac } from "./Giac";
import { PolyMonomial } from "./PolyMonomial";
/**
 * We define an algebraic fraction as the quotient of two Polynomials
 */
export class AlgebraicFraction {

    polyDen: Polynomial | PolyMonomial;
    polyNum: Polynomial | PolyMonomial;
    /**
     * Converts the string into a Fraction object by
     * splitting the str by the  /  symbol and parsing
     * each polynomial indepently
     * @param str string to be parsed
     */
    static parse(str: string): AlgebraicFraction {
       return Giac.parseAlgebraicFraction(str);
    }

    constructor(polyNum: Polynomial | PolyMonomial | (number | Numeric)[], polyDen: Polynomial | PolyMonomial | (number | Numeric)[]) {   
        if (Array.isArray(polyNum)) {
            const coefs = <Numeric[]> polyNum.map( (e) => {
                if (e instanceof Numeric) {
                    return e;
                } else if (typeof(e)==='number') {
                    return Numeric.fromNumber(e);
                }
            });
            this.polyNum = new Polynomial(coefs);
        } else {
            this.polyNum = polyNum;
        }   

        if (Array.isArray(polyDen)) {
            const coefs = <Numeric[]> polyDen.map( (e) => {
                if (e instanceof Numeric) {
                    return e;
                } else if (typeof(e)==='number') {
                    return Numeric.fromNumber(e);
                }
            });
            this.polyDen = new Polynomial(coefs);
        } else {
            this.polyDen = polyDen;
        }            
    }

    simplified(): AlgebraicFraction {
        const res = Giac.simplify(this.toString(), AlgebraicFraction);  
        return res;
    }

    isPolynomial(): boolean {
        const fraction = this.simplified();
        return fraction.polyDen.degree() === 0;
    }

    isFraction(): boolean {
        return !this.isPolynomial;
    }

    toString(bar='x'): string {
        const num = this.polyNum.toString(bar);
        const den = this.polyDen.toString(bar);
        if (num === '0') {
            return num;
        }
        if (den === '1') {
            return num;
        }
        return "(" + num + ")/(" + den + ")";
    }

    toTeX(bar='x'): string {
        const num = this.polyNum.toTeX(bar);
        const den = this.polyDen.toTeX(bar);
        if (num === '0') {
            return num;
        }
        if (den === '1') {
            return num;
        }
        return "\\dfrac{" + num + "}{" + den + "}";
    }
}