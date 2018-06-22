import { Formatter } from '../util/Formatter';
import { Random } from '../util/Random';
import { Giac } from './Giac';
import { Numeric } from './Numeric';
import { Polynomial } from './Polynomial'; 

export enum EQUATION_SYMBOLS {
    EQ = 0,
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
    if (!c.isNegative()) {
        str = "+";
    }
    str += c.toTeX();
    return str;
}


export class Equation {

    answers: any[];

    constructor(public rnd: Random, public bar="x", public lhs?: string, public rhs?, public symbol = EQUATION_SYMBOLS.EQ) {

    }
    // Polynomial equations ==================
    linealFromRoot(root: Numeric, complexity = 2) {
        this.polynomialFromRoots([root], 1, complexity);
    }

    quadraticFromRoots(roots: Numeric[], complexity = 2) {
        this.polynomialFromRoots(roots, 2, complexity);
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
        if (A !== 1) {
            Astr = A + "";
        }

        const Bsrt = stringify(B);
        let poly = new Polynomial([A, 0, B, 0, C]);
        if (complexity > 1) {
            const poly2 = this.rnd.polynomial({ maxDegree: 4 });
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

    polynomialFromRoots(roots: Numeric[], degree = 2, complexity = 1) {
        this.answers = roots;
        let poly = Polynomial.fromRoots(roots);

        if (roots.length < degree) {
            // Create a irreductible polynomial of second degree
            const b = this.rnd.intBetween(-5, 5);
            const c = Math.round(b * b / 4 + this.rnd.intBetween(2, 5));
            poly = poly.multiply(new Polynomial([1, b, c]));
        }
        if (complexity === 0) {
            //assume factorizable
            this.lhs = poly.toFactorForm();
            this.rhs = "0";
        } else if (complexity === 1) {
            //assume basic = 0
            this.lhs = poly.toTeX();
            this.rhs = "0";
        } else if (complexity > 1) {
            if (roots.length === 2 && degree === 2) {
               
                const dice = this.rnd.intBetween(0, 1);
                if (dice === 0) { 
                     // Crea una equació del tipo (x-a)^2 = b^2
                    let [r1, r2] = roots;
                    const beta = r1.substract(r2).divide(Numeric.fromNumber(2)).power(2);
                    const alpha = r1.add(r2).divide(Numeric.fromNumber(2));
                    const poly3 = new Polynomial([1, alpha.oposite()]);
                    this.lhs = "\\left(" + poly3.toTeX(this.bar) + "\\right)^2";
                    this.rhs = beta.toTeX(); 
                } else if (dice === 1) {
                    // Crea una equació del tipo Poly + x^2+2a+a^2 = (x+a)^2
                    const poly2 = this.rnd.polynomial({ minDegree: 1, maxDegree: 1 });
                    const poly3 = poly2.power(2);
                    this.lhs = poly.add(poly3).toTeX(this.bar);
                    this.rhs = "\\left(" + poly2.toTeX(this.bar) + "\\right)^2";     
                }

            } else {
                const poly2 = this.rnd.polynomial({ minDegree: 1, maxDegree: 1 });
                // make sure that the last coef is not zero
                const cfs = poly2.coefs;
                cfs[cfs.length - 1] = this.rnd.numericBetweenNotZero(-10, 10);

                const poly3 = poly2.power(2);
                this.lhs = poly.add(poly3).toTeX(this.bar);
                this.rhs = "\\left(" + poly2.toTeX(this.bar) + "\\right)^2";
            }
        }
    };

    // Rational equations =====================
    rational(r = 10, complexity = 1) {
        if (complexity < 1) {
            complexity = 1;
        }
        // Generate roots
        const numRoots = this.rnd.numericList(complexity + 1, r); 
        let denExpr;
        let denRoots: Numeric[];
        const coin = this.rnd.intBetween(0, 2);
        if (coin === 0) {
            denRoots = this.rnd.numericList(2, 4); 
            denExpr = Polynomial.fromRoots(denRoots).toString();
        } else if (coin === 1) {
            denRoots = this.rnd.numericList(complexity, 4); 
            denExpr = Polynomial.fromRoots(denRoots).toString();
        } else {
            denRoots = [this.rnd.numericBetween(-2 , 2)]; 
            const n = this.rnd.numericBetween(1, 4);
            denExpr = Polynomial.fromRoots(denRoots).toString()+"*(x**2 + " + n + ")";
        }     

        // Remove numRoots that are in denRoots (since zeroes the denominator)
        denRoots.forEach( (e) => {
            const found = numRoots.filter((n)=> {
                return n.isEqual(e);
            });
            found.forEach( (f) => {
                numRoots.splice(numRoots.indexOf(f), 1);
            });
        });  

        if (numRoots.length === 0) {
            return this.rational(r, complexity);
        }
       
        // Generate polynomials
        const numPoly = Polynomial.fromRoots(numRoots);
        // Convert rational fraction to partial fractions expression:
        this.lhs = Giac.evaluate("latex(partfrac(("+ numPoly.toString()+")/(" + denExpr + ")))").replace(/"/g,"").replace(/\\frac/g, '\\dfrac');
        this.rhs = "0";
        this.answers = numRoots;
    }

    // irrational equations ======================
    irrational(r = 10, complexity = 1) {
        if (complexity <= 1) {
            const cas = this.rnd.intBetween(0, 1);
            const a = this.rnd.intBetweenNotZero(-r, r);
            const b = this.rnd.intBetweenNotZero(-r, r);
            let c = this.rnd.intBetweenNotZero(-r, r);
            if (cas === 0) {
                c = Math.abs(c);
                this.lhs = "\\sqrt{" + Formatter.numericXstringTeX(false, Numeric.fromNumber(a), this.bar) + Formatter.append(b) + "} ";
                this.rhs = c + "";
                const num = c * c - b;
                this.answers = []
                if (c >= 0) {
                    const root = Numeric.fromFraction(num, a);
                    this.answers.push(root);
                }
            } else {
                const sigma = 2 * this.rnd.intBetween(2, 5) - 1;  //random odd number
                const delta = Numeric.fromFraction(sigma * sigma - 1, 4);
                const b = Numeric.fromNumber(a).add(delta);
                this.lhs = "\\sqrt{" + this.bar + Formatter.append(-a) + "} ";
                this.rhs = this.bar + Formatter.append(b.oposite());
                const root = Numeric.fromFraction(1 + sigma, 2).add(b);
                this.answers = [root]
            }
        } else if (complexity >= 2) {
            const cas = this.rnd.intBetween(0, 2);

            let a = this.rnd.intBetweenNotZero(-r, r);
            let b = this.rnd.intBetweenNotZero(-r, r);
            let c = this.rnd.intBetweenNotZero(-r, r);
            if (cas === 0) {
                this.lhs = "\\sqrt{" + this.bar + Formatter.append(-a) + "} " + Formatter.append(b);
                this.rhs = "\\sqrt{" + this.bar + Formatter.append(-c) + "}";
                const num = Math.pow(c + b * b - a, 2);
                const root = Numeric.fromNumber(a).add(Numeric.fromFraction(num, 4 * b * b));
                this.answers = [root];
            } else if (cas === 1) {
                c = Math.abs(c);
                this.lhs = "\\sqrt{("+ this.bar + Formatter.append(-a) + ")^2 + (" + this.bar + Formatter.append(-b) + ")^2} ";
                this.rhs = c + "";
                const plainEqn = "sqrt(x-("+a+")**2 + (x-("+b+"))**2) = " + c;
                this.answers = [Giac.evaluate("latex(solve(" + plainEqn + "))").replace(/"/g, "").replace(/,/g, ";")];
            } else if (cas === 2) {
                a = this.rnd.intBetween(-r, -1);
                b = a + this.rnd.intBetween(-r, -1);
                c = Math.round(Math.sqrt(a - b)) + this.rnd.intBetween(1, r);
                this.lhs = "\\sqrt{" + this.bar + Formatter.append(-a) + "} " + " + \\sqrt{" + this.bar + Formatter.append(-b) + "} ";
                this.rhs = c + "";
                const num = a * a - 2 * a * b + 2 * a * c * c + b * b + 2 * b * c * c + c * c * c * c;
                const root = Numeric.fromFraction(num, 4 * c * c);
                this.answers = [root]
            }
        }
    }

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
        if ((this.answers || []).length === 0) {
            return "Cap solució";
        }
        return this.answers.map(e => {
            let e2: any = e;
            if (e2.toTeX) {
                e2 = e2.toTeX();
            }
            return "$x=" + e2 + "$";
        }).filter((item, pos, self) => self.indexOf(item) == pos).join("; ");
    }

}