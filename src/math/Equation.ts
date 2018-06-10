import { Interval } from "./Interval";
import { Numeric } from "./Numeric";
import { Giac } from "./Giac";
import { Intervals } from "./Intervals"; 
import { RSA_SSLV23_PADDING } from "constants";
import { Polynomial } from "./Polynomial";
import { Random } from "../util/Random";

export enum EQUATION_SYMBOLS {
    EQ  = 0,
    LT = 1,
    GT = 2,
    LEQ = 3,
    GEQ = 4
}

function stringify(c: Numeric): string {
    let str = "";
    if (c.isZero()) {
        return "";
    } 
    if(!c.isNegative()) {
        str = "+";
    }
    str += c.toTeX();
    return str;
}


export class Equation {
    
    answers: any[];

    constructor(public rnd: Random, public lhs?: string, public rhs?, public symbol = EQUATION_SYMBOLS.EQ) {

    }
    // Polynomial equations ==================
    linealFromRoot(root: Numeric, complexity = 2){
        this.polynomialFromRoots(root, 1, complexity);
    }

    quadraticFromRoots(roots: Numeric[], complexity = 2) {
        this.polynomialFromRoots(roots, 2, complexity);
    };

    factorizableFromRoots(roots: Numeric[]){
        this.lhs = "";
        const z = roots.map( e => {
            if (e.isZero()) {
                return "x";
            } else {
                let sign = "";
                const e2 = e.oposite();
                if(!e2.isNegative()) {
                    sign = "+";
                }
                let deno = "";
                if (e2.Re["d"] > 1) {
                    deno = e2.Re["d"];
                }
                return "( "+ deno +" x" + sign + e2.Re["n"] + ")";
            }
        }).join("\\cdot ");

        this.rhs = "0";
        this.answers = roots;
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
        const lcm = parseInt(Giac.lcm(B.Re["d"], C.Re["d"]));
        if (lcm > 1) {
            A = lcm;
            B = B.multiply(Numeric.fromNumber(lcm));
            C = C.multiply(Numeric.fromNumber(lcm));
        }
        let Astr = "";
        if (A!==1) {
            Astr = A + "";
        }
        
        const Bsrt = stringify(B);
        let poly = new Polynomial([A, 0, B, 0, C]);
        if (complexity > 1) {
            const poly2 = this.rnd.polynomial({maxDegree: 4});
            poly = poly.add(poly2);
            this.rhs = poly2.toTeX(); 
        } else {
            this.rhs = "0"; 
        }
        this.lhs = poly.toTeX();
       

        this.answers = [];
        if (!r1.isNegative()) {
            this.answers.push(-Math.sqrt(r1.toNumber()));
            this.answers.push(Math.sqrt(r1.toNumber()));
        }
        if (!r2.isNegative()) {
            this.answers.push(-Math.sqrt(r2.toNumber()));
            this.answers.push(Math.sqrt(r2.toNumber()));
        }
    };

    polynomialFromRoots(roots, degree = 2, complexity = 0) {        
        this.lhs = "";
        this.rhs = "";
    };

    // Rational equations =====================

    // Radical equations ======================

    // Exponential equations ==================

    // Logarithmic equations ==================

    // Trigonometric equations ================


    toString() {
        return this.lhs + " = " + this.rhs;
    }

    toTeX() {
        return this.lhs + " =" + this.rhs;
    }
  
    solutionsTeX(): string {
        if (this.answers.length === 0) {
            return "Cap solució";
        }
        return this.answers.map(e => {
            let e2: any = e;
            if (e2.toTeX) {
                e2 = e2.toTeX();
            }
            return "$x=" + e2 + "$";
        } ).filter((item, pos, self) => self.indexOf(item) == pos).join("; ");
    }

}