import { Interval } from "./Intervals";
import { Numeric } from "./Numeric";
import { Giac } from "./Giac";
import { Polynomial } from "./Polynomial";
import { Random } from "../util/Random";

export enum EQUATION_SYMBOLS {
    eq  = 0,
    lt = 1,
    gt = 2,
    leq = 3,
    geq = 4
}

export class Equation {
    
    answers: Interval[];

    constructor(public lhs?: string, public rhs?, public symbol = EQUATION_SYMBOLS.eq) {
    }

    // Polynomial equations ==================

    linealFromRoot(root: Numeric, complexity = 2){
        this.polynomialFromRoots(root, 1, complexity);
    }

    quadraticFromRoots(roots: Numeric[], complexity = 2) {
        this.polynomialFromRoots(roots, 2, complexity);
    };

    factorizableFromRoots(roots){
        
    };

    biquadraticFromQuadraticRoots(roots: Numeric[], complexity = 1) {
        if (roots.length !== 2) {
            throw new Error("Equation:: Expecting two roots in biquadraticFromQuadraticRoots")
        }
        const [r1, r2] = roots;
        let A = 1;
        let B = r1.add(r2).oposite();
        let C = r1.multiply(r2);
        // Get rid of possible denominators
        const lcm = parseInt(Giac.lcm(B["d"], C["d"]));
        if (lcm > 1) {
            A = lcm;
            B = B.multiply(Numeric.fromNumber(lcm));
            C = C.multiply(Numeric.fromNumber(lcm));
        }
        this.lhs = "";
        this.rhs = "";
    };

    polynomialFromRoots(roots, rnd: Random, degree = 2, complexity = 0) {        
       
        const poly1 = Polynomial.fromRoots(roots);
        this.lhs = poly1.toTeX();
        this.rhs = "0";

        if (degree === 1) {
            switch(complexity) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;    
            }
        } else if (degree === 2) {
            switch(complexity) {
                case 0:
                    const poly1 = Polynomial.fromRoots(roots);
                    this.lhs = poly1.toTeX();
                    this.rhs = "0";
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;    
            }
        } else if (degree === 3) {
            switch(complexity) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;    
            }
        } else if (degree ===4) {
            switch(complexity) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;    
            }
        } else {
            let poly2;
            switch(complexity) {
                case 0:                   
                    this.lhs = poly1.toFactorForm();
                    this.rhs = "0";
                    break;
                case 1:
                    this.lhs = poly1.toTeX();
                    this.rhs = "0";            
                    break;
                case 2:
                    poly2 = rnd.polynomial({maxDegree: degree, domain: 'Z'});
                    this.lhs = poly1.add(poly2).toTeX();
                    this.rhs = poly2.toTeX();            
                    break; 
                case 3:
                    poly2 = rnd.polynomial({maxDegree: degree, domain: 'Q'});
                    this.lhs = poly1.add(poly2).toTeX();
                    this.rhs = poly2.toTeX();    
                    break;  
                case 4:
                    poly2 = rnd.polynomial({maxDegree: degree, domain: 'Q'});
                    this.lhs = poly1.add(poly2).toTeX();
                    this.rhs = poly2.toTeX();    
                    break;    
            }
        }
    };

    // Rational equations =====================

    // Radical equations ======================

    // Exponential equations ==================

    // Logarithmic equations ==================

    // Trigonometric equations ================


    toString() {
        return this.lhs + " " + this.symbol + " " + this.rhs;
    }

    toTeX() {
        return this.lhs + " " + this.symbol + " " + this.rhs;
    }

    solutions(): Interval[] {
        if (this.symbol === EQUATION_SYMBOLS.eq)  {
            // Equation

        } else {
            // Innequation

        }
        return this.answers;
    }

    solutionsTeX(): string {
        return "todo";
    }

}