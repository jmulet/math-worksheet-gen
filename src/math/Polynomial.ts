import { Expression } from "./Expression";
import { Numeric } from "./Numeric";
import * as math from "mathjs";

export class Polynomial extends Expression {
    coefs: Numeric[];

    // Constructs the polynomial given all complex roots
    static fromRoots(roots: Numeric[]): Polynomial {
        const binomials = roots.map( (e) => {
            let coef1 = 1;
            let coef2 = e.oposite();
            if(coef2.Re["d"] > 1) {
                coef1 = coef2.Re["d"];
                coef2 = coef2.multiply(Numeric.fromNumber(coef1));
            }
            return new Polynomial([coef1, coef2]);
        });
        let poly = binomials[0];
        for(var i=0; i<binomials.length; i++) {
            poly = poly.multiply(binomials[i]);
        }
        return poly;
    }

    constructor(coefs?: (number | Numeric | string)[]) {
        super();
      
        this.coefs = (coefs || []).map((e) => {
            if (e instanceof Numeric) {
                return e;
            } else if (typeof (e) === "string") {
                const frac = math.fraction(e);
                return new Numeric(frac["n"], frac["d"]);
            } else if (typeof (e) === "number") {
                return new Numeric(e);
            }
        });
        //Must cleanup coefficients in order to remove trailing zeros otherwise
        //degree would be wrong
        while (this.coefs.length > 1 && this.coefs[0].isZero()) {
            this.coefs.splice(0, 1);
        }
       
    }

    degree(): number {
        return this.coefs.length - 1;
    }

    /**
     * Converts a monomial c x^dg to a polinomial object
     * @param {type} c
     * @param {type} dg
     * @returns {rgen-algebra_L1.Poly}
     */
    static monomial(coef: Numeric, degree: number) {
        var result = new Array<Numeric>(degree + 1);
        result[0] = coef;
        for (var i = 1; i < degree + 1; i++) {
            result[i] = Numeric.fromNumber(0);
        }
        return new Polynomial(result);
    };

    multiply(p2: Polynomial): Polynomial {
        let c2: Numeric[] = p2.coefs;
        const productdg = this.coefs.length + c2.length - 2;
        const product = new Array<Numeric>(productdg + 1);
        for (let i = 0; i < product.length; i++) {
            product[i] = Numeric.fromNumber(0);
        }

        for (let i = 0; i < c2.length; i++) {
            for (let k = 0; k < this.coefs.length; k++) {
                product[i + k] = product[i + k].add(<Numeric>this.coefs[k].multiply(c2[i]));
            }
        };
        return new Polynomial(product);
    }

    add(p2: Polynomial): Polynomial {
        let c2: Numeric[] = p2.coefs;
        const l1 = this.coefs.length;
        const l2 = c2.length;
        const result = new Array<Numeric>(Math.max(l1, l2));

        for (let i = 0; i < result.length; i++) {
            const v1 = l1 - i - 1 >= 0 ? this.coefs[l1 - i - 1] : Numeric.fromNumber(0);
            const v2 = l2 - i - 1 >= 0 ? c2[l2 - i - 1] : Numeric.fromNumber(0);
            result[result.length - i - 1] = v1.add(v2);
        }

        return new Polynomial(result);
    }

    substract(p2: Polynomial) {
        const p2minus = new Polynomial(p2.coefs.map(e => e.oposite()));
        return this.add(p2minus);
    }

    divide(p2: Polynomial): { quotient: Polynomial, remainder: Polynomial } {
        const c2 = p2.coefs;
        const l1 = this.coefs.length;
        const l2 = c2.length;
        if (l1 < l2) {
            return { quotient: new Polynomial([0]), remainder: this };
        }
        else {
            let quo = new Polynomial([0]);
            let remainder = <Polynomial> this;
            while (remainder.degree() >= p2.degree()) {
                const step = Polynomial._divide(remainder, p2);
                quo = quo.add(step.q);
                remainder = step.r;
            };
            return { quotient: quo, remainder: remainder };
        }

    }

    /**
     * One step division
     * @param {type} p1
     * @param {type} c2
     * @param {type} indx
     * @returns {Poly._divide.productAnonym$2}
     */
    private static _divide(p1: Polynomial, p2: Polynomial) {
        const q: Numeric = p1.coefs[0].divide(p2.coefs[0]);
        const n = p1.degree() - p2.degree();
        const quocient = Polynomial.monomial(q, n);
        const remainder = p1.substract(p2.multiply(quocient));
        return { q: quocient, r: remainder };
    }


    power(n: number): Polynomial {
        if (n === 0) {
            return new Polynomial([1]);
        }
        else if (n === 1) {
            return <Polynomial> this;
        }
        else {
            let pow = <Polynomial> this;
            for (let i = 1; i < n; i++) {
                pow = pow.multiply(this);
            }
            return pow;
        }
    }

    derive() {
        if (this.degree() <= 0) {
            return new Polynomial([0]);
        }

        const deriv = new Array<Numeric>(this.coefs.length - 1);
        for (let i = 0; i < this.coefs.length - 1; i++) {
            const n = this.coefs.length - i;
            deriv[i] = <Numeric> this.coefs[i].multiply(Numeric.fromNumber(n));
        }

        return new Polynomial(deriv);
    }


    integrate(cte: number | Numeric | string) {
        if (!cte) {
            cte = 0;
        }

        const integral = new Array<number | Numeric | string>(this.coefs.length + 1);
        for (let i = 0; i < this.coefs.length; i++) {
            const n = this.coefs.length - i;
            integral[i] = <Numeric> this.coefs[i].multiply(new Numeric(1, n + 1));
        }
        integral[integral.length - 1] = cte;

        return new Polynomial(integral);
    }


    toString(bar?: string): string  {
        const degree = this.degree();
        const withPowers = this.coefs.map((coef, i) => {
            const expd = degree - i;
            if (!coef.isZero())  {
                let num = "" + coef.toTeX();                 
                if (coef.isOne() && i !== degree) {
                    num = "";                    
                }
                if (!coef.isNegative() && i > 0) {
                    num = "+ " + num;
                }
                return num + " " + (expd ? (bar + (expd === 1 ? "" : "^{" + expd + "}")) : "");
            } else {
                return "";
            }
        })

        let result = withPowers.join(" ");
        if(!result.trim()) {
            result = "0";
        }
        return result;
    }

}